var express = require('express');
var router = express.Router();

var ioMan = require('zzCustom/socketGlobal');

ioMan.io().on('connection', function (socket) {
  ioMan.io().emit('servMSG', { message: 'connected!' });
});

var monGlo = require('zzCustom/mongoGlobal');
var ObjectID = require("mongodb").ObjectID;


/* HOME */
router.get('/', function (req, res, next) {
  /*   var path = require('path');
    res.sendFile(path.resolve('ordini/prova.txt')); */
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
/* HOME */


/* GESTIONE MENU */
router.post('/g_menu/add', function (req, res, next) {
  var newMenuName = req.body.menuName;
  if (req.session.buser !== undefined) {
    var query = { _id: ObjectID(req.session.buser), stato: true };
    monGlo.find('backend_sessione', query, function (data) {
      if (data.length == 0) {
        req.session.destroy();
        res.send('sessionescaduta');
      } else {
        monGlo.find('menu', {}, function (data) {
          var newCode = 0;
          for (var i = 0; i < data.length; i++) {
            if (data[i].codice >= newCode)
              newCode = data[i].codice + 1;
          }
          monGlo.insert('menu', { nome: newMenuName, codice: newCode }, function (data) {
            ioMan.io().emit('g_menu', { message: 'refresh' });
            res.send('ok');
          });
        });
      }
    });
  }
  else
    res.send('sessionescaduta');
});

router.post('/g_menu/delete', function (req, res, next) {
  if (req.session.buser !== undefined) {
    var query = { _id: ObjectID(req.session.buser), stato: true };
    monGlo.find('backend_sessione', query, function (data) {
      if (data.length == 0) {
        req.session.destroy();
        res.send('sessionescaduta');
      } else {
        monGlo.remove('menu', { codice: Number(req.body.codice) }, function (data) {
          ioMan.io().emit('g_menu', { message: 'refresh' });
          res.send('ok');
        });
      }
    });
  }
  else
    res.send('sessionescaduta');
});

router.post('/g_menu/update', function (req, res, next) {
  console.log(req.body);
  var newData = JSON.parse(req.body.data);
  console.log(newData);
  if (req.session.buser !== undefined) {
    var query = { _id: ObjectID(req.session.buser), stato: true };
    monGlo.find('backend_sessione', query, function (data) {
      if (data.length == 0) {
        req.session.destroy();
        res.send('sessionescaduta');
      } else {
        var k = 0;
        for (var i = 0; i < newData.length; i++) {
          monGlo.update('menu', { codice: Number(newData[i].codice) }, { nome: newData[i].nome }, function () {
            k++;
            if (k == newData.length - 1) {
              ioMan.io().emit('g_menu', { message: 'refresh' });
              res.send('ok');
            }
          });
        }
      }
    });
  }
  else
    res.send('sessionescaduta');
});
/* GESTIONE MENU */

module.exports = router;

