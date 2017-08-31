var express = require('express');
var router = express.Router();

var ioMan = require('zzCustom/socketGlobal');

ioMan.io().on('connection', function (socket) {
  ioMan.io().emit('servMSG', { message: 'connected!' });
});

var monGlo = require('zzCustom/mongoGlobal');
var ObjectID = require("mongodb").ObjectID;

router.get('/', function (req, res, next) {
  if (req.session.buser !== undefined) {
    var query = { _id: ObjectID(req.session.buser), stato: true };
    monGlo.find('backend_sessione', query, function (data) {
      if (data.length == 0) {
        req.session.destroy();
        res.render('backend/amministrazione', { title: 'sessione scaduta', data: null });
      } else {
        monGlo.find('backend_menu', {}, function (data) {
          if (data.length == 0) {
            res.send('nope!');
          } else {
            res.render('backend/amministrazione', { title: 'amministrazione', data: data });
          }
        });
      }
    });
  } else {
    res.render('backend/amministrazione', { title: 'amministrazione', data: null });
  }
});

router.get('/menu', function (req, res, next) {
  monGlo.find('backend_menu', {}, function (data) {
    if (data.length == 0) {
      res.send('nope!');
    } else {
      res.send(data);
    }
  });
});

router.get('/login', function (req, res, next) {
  res.render('backend/login', { title: 'amministrazione' });
});

router.get('/g_menu', function (req, res, next) {
  if (req.session.buser !== undefined) {
    var query = { _id: ObjectID(req.session.buser), stato: true };
    monGlo.find('backend_sessione', query, function (data) {
      if (data.length == 0) {
        req.session.destroy();
        res.send('sessionescaduta');
      } else {
        monGlo.find('menu', {}, function (data) {
          res.render('backend/g_menu', { title: 'amministrazione', menu: data });
        });
      }
    });
  }
  else
    res.send('sessionescaduta');
});
router.get('/g_categorie', function (req, res, next) {
  if (req.session.buser !== undefined) {
    var query = { _id: ObjectID(req.session.buser), stato: true };
    monGlo.find('backend_sessione', query, function (data) {
      if (data.length == 0) {
        req.session.destroy();
        res.send('sessionescaduta');
      } else {
        res.render('backend/g_categorie', { title: 'amministrazione' });
      }
    });
  }
  else
    res.send('sessionescaduta');
});
router.get('/g_prodotti', function (req, res, next) {
  if (req.session.buser !== undefined) {
    var query = { _id: ObjectID(req.session.buser), stato: true };
    monGlo.find('backend_sessione', query, function (data) {
      if (data.length == 0) {
        req.session.destroy();
        res.send('sessionescaduta');
      } else {
        res.render('backend/g_prodotti', { title: 'amministrazione' });
      }
    });
  }
  else
    res.send('sessionescaduta');
});

router.post('/login', function (req, res, next) {
  var query = { username: req.body.uname, password: req.body.upass };
  var uid;
  monGlo.find('backend_utenti', query, function (data) {
    if (data.length == 0) {
      res.send({ logged: false });
    } else {
      uid = data[0]._id;
      query = { codice: uid };
      monGlo.find('backend_sessione', query, function (data) {
        if (data.length == 0) {
          query = { codice: uid, stato: true };
          monGlo.insert('backend_sessione', query, function (data) {
            if (data.length == 0) {
              res.send({ logged: false });
            } else {
              req.session.buser = data[0]._id;
              res.send({ logged: true });
            }
          });
        } else {
          query = { codice: uid };
          monGlo.update('backend_sessione', query, { stato: false }, function (data) {
            query = { codice: uid, stato: true };
            monGlo.insert('backend_sessione', query, function (data) {
              if (data.length == 0) {
                res.send({ logged: false });
              } else {
                req.session.buser = data[0]._id;
                res.send({ logged: true });
              }
            });
          });
        }
      });
    }
  });
});

router.post('/logout', function (req, res, next) {
  var uid = req.session.buser;
  req.session.destroy();
  var query = { _id: ObjectID(uid) };
  monGlo.update('backend_sessione', query, { stato: false }, function (data) {
    monGlo.remove('backend_sessione', { stato: false }, function (data) {
      res.send('ok');
    });
  });
});

module.exports = router;

