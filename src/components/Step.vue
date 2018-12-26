<template lang="pug">
  .card
    .card-header
      .form-group.row.mb-0
        .col-12
          nav.navbar.navbar-expand-md.navbar-light.bg-light.pull-right
            ul.navbar-nav
              li.nav-item.dropdown
                a.nav-link.mr-2.dropdown-toggle.text-info(href="" title="HTTP Request Options" @click.prevent="")
                  i.material-icons(style="font-size:1.5em;") send
              li.nav-item.dropdown
                a.nav-link.mr-2.dropdown-toggle#checkNavDropdown.text-info(href="" title="HTTP Response Options" @click.prevent="")
                  i.material-icons(style="font-size:1.5em;") reply
              li.nav-item
                a.nav-link.mr-2(href="" title="Collections" @click.prevent="" :class="step.collect != undefined?'text-info':''")
                  i.material-icons(style="font-size:1.5em;") collections_bookmark
              li.nav-item
                a.nav-link.mr-2(href="" title="Print Response" @click.prevent="" :class="step.print != undefined?'text-info':''")
                  i.material-icons(style="font-size:1.5em;") print
              li.nav-item
                a.nav-link.mr-2(href="" title="Iterate" @click.prevent="" :class="step.iterate != undefined?'text-info':''")
                  i.material-icons(style="font-size:1.5em;") loop
              li.nav-item
                a.nav-link.mr-2(href="" title="Delay" @click.prevent="" :class="step.delay != undefined?'text-info':''")
                  i.material-icons(style="font-size:1.5em;") timelapse
              li.nav-item
                a.nav-link.mr-2(href="" title="Skip On Error" @click.prevent="" :class="step.skip_on_error != undefined?'text-info':''")
                  i.material-icons(style="font-size:1.5em;") skip_next

    .card-body
      .form-group.row
        label.col-sm-2.col-form-label(for='') Name
        label.col-sm-10.col-form-label(for='') {{step.name}}
      .form-group.row
        .col-sm-2
          select.form-control(v-model='step.type' disabled)
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
                label.col-sm-10.col-form-label(for='') {{step[step.type].file}}
            template(v-if="stepTypeKey == 'url'")
              .form-group.row(:key='stepTypeKey')
                label.col-sm-2.col-form-label(for='') {{stepTypeKey}}
                label.col-sm-10.col-form-label(for='') {{step[step.type].url}}
            template(v-if="stepTypeKey == 'json'")
              .form-group.row(:key='stepTypeKey')
                label.col-2.col-form-label(for='') {{stepTypeKey}}
                label.col-10.col-form-label(for='') {{step[step.type].json}}
            template(v-if="stepTypeKey =='headers'")
              .form-group.row(:key='stepTypeKey')
                label.col-2.col-form-label(for='') {{stepTypeKey}}
                .col-10
                  template(v-for='(headerVal, headerKey ) in stepTypeVal')
                    .form-group.row(:key='headerKey')
                      label.col-6.col-form-label(for='') {{headerKey}}
                      label.col-6.col-form-label(for='') {{step[step.type].headers[headerKey]}}
            template(v-if="stepTypeKey == 'override'")
              .form-group.row(:key='stepTypeKey')
                label.col-2.col-form-label {{stepTypeKey}}
                .col-10
                  template(v-for='(overrideVal, overrideKey) in stepTypeVal')
                    .form-group.row(:key='overrideKey')
                      label.col-6.col-form-label(for='') {{overrideKey}}
                      label.col-6.col-form-label(for='') {{step[step.type].override[overrideKey]}}
      template(v-if="step.delay != undefined")
        .form-group.row
          label.col-2.col-form-label(for='') Delay
          label.col-10.col-form-label(for='') {{step.delay}}
      template(v-if="step.iterate != undefined")
        .form-group.row
          label.col-2.col-form-label(for='') Iterate
          label.col-10.col-form-label(for='') {{step.iterate}}
      template(v-if="step.print != undefined")
        .form-group.row
          label.col-sm-2.col-form-label(for='', name='') Print
          .col-sm-10
            template(v-for='(print, printIndex) in step.print')
              .form-group.row
                label.col-12.col-form-label(for='', name='') {{step.print[printIndex]}}
      .form-group.row
        label.col-sm-2.col-form-label(for='', name='') Check
        .col-sm-10
          template(v-for='(checkVal, checkKey) in step.check')
            template(v-if="checkKey == 'status'")
              .form-group.row
                label.col-sm-2.col-form-label(for='', name='') Status
                label.col-sm-10.col-form-label(for='', name='') {{step.check.status}}                
            template(v-if="checkKey == 'schema'")
              .form-group.row
                label.col-2.col-form-label(for='') Schema
                label.col-10.col-form-label(for='') {{step.check.schema}}
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
                              label.col-6.col-form-label {{checkBodyEqKey}}
                              label.col-6.col-form-label {{step.check.body.eq[checkBodyEqKey]}}
                    template(v-if="checkBodyKey == 'neq'")
                      .form-group.row
                        label.col-2.col-form-label neq
                        .col-10
                          template(v-for='(checkBodyNeqVal, checkBodyNeqKey) in checkBodyVal')
                            .form-group.row
                              label.col-6.col-form-label {{checkBodyNeqKey}}
                              label.col-6.col-form-label {{step.check.body.neq[checkBodyNeqKey]}}
                    template(v-if="checkBodyKey == 'null'")
                      .form-group.row
                        label.col-sm-2.col-form-label(for='', name='') null
                        .col-sm-10
                          template(v-for='(nullVal, nullIndex) in checkBodyVal')
                            .form-group.row
                              label.col-12.col-form-label {{step.check.body.null[nullIndex]}}
                    template(v-if="checkBodyKey == 'deepEqual'")
                      .form-group.row
                        label.col-2.col-form-label deepEqual
                        .col-10
                          template(v-for='(checkBodyDeepEqVal, checkBodyDeepEqKey) in checkBodyVal')
                            .form-group.row
                              label.col-6.col-form-label {{checkBodyDeepEqKey}}
                              label.col-6.col-form-label {{step.check.body.deepEqual[checkBodyDeepEqKey]}}
                    template(v-if="checkBodyKey == 'regex'")
                      .form-group.row
                        label.col-2.col-form-label regex
                        .col-10
                          template(v-for='(checkBodyRegexVal, checkBodyRegexKey) in checkBodyVal')
                            .form-group.row
                              label.col-6.col-form-label {{checkBodyRegexKey}}
                              label.col-6.col-form-label {{step.check.body.regex[checkBodyRegexKey]}}
      template(v-if="step.collect != undefined")
        .form-group.row
          label.col-2.col-form-label Collect
          .col-10
            template(v-for='(collectVal, collectKey) in step.collect')
              .form-group.row
                label.col-6.col-form-label {{collectKey}}
                label.col-6.col-form-label {{step.collect[collectKey]}}
      template(v-if="step.skip_on_error != undefined")
        .form-group.row
          label.col-2.col-form-label Skip On Error
          .col-10
            select.form-control(v-model='step.skip_on_error' disabled)
              option(value='true') TRUE
              option(value='false') FALSE

</template>

<script>
import Store from "../store.js";
var getAndDeleteObj = Store.state.getAndDeleteObj;
var postAndPutObj = Store.state.postAndPutObj;
var localObj = Store.state.localObj;

export default {
  props: ["step", "stepIndex", "tests"],
  data: function() {
    return {
      showCheckOptions: false,
      showHttpReqOptions: false
    };
  },
  updated() {
    this.$emit("stepUpdated", [this.stepIndex, this.step]);
  },
  methods: {}
};
</script>

<style lang="scss">
</style>
