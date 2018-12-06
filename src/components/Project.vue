<template lang="pug">
.container.mt-2
  .row
    .col-12
      .card
        .card-header.pb-0
          .row
            .col-6
              nav
                ol.breadcrumb.bg-light.mb-0
                  template(v-for="(path, ind) in paths")
                    template(v-if="ind>1")
                      template(v-if="ind == paths.length-1")
                        li.breadcrumb-item.active {{path.name}}
                      template(v-else)
                        li.breadcrumb-item
                          router-link(:to="path.path") {{path.name}}
            .col-6
              nav.navbar.navbar-expand-lg.navbar-light.bg-none.float-right
                ul.navbar-nav
                  li.nav-item.dropdown
                    a.nav-link.mr-2.dropdown-toggle#createFileDropdown(href="" title="Create File" data-toggler="dropdown" aria-haspopup="true" aria-expanded="false" @click.prevent="showNewFile = !showNewFile; clickedIcon = showNewFile? 'file': ''" :class="clickedIcon == 'file'? 'text-info': ''")
                      i.material-icons(style="font-size: 1.5em;") note_add
                    ul.dropdown-menu(:class="showNewFile?'show':''" style="width: 25em;")
                      li.dropdown-item
                        form.form-inline(@submit.prevent="saveFileOrFolder")
                          .form-group
                            input.form-control.mr-2(name="name")
                            button.btn.btn-info.mr-2(type="submit") Create
                            button.btn.btn-default(type="cancel" @click.prevent="cancelSaveFileOrFolder") Cancel
                      //li.dropdown-item
                        span Succeed
                  li.nav-item.dropdown
                    a.nav-link.mr-2.dropdown-toggle#createFileDropdown(href="" title="Create File" data-toggler="dropdown" aria-haspopup="true" aria-expanded="false" @click.prevent="showNewFile = !showNewFile; clickedIcon = showNewFile? 'folder':''" :class="clickedIcon == 'folder'? 'text-info': ''")
                      i.material-icons(style="font-size: 1.5em;") create_new_folder
        .card-body.py-0
          router-view(:key="$route.fullPath")
</template>
<script>
import Axios from "axios";
export default {
  props: ["projectName1"],
  data() {
    return {
      showNewFile: false,
      clickedIcon: "",
      response: ""
    };
  },
  computed: {
    projectName() {
      return this.$store.state.projectName;
    },
    paths() {
      return this.$store.state.paths;
    }
  },
  created() {
  },
  methods: {
    saveFileOrFolder(e) {
      let name = e.target.elements.name.value;
      let type = this.clickedIcon;
      Axios.post(
        "/api/create_folder_file?path=" +
          this.$route.path +
          "&name=" +
          name +
          "&type=" +
          type,
        {}
      )
        .then(res => {
          this.showNewFile = false;
          this.clickedIcon = "";
          console.log("Response : ", JSON.stringify(res.data));
          if (res.data.isCreated) {
            this.$store.commit("PUSH_CONTENT", res.data.content);
          }
        })
        .catch(err => {
          console.log("Error : ", err);
        });
    },
    cancelSaveFileOrFolder(e) {
      this.showNewFile = false;
      this.clickedIcon = "";
    }
  }
};
</script>
<style lang="scss">
</style>
