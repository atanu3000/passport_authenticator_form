const express = require('express');
const passport = require('passport');
const formControllers = require('../controllers/formController');
const router = express.Router();

const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');

// routes for all pages
router.get('/', formControllers.homePage);
router.get('/login', formControllers.loginPage);
router.get('/register', formControllers.registerPage);
router.get('/dashboard', formControllers.dashboard);
router.get('/edit', formControllers.editPage);

// create a new account
router.post('/register', formControllers.registerAccount);

// Login to Dashboard
router.post("/login", passport.authenticate("local", { failureRedirect: "/login", failureFlash: true, }), (req, res) => {
  // req.flash("success_msg", "You have successfully logged in!");
  res.redirect("/dashboard");
});

// update profile 
router.post('/edit/:id', formControllers.updateProfile);

// Logout
router.get("/logout", formControllers.logoutUser);

module.exports = router;