const express = require("express");
const router = express.Router();
const mkdirp = require("mkdirp-promise");
const fs = require("fs");
const teakozi = require("teakozi");

const writeFile = (filePath, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, 'utf-8', err => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const readFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};


const readDirs = (dir) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, list) => {
      if (err) return reject(err);
      else resolve(list);
    });
  });
};

router.get("/", (req, res) => {
  res.sendFile("index.html");
});

router.get("/api/projects", (req, res) => {
  console.log("inside projects");
  readDirs("projects")
    .then((list) => {
      res.send(list);
    })
    .catch((err) => {
      console.log("Error is ::::: ", err);
      res.send([]);
    });
});

router.get("/api/:projectName", (req, res) => {
  var projectName = req.params.projectName;

  mkdirp("projects")
    .then(() => {
      mkdirp("projects/" + projectName);
    })
    .then(() => {
      mkdirp("projects/" + projectName + "/config");
    })
    .then(() => {
      if(!fs.existsSync("projects/" + projectName + "/config/index.js"))
        writeFile("projects/" + projectName + "/config/index.js", "module.exports={}");
    })
    .then(() => {
      mkdirp("projects/" + projectName + "/models");
    })
    .then(() => {
      mkdirp("projects/" + projectName + "/payload");
    })
    .then(() => {
      mkdirp("projects/" + projectName + "/tests");
    })
    .then(() => {
      res.send(["config", "models", "payload", "tests"]);
    })
    .catch((err) => {
      console.log("Error is ::::: ", err);
      res.send([]);
    });
});

router.get("/api/:projectName/:dir", (req, res) => {
  console.log("Project Name : ", req.params.projectName, " - Directory : ", req.params.dir);
  readDirs("projects/" + req.params.projectName + "/" + req.params.dir)
    .then(list => {
      // let response = [];
      // list.filter(name=>{
      //     let fileObj;
      //     name.isDirectory = name.isDirectory()
      // });
      res.send(list);
    })
    .catch(err => {
      console.log("Error :: ", err);
      res.send([]);
    });
});

router.get("/api/:projectName/:dir/:file", (req, res) => {
  readFile("projects/" + req.params.projectName + "/" + req.params.dir + "/" + req.params.file)
    .then(content => {
      res.send(content);
    })
    .catch(err => {
      console.log("Error : ", err);
    });
});

router.post("/api/:projectName/:dir/:file", (req, res) => {
  console.log("content is :::: ", req.body.code);
  writeFile("projects/" + req.params.projectName + "/" + req.params.dir + "/" + req.params.file, req.body.code)
    .then(() => {
      res.send("File Saved Successfully");
    })
    .catch(err => {
      console.lolg("Error came while saving");
      res.send(err);
    });
});

router.post("/api/getLog", (req, res) => {
  console.log("Request is :::: ", req.body);
  writeFile("./sample/tests/1.yml", req.body.yaml)
    .then(() => {
      teakozi.start("sample").
      then((content) => {
          console.log("content is ::: ", content);
          res.send({
            msg: "Successfully Executed Test cases with teakozi",
            testResponse: content
          });
        })
        .catch(err => {
          res.send({
            msg: "Error came while teakozi test execution",
            error: err
          });

        });
    })
    .catch((err) => {
      res.send({
        error: err
      });
    });
});

module.exports = router;