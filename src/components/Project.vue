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
                          a(:href="path.path" :to="path.path") {{path.name}}
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
          router-view
</template>
<script>
import Axios from "axios";
import Content from "./Content.vue";
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
    dirs() {
      return this.$store.state.projectDirs;
    },
    paths() {
      return this.$store.state.paths;
    }
  },
  created() {
    console.log("Project component created");
    this.$store.commit("SET_PATHS", this.$route.path);
    this.$store.commit("SET_PROJECT_NAME", this.paths[this.paths.map(e=> e.path).indexOf("/projects")+1].name);
    console.log("Paths are ::: ", JSON.stringify(this.paths));
    console.log("Project is ::::: ", this.projectName);
    console.log("Response data in Project : ", this.$route.path);
    Axios.get("/api" + this.$route.path)
      .then(res => {
        console.log("Response data in ProjectDIr : ", JSON.stringify(res.data));
        let contents = res.data;
        this.$store.commit("SET_CONTENTS", contents);
        // let { routes } = this.$router.options;
        // let routerData = routes.find(r => r.path === "/projects/*");
        //routerData.children = [{ name: this.paths[this.paths.length-1].name, path: this.$route.path, component: Content }];
        // contents.find(content => {
        //   routerData.children.push({
        //     path: this.$route.path + "/" + content.name,
        //     component: Content
        //   });
        // });
        // this.$router.addRoutes([routerData]);
        //console.log("Updated routes are :::: ", JSON.stringify(routes));
        //this.$router.push(this.paths[this.paths.length-1].name)
        //console.log("Pushing to :::: ", routerData.children[0].path);
        //this.$router.push({path: routerData.children[0].path});
        //this.$router.go(0);
      })
      .catch(err => {
        console.log("Error ::: ", err);
      });
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
