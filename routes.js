const express = require("express");
const router = express.Router();
const mkdirp = require("mkdirp-promise");
const fs = require("fs");
const path = require("path");
const teakozi = require("teakozi");

var apiRouter = express.Router({
  mergeParams: true
});
router.use("/teakozi/api", apiRouter);

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

apiRouter.get("/projects/:sc", (req, res) => {
  let sc = req.params.sc;
  readDirs("projects/" + sc)
    .then(list => {
      res.send(list);
    })
    .catch(err => {
      console.log("Error is ::::: ", err);
      mkdirp("projects/" + sc)
        .then(() => {
          res.send([]);
        });
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

apiRouter.get("/projects/:sc/:projectName", (req, res) => {
  var sc = req.params.sc;
  var projectName = req.params.projectName;
  var scPath = "projects/" + sc + "/";
  mkdirp(scPath + projectName)
    .then(() => {
      mkdirp(scPath + projectName + "/config");
    })
    .then(() => {
      if (!fs.existsSync(scPath + projectName + "/config/index.js"))
        writeFile(
          scPath + projectName + "/config/index.js",
          "module.exports={}"
        );
    })
    .then(() => {
      mkdirp(scPath + projectName + "/logs");
    })
    .then(() => {
      mkdirp(scPath + projectName + "/models");
    })
    .then(() => {
      mkdirp(scPath + projectName + "/payload");
    })
    .then(() => {
      mkdirp(scPath + projectName + "/tests");
    })
    .then(() => {
      let response = {
        contents: getFilesInfo(scPath + projectName, ["config", "logs", "models", "payload", "tests"]),
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

apiRouter.get("/projects/:projectName/*", (req, res) => {
  let actualPath = req.path.substring(1);
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

apiRouter.post("/projects/:projectName/*", (req, res) => {
  let actualPath = req.path.substring(1);
  writeFile(actualPath, req.body.code)
    .then(() => {
      res.send("File Saved Successfully");
    })
    .catch(err => {
      console.lolg("Error came while saving");
      res.send(err);
    });
});

apiRouter.get("/tests", (req, res) => {
  readFile(req.query.yamlPath)
    .then(content => {
      res.send(content);
    })
    .catch(err => {
      console.log("Error :::: ", err);
    });
});

apiRouter.post("/create_folder_file", (req, res) => {
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

apiRouter.get("/run_tests", (req, res) => {
  let projectName = req.query.projectName;
  let sc = req.query.shortcode;
  let tags = req.query.tags;
  var scPath = "projects/" + sc + "/";
  (() => {
    if (tags) {
      return teakozi.start(scPath + projectName, __dirname, {
        tag: tags
      });
    } else {
      return teakozi.start(scPath + projectName, __dirname);
    }
  })()
  .then(log => {
      console.log("Response : ", JSON.stringify(log));
      res.send({
        msg: "Successfully Executed Test cases with teakozi",
        log: log
      });
    })
    .catch(err => {
      console.log("Error : ", err);
      res.send({
        msg: "Test case execution failed",
        error: err
      });
    });
});

router.get("/*", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

module.exports = router;