<template lang="pug">
  .card
    .card-header
      .form-group.row.mb-0
        .col-12
          nav.navbar.navbar-expand-md.navbar-light.bg-light.pull-right
            ul.navbar-nav
              li.nav-item.dropdown
                a.nav-link.mr-2.dropdown-toggle.text-info(href="" title="HTTP Request Options" data-toggler="dropdown" aria-haspopup="true" aria-expanded="true"  @click.prevent="showHttpReqOptions = !showHttpReqOptions")
                  i.material-icons(style="font-size:1.5em;") send
                .dropdown-menu(:class="showHttpReqOptions?'show':''")
                  a.dropdown-item(href="" @click.prevent="addHeader2Step()" :class="step[step.type].headers != undefined?'bg-info':''") Headers
                  template(v-if="(step.type == 'post' || step.type == 'put')")
                    a.dropdown-item(href="" @click.prevent="addOverride2Step()" :class="step[step.type].override != undefined?'bg-info':''") Override
                    a.dropdown-item(href="" @click.prevent="addJson2Step()" :class="step[step.type].json != undefined?'bg-info':''") Json
                    a.dropdown-item(href="" @click.prevent="addFile2Step()" :class="step[step.type].file != undefined?'bg-info':''") File
              li.nav-item.dropdown
                a.nav-link.mr-2.dropdown-toggle#checkNavDropdown.text-info(href="" title="HTTP Response Options" data-toggler="dropdown" aria-haspopup="true" aria-expanded="false" role="button" @click.prevent="showCheckOptions = !showCheckOptions;")
                  i.material-icons(style="font-size:1.5em;") reply
                .dropdown-menu(aria-labelledby="checkNavDropdown" :class="showCheckOptions?'show':''")
                  a.dropdown-item(href="" @click.prevent="addSchema2Step()" :class="step.check.schema != undefined?'bg-info':''") Schema
                  a.dropdown-item(href="" @click.prevent="addEQ2Step()" :class="step.check.body && (step.check.body.eq != undefined)?'bg-info':''") EQ
                  a.dropdown-item(href="" @click.prevent="addNEQ2Step()" :class="step.check.body && (step.check.body.neq != undefined)?'bg-info':''") NEQ
                  a.dropdown-item(href="" @click.prevent="addNULL2Step()" :class="step.check.body && (step.check.body.null != undefined)?'bg-info':''") NULL
                  a.dropdown-item(href="" @click.prevent="addDeepEQ2Step()" :class="step.check.body && (step.check.body.deepEqual != undefined)?'bg-info':''") DEEP Equal
                  a.dropdown-item(href="" @click.prevent="addRegex2Step()" :class="step.check.body && (step.check.body.regex != undefined)?'bg-info':''") REGEX
              li.nav-item
                a.nav-link.mr-2(href="" title="Collections" @click.prevent="addCollect2Step()" :class="step.collect != undefined?'text-info':''")
                  i.material-icons(style="font-size:1.5em;") collections_bookmark
              li.nav-item
                a.nav-link.mr-2(href="" title="Print Response" @click.prevent="addPrints2Step()" :class="step.print != undefined?'text-info':''")
                  i.material-icons(style="font-size:1.5em;") print
              li.nav-item
                a.nav-link.mr-2(href="" title="Iterate" @click.prevent="addIterate2Step()" :class="step.iterate != undefined?'text-info':''")
                  i.material-icons(style="font-size:1.5em;") loop
              li.nav-item
                a.nav-link.mr-2(href="" title="Delay" @click.prevent="addDelay2Step()" :class="step.delay != undefined?'text-info':''")
                  i.material-icons(style="font-size:1.5em;") timelapse
              li.nav-item
                a.nav-link.mr-2(href="" title="Skip On Error" @click.prevent="addSkipOnError2Step()" :class="step.skip_on_error != undefined?'text-info':''")
                  i.material-icons(style="font-size:1.5em;") skip_next
              li.nav-item
                a.nav-link.red(href='' title='Remove Step' @click.prevent='removeStep(stepIndex)')
                  i.material-icons(style="font-size:1.5em;") delete

    .card-body
      .form-group.row
        label.col-sm-2.col-form-label(for='') Name
        .col-sm-10
          input.form-control(type='text', v-model='step.name' @focusout="$forceUpdate()")
      .form-group.row
        .col-sm-2
          select.form-control(v-model='step.type', @change='stepTypeChanged(step)')
            option(value='get') GET
            option(value='post') POST
            option(value='put') PUT
            option(value='delete') DELETE
            option(value='local') LOCAL
        .col-sm-10
          template(v-for='(stepTypeVal,stepTypeKey) in step[step.type]')
            template(v-if="stepTypeKey == 'file'")
              .form-group.row(:key='stepTypeKey')
                label.col-sm-2.col-form-label(for='') {{stepTypeKey}}
                .col-sm-10
                  input.form-control(v-model='step[step.type].file', @keydown='$forceUpdate()')
            template(v-if="stepTypeKey == 'url'")
              .form-group.row(:key='stepTypeKey')
                label.col-sm-2.col-form-label(for='') {{stepTypeKey}}
                .col-sm-10
                  input.form-control(v-model='step[step.type].url', @keydown='$forceUpdate()')
            template(v-if="stepTypeKey == 'json'")
              .form-group.row(:key='stepTypeKey')
                label.col-2.col-form-label(for='') {{stepTypeKey}}
                .col-10
                  input.form-control(v-model='step[step.type].json', @keydown='$forceUpdate()')
            template(v-if="stepTypeKey =='headers'")
              .form-group.row(:key='stepTypeKey')
                label.col-2.col-form-label(for='') {{stepTypeKey}}
                .col-10
                  template(v-for='(headerVal, headerKey ) in stepTypeVal')
                    .form-group.row(:key='headerKey')
                      .col-5
                        input.form-control(placeholder='Authorization', :value='headerKey', @focusout='addHeaderKey($event.target.value)')
                      .col-5
                        input.form-control(placeholder='Basic ***', v-model='step[step.type].headers[headerKey]', @focusout='$forceUpdate()')
                      .col-2
                        a(href='', @click.prevent='removeHeader(headerKey)', title="Remove Header")
                          i.fa.fa-trash-o.fa-lg
                  a(href='', @click.prevent='addHeader()', title="Add Header")
                    i.material-icons(style="font-size:1.5em;") library_add
            template(v-if="stepTypeKey == 'override'")
              .form-group.row(:key='stepTypeKey')
                label.col-2.col-form-label {{stepTypeKey}}
                .col-10
                  template(v-for='(overrideVal, overrideKey) in stepTypeVal')
                    .form-group.row(:key='overrideKey')
                      .col-5
                        input.form-control(placeholder='$.body', :value='overrideKey', @focusout='addOverrideKey($event.target.value)')
                      .col-5
                        input.form-control(placeholder='~comment_text~', v-model='step[step.type].override[overrideKey]', @focusout='$forceUpdate()')
                      .col-2
                        a(href='', @click.prevent='removeOverride(overrideKey)', title="Remove Header")
                          i.fa.fa-trash-o.fa-lg
                  a(href='', @click.prevent='addOverride()', title="Add Override")
                    i.material-icons(style="font-size:1.5em;") library_add
      template(v-if="step.delay != undefined")
        .form-group.row
          label.col-2.col-form-label(for='') Delay
          .col-sm-10
            input.form-control(type='text', name='', v-model='step.delay' @focusout="$forceUpdate()")
      template(v-if="step.iterate != undefined")
        .form-group.row
          label.col-2.col-form-label(for='') Iterate
          .col-10
            input.form-control(type='text', name='', v-model='step.iterate' @focusout="$forceUpdate()")
      template(v-if="step.print != undefined")
        .form-group.row
          label.col-sm-2.col-form-label(for='', name='') Print
          .col-sm-10
            template(v-for='(print, printIndex) in step.print')
              .form-group.row
                .col-11
                  input.form-control(v-model="step.print[printIndex]" @focusout="$forceUpdate()")
                .col-1
                  a(href='', @click.prevent='removePrint(printIndex)', title="Remove Print")
                    i.fa.fa-trash-o.fa-lg
            a(href='', @click.prevent='addPrint()', title="Add Print Variables")
              i.material-icons(style="font-size:1.5em;") library_add
      .form-group.row
        label.col-sm-2.col-form-label(for='', name='') Check
        .col-sm-10
          template(v-for='(checkVal, checkKey) in step.check')
            template(v-if="checkKey == 'status'")
              .form-group.row
                label.col-sm-2.col-form-label(for='', name='') Status
                .col-sm-10
                  input.form-control(type='text', name='', v-model='step.check.status' @focusout="$forceUpdate()")
            template(v-if="checkKey == 'schema'")
              .form-group.row
                label.col-2.col-form-label(for='') Schema
                .col-10
                  input.form-control(type='text', name='', v-model='step.check.schema' @focusout="$forceUpdate()")
            template(v-if="checkKey == 'body'")
              .form-group.row
                label.col-2.col-form-label Body
                .col-10
                  template(v-for='(checkBodyVal, checkBodyKey) in step.check.body')
                    template(v-if="checkBodyKey == 'eq'")
                      .form-group.row
                        label.col-2.col-form-label eq
                        .col-10
                          template(v-for='(checkBodyEqVal, checkBodyEqKey) in checkBodyVal')
                            .form-group.row
                              .col-5
                                input.form-control(:value='checkBodyEqKey', @focusout='addEqualCheckKey($event.target.value)')
                              .col-5
                                input.form-control(v-model='step.check.body.eq[checkBodyEqKey]', @focusout='$forceUpdate()')
                              .col-2
                                a(href='', @click.prevent='removeEqualCheck(checkBodyEqKey)', title="Remove Eq check")
                                  i.fa.fa-trash-o.fa-lg
                          a(href='', @click.prevent='addEqualCheck()', title="Add Equal Check")
                            i.material-icons(style="font-size:1.5em;") library_add
                    template(v-if="checkBodyKey == 'neq'")
                      .form-group.row
                        label.col-2.col-form-label neq
                        .col-10
                          template(v-for='(checkBodyNeqVal, checkBodyNeqKey) in checkBodyVal')
                            .form-group.row
                              .col-5
                                input.form-control(:value='checkBodyNeqKey', @focusout='addNequalCheckKey($event.target.value)')
                              .col-5
                                input.form-control(v-model='step.check.body.neq[checkBodyNeqKey]', @focusout='$forceUpdate()')
                              .col-2
                                a(href='', @click.prevent='removeNequalCheck(checkBodyNeqKey)', title="Remove Neq Check")
                                  i.fa.fa-trash-o.fa-lg
                          a(href='', @click.prevent='addNequalCheck()', title="Add Neq Check")
                            i.material-icons(style="font-size:1.5em;") library_add
                    template(v-if="checkBodyKey == 'null'")
                      .form-group.row
                        label.col-sm-2.col-form-label(for='', name='') null
                        .col-sm-10
                          template(v-for='(nullVal, nullIndex) in checkBodyVal')
                            .form-group.row
                              .col-10
                                input.form-control(v-model='step.check.body.null[nullIndex]')
                              .col-2
                                a(href='', @click.prevent='removeNull(nullIndex)', title="Remove Null Check")
                                  i.fa.fa-trash-o.fa-lg
                          a(href='', @click.prevent='addNull()', title="Add Null Check")
                            i.material-icons(style="font-size:1.5em;") library_add
                    template(v-if="checkBodyKey == 'deepEqual'")
                      .form-group.row
                        label.col-2.col-form-label deepEqual
                        .col-10
                          template(v-for='(checkBodyDeepEqVal, checkBodyDeepEqKey) in checkBodyVal')
                            .form-group.row
                              .col-5
                                input.form-control(:value='checkBodyDeepEqKey', @focusout='addDeepEqCheckKey($event.target.value)')
                              .col-5
                                input.form-control(v-model='step.check.body.deepEqual[checkBodyDeepEqKey]', @focusout='$forceUpdate()')
                              .col-2
                                a(href='', @click.prevent='removeDeepEqCheck(checkBodyDeepEqKey)', title="Remove Deep Equal Check")
                                  i.fa.fa-trash-o.fa-lg
                          a(href='', @click.prevent='addDeepEqCheck()', title="Add Deep Equal Check")
                            i.material-icons(style="font-size:1.5em;") library_add
                    template(v-if="checkBodyKey == 'regex'")
                      .form-group.row
                        label.col-2.col-form-label regex
                        .col-10
                          template(v-for='(checkBodyRegexVal, checkBodyRegexKey) in checkBodyVal')
                            .form-group.row
                              .col-5
                                input.form-control(:value='checkBodyRegexKey', @focusout='addRegexCheckKey($event.target.value)')
                              .col-5
                                input.form-control(v-model='step.check.body.regex[checkBodyRegexKey]', @focusout='$forceUpdate()')
                              .col-2
                                a(href='', @click.prevent='removeRegexCheck(checkBodyRegexKey)', title="Remove Regex Check")
                                  i.fa.fa-trash-o.fa-lg
                          a(href='', @click.prevent='addRegexCheck()', title="Add Regex Check")
                            i.material-icons(style="font-size:1.5em;") library_add
      template(v-if="step.collect != undefined")
        .form-group.row
          label.col-2.col-form-label Collect
          .col-10
            template(v-for='(collectVal, collectKey) in step.collect')
              .form-group.row
                .col-5
                  input.form-control(:value='collectKey', @focusout='addCollectKey($event.target.value)', placeholder='gist_id')
                .col-5
                  input.form-control(v-model='step.collect[collectKey]', placeholder='$.id', @focusout='$forceUpdate()')
                .col-2
                  a(href='', @click.prevent='removeCollect(collectKey)', title="Remove Collect")
                    i.fa.fa-trash-o.fa-lg
            a(href='', @click.prevent='addCollect()', title="Add Collect")
              i.material-icons(style="font-size:1.5em;") library_add
      template(v-if="step.skip_on_error != undefined")
        .form-group.row
          label.col-2.col-form-label Skip On Error
          .col-10
            select.form-control(v-model='step.skip_on_error')
              option(value='true') TRUE
              option(value='false') FALSE

</template>

<script>
import Store from "../store.js";
var step;
var getAndDeleteObj = Store.state.getAndDeleteObj;
var postAndPutObj = Store.state.postAndPutObj;
var localObj = Store.state.localObj;
var checkObj = Store.state.checkObj;
const YAML = require("js-yaml");

export default {
  props: ["step", "stepIndex", "tests"],
  data: function() {
    return {
      showCheckOptions: false,
      showHttpReqOptions: false
    };
  },
  updated() {
    console.log(
      "step :::: updating in step too ::: ",
      JSON.stringify(this.tests)
    );
    this.$emit("stepUpdated", [this.stepIndex, this.step]);
  },
  methods: {
    removeStep(stepIndex) {
      this.tests.steps.splice(stepIndex, 1);
    },
    stepTypeChanged(step) {
      delete this.step.get;
      delete this.step.post;
      delete this.step.put;
      delete this.step.delete;
      delete this.step.local;
      getAndDeleteObj = {};
      getAndDeleteObj.url = "";
      postAndPutObj = {};
      postAndPutObj.url = "";

      if (this.step.type == "get" || this.step.type == "delete")
        this.step[step.type] = getAndDeleteObj;
      else if (this.step.type == "post" || this.step.type == "put")
        this.step[this.step.type] = postAndPutObj;
      else this.step[this.step.type] = localObj;
    },
    addEQ2Step() {
      this.addBody2Step();
      if (this.step.check.body.eq == undefined) {
        this.step.check.body.eq = {};
      } else {
        delete this.step.check.body.eq;
        this.removeBodyFromStep();
      }
      this.$forceUpdate();
    },
    addNEQ2Step() {
      this.addBody2Step();
      if (this.step.check.body.neq == undefined) {
        this.step.check.body.neq = {};
      } else {
        delete this.step.check.body.neq;
        this.removeBodyFromStep();
      }
      this.$forceUpdate();
    },
    addNULL2Step() {
      this.addBody2Step();
      if (this.step.check.body.null == undefined) {
        this.step.check.body.null = [];
      } else {
        delete this.step.check.body.null;
        this.removeBodyFromStep();
      }
      this.$forceUpdate();
    },
    addDeepEQ2Step() {
      this.addBody2Step();
      if (this.step.check.body.deepEqual == undefined) {
        this.step.check.body.deepEqual = {};
      } else {
        delete this.step.check.body.deepEqual;
        this.removeBodyFromStep();
      }
      this.$forceUpdate();
    },
    addRegex2Step() {
      this.addBody2Step();
      if (this.step.check.body.regex == undefined) {
        this.step.check.body.regex = {};
      } else {
        delete this.step.check.body.regex;
        this.removeBodyFromStep();
      }
      this.$forceUpdate();
    },
    addBody2Step() {
      if (this.step.check.body == undefined) {
        this.step.check.body = {};
      }
    },
    removeBodyFromStep() {
      if (Object.keys(this.step.check.body).length < 1) {
        delete this.step.check.body;
      }
    },
    addSchema2Step() {
      if (this.step.check.schema == undefined) {
        this.step.check.schema = "";
      } else {
        delete this.step.check.schema;
      }
      this.$forceUpdate();
    },
    addOverride2Step() {
      if (this.step[this.step.type].override == undefined) {
        this.step[this.step.type].override = {};
      } else {
        delete this.step[this.step.type].override;
      }
      this.$forceUpdate();
    },
    addJson2Step() {
      if (this.step[this.step.type].json == undefined) {
        this.step[this.step.type].json = "";
      } else {
        delete this.step[this.step.type].json;
      }
      this.$forceUpdate();
    },
    addFile2Step() {
      if (this.step[this.step.type].file == undefined) {
        this.step[this.step.type].file = "";
      } else {
        delete this.step[this.step.type].file;
      }
      this.$forceUpdate();
    },
    addPrints2Step() {
      if (this.step.print == undefined) {
        this.step.print = [];
      } else {
        delete this.step.print;
      }
      this.$forceUpdate();
    },
    addSkipOnError2Step() {
      if (this.step.skip_on_error == undefined) {
        this.step.skip_on_error = true;
      } else {
        delete this.step.skip_on_error;
      }
      this.$forceUpdate();
    },
    addIterate2Step() {
      if (this.step.iterate == undefined) {
        this.step.iterate = "";
      } else {
        delete this.step.iterate;
      }
      this.$forceUpdate();
    },
    addDelay2Step() {
      if (this.step.delay == undefined) {
        this.step.delay = "";
      } else {
        delete this.step.delay;
      }
      this.$forceUpdate();
    },
    addCollect2Step() {
      if (this.step.collect == undefined) {
        this.step.collect = {};
      } else {
        delete this.step.collect;
      }
      this.$forceUpdate();
    },
    addHeader2Step() {
      if (this.step[this.step.type].headers == undefined) {
        this.step[this.step.type].headers = {};
      } else {
        delete this.step[this.step.type].headers;
      }
      this.$forceUpdate();
    },
    addHeader() {
      if (this.step[this.step.type].headers[""] == undefined) {
        this.step[this.step.type].headers[""] = "";
        this.$forceUpdate();
      }
    },
    removeHeader(headerKey) {
      delete this.step[this.step.type].headers[headerKey];
      this.$forceUpdate();
    },
    addHeaderKey(key) {
      if (this.step[this.step.type].headers[key] == undefined) {
        delete this.step[this.step.type].headers[""];
        this.step[this.step.type].headers[key] = "";
      }
      this.$forceUpdate();
    },
    addOverride() {
      if (this.step[this.step.type].override[""] == undefined) {
        this.step[this.step.type].override[""] = "";
        this.$forceUpdate();
      }
    },
    removeOverride(overrideKey) {
      delete this.step[this.step.type].override[overrideKey];
      this.$forceUpdate();
    },
    addOverrideKey(key) {
      if (this.step[this.step.type].override[key] == undefined) {
        delete this.step[this.step.type].override[""];
        this.step[this.step.type].override[key] = "";
      }
      this.$forceUpdate();
    },
    removePrint(printIndex) {
      this.step.print.splice(printIndex, 1);
    },
    addPrint() {
      this.step.print.push("");
      this.$forceUpdate();
    },
    addCollect() {
      if (this.step.collect[""] == undefined) {
        this.step.collect[""] = "";
        this.$forceUpdate();
      }
    },
    removeCollect(collectKey) {
      delete this.step.collect[collectKey];
      this.$forceUpdate();
    },
    addCollectKey(key) {
      if (this.step.collect[key] == undefined) {
        delete this.step.collect[""];
        this.step.collect[key] = "";
      }
      this.$forceUpdate();
    },
    addEqualCheck() {
      if (this.step.check.body.eq[""] == undefined) {
        this.step.check.body.eq[""] = "";
        this.$forceUpdate();
      }
    },
    removeEqualCheck(checkBodyEqKey) {
      delete this.step.check.body.eq[checkBodyEqKey];
      this.$forceUpdate();
    },
    addEqualCheckKey(key) {
      if (this.step.check.body.eq[key] == undefined) {
        delete this.step.check.body.eq[""];
        this.step.check.body.eq[key] = "";
      }
      this.$forceUpdate();
    },
    addNequalCheck() {
      if (this.step.check.body.neq[""] == undefined) {
        this.step.check.body.neq[""] = "";
        this.$forceUpdate();
      }
    },
    removeNequalCheck(checkBodyNeqKey) {
      delete this.step.check.body.neq[checkBodyNeqKey];
      this.$forceUpdate();
    },
    addNequalCheckKey(key) {
      if (this.step.check.body.neq[key] == undefined) {
        delete this.step.check.body.neq[""];
        this.step.check.body.neq[key] = "";
      }
      this.$forceUpdate();
    },
    removeNull(nullIndex) {
      this.step.check.body.null.splice(nullIndex, 1);
      this.$forceUpdate();
    },
    addNull() {
      this.step.check.body.null.push("");
      this.$forceUpdate();
    },
    removeDeepEqCheck(key) {
      delete this.step.check.body.deepEqual[key];
      this.$forceUpdate();
    },
    addDeepEqCheck() {
      if (this.step.check.body.deepEqual[""] == undefined) {
        this.step.check.body.deepEqual[""] = "";
        this.$forceUpdate();
      }
    },
    addDeepEqCheckKey(key) {
      if (this.step.check.body.deepEqual[key] == undefined) {
        delete this.step.check.body.deepEqual[""];
        this.step.check.body.deepEqual[key] = "";
      }
      this.$forceUpdate();
    },
    removeRegexCheck(checkBodyRegexKey) {
      delete this.step.check.body.regex[checkBodyRegexKey];
      this.$forceUpdate();
    },
    addRegexCheck() {
      if (this.step.check.body.regex[""] == undefined) {
        this.step.check.body.regex[""] = "";
        this.$forceUpdate();
      }
    },
    addRegexCheckKey(key) {
      if (this.step.check.body.regex[key] == undefined) {
        delete this.step.check.body.regex[""];
        this.step.check.body.regex[key] = "";
      }
      this.$forceUpdate();
    }
  }
};
</script>

<style lang="scss">
</style>
