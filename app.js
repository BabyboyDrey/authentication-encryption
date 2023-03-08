//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

console.log(process.env.SECRET);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('Public'));
app.set('view engine', 'ejs')

mongoose.connect('mongodb://127.0.0.1:27017/userDB', {useNewUrlParser: true});


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password'] });

const User = new mongoose.model('User', userSchema);


app.get('/', function(req, res){
    res.render('home');
});

app.get('/register', function(req, res){
    res.render('register');
});

app.get('/login', function(req, res){
    res.render('login');
});


app.post("/register", function(req, res){


const newUser = new User ({
    email: req.body.username,
    password: req.body.password
});

newUser.save()
.catch(err => {
    console.log(err)
})
.then(() => res.render('secrets'));

});

app.post('/login', function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username})
    .catch(err => {
        console.log(err)
    })
 .then (foundUser => {
    if (foundUser.password === password){
        res.render('secrets')
    } else {
        res.send('incorrect email or password')
    }
 });
})
app.listen('3000', function(req, res){
    console.log('Port is live on port 3000')
});