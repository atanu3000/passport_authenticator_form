const express = require('express');
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

// initializing express
const app = express();

// connecting to database
const dbURL = "mongodb+srv://atanupaul03:UlzBd1x6xOTUdirq@cluster0.jinklwv.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Database connected");
        app.listen(process.env.PORT || 5000, () => {
            console.log('Server running on port 5000');
        })
    })
    .catch(err => console.log(err));

//setting view engine
app.set('view engine', 'ejs');

// Passport Configuration
require("./config/passport")(passport);

// Express session
app.use(
    session({
        secret: "2973e5bd77059ecec05db58b61f83e313fb14fd0",
        resave: true,
        saveUninitialized: true,
    })
);

// Passport Middlewares
app.use(passport.initialize());
app.use(passport.session());


// middlewares
app.use(express.static('public')); // seting public path
app.use(express.json()); // JSON Response
app.use(express.urlencoded({ extended: true })); // For Parsing URLs


// app.use((req, res) => {
//     res.status(404).send("<h2 style='text-align: center'> Not Found</h2>");
// })

// impoting all routes
const formRoutes = require('./routes/route');
app.use(formRoutes);