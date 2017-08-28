var express = require('express');
var router = express.Router();

var ioMan = require('zzCustom/socketGlobal');

ioMan.io().on('connection', function (socket) {
  ioMan.io().emit('servMSG', { message: 'connected!' });
});

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(req.session.customData);
  req.session.customData = Math.random();
  console.log(req.session);
  res.render('index', { title: 'Express' });
});

module.exports = router;

