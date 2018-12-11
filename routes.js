const express = require("express");
const router = express.Router();
const mkdirp = require("mkdirp-promise");
const fs = require("fs");
const path = require("path");
//const fse = require("fs-extra");
const teakozi = require("teakozi");

const writeFile = (filePath, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, "utf-8", err => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const readFile = filePath => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

const readDirs = dir => {
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
  readDirs("projects")
    .then(list => {
      res.send(list);
    })
    .catch(err => {
      console.log("Error is ::::: ", err);
      res.send([]);
    });
});

function getFilesInfo(relPath, list) {
  let response = [];
  list.filter(file => {
    response.push({
      name: file,
      ext: path.extname(file),
      isFile: fs.lstatSync(relPath + "/" + file).isFile()
    });
  });
  return response;
}

router.get("/api/projects/:projectName", (req, res) => {
  var projectName = req.params.projectName;
  mkdirp("projects")
    .then(() => {
      mkdirp("projects/" + projectName);
    })
    .then(() => {
      mkdirp("projects/" + projectName + "/config");
    })
    .then(() => {
      if (!fs.existsSync("projects/" + projectName + "/config/index.js"))
        writeFile(
          "projects/" + projectName + "/config/index.js",
          "module.exports={}"
        );
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
      let response = {
        contents: getFilesInfo("projects/" + projectName, [
          "config",
          "models",
          "payload",
          "tests"
        ]),
        isPathAFile: false
      };
      res.send(response);
    })
    .catch(err => {
      console.log("Error is ::::: ", err);
      res.send({
        contents: [],
        isPathAFile: false
      });
    });
});

router.get("/api/projects/:projectName/*", (req, res) => {
  let actualPath = req.path.split("/api/")[1];
  let isExists = fs.existsSync(actualPath);
  let isPathAFile = fs.lstatSync(actualPath).isFile();
  if (isExists && !isPathAFile) {
    readDirs(actualPath)
      .then(list => {
        res.send({
          contents: getFilesInfo(actualPath, list),
          isPathAFile: false
        });
      })
      .catch(err => {
        console.log("Error :::: ", err);
        res.send({
          contents: [],
          isPathAFile: false
        });
      });
  } else if (isExists && isPathAFile) {
    console.log("actualPath :::: ", actualPath);
    readFile(actualPath)
      .then(content => {
        res.send({
          contents: content,
          isPathAFile: true
        });
      })
      .catch(err => {
        console.log("Error :::: ", err);
        res.send({
          contents: [],
          isPathAFile: true
        });
      });
  } else {
    res.send({
      contents: [],
      isPathAFile: isPathAFile
    });
  }
});

router.post("/api/projects/:projectName/*", (req, res) => {
  let actualPath = req.path.split("/api/")[1];
  writeFile(actualPath, req.body.code)
    .then(() => {
      res.send("File Saved Successfully");
    })
    .catch(err => {
      console.lolg("Error came while saving");
      res.send(err);
    });
});

router.get("/api/tests", (req, res) => {
  console.log("inside /api/tests ");
  readFile(req.query.yamlPath)
    .then(content => {
      res.send(content);
    })
    .catch(err => {
      console.log("Error :::: ", err);
    });
});

router.post("/api/create_folder_file", (req, res) => {
  var absPath = req.query.path;
  var name = req.query.name;
  var type = req.query.type;
  var totalPath = (absPath + "/" + name).substring(1);

  var resContent = {
    name: name,
    isFile: type == "file" ? true : false,
    ext: path.extname(name)
  };

  if (type == "folder" && !fs.existsSync(totalPath)) {
    mkdirp(totalPath)
      .then(() => {
        res.send({
          msg: "Folder Created",
          isCreated: true,
          content: resContent
        });
      })
      .catch(err => {
        res.send({
          msg: "Folder Failed to create",
          isCreated: false,
          error: err
        });
      });
  } else if (type == "file" && !fs.existsSync(totalPath)) {
    writeFile(totalPath, "")
      .then(() => {
        res.send({
          msg: "File Created",
          isCreated: true,
          content: resContent
        });
      })
      .catch(err => {
        res.send({
          msg: "File Failed create",
          isCreated: false,
          error: err
        });
      });
  } else {
    res.send({
      msg: "Corrupted Path",
      isCreated: false,
      error: new Error("Unknown Reason")
    });
  }
});

router.post("/api/getLog", (req, res) => {
  writeFile("./sample/tests/1.yml", req.body.yaml)
    .then(() => {
      teakozi
        .start("sample")
        .then(content => {
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
    .catch(err => {
      res.send({
        error: err
      });
    });
});

router.post("/api/run_tests", (req, res) => {
  var projectName = req.query.projectName;
  var tags = req.query.tags;
  var absPath = req.query.path.substring(1);
  var yaml = req.body.yaml;
  if (req.body.yaml) {
    writeFile(absPath, yaml)
      .then(() => {
        teakozi.start("projects/" + projectName, __dirname, {
          tag: tags
        }).then(log => {
          res.send(log);
        }).catch(err => {
          console.log("inside error : ", err);
          res.send(err);
        });
      })
      .catch(err => {
        console.log("Error ::: ", err);
        res.send(err);
      });
  } else {
    res.send("In else block of success");
  }
});

module.exports = router;