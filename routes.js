const express = require("express");
const router = express.Router();
const mkdirp = require("mkdirp");
const fs = require("fs");
const teakozi = require("teakozi");

router.get("/*", (req, res) => {
    res.sendFile("index.html");
});

router.get("/api", (req, res) => {
    res.send("Here man");
});


router.post("/api/createproject", (req, res) => {
    let projectName = req.body.projectName;
    mkdirp(projectName, err => {
        if (err) console.log("error while creating project");
        else {
            mkdirp(projectName + "/config", err => {
                if (err) console.log("Config folders didn't created");
                else console.log("Successfully create config folders");
                writeFile(projectName + "/config/index.js", "module.exports={}")
                    .then(() => console.log("index.js file created"))
                    .catch(err => console.log("error while creating index.js file : ", err));
            });
            mkdirp(projectName + "/models", err => {
                if (err) console.log("models folders didn't created");
                else console.log("Successfully create models folders");
            });
            mkdirp(projectName + "/payload", err => {
                if (err) console.log("payload folders didn't created");
                else console.log("Successfully create payload folders");
            });
            mkdirp(projectName + "/tests", err => {
                if (err) console.log("tests folders didn't created");
                else console.log("Successfully create tests folders");
            });
        }
    });
    res.send("Project Created");
});

const writeFile = (filePath, content) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, content, 'utf-8', err => {
            if (err) reject(err);
            else resolve();
        });
    });
};

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