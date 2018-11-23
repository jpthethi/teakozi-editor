const express = require("express");
const app = express();
const path = require("path");
app.use(express.json());
app.use("/", require("./routes"));
app.use(express.static(path.join(__dirname,"dist/")));
app.engine('html', require('ejs').renderFile);
app.set("view engine", "html");

app.listen(5001, () => console.log("Server up and running on 5001"));