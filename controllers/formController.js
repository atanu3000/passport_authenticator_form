const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require("connect-flash");

// importing models from models folder
const UserData = require('../models/userData');

// controllrs functions

// rendering home page
const homePage = (req, res) => {
    res.render('home', { title: 'Home' });
}

//finding profile logo for dashboard
const profilePic = (str) => {
    const name = str.name;
    const [firstChar, secondChar] = name.split(" ").map(word => word.charAt(0));
    const concatenatedChars = `${firstChar}${secondChar}`;
    return concatenatedChars;
}

// rendering profile page
const dashboard = (req, res) => {
    res.render('dashboard', { user: req.user, profilePic: profilePic(req.user), title: 'Dashboard' });
}

// rendering login page
const loginPage = (req, res) => {
    res.render('login', { title: 'Login' });
}

// rendering register page
const registerPage = (req, res) => {
    res.render('register', { title: 'Register' });
}

// rendering edit page 
const editPage = (req, res) => {
    res.render('update', {user: req.user, title: 'Update' });
}

// create a new account
const registerAccount = (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    const errors = [];

    if (!name || !email || !password || !confirmPassword) {
        errors.push({ msg: 'All fields are required' });
    }

    if (password !== confirmPassword) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 8) {
        errors.push({ msg: 'Password must be at least 8 characters' });
    }

    if (errors.length > 0) {
        res.render('register', { title: 'Register', errors });
    } else {
        UserData.findOne({ email: email })
            .then(user => {
                if (user) {
                    errors.push({ msg: 'This Email already exists' });
                    res.render('register', { title: 'Register', errors });
                } else {
                    const newUser = new UserData({ name, email, password });

                    // hashing the password using Bcrypt
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can log in');
                                    res.redirect('/login');
                                })
                                .catch(err => console.log(err));
                        });
                    });
                }
            })
    }
}

// login user
const loginAccount = () => {

}

//update profile
const updateProfile = (req, res) => {
    const updateData = req.body;
    const id = req.params.id;
    UserData.findByIdAndUpdate(id, updateData)
        .then(() => {
            req.flash( "success_msg", "You have successfully updated your User Profile!" );
            res.redirect("/dashboard");
        })
        .catch(err => console.log(err));
}

//logout
const logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log(err);
            return next(err);
        }
          req.flash("success_msg", "You have successfully logged out!");
        res.redirect("/login");
    });
}

//exporting all controllers functions
module.exports = {
    homePage,
    dashboard,
    loginPage,
    registerPage,
    registerAccount,
    loginAccount,
    logoutUser,
    editPage,
    updateProfile,
};