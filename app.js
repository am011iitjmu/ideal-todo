const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/todoDB", { useNewUrlParser: true, useUnifiedTopology: true });

const itemSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    }
});

const item = mongoose.model("item", itemSchema);

app.get("/", function(req, res1) {
    var today = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    var day = today.toLocaleDateString("en-IN", options);
    var itemsArr = [];
    item.find(function(err, res) {
        if (err) {
            console.log(err);
        } else {
            for (var i = 0; i < res.length; i++) {
                itemsArr[i] = res[i].content;
            }
            res1.render("list", { ejs: day, newItem: itemsArr });
        }
    });

});

app.post("/", function(req, res) {
    // req.body.addItem
    var newItem = new item({
        content: req.body.addItem
    });
    newItem.save();
    res.redirect("/");
});

app.post("/delete", function(req, res) {
    item.deleteOne({ content: req.body.checkbox }, function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function() {
    console.log("App started");
});