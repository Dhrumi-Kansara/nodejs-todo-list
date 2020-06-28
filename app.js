//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app=express();

let items=[];
let workItems=[];

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

const today=new Date();
const currentDay=today.getDay();
let day;
let options={};
app.get("/",function(req, res){
  
  
  
  options={
    weekday: "long",
    day:"numeric",
    month:"long"
  };
  day=today.toLocaleDateString("en-US",options);

  res.render("list", {listType: day, newListItems: items});
}); 

app.get("/work",function(req, res){
  res.render("list",{listType:"work", newListItems: workItems});
});

let item;
app.post("/",function(req, res){
  item=req.body.item;
  if(req.body.listType="work") {
    workItems.push(item);
    res.redirect("work");
  }
  else {
  
  items.push(item);

  res.redirect("/");
  }
});

let workItem;
app.post("/work",function(req, res){
  item=req.body.item;
  items.push(item);
  res.redirect("/work");
});



app.listen(3000, function() {
  console.log("server started at port 3000 ");
}); 