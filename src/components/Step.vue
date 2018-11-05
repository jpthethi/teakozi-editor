<template lang="html">
    <div class="col-sm-10">
      <template v-for="step in tests.steps">
        <template v-if="step.get != null">
          <div class="form-group row">
            <label for="" class="col-sm-2 col-form-label">Get</label>
            <div class="col-sm-10">
              <template v-for="(getVal, getKey) in step.get">
                <div class="form-group row">
                  <label for="" class="col-sm-2 col-form-label">{{getKey}}</label>
                  <div class="col-sm-10">
                    <input class="form-control" :value="getVal">
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
        <template v-if="step.post != null">
          <div class="form-group row">
            <label for="" class="col-sm-2 col-form-label">Post</label>
            <div class="col-sm-10">
              <template v-for="(getVal, getKey) in step.post">
                <div class="form-group row">
                  <label for="" class="col-sm-2 col-form-label">{{getKey}}</label>
                  <div class="col-sm-10">
                    <input class="form-control" :value="getVal">
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
        <div class="form-group row">
          <label for="" class="col-sm-2 col-form-label">Name</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" name="" :value="step.name">
          </div>
        </div>
        <div class="form-group row">
          <label for="" class="col-sm-2 col-form-label" name="">Print</label>
          <div class="col-sm-10">
            <select class="form-control" name="" multiple/>
          </div>
        </div>
        <div class="form-group row">
          <label for="" class="col-sm-2 col-form-label" name="">Check</label>
          <div class="col-sm-10">
            <template v-for="(val, key) in step.check">
              <template v-if="key == 'status'">
                <div class="form-group row">
                    <label for="" class="col-sm-2 col-form-label" name="">{{key}}</label>
                    <div class="col-sm-10">
                      <input type="text" class="form-control" name="" :value="val">
                    </div>
                </div>
              </template>
              <template v-if="key == 'body'">
                <div class="form-group row">
                  <label for="" class="col-sm-2 col-form-label">{{key}}</label>
                  <div class="col-sm-10">
                    <template v-for="(val1, key1) in val">
                      <div class="form-group row" v-bind:key="key1">
                        <label for="" class="col-sm-2 col-form-label" name="">{{key1}}</label>
                        <div class="col-sm-10">
                          <input type="text" class="form-control" name="" :value="val1">
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </template>
            </template>
          <button class="btn btn-primary btn-xs float-right" title="Add Check">+</button>
          </div>
        </div>
        <hr>
      </template>      
    </div>
</template>

<script>
export default {
}
</script>

<style lang="css">
</style>
