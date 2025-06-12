const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config(); 

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


const todoSchema = new mongoose.Schema({
    name: String
});
const Item = mongoose.model("task", todoSchema);


mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("✅ MongoDB Connected");
})
.catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
});


app.get("/", (req, res) => {
    Item.find()
    .then((dbData) => {
        res.render("list", { data: dbData, editId: null });
    })
    .catch((err) => {
        res.send("Error fetching tasks: " + err.message);
    });
});

app.post("/", (req, res) => {
    const itemName = req.body.ele1;
    if (itemName.trim() !== "") {
        const todo = new Item({ name: itemName });
        todo.save().then(() => res.redirect("/"));
    } else {
        res.redirect("/");
    }
});

app.post("/delete", (req, res) => {
    const checked = req.body.check;
    Item.findByIdAndDelete(checked)
    .then(() => res.redirect("/"))
    .catch((err) => res.send("Delete failed: " + err.message));
});

app.get("/edit/:id", (req, res) => {
    const id = req.params.id;
    Item.find()
    .then((dbData) => {
        res.render("list", { data: dbData, editId: id });
    })
    .catch((err) => res.send("Error loading edit page: " + err.message));
});

app.post("/edit/:id", (req, res) => {
    const id = req.params.id;
    const updatedName = req.body.updatedName;
    Item.findByIdAndUpdate(id, { name: updatedName })
    .then(() => res.redirect("/"))
    .catch((err) => res.send("Error updating task: " + err.message));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

