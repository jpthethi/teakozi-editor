<template lang="pug">
  .form-group
    .form-group.row
      .col-12
        a.red.pull-right(href='', title='Remove Step', @click.prevent='removeStep(stepIndex)')
          i.fa.fa-trash-o.fa-lg
    .form-group.row
      label.col-sm-2.col-form-label(for='') Name
      .col-sm-10
        input.form-control(type='text', v-model='step.name')
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
                  i.fa.fa-plus-square-o.fa-lg
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
                  i.fa.fa-plus-square-o.fa-lg
    .form-group.row
      label.col-2.col-form-label(for='') Delay
      .col-sm-10
        input.form-control(type='text', name='', v-model='step.delay')
    .form-group.row
      label.col-2.col-form-label(for='') Iterate
      .col-10
        input.form-control(type='text', name='', v-model='step.iterate')
    .form-group.row
      label.col-sm-2.col-form-label(for='', name='') Print
      .col-sm-10
        template(v-for='(print, printIndex) in step.print')
          .form-group.row
            .col-11
              input.form-control(v-model="step.print[printIndex]")
            .col-1
              a(href='', @click.prevent='removePrint(printIndex)', title="Remove Print")
                i.fa.fa-trash-o.fa-lg
        a(href='', @click.prevent='addPrint()', title="Add Print Variables")
          i.fa.fa-plus-square-o.fa-lg
    .form-group.row
      label.col-sm-2.col-form-label(for='', name='') Check
      .col-sm-10
        template(v-for='(checkVal, checkKey) in step.check')
          template(v-if="checkKey == 'status'")
            .form-group.row
              label.col-sm-2.col-form-label(for='', name='') Status
              .col-sm-10
                input.form-control(type='text', name='', v-model='step.check.status')
          template(v-if="checkKey == 'schema'")
            .form-group.row
              label.col-2.col-form-label(for='') Schema
              .col-10
                input.form-control(type='text', name='', v-model='step.check.schema')
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
                          i.fa.fa-plus-square-o.fa-lg
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
                          i.fa.fa-plus-square-o.fa-lg
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
                          i.fa.fa-plus-square-o.fa-lg
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
                          i.fa.fa-plus-square-o.fa-lg
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
                          i.fa.fa-plus-square-o.fa-lg
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
          i.fa.fa-plus-square-o.fa-lg
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
    return {};
  },
  updated() {
    console.log("step :::: updating in step too ::: ", JSON.stringify(this.tests));
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

      if (this.step.type == "get" || this.step.type == "delete")
        this.step[step.type] = getAndDeleteObj;
      else if (this.step.type == "post" || this.step.type == "put")
        this.step[this.step.type] = postAndPutObj;
      else this.step[this.step.type] = localObj;
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
    },
    addNull() {
      this.step.check.body.null.push("");
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

<style lang="css">
</style>
