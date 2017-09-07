var express = require('express');
var router = express.Router();

var monGlo = require('zzCustom/mongoGlobal');
var ObjectID = require("mongodb").ObjectID;

/* HOME */
router.get('/', function(req, res, next) {
    funzione(req, function(dati) {
        monGlo.find('prodotti', {}, { nome: 1 }, function(search_result) {
            res.render('template', { title: 'home', contenuto: 'categoria', menu: dati.menu, categorie: dati.categorie, prodotti: search_result, menuattivo: null, auth: dati.logged, nomeCategoria: null });
        });
    });
});
router.post('/login', function(req, res, next) {
    funzione(req, function(dati) {
        var query = { email: req.body.login_email, password: req.body.login_password };
        console.log(query);
        console.log(req.body);
        var uid;
        monGlo.find('utenti', query, {}, function(data) {
            console.log(data);
            if (data.length == 0) {
                res.redirect('/');
            } else {
                uid = data[0]._id;
                query = { codice: uid };
                monGlo.find('sessione', query, {}, function(data) {
                    if (data.length == 0) {
                        query = { codice: uid, stato: true };
                        monGlo.insert('sessione', query, function(data) {
                            req.session.buser = data[0]._id;
                            res.redirect('/');
                        });
                    } else {
                        query = { codice: uid };
                        monGlo.update('sessione', query, { stato: false }, function(data) {
                            query = { codice: uid, stato: true };
                            monGlo.insert('sessione', query, function(data) {
                                req.session.buser = data[0]._id;
                                res.redirect('/');
                            });
                        });
                    }
                });
            }
        });
    });
});
router.get('/logout', function(req, res, next) {
    funzione(req, function(dati) {
        var uid = req.session.buser;
        req.session.destroy();
        var query = { _id: ObjectID(uid) };
        monGlo.update('sessione', query, { stato: false }, function (data) {
            monGlo.remove('sessione', { stato: false }, function (data) {
                res.redirect('/');
            });
        });
    });
});
/* HOME */

/* REGISTRAZIONE */
router.get('/registrazione', function(req, res, next) {
    funzione(req, function(dati) {
        if (dati.logged == true)
            res.render('template', { title: 'il mio profilo', contenuto: 'profilo', contenuto_sub: 'datiutente', menu: dati.menu, categorie: dati.categorie, menuattivo: null, auth: dati.logged });
        else
            res.render('template', { title: 'registrazione', contenuto: 'registrazione', menu: dati.menu, categorie: dati.categorie, menuattivo: null, errore: null, auth: dati.logged });
    });
});
router.post('/registrazione', function(req, res, next) {
    if (req.body.nome == '' || req.body.cognome == '' || req.body.email == '' || req.body.indirizzo == '' || req.body.stato == '' || req.body.provincia == '' || req.body.telefono == '' || req.body.password == '') {
        funzione(req, function(dati) {
            res.render('template', { title: 'registrazione', contenuto: 'registrazione', menu: dati.menu, categorie: dati.categorie, menuattivo: null, errore: 'dati non corretti', auth: dati.logged });
        });
    } else {
        funzione(req, function(dati) {
            monGlo.find('utenti', {}, { codice: 1 }, function(data) {
                var newCode = 0;
                if (data.length != 0)
                    newCode = data[data.length - 1].codice + 1;
                monGlo.insert('utenti', { codice: Number(newCode), nome: req.body.nome, cognome: req.body.cognome, email: req.body.email, indirizzo: req.body.indirizzo, stato: req.body.stato, provincia: req.body.provincia, telefono: req.body.telefono, password: req.body.password }, function(result) {
                    var query = { codice: Number(result[0].codice) };
                    var uid;
                    monGlo.find('utenti', query, {}, function(data) {
                        if (data.length == 0) {
                            res.render('template', { title: 'registrazione', contenuto: 'registrazione', menu: dati.menu, categorie: dati.categorie, menuattivo: null, errore: 'dati non corretti', auth: dati.logged });
                        } else {
                            uid = data[0]._id;
                            query = { codice: uid };
                            monGlo.find('sessione', query, {}, function(data) {
                                if (data.length == 0) {
                                    query = { codice: uid, stato: true };
                                    monGlo.insert('sessione', query, function(data) {
                                        req.session.buser = data[0]._id;
                                        res.redirect('/profilo');
                                    });
                                } else {
                                    query = { codice: uid };
                                    monGlo.update('sessione', query, { stato: false }, function(data) {
                                        query = { codice: uid, stato: true };
                                        monGlo.insert('sessione', query, function(data) {
                                            req.session.buser = data[0]._id;
                                            res.redirect('/profilo');
                                        });
                                    });
                                }
                            });
                        }
                    });
                });
            });
        });
    }
});
/* REGISTRAZIONE */

/* CATEGORIA */
router.get('/categoria', function(req, res, next) {
    var codice_categoria = req.query.cat;
    funzione(req, function(dati) {
        monGlo.find('categorie', { codice: Number(codice_categoria) }, {}, function(cat_search_result) {
            monGlo.find('prodotti', { codice_categoria: Number(cat_search_result[0].codice) }, { nome: 1 }, function(search_result) {
                res.render('template', { title: cat_search_result.nome, contenuto: 'categoria', menu: dati.menu, categorie: dati.categorie, prodotti: search_result, menuattivo: cat_search_result[0].codice_menu, auth: dati.logged, nomeCategoria: cat_search_result[0].nome });
            });
        });
    });
});
/* CATEGORIA */

/* PRODOTTO */
router.get('/prodotto', function(req, res, next) {
    //Titolo = nome del prodotto
    var codice_prodotto = req.query.pro;
    funzione(req, function(dati) {
        monGlo.find('prodotti', { codice: Number(codice_prodotto) }, {}, function(dati_prodotto) {
            monGlo.find('categorie', { codice: Number(dati_prodotto[0].codice_categoria) }, {}, function(cat_search_result) {
                res.render('template', {
                    title: 'prodotto',
                    contenuto: 'prodotto',
                    menu: dati.menu,
                    categorie: dati.categorie,
                    dati_prodotto: dati_prodotto[0],
                    menuattivo: cat_search_result[0].codice_menu,
                    auth: dati.logged
                });
            });
        });
    });
});
/* PRODOTTO */

/* CARRELLO */
router.get('/carrello', function(req, res, next) {
    var aggiungi = req.query.add;
    funzione(req, function(dati) {
        if (dati.logged == true) {
            monGlo.find('utenti', { _id: ObjectID(dati.userID) }, {}, function(utente) {
                var codice_utente = utente[0].codice;
                var carrello = (req.session.carrello != null) ? req.session.carrello : [];
                if (carrello == []) {
                    monGlo.find('carrelli', { codice_utente: Number(codice_utente) }, {}, function(carrello_utente) {
                        carrello = JSON.parse(carrello_utente[0].carrello);
                        req.session.carrello = carrello;

                        if (aggiungi == undefined) {
                            res.render('template', { title: 'carrello', contenuto: 'carrello', menu: dati.menu, categorie: dati.categorie, menuattivo: null, auth: dati.logged, auth: dati.logged, carrello: carrello });
                        } else {

                            var aggiungilo = true;
                            if (carrello != []) {
                                for (var i = 0; i < carrello.length; i++) {
                                    if (JSON.parse(carrello[i]).codice == aggiungi)
                                        aggiungilo = false;
                                }
                            }

                            if (aggiungilo == true)
                                monGlo.find('prodotti', { codice: Number(aggiungi) }, {}, function(oggetto) {
                                    oggetto[0].quantita = 1;
                                    carrello.push(JSON.stringify(oggetto[0]));
                                    req.session.carrello = carrello;
                                    monGlo.update('carrelli', { codice_utente: Number(codice_utente) }, { carrello: JSON.stringify(carrello) }, function(result) {
                                        res.render('template', { title: 'carrello', contenuto: 'carrello', menu: dati.menu, categorie: dati.categorie, menuattivo: null, auth: dati.logged, auth: dati.logged, carrello: carrello });
                                    });
                                });
                            else
                                res.render('template', { title: 'carrello', contenuto: 'carrello', menu: dati.menu, categorie: dati.categorie, menuattivo: null, auth: dati.logged, auth: dati.logged, carrello: carrello });
                        }
                    });
                } else {
                    monGlo.update('carrelli', { codice_utente: Number(codice_utente) }, { carrello: JSON.stringify(carrello) }, function(result) {
                        var aggiungilo = true;
                        if (carrello != []) {
                            for (var i = 0; i < carrello.length; i++) {
                                if (JSON.parse(carrello[i]).codice == aggiungi)
                                    aggiungilo = false;
                            }
                        }
                        if (aggiungi == undefined) {
                            monGlo.update('carrelli', { codice_utente: Number(codice_utente) }, { carrello: JSON.stringify(carrello) }, function(result) {
                                res.render('template', { title: 'carrello', contenuto: 'carrello', menu: dati.menu, categorie: dati.categorie, menuattivo: null, auth: dati.logged, auth: dati.logged, carrello: carrello });
                            });
                        } else {
                            if (aggiungilo == true)
                                monGlo.find('prodotti', { codice: Number(aggiungi) }, {}, function(oggetto) {
                                    oggetto[0].quantita = 1;
                                    carrello.push(JSON.stringify(oggetto[0]));
                                    req.session.carrello = carrello;
                                    monGlo.update('carrelli', { codice_utente: Number(codice_utente) }, { carrello: JSON.stringify(carrello) }, function(result) {
                                        res.render('template', { title: 'carrello', contenuto: 'carrello', menu: dati.menu, categorie: dati.categorie, menuattivo: null, auth: dati.logged, auth: dati.logged, carrello: carrello });
                                    });
                                });
                            else
                                res.render('template', { title: 'carrello', contenuto: 'carrello', menu: dati.menu, categorie: dati.categorie, menuattivo: null, auth: dati.logged, auth: dati.logged, carrello: carrello });
                        }
                    });
                }
            });
        } else {
            var carrello = (req.session.carrello != null) ? req.session.carrello : [];
            var aggiungilo = true;
            if (req.session.carrello != []) {
                for (var i = 0; i < carrello.length; i++) {
                    if (JSON.parse(carrello[i]).codice == aggiungi)
                        aggiungilo = false;
                }
            }
            if (aggiungi == undefined) {
                res.render('template', { title: 'carrello', contenuto: 'carrello', menu: dati.menu, categorie: dati.categorie, menuattivo: null, auth: dati.logged, auth: dati.logged, carrello: carrello });
            } else {
                if (aggiungilo == true)
                    monGlo.find('prodotti', { codice: Number(aggiungi) }, {}, function(oggetto) {
                        oggetto[0].quantita = 1;
                        carrello.push(JSON.stringify(oggetto[0]));
                        req.session.carrello = carrello;
                        res.render('template', { title: 'carrello', contenuto: 'carrello', menu: dati.menu, categorie: dati.categorie, menuattivo: null, auth: dati.logged, auth: dati.logged, carrello: carrello });
                    });
                else
                    res.render('template', { title: 'carrello', contenuto: 'carrello', menu: dati.menu, categorie: dati.categorie, menuattivo: null, auth: dati.logged, auth: dati.logged, carrello: carrello });
            }
        }
    });
});
/* CARRELLO */

/* PROFILO */
router.get('/profilo', function(req, res, next) {
    funzione(req, function(dati) {
        if (dati.logged == false)
            res.redirect('/');
        else {
            monGlo.find('utenti', { _id: ObjectID(dati.userID) }, {}, function(found) {
                res.render('template', { title: 'il mio profilo', contenuto: 'profilo', contenuto_sub: 'datiutente', menu: dati.menu, categorie: dati.categorie, menuattivo: null, auth: dati.logged, dati_utente: found[0] });
            });
        }
    });
});
router.get('/profilo/storicoordini', function(req, res, next) {
    funzione(req, function(dati) {
        if (dati.logged == false)
            res.redirect('/');
        res.render('template', { title: 'il mio profilo', contenuto: 'profilo', contenuto_sub: 'storicoordini', menu: dati.menu, categorie: dati.categorie, menuattivo: null, auth: dati.logged });
    });
});
/* PROFILO */

router.post('/avvertimi', function(req, res, next) {
    var codice_prodotto = req.body.codice;
    funzione(req, function(dati) {
        if (dati.logged == false) {
            res.redirect('/');
        } else {
            monGlo.find('prodotti', { codice: Number(codice_prodotto) }, { nome: 1 }, function(search_result) {
                var prodotto = search_result[0];
                var avvertendi = (prodotto.avverti_user == '') ? [] : JSON.parse(prodotto.avverti_user);
                monGlo.find('utenti', { _id: ObjectID(dati.userID) }, {}, function(utente) {
                    avvertendi.push(utente[0].email);
                    monGlo.update('prodotti', { codice: Number(codice_prodotto) }, { avverti_user: JSON.stringify(avvertendi) }, function(result) {
                        res.send('OK');
                    });
                });
            });
        }
    });
});

function funzione(req, callback) {
    var out = { menu: '', categorie: '', logged: false, userID: '' };
    monGlo.find('menu', {}, { codice: 1 }, function(dati_menu) {
        out.menu = dati_menu;
        monGlo.find('categorie', {}, { codice_menu: 1 }, function(dati_categorie) {
            out.categorie = dati_categorie;
            if (req.session.buser !== undefined) {
                var query = { _id: ObjectID(req.session.buser), stato: true };
                monGlo.find('sessione', query, {}, function(data) {
                    if (data.length != 0) {
                        out.userID = data[0].codice;
                        out.logged = true;
                    }
                    callback(out);
                });
            } else
                callback(out);
        });
    });
}

module.exports = router;