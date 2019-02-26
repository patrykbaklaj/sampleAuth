// package to use env files
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
// require packages to use authentication
const passportLocalMongoose = require('passport-local-mongoose');
const session = require('express-session');
const passport = require('passport');

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

// configure app to use passport
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// connect to MongoDB
mongoose.connect('mongodb://localhost:27017/testAuth', {
    useNewUrlParser: true
});


// create user schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

// Plug in passportLocalMongoose
userSchema.plugin(passportLocalMongoose);

// create user model
const User = mongoose.model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

    if (req.isAuthenticated()) {
        res.render('secrets');
    } else {
        res.redirect('login');
    }

});

app.post('/register', (req, res) => {

    User.register({
        username: req.body.username
    }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect('/register');
        } else {
            passport.authenticate('local')(req, res, () => {
                res.redirect('/secrets');
            });
        }
    });
});

app.post("/login", function (req, res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function (err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            });
        }
    });
});



const port = 3000;
app.listen(port, () => console.log(`Serwer started at port ${port}`));