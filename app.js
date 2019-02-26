const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

// Init app
const app = express();
// Config app to serve static files in public folder
app.use(express.static('public'));
// Config app to use body-parser
app.use(bodyParser.urlencoded({
    extended: true
}));
// Config app to use ejs
app.set('view engine', 'ejs');

// connect to MongoDB
mongoose.connect('mongodb://localhost:27017/testAuth', {useNewUrlParser: true });


// create user schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});
// create user model
const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/secrets', (req, res) => {
    res.render('secrets');
});

app.post('/register', (req, res) => {

    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    console.log(user);
    user.save();
    res.redirect('/secrets');
});



const port = 3000;
app.listen(port, () => console.log(`Serwer started at port ${port}`));