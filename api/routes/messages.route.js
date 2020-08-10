const express = require('express');
const router = express.Router();

const controller = require('../controllers/messages.controller');

router.get('/', controller.index);

router.get('/:id', controller.getMessages);

router.post('/sendMessages', controller.postSendMessages);

module.exports = router;
