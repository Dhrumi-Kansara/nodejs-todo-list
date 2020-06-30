//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app=express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true 
});

const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = new mongoose.model("Item",itemsSchema);

app.get("/",function(req, res){
  let day=date.getDate();
  
  Item.find({},function(err, foundItems){
    res.render("list", {listType: day, newListItems: foundItems});
    console.log(foundItems);
  });  
  
}); 

app.post("/",function(req, res){
  
  let itemName=req.body.item;
  
  const newItem = new Item({
    name: itemName
  });
  newItem.save();
  res.redirect("/");
  
});

app.post("/delete",function(req, res){
  const checkedItemId=req.body.checkBox;

  Item.findByIdAndRemove(checkedItemId,function(err){
    if(err) {
      console.log(err);
    }
    else {
      console.log("delete successfull");
      res.redirect("/");
    }
  });

});

app.listen(3000, function() {
  console.log("server started at port 3000 ");
}); 