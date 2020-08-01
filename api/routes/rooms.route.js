const express = require('express');
const router = express.Router();

const controller = require('../controllers/rooms.controller');

router.get('/', controller.index);

router.get('/:idRoom', controller.getRoom);

router.get('/:idRoom/members', controller.getMemsOnRoom);

router.post('/create', controller.postCreate);

router.post('/join', controller.postJoin);

module.exports = router;
