var express = require('express');
const indexController = require('../controllers/indexController');
const messageHandler = require('../controllers/messageHandler');

var router = express.Router();
/* GET home page. */
router.get('/', indexController.messages);

router.post('/:id/delete', messageHandler.delete_post )

module.exports = router;
