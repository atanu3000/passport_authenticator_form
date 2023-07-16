// importing models from models folder
const UserData = require('../models/userData');

// controllrs functions

// rendering home page
const homePage = (req, res) => {
    res.render('home', { title: 'Home' });
}

// rendering profile page
const dashboard = (req, res) => {
    res.render('dashboard', { title: 'Dashboard' });
}

// rendering login page
const loginPage = (req, res) => {
    res.render('login', { title: 'Login' });
}

// rendering register page
const registerPage = (req, res) => {
    res.render('register', { title: 'Register' });
}

// create a new account
const registerAccount = (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    console.log(password);
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
        UserData.findOne({ email: email})
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



//exporting all controllers functions
module.exports = {
    homePage,
    dashboard,
    loginPage,
    registerPage,
    registerAccount,
};