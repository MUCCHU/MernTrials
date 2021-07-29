const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
dotenv.config({path: './config.env'});


const db = process.env.DATABASE;
mongoose.connect(db,{
    useNewUrlParser:true,
    useCreateIndex : true,
    useUnifiedTopology:true,
    useFindAndModify:false
}).then(()=>{
    console.log("connection successful")
}).catch((err)=>{
    console.log(err);
})
const middleware = (req, res, next)=>{
    console.log("Middle ware")
    next();
}
app.get('/',middleware ,(req, res)=>{
    res.send("Hello World from the server")
})
app.get('/about', (req, res)=>{
    res.send("Welcome to the about page")
})
app.get('/contact', (req, res)=>{
    res.send("Welcome to the contact page")
})
app.get('/signin', (req, res)=>{
    res.send("Welcome to the signin page")
})
app.get('/signup', (req, res)=>{
    res.send("Welcome to the signup page")
})
app.listen(8000, ()=>{
    console.log("Server running live at Localhost:8000")
});