const express = require('express');
const app = express();
const port = 3000;
const userModel = require('./models/user');
const cookieParser = require('cookie-parser');
const path = require('path');

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());



app.get('/', (req,res)=>{
    res.render("index");
})

app.listen(port,function(){
    console.log(`Server working on port ${port}`);
})