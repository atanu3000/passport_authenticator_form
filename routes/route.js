const express = require('express');
const passport = require('passport');
const formControllers = require('../controllers/formController');
const router = express.Router();

const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');

// routes for all pages
router.get('/', forwardAuthenticated, formControllers.homePage);
router.get('/login', forwardAuthenticated, formControllers.loginPage);
router.get('/register', forwardAuthenticated, formControllers.registerPage);
router.get('/dashboard', ensureAuthenticated, formControllers.dashboard);
router.get('/edit', ensureAuthenticated, formControllers.editPage);

// create a new account
router.post('/register', formControllers.registerAccount);

// Login to Dashboard
router.post("/login", passport.authenticate("local", { failureRedirect: "/login", failureFlash: true, }), (req, res) => {
  req.flash("success_msg", "You have successfully logged in!");
  res.redirect("/dashboard");
});

// update profile 
router.post('/edit/:id', formControllers.updateProfile);

// Logout
router.get("/logout", formControllers.logoutUser);

module.exports = router;