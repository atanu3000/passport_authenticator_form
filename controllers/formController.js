// importing models from models folder
const UserData = require('../models/userData');

// controllrs functions

// rendering home page
const homePage = (req, res) => {
    res.render('home', { title: 'Home'});
}

// rendering profile page
const dashboard = (req, res) => {
    res.render('dashboard', { title: 'Dashboard'});
}

// rendering login page
const loginPage = (req, res) => {
    res.render('login', { title: 'Login'});
}

// rendering register page
const registerPage = (req, res) => {
    res.render('register', { title: 'Register'});
}

//exporting all controllers functions
module.exports = {
    homePage,
    dashboard,
    loginPage,
    registerPage,
};