const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const mongoose = require('mongoose');

const app = express();

const port = 3000;

//Setting Templete language
app.set('view engine', 'ejs');

//This allows to add styles and images to html by creating public folder
app.use(express.static("public"));

//This pause the input for the html form and send it back to the post request
app.use(bodyParser.urlencoded({ extended: true }));

// //variable
// let items = [];
// let workItems = [];

//Instead of storing the data into an array, we storing into the mongoDB database
mongoose.connect("mongodb://localhost:27017/todolistDB", {
    useNewUrlParser: true, useUnifiedTopology: true,
    useFindAndModify: false
});

//Creating schema

const ItemsSchema = {
    name: String
}

//mongoose model
const Item = mongoose.model("Item", ItemsSchema);

//Creating document
const item01 = new Item({
    name: "Welcome to ToDoList!"
});

const item02 = new Item({
    name: "Hit the + button to  add new item"
});

const item03 = new Item({
    name: "<-- use this to delete an item"
});

const defaultItems = [item01, item02, item03];

app.get("/", (req, res) => {

    Item.find({}, (err, foundedItem) => {
        if (foundedItem.length === 0) {
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Items added successfully.");
                }
            });
            res.redirect("/");
        }
        else {
            //This render method is used to view the EJS files
            res.render("list", { listTitle: "Today", listItems: foundedItem });
        }
    });

});

//This makes a post request to get input from the html form
app.post("/", (req, res) => {

    let itemName = req.body.newItem;

    if (itemName.length != 0) {
        //creating a document
        const item = new Item({
            name: itemName
        });

        item.save();
        res.redirect("/");
    }
    else {
        res.redirect("/");
    }
});

app.post("/delete", (req, res) => {
    const checkedItemId = req.body.checkbox;

    Item.findByIdAndRemove(checkedItemId, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Item deleted successfully");
            res.redirect("/");
        }
    })

})

//Creating a second using same template (list.ejs)
app.get("/work", (req, res) => {
    res.render("list", { listTitle: "Work list", listItems: workItems });
});

app.post("/work", (req, res) => {
    let item = req.body.newItem;
    if (item.length != 0) {
        items.push(item);
    }
    res.redirect("/work");
});

//New page => About

app.get("/about", (req, res) => {
    res.render("about");
});


//This starts the server
app.listen(port, () => {
    console.log(`Server started at the port ${port}.`);
});