var express = require('express');
var router = express.Router();

var ioMan = require('zzCustom/socketGlobal');

var monGlo = require('zzCustom/mongoGlobal');
var ObjectID = require("mongodb").ObjectID;

var menuBackend;
monGlo.find('backend_menu', {}, {}, function (data) {
  menuBackend = data;
});

/* LOGIN / LOGOUT */
router.get('/', function (req, res) {
  if (req.session.buser !== undefined) {
    var query = { _id: ObjectID(req.session.buser), stato: true };
    monGlo.find('backend_sessione', query, {}, function (data) {
      if (data.length == 0) {
        req.session.destroy();
        res.redirect('/amministrazione/login');
      } else {
        res.render('backend/template', { title: 'amministrazione', contenuto: '', menuBackend: menuBackend, msg: null });
      }
    });
  } else {
    res.redirect('/amministrazione/login');
  }
});
router.get('/login', function (req, res) {
  if (req.session.buser !== undefined) {
    var query = { _id: ObjectID(req.session.buser), stato: true };
    monGlo.find('backend_sessione', query, {}, function (data) {
      if (data.length == 0) {
        req.session.destroy();
        res.render('backend/template', { title: 'amministrazione', contenuto: 'login', menuBackend: null, msg: 'sessione scaduta' });
      } else {
        res.redirect('/amministrazione');
      }
    });
  } else {
    res.render('backend/template', { title: 'amministrazione', contenuto: 'login', menuBackend: null, msg: null });
  }
});
router.post('/login', function (req, res, next) {
  var query = { username: req.body.uname, password: req.body.upass };
  var uid;
  monGlo.find('backend_utenti', query, {}, function (data) {
    if (data.length == 0) {
      res.render('backend/template', { title: 'login', contenuto: 'login', menuBackend: null, msg: 'username o password errati' });
    } else {
      uid = data[0]._id;
      query = { codice: uid };
      monGlo.find('backend_sessione', query, {}, function (data) {
        if (data.length == 0) {
          query = { codice: uid, stato: true };
          monGlo.insert('backend_sessione', query, function (data) {
            req.session.buser = data[0]._id;
            res.redirect('/amministrazione');
          });
        } else {
          query = { codice: uid };
          monGlo.update('backend_sessione', query, { stato: false }, function (data) {
            query = { codice: uid, stato: true };
            monGlo.insert('backend_sessione', query, function (data) {
              req.session.buser = data[0]._id;
              res.redirect('/amministrazione');
            });
          });
        }
      });
    }
  });
});
router.get('/logout', function (req, res) {
  var uid = req.session.buser;
  req.session.destroy();
  var query = { _id: ObjectID(uid) };
  monGlo.update('backend_sessione', query, { stato: false }, function (data) {
    monGlo.remove('backend_sessione', { stato: false }, function (data) {
      res.redirect('/amministrazione/login');
    });
  });
});
/* LOGIN / LOGOUT */


/* GESTIONE MENU */
router.get('/menu', function (req, res, next) {
  if (req.session.buser !== undefined) {
    var query = { _id: ObjectID(req.session.buser), stato: true };
    monGlo.find('backend_sessione', query, {}, function (data) {
      if (data.length == 0) {
        res.redirect('/amministrazione/login');
      } else {
        monGlo.find('menu', {}, { codice: 1 }, function (data) {
          res.render('backend/template', { title: 'gestione menu', contenuto: 'menu', menuBackend: menuBackend, menu: data });
        });
      }
    });
  }
  else
    res.redirect('/amministrazione/login');
});
router.post('/menu/add', function (req, res, next) {
  var newMenuName = req.body.menuName;
  if (req.session.buser !== undefined) {
    var query = { _id: ObjectID(req.session.buser), stato: true };
    monGlo.find('backend_sessione', query, {}, function (data) {
      if (data.length == 0) {
        res.redirect('/amministrazione/login');
      } else {
        monGlo.find('menu', {}, { codice: 1 }, function (data) {
          var newCode = data[data.length - 1].codice + 1;
          monGlo.insert('menu', { nome: newMenuName, codice: newCode }, function (data) {
            res.send('OK');
            ioMan.io().emit('backend_menu', { message: 'refresh' });
          });
        });
      }
    });
  }
  else
    res.redirect('/amministrazione/login');
});
router.post('/menu/delete', function (req, res, next) {
  if (req.session.buser !== undefined) {
    var query = { _id: ObjectID(req.session.buser), stato: true };
    monGlo.find('backend_sessione', query, {}, function (data) {
      if (data.length == 0) {
        res.redirect('/amministrazione/login');
      } else {
        monGlo.remove('menu', { codice: Number(req.body.codice) }, function (data) {
          res.send('OK');
          ioMan.io().emit('backend_menu', { message: 'refresh' });
        });
      }
    });
  }
  else
    res.redirect('/amministrazione/login');
});
router.post('/menu/update', function (req, res, next) {
  var newData = JSON.parse(req.body.data);
  if (req.session.buser !== undefined) {
    var query = { _id: ObjectID(req.session.buser), stato: true };
    monGlo.find('backend_sessione', query, {}, function (data) {
      if (data.length == 0) {
        res.redirect('/amministrazione/login');
      } else {
        var k = 0;
        for (var i = 0; i < newData.length; i++) {
          monGlo.update('menu', { codice: Number(newData[i].codice) }, { nome: newData[i].nome }, function () {
            k++;
            if (k == newData.length - 1) {
              res.send('OK');
              ioMan.io().emit('backend_menu', { message: 'refresh' });
            }
          });
        }
      }
    });
  }
  else
    res.redirect('/amministrazione/login');
});
/* GESTIONE MENU */


/* GESTIONE CATEGORIE */

/* GESTIONE CATEGORIE */


/* GESTIONE PRODOTTI */

/* GESTIONE PRODOTTI */

/* 
router.get('/g_menu', function (req, res, next) {
  if (req.session.buser !== undefined) {
    var query = { _id: ObjectID(req.session.buser), stato: true };
    monGlo.find('backend_sessione', query, {}, function (data) {
      if (data.length == 0) {
        req.session.destroy();
        res.send('sessionescaduta');
      } else {
        monGlo.find('menu', {}, { codice: 1 }, function (data) {
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
    monGlo.find('backend_sessione', query, {}, function (data) {
      if (data.length == 0) {
        req.session.destroy();
        res.send('sessionescaduta');
      } else {
        var tmp = {};
        monGlo.find('categorie', {}, { codice_menu: 1 }, function (data) {
          tmp.cat = data;
          monGlo.find('menu', {}, { codice: 1 }, function (data) {
            tmp.men = data;
            res.render('backend/g_categorie', { title: 'amministrazione', outData: tmp });
          });
        });
      }
    });
  }
  else
    res.send('sessionescaduta');
});

router.post('/g_categorie/add', function (req, res, next) {
  var newCategoria = req.body.newCategoria;
  if (req.session.buser !== undefined) {
    var query = { _id: ObjectID(req.session.buser), stato: true };
    monGlo.find('backend_sessione', query, {}, function (data) {
      if (data.length == 0) {
        req.session.destroy();
        res.send('sessionescaduta');
      } else {
        monGlo.find('categorie', {}, { codice: 1 }, function (data) {
          var newCode = data[data.length - 1].codice + 1;
          monGlo.insert('categorie', { nome: newCategoria, codice: newCode, codice_menu: null }, function (data) {
            ioMan.io().emit('g_categorie', { message: 'refresh' });
            res.send('ok');
          });
        });
      }
    });
  }
  else
    res.send('sessionescaduta');
});

router.post('/g_categorie/delete', function (req, res, next) {
  if (req.session.buser !== undefined) {
    var query = { _id: ObjectID(req.session.buser), stato: true };
    monGlo.find('backend_sessione', query, {}, function (data) {
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

router.post('/g_categorie/update', function (req, res, next) {
  console.log(req.body);
  var newData = JSON.parse(req.body.data);
  console.log(newData);
  if (req.session.buser !== undefined) {
    var query = { _id: ObjectID(req.session.buser), stato: true };
    monGlo.find('backend_sessione', query, {}, function (data) {
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

router.get('/g_prodotti', function (req, res, next) {
  if (req.session.buser !== undefined) {
    var query = { _id: ObjectID(req.session.buser), stato: true };
    monGlo.find('backend_sessione', query, {}, function (data) {
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
}); */

module.exports = router;

