//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const date = require(__dirname + "/date.js");

const app=express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false 
});

const itemsSchema = new mongoose.Schema({
  name: String
});

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
});

const Item = new mongoose.model("Item",itemsSchema);

const List = new mongoose.model("List",listSchema);

app.get("/",function(req, res){

  Item.find({},function(err, foundItems){

    res.render("list", {listType: "Today", newListItems: foundItems});

  });  
}); 

app.get("/:customListName",function(req, res){
  
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName},function(err, foundList) {
    
    if(!err) {
      if(!foundList) {
        const newList = new List({
          name: customListName,
          items: []
        });
        newList.save(); 
        res.redirect("/"+customListName);
      }
      else {
        res.render("list", {listType: foundList.name, newListItems: foundList.items});
      }
    }
  });
});

app.post("/",function(req, res){

  let listType = req.body.listType;
  let itemName=req.body.item;
  
  const newItem = new Item({
    name: itemName
  });

  if(listType=="Today") {

    newItem.save();
    res.redirect("/");
  }
  else {
    List.findOne({name: listType},function(err, foundList) {
      foundList.items.push(newItem);
      foundList.save();
      res.redirect("/"+listType);
    });
  }
});

app.post("/delete",function(req, res){
  const checkedItemId=req.body.checkBox;
  const listType=req.body.listType;
  if(listType=="Today") {
    Item.findByIdAndRemove(checkedItemId,function(err){
      if(err) {
        console.log(err);
      }
      else {
        console.log("delete successfull");
        res.redirect("/");
      }
    });
  }
  else {
    List.findOneAndUpdate({name: listType},{$pull: {items: {_id: checkedItemId}}},function(err, foundList) {
      if(!err) {
        res.redirect("/" + listType);
      }
    });
  }
});

app.listen(3000, function() {
  console.log("server started at port 3000 ");
}); 