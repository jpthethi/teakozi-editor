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
            console.log("Folders are ::: ", list);
            res.send(list);
        })
        .catch((err) => {
            console.log("Error is ::::: ", err);
            res.send([]);
            // mkdirp("projects", err => {
            //     if (err) console.log("Error while creating projects Dir");
            //     res.send([]);
            // }).then((res) => {
            //     console.log("Response ::::: ", res);
            // }).catch((err) => {
            //     console.log("Error is ::::: ", err);
            // });
        });
});

router.get("/api/:projectName", (req, res) => {
    var projectName = req.params.projectName;
    console.log("projectName :::: ", projectName);

    mkdirp("projects")
        .then(() => {
            mkdirp("projects/" + projectName);
        })
        .then(() => {
            mkdirp("projects/" + projectName + "/config");
        })
        .then(() => {
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