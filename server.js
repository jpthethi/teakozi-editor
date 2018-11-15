const express = require("express");
const app = express();
app.use(express.json());
app.use("/", require("./routes"));

app.listen(5001, () => console.log("Server up and running on 5001"));