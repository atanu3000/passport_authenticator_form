// importing models from models folder
const UserData = require('../models/userData');

// controllrs functions

// rendering profile page
const profilePage = (req, res) => {
    res.render('profile', { title: 'Profile'});
}

//exporting all controllers functions
module.exports = {
    profilePage,
}