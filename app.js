//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const app=express();

const items=[];
const workItems=[];

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));


app.get("/",function(req, res){
  let day=date.getDate();
  res.render("list", {listType: day, newListItems: items});
}); 

app.get("/work",function(req, res){
  res.render("list",{listType:"work", newListItems: workItems});
});



app.post("/",function(req, res){
  
  let item=req.body.item;
  if(req.body.listType=="work") {
    workItems.push(item);
    res.redirect("work");
  }
  else {
  
  items.push(item);

  res.redirect("/");
  }
});


app.post("/work",function(req, res){
  let item=req.body.item;
  items.push(item);
  res.redirect("/work");
});



app.listen(3000, function() {
  console.log("server started at port 3000 ");
}); 