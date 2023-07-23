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
    let concatenatedChars = "";

    function countWords(name) {
        name = name.trim();
        const wordsArray = name.split(/\s+/);
        const filteredWordsArray = wordsArray.filter(word => word !== '');
        return filteredWordsArray.length;
    }

    if (countWords(name) == 1) {
        concatenatedChars = name[0].toUpperCase();
        return concatenatedChars;
    }
    const [firstChar, secondChar] = name.split(" ").map(word => word.charAt(0));
    concatenatedChars = `${firstChar}${secondChar}`;
    return concatenatedChars.toUpperCase();
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
    const localuser = req.isAuthenticated() ? req.user : null;
    res.render('update', { user: req.user, isLocalUser: localuser ? localuser.isLocalUser : false, title: 'Update' });
}

// rendering change password page
const changePasswordPage = (req, res) => {
    res.render('changePassword', { user: req.user, title: 'Change Password' });
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
                    // making a new instance of a user
                    const newUser = new UserData({ name, email, password, isLocalUser: true, });

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
const loginAccount = (req, res) => {
    req.flash("success_msg", "You have successfully logged in!");
    res.redirect("/dashboard");
}

//update profile
const updateProfile = (req, res) => {
    const updateData = req.body;
    const id = req.params.id;
    UserData.findByIdAndUpdate(id, updateData)
        .then(() => {
            req.flash("success_msg", "You have successfully updated your User Profile!");
            res.redirect("/dashboard");
        })
        .catch(err => console.log(err));
}

// change password
const changePassword = async (req, res) => {
    const { oPassword, nPassword, cPassword } = req.body;
    const id = req.params.id;
    const errors = [];

    try {
        const user = await UserData.findById(id);
        if (!user) {
            errors.push({msg: 'User not found'});
        }

        const passwordMatch = await bcrypt.compare(oPassword, user.password);
        if (!passwordMatch) {
            errors.push({msg: 'Incorrect Password!'});
        }

        if (nPassword !== cPassword) {
            errors.push({msg: "Passwords don't match"});
        }

        if (nPassword.length < 8) {
            errors.push({msg: 'Password must be atleat 8 characters'});
        }

        if (errors.length > 0) {
            return res.render('changePassword', {user, title: 'Change Password', errors});
        }

        // Hash the new password before saving it to the database.
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(nPassword, saltRounds);

        // Update the user's password in the database.
        user.password = hashedPassword;
        await user.save();
        // Log out the user after password change (moved after rendering the page)
        res.redirect('/logout');
        
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while changing the password." });
    }
};

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
    changePasswordPage,
    changePassword,
};