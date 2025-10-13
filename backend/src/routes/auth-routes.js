const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth-controllers.js');
const { authentication } = require('../middlewares/authentication.js');


router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authentication, authController.logout);

module.exports = router;