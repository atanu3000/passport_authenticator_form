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
router.get('/change_password', ensureAuthenticated, formControllers.changePasswordPage);

// create a new account
router.post('/register', formControllers.registerAccount);

// Login to Dashboard
router.post("/login", 
  passport.authenticate("local", { failureRedirect: "/login", failureFlash: true, }), 
  formControllers.loginAccount);

// Routes for Google sign-up
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get( '/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', failureFlash: true,}), 
  formControllers.loginAccount);

// update profile 
router.post('/edit/:id', formControllers.updateProfile);

// change password
router.post('/change_password/:id', formControllers.changePassword);

// Logout
router.get("/logout", formControllers.logoutUser);

module.exports = router;