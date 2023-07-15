const express = require('express');
const formControllers = require('../controllers/formController');
const router = express.Router();

router.get('/', formControllers.homePage);
router.get('/login', formControllers.loginPage);
router.get('/register', formControllers.registerPage);
router.get('/dashboard', formControllers.dashboard);

module.exports = router;