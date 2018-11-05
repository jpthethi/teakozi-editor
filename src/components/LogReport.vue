<template lang="html">
  <div class="container" id="report-json">
  	<h3>Test Run : {{log.id}}</h3>
  	<div>
  		Start: {{log.start | dateFormat}} | End: {{log.end | dateFormat}} | Duration: {{log.duration |
  		ms2Secs}}s
  	</div>
  	<!-- <div>
  		Total Test Cases: {{log.tests.length}}
  	</div> -->
  	<br>
  	<h4>Summary</h4>

  	<table class="table table-bordered">
  		<thead>
  			<th>Sno</th>
  			<th>Name</th>
  			<th>Status</th>
  			<th>Duration(ms)</th>
  			<th>Steps</th>
  			<th>TestFile</th>
  			<th>LogFile</th>
  		</thead>
  		<tbody>
  			<tr v-for="(test, ind) in log.tests">
  				<td>{{ind+1}}</td>
  				<td>
  					<a :href="'#t'+(ind+1)">
  						{{test.name}}
  					</a>
  				</td>
  				<td>
  					<i class="fa fa-circle" :style="test.valid?{color:'green'}:{color:'red'}"></i>
  				</td>
  				<td>{{test.duration}}</td>
  				<td>{{test.steps.length}}</td>
  				<td>{{test.test_file}}</td>
  				<td>{{test.logfile}}</td>
  			</tr>
  		</tbody>
  	</table>
  	<h4>Details:</h4>
  	<template v-for="(test, ind) in log.tests">
  		<hr>
  		<div class="row">
  			<div class="col-1">
  				<i class="fa fa-circle" :style="test.valid?{color:'green'}:{color:'red'}"></i>
  			</div>
  			<div class="col-11">
  				<h4 :style="test.valid?{color: 'green'}:{color: 'red'}">
  					<a :id="'t'+(ind+1)">{{ind+1}}-{{test.name}}</a>
  				</h4>
  				<div class="small">
  					Start: {{test.start | dateFormat}} | End: {{test.end | dateFormat}} | Duration:
  					{{test.duration
  					| ms2Secs}}s
  				</div>
  				<template v-for="(step, i) in test.steps">
  					<hr>
  					<div class="row">
  						<div class="col-1">
  						</div>
  						<div class="col-1">
  							<i class="fa fa-circle" :style="step.valid?{color:'green'}:{color:'red'}"></i>
  						</div>
  						<div class="col-10">
  							<h5 :style="step.valid?{color: 'green'}:{color: 'red'}">
  								<a :id="'t'+(ind+1)+'s'+(i+1)">{{ind+1}}.{{i+1}} {{step.name}}</a>
  							</h5>
  							<div>
  								<pre class="float-left badge badge-primary mr-2 small">{{step.method}}</pre>
  								<pre class="inline small">{{step.url}}</pre>
  							</div>
  							<div class="small">
  								Start: {{step.start}} | End: {{step.end}} | Duration: {{step.duration |
  								ms2Secs}}s
  							</div>
  							<hr>
  							<template v-if="step.debug_prints.length > 0">
  								<template v-for="dp in step.debug_prints">
  									<pre>{{dp}}</pre>
  									<hr>
  								</template>
  							</template>
  							<template v-if="step.asserts.length > 0">
  								<template v-for="assert in step.asserts">
  									<div>
  										<div class="float-left mr-2 font-weight-bold" :style="assert.valid?{color: 'green'}:{color: 'red'}">{{assert.valid?"Pass":"Failed"}}
  										</div>
  										<div class="inline">
  											{{assert.detail}}
  										</div>
  									</div>
  								</template>
  							</template>
  						</div>
  					</div>
  				</template>
  			</div>
  		</div>
  	</template>
  </div>
</template>

<script>
export default {
  props: ["log"],
  data: function(){
    return {
      id: this.$route.params.id
    }
  },
  filters: {
    JSONFormat: function (obj) {
        return JSON.stringify(obj);
    },
    dateFormat: function (date) {
        return moment().format("DD-MMM-YYYY HH:MM:SS");
    },
    ms2Secs: function (ms) {
        if (typeof (ms) == "number")
            return Math.round(ms / 1000);
        return 0;
    }
  }
}
</script>

<style lang="css">
</style>
