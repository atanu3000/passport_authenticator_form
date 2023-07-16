const express = require('express');
const formControllers = require('../controllers/formController');
const router = express.Router();
const passport = require('passport');

const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');

// routes for all pages
router.get('/', formControllers.homePage);
router.get('/login', formControllers.loginPage);
router.get('/register', formControllers.registerPage);
router.get('/dashboard', formControllers.dashboard);

// create a new account
// router.post('/register', formControllers.registerAccount);

module.exports = router;