var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const messageHandler = require('../controllers/messageHandler');

router.get('/sign-up', userController.user_sign_up_get);

router.post('/sign-up', userController.user_sign_up_post);

router.get('/join', userController.join_get);

router.post('/join', userController.join_post);

router.get('/admin', userController.admin_get);

router.post('/admin', userController.admin_post);

router.get('/login', userController.login_get);

router.post('/login', userController.login_post);

router.get('/logout', userController.logout);

router.get('/new-message', messageHandler.new_message_get);

router.post('/new-message', messageHandler.new_message_post);

module.exports = router;
