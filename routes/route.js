const express = require('express');
const formControllers = require('../controllers/formController');
const router = express.Router();

router.get('/', formControllers.profilePage);

module.exports = router;