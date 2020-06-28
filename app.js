//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app=express();

let items=[];

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

  res.render("list", {kindOfDay: day, newListItems: items});
}); 

let item;
app.post("/",function(req, res){

  item=req.body.item;
  items.push(item);

  res.redirect("/");
});

app.listen(3000, function() {
  console.log("server started at port 3000 ");
}); 