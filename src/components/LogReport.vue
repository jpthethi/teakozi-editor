<template lang="pug">
#report-json.container
  h3 Test Run : {{log.id}}
  div
    | Start: {{log.start | dateFormat}} | End: {{log.end | dateFormat}} | Duration: {{log.duration |
    | ms2Secs}}s
  br
  h4 Summary
  table.table.table-bordered
    thead
      tr
        th Sno
        th Name
        th Status
        th Duration(ms)
        th Steps
        th TestFile
        th LogFile
    tbody
      tr(v-for='(test, ind) in log.tests')
        td {{ind+1}}
        td
          a(:href="'#t'+(ind+1)")
            | {{test.name}}
        td
          i.fa.fa-circle(:style="test.valid?{color:'green'}:{color:'red'}")
        td {{test.duration}}
        td {{test.steps.length}}
        td {{test.test_file}}
        td {{test.logfile}}
  h4 Details:
  template(v-for='(test, ind) in log.tests')
    hr
    .row
      .col-1
        i.fa.fa-circle(:style="test.valid?{color:'green'}:{color:'red'}")
      .col-11
        h4(:style="test.valid?{color: 'green'}:{color: 'red'}")
          a(:id="'t'+(ind+1)") {{ind+1}}-{{test.name}}
        .small
          | Start: {{test.start | dateFormat}} | End: {{test.end | dateFormat}} | Duration:
          | {{test.duration
          | | ms2Secs}}s
        template(v-for='(step, i) in test.steps')
          hr
          .row
            .col-1
            .col-1
              i.fa.fa-circle(:style="step.valid?{color:'green'}:{color:'red'}")
            .col-10
              h5(:style="step.valid?{color: 'green'}:{color: 'red'}")
                a(:id="'t'+(ind+1)+'s'+(i+1)") {{ind+1}}.{{i+1}} {{step.name}}
              div
                pre.float-left.badge.badge-primary.mr-2.small.
                  \n{{step.method}}                  
                pre.inline.small.
                  \n{{step.url}}                  
              .small
                | Start: {{step.start}} | End: {{step.end}} | Duration: {{step.duration |
                | ms2Secs}}s
              hr
              template(v-if='step.debug_prints')
                template(v-for='dp in step.debug_prints')
                  pre.
                    \n{{dp}}
                  hr
              template(v-if='step.asserts')
                template(v-for='assert in step.asserts')
                  div
                    .float-left.mr-2.font-weight-bold(:style="assert.valid?{color: 'green'}:{color: 'red'}")
                      | {{assert.valid?"Pass":"Failed"}}
                    .inline
                      | {{assert.detail}}
</template>

<script>
import moment from "moment";

export default {
  props: ["log"],
  data: function() {
    return {
      id: this.$route.params.id
    };
  },
  filters: {
    JSONFormat: function(obj) {
      return JSON.stringify(obj);
    },
    dateFormat: function() {
      return moment().format("DD-MMM-YYYY HH:MM:SS");
    },
    ms2Secs: function(ms) {
      if (typeof ms == "number") return Math.round(ms / 1000);
      return 0;
    }
  }
};
</script>

<style lang="css">
</style>
