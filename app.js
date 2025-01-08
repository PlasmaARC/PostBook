//Initializing the frameworks and library used.
const express = require('express');
const app = express();
const port = 3000;
//Initializing database
const userModel = require('./models/user');
//Initializing Post databse
const postModel = require('./models/post');
//Initializing cookie-parser
const cookieParser = require('cookie-parser');
//Initializing path
const path = require('path');
//Initializing brypt
const bcrypt = require('bcrypt')
//Initializing JsonWebToken
const jwt = require('jsonwebtoken');

//Setting View Engine to use ejs
app.set("view engine", "ejs");
//making url encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//using cookie ot store user authentication 
app.use(cookieParser());


//When Opening localhost://3000, index.ejs page from views is rendered. i
app.get('/', (req, res) => {
    res.render("index");
})

app.get('/login', (req, res) => {
    res.render("login");
})

app.get('/profile', isLoggedIn, (req,res)=>{
    console.log(req.user);
    res.render("login")
})

//Using database to handle form data
//Since it is async function we are waiting for data.
app.post('/register', async (req, res) => {
    //Destructuring the Schema 
    let { email, password, username, name, age } = req.body;

    //Finding whether there is already email with the form data
    let user = await userModel.findOne({ email });

    //if yes, then a response was send
    if (user) return res.status(500).send("User already registered.")

    //We are using bcrypt to encrypr the password with a salt value
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let user = await userModel.create({
                username,
                age,
                name,
                email,
                password: hash
            })
            //bvrypt is used to secretly hash the password to make it more secure.
            //The server forgets you the moment a request is fulfiled. And for another task it again ask for credentials. That's why we are using jwt to make a payload of email and userid to send the data as a cookie so that this information is automatically send to server and the server knows us.

            //Using jwt to authorize signin, payload is object and here email and userid is used and also secret key.
            let token = jwt.sign({ email: email, userid: user._id }, "secretkey")
            //Cookies store information about user credential and so the variable token we have made is send as a cookie token.
            res.cookie("token", token);
            //Token is sent as cookies.
            res.send("Registered");

        })
    });

})

app.post('/login', async (req,res)=>{
    let {email, password} = req.body;

    //Finding already registered email.
    let user = await userModel.findOne({email});
    //If not already user send a response
    if(!user) return res.status(500).send("Something went wrong");

    //comparing password and hash pasword using bcrypt
    bcrypt.compare(password, user.password, function (err,result){
        if(result){
            //if true send a token 
            let token = jwt.sign({ email: email, userid: user._id }, "secretkey");
            res.cookie("token", token);

            //if true send a response
            res.status(200).send("You can Login Now");
        }
        else {
            //redirect to login
            res.redirect("/login");
        }
        
    })
});

//Logout routing
app.get('/logout', (req,res)=>{
    res.cookie("token", "");
    res.redirect("/login");
})

function isLoggedIn(req,res,next){
    //check the token value f logged in
    if(req.cookies.token === ""){
        res.send("You need to Login")
    }else {
        let data = jwt.verify(req.cookies.token, "secretkey")
        req.user = data;
    }
    next();
}


app.listen(port);