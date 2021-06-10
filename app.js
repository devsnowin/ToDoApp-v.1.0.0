const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const date = require(__dirname + '/date.js')

const app = express();

const port = 3000;

//variable
let items = [];
let workItems = [];

//Setting Templete language
app.set('view engine', 'ejs');

//This allows to add styles and images to html by creating public folder
app.use(express.static("public"));

//This pause the input for the html form and send it back to the post request
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {

    //This our own module (data.js)
    let day = date();
    
    //This render method is used to view the EJS files
    res.render("list", { listTitle: day, listItems: items });

});

//This makes a post request to get input from the html form
app.post("/", (req, res) => {

    let item = req.body.newItem;

    //checking if the item is not empty or null
    if (item.length != 0) {
        //Checking if the item is adding from home page or work list page, if it is then redirect to the respective page
        if (req.body.button === "Work") {
            workItems.push(item);
            res.redirect("/work")
        } else {
            items.push(item);
            res.redirect("/");
        }
    }

});

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