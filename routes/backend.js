var express = require('express');
var router = express.Router();

var ioMan = require('zzCustom/socketGlobal');

var monGlo = require('zzCustom/mongoGlobal');
var ObjectID = require("mongodb").ObjectID;

var menuBackend;
var lastNewCode = -1;
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
                res.render('backend/template', { title: 'amministrazione', contenuto: 'help', menuBackend: menuBackend, msg: null });
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
    } else
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
                    var newCode = 0;
                    if (data.length != 0)
                        newCode = data[data.length - 1].codice + 1;
                    monGlo.insert('menu', { nome: newMenuName, codice: Number(newCode) }, function (data) {
                        res.send('OK');
                        ioMan.io().emit('backend_menu', { message: 'refresh' });
                    });
                });
            }
        });
    } else
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
    } else
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
                        if (k == newData.length - 1) {
                            res.send('OK');
                            ioMan.io().emit('backend_menu', { message: 'refresh' });
                        }
                        k++;
                    });
                }
            }
        });
    } else
        res.redirect('/amministrazione/login');
});
/* GESTIONE MENU */


/* GESTIONE CATEGORIE */
router.get('/categorie', function (req, res, next) {
    if (req.session.buser !== undefined) {
        var query = { _id: ObjectID(req.session.buser), stato: true };
        monGlo.find('backend_sessione', query, {}, function (data) {
            if (data.length == 0) {
                res.redirect('/amministrazione/login');
            } else {
                var tmp = {};
                monGlo.find('categorie', {}, { codice_menu: 1 }, function (data) {
                    tmp.cat = data;
                    monGlo.find('menu', {}, { codice: 1 }, function (data) {
                        tmp.men = data;
                        res.render('backend/template', { title: 'gestione categorie', contenuto: 'categorie', menuBackend: menuBackend, categorie: tmp });
                    });
                });
            }
        });
    } else
        res.redirect('/amministrazione/login');
});
router.post('/categorie/add', function (req, res, next) {
    var newCategoriaName = req.body.categoriaName;
    var newCategoriaMenuCode = req.body.codiceMenu;
    if (req.session.buser !== undefined) {
        var query = { _id: ObjectID(req.session.buser), stato: true };
        monGlo.find('backend_sessione', query, {}, function (data) {
            if (data.length == 0) {
                res.redirect('/amministrazione/login');
            } else {
                monGlo.find('categorie', {}, { codice: 1 }, function (data) {
                    var newCode = 0;
                    if (data.length != 0)
                        newCode = data[data.length - 1].codice + 1;
                    monGlo.insert('categorie', { nome: newCategoriaName, codice: Number(newCode), codice_menu: Number(newCategoriaMenuCode) }, function (data) {
                        res.send('OK');
                        ioMan.io().emit('backend_categorie', { message: 'refresh' });
                    });
                });
            }
        });
    } else
        res.redirect('/amministrazione/login');
});
router.post('/categorie/delete', function (req, res, next) {
    if (req.session.buser !== undefined) {
        var query = { _id: ObjectID(req.session.buser), stato: true };
        monGlo.find('backend_sessione', query, {}, function (data) {
            if (data.length == 0) {
                res.redirect('/amministrazione/login');
            } else {
                monGlo.remove('categorie', { codice: Number(req.body.codice) }, function (data) {
                    res.send('OK');
                    ioMan.io().emit('backend_categorie', { message: 'refresh' });
                });
            }
        });
    } else
        res.redirect('/amministrazione/login');
});
router.post('/categorie/update', function (req, res, next) {
    var newData = JSON.parse(req.body.data);
    if (req.session.buser !== undefined) {
        var query = { _id: ObjectID(req.session.buser), stato: true };
        monGlo.find('backend_sessione', query, {}, function (data) {
            if (data.length == 0) {
                res.redirect('/amministrazione/login');
            } else {
                var k = 0;
                for (var i = 0; i < newData.length; i++) {
                    monGlo.update('categorie', { codice: Number(newData[i].codice) }, { nome: newData[i].nome, codice_menu: Number(newData[i].codice_menu) }, function () {
                        if (k == newData.length - 1) {
                            res.send('OK');
                            ioMan.io().emit('backend_categorie', { message: 'refresh' });
                        }
                        k++;
                    });
                }
            }
        });
    } else
        res.redirect('/amministrazione/login');
});
/* GESTIONE CATEGORIE */


/* GESTIONE PRODOTTI */
router.get('/prodotti', function (req, res, next) {
    if (req.session.buser !== undefined) {
        var query = { _id: ObjectID(req.session.buser), stato: true };
        monGlo.find('backend_sessione', query, {}, function (data) {
            if (data.length == 0) {
                res.redirect('/amministrazione/login');
            } else {
                var tmp = {};
                monGlo.find('categorie', {}, { codice_menu: 1 }, function (data) {
                    tmp.cat = data;
                    monGlo.find('menu', {}, { codice: 1 }, function (data) {
                        tmp.men = data;
                        res.render('backend/template', { title: 'gestione prodotti', contenuto: 'prodotti', menuBackend: menuBackend, categorie: tmp });
                    });
                });
            }
        });
    } else
        res.redirect('/amministrazione/login');
});
router.post('/prodotti/search', function (req, res, next) {
    var search = req.body;
    console.log(search);
    if (req.session.buser !== undefined) {
        var query = { _id: ObjectID(req.session.buser), stato: true };
        monGlo.find('backend_sessione', query, {}, function (data) {
            if (data.length == 0) {
                res.redirect('/amministrazione/login');
            } else {
                if (search.codiceMenu == '-1' && search.codiceCategoria == '-1' && search.nomeProdotto == '') {
                    monGlo.find('prodotti', {}, { nome: 1 }, function (search_result) {
                        res.send(search_result);
                    });
                }
                if (search.codiceMenu == '-1' && search.codiceCategoria == '-1' && search.nomeProdotto != '') {
                    monGlo.find('prodotti', { nome: { "$regex": search.nomeProdotto } }, { nome: 1 }, function (search_result) {
                        res.send(search_result);
                    });
                }
                if (search.codiceMenu == '-1' && search.codiceCategoria != '-1' && search.nomeProdotto == '' || search.codiceMenu != '-1' && search.codiceCategoria != '-1' && search.nomeProdotto == '') {
                    monGlo.find('prodotti', { codice_categoria: Number(search.codiceCategoria) }, { nome: 1 }, function (search_result) {
                        res.send(search_result);
                    });
                }
                if (search.codiceMenu == '-1' && search.codiceCategoria != '-1' && search.nomeProdotto != '' || search.codiceMenu != '-1' && search.codiceCategoria != '-1' && search.nomeProdotto != '') {
                    monGlo.find('prodotti', { codice_categoria: Number(search.codiceCategoria), nome: { "$regex": search.nomeProdotto } }, { nome: 1 }, function (search_result) {
                        res.send(search_result);
                    });
                }
                if (search.codiceMenu != '-1' && search.codiceCategoria == '-1' && search.nomeProdotto == '') {
                    monGlo.find('categorie', { codice_menu: Number(search.codiceMenu) }, { codice: 1 }, function (cat_search_result) {
                        var out = null;
                        var k = 0;
                        for (var i = 0; i < cat_search_result.length; i++) {
                            monGlo.find('prodotti', { codice_categoria: Number(cat_search_result[i].codice) }, { codice_categoria: 1 }, function (search_result) {
                                if (out === null)
                                    out = search_result;
                                else
                                    out = out.concat(search_result);
                                if (k == cat_search_result.length - 1) {
                                    res.send(out);
                                }
                                k++;
                            });
                        }
                    });
                }
                if (search.codiceMenu != '-1' && search.codiceCategoria == '-1' && search.nomeProdotto != '') {
                    monGlo.find('categorie', { codice_menu: Number(search.codiceMenu) }, { codice: 1 }, function (cat_search_result) {
                        var out = null;
                        var k = 0;
                        for (var i = 0; i < cat_search_result.length; i++) {
                            monGlo.find('prodotti', { codice_categoria: Number(cat_search_result[i].codice), nome: { "$regex": search.nomeProdotto } }, { codice_categoria: 1 }, function (search_result) {
                                if (out === null)
                                    out = search_result;
                                else
                                    out = out.concat(search_result);
                                if (k == cat_search_result.length - 1) {
                                    res.send(out);
                                }
                                k++;
                            });
                        }
                    });
                }
            }
        });
    } else
        res.redirect('/amministrazione/login');
});
router.post('/prodotti/delete', function (req, res, next) {
    if (req.session.buser !== undefined) {
        var query = { _id: ObjectID(req.session.buser), stato: true };
        monGlo.find('backend_sessione', query, {}, function (data) {
            if (data.length == 0) {
                res.redirect('/amministrazione/login');
            } else {
                monGlo.remove('prodotti', { codice: Number(req.body.codice) }, function (data) {
                    res.send('OK');
                });
            }
        });
    } else
        res.redirect('/amministrazione/login');
});
/* GESTIONE PRODOTTI */

var nodemailer = require('nodemailer');
/* GESTIONE PRODOTTO */
router.get('/prodotto', function (req, res, next) {
    if (req.session.buser !== undefined) {
        var query = { _id: ObjectID(req.session.buser), stato: true };
        monGlo.find('backend_sessione', query, {}, function (data) {
            if (data.length == 0) {
                res.redirect('/amministrazione/login');
            } else {
                monGlo.find('categorie', {}, { codice_menu: 1 }, function (categorie) {
                    if (req.query.c == undefined) {
                        //NUOVO PRODOTTO
                        monGlo.find('prodotti', {}, { codice: 1 }, function (data) {
                            var newCode = 0;
                            if (data.length != 0)
                                newCode = data[data.length - 1].codice + 1;
                            if (lastNewCode >= newCode)
                                newCode = lastNewCode + 1;
                            lastNewCode = newCode;
                            res.render('backend/template', { title: 'aggiungi prodotto', contenuto: 'prodotto', menuBackend: menuBackend, categorie: categorie, datiProdotto: null, newCode: newCode });
                        });
                    } else {
                        //MODIFICA PRODOTTO
                        var codice_prodotto = Number(req.query.c);
                        monGlo.find('prodotti', { codice: codice_prodotto }, {}, function (dati_prodotto) {
                            res.render('backend/template', { title: 'aggiungi prodotto', contenuto: 'prodotto', menuBackend: menuBackend, categorie: categorie, datiProdotto: (dati_prodotto.length == 0) ? null : dati_prodotto[0], newCode: null });
                        });
                    }
                });
            }
        });
    } else
        res.redirect('/amministrazione/login');
});
router.post('/prodotto/add', function (req, res, next) {
    var salva_prodotto = req.body;
    if (req.session.buser !== undefined) {
        var query = { _id: ObjectID(req.session.buser), stato: true };
        monGlo.find('backend_sessione', query, {}, function (data) {
            if (data.length == 0) {
                res.redirect('/amministrazione/login');
            } else {
                if (Number(salva_prodotto.quantita) <= 5) {
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'noreply.progettoecommerce@gmail.com',
                            pass: 'noreplyecommerce'
                        }
                    });

                    var mailOptions = {
                        from: 'noreply.progettoecommerce@gmail.com',
                        to: 'claudio.milani@studenti.unicam.it',
                        subject: 'Prodotto "' + salva_prodotto.nome + '" (cod. ' + salva_prodotto.codice + ') in esaurimento',
                        text: 'rimangono solo ' + salva_prodotto.quantita + ' displonibili, vedi un po tu...\n codice_categoria :' + salva_prodotto.codice_categoria
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                }
                monGlo.insert('prodotti', {
                    codice: Number(salva_prodotto.codice),
                    nome: salva_prodotto.nome,
                    descrizione: salva_prodotto.descrizione,
                    prezzo: salva_prodotto.prezzo,
                    quantita: salva_prodotto.quantita,
                    specifiche: salva_prodotto.specifiche,
                    codice_categoria: Number(salva_prodotto.codice_categoria)
                }, function (data) {
                    res.send({ codice: salva_prodotto.codice });
                });
            }
        });
    } else
        res.redirect('/amministrazione/login');
});
router.post('/prodotto/update', function (req, res, next) {
    var salva_prodotto = req.body;
    console.log(salva_prodotto);
    if (req.session.buser !== undefined) {
        var query = { _id: ObjectID(req.session.buser), stato: true };
        monGlo.find('backend_sessione', query, {}, function (data) {
            if (data.length == 0) {
                res.redirect('/amministrazione/login');
            } else {
                if (Number(salva_prodotto.quantita) <= 5) {
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'noreply.progettoecommerce@gmail.com',
                            pass: 'noreplyecommerce'
                        }
                    });

                    var mailOptions = {
                        from: 'noreply.progettoecommerce@gmail.com',
                        to: 'claudio.milani@studenti.unicam.it',
                        subject: 'Prodotto "' + salva_prodotto.nome + '" (cod. ' + salva_prodotto.codice + ') in esaurimento',
                        text: 'rimangono solo ' + salva_prodotto.quantita + ' displonibili, vedi un po tu...\n codice_categoria :' + salva_prodotto.codice_categoria
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                }
                monGlo.update('prodotti', { codice: Number(salva_prodotto.codice) }, {
                    nome: salva_prodotto.nome,
                    descrizione: salva_prodotto.descrizione,
                    prezzo: salva_prodotto.prezzo,
                    quantita: salva_prodotto.quantita,
                    specifiche: salva_prodotto.specifiche,
                    codice_categoria: Number(salva_prodotto.codice_categoria)
                }, function () {
                    if (Number(salva_prodotto.quantita) > 0) {
                        monGlo.find('prodotti', { codice: Number(salva_prodotto.codice) }, { nome: 1 }, function (prodotto_da_segnalare) {
                            var avvertendi = (prodotto_da_segnalare[0].avverti_user == '') ? [] : JSON.parse(prodotto_da_segnalare[0].avverti_user);
                            for (var i = 0; i < avvertendi.length; i++) {
                                var transporter = nodemailer.createTransport({
                                    service: 'gmail',
                                    auth: {
                                        user: 'noreply.progettoecommerce@gmail.com',
                                        pass: 'noreplyecommerce'
                                    }
                                });

                                var mailOptions = {
                                    from: 'noreply.progettoecommerce@gmail.com',
                                    to: avvertendi[i],
                                    subject: 'Prodotto "' + salva_prodotto.nome + '" (cod. ' + salva_prodotto.codice + ') DISPONIBILE',
                                    text: 'Di ' + salva_prodotto.nome + ' sono ora disponibili ' + salva_prodotto.quantita + 'pz.\nvedi un po tu...'
                                };

                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log('Email sent: ' + info.response);
                                    }
                                });
                            }
                            monGlo.update('prodotti', { codice: Number(salva_prodotto.codice) }, { avverti_user: '' }, function () { });
                            res.send({ codice: salva_prodotto.codice });
                        });
                    } else {
                        res.send({ codice: salva_prodotto.codice });
                    }
                });
            }
        });
    } else
        res.redirect('/amministrazione/login');
});
/* GESTIONE PRODOTTO */

/* UPLOAD */
router.post('/upload', function (req, res, next) {
    if (req.session.buser !== undefined) {
        var query = { _id: ObjectID(req.session.buser), stato: true };
        monGlo.find('backend_sessione', query, {}, function (data) {
            if (data.length == 0) {
                res.redirect('/amministrazione/login');
            } else {
                var codice = req.body.codice;
                var file_1 = req.files.file_1;
                var file_2 = req.files.file_2;
                var file_3 = req.files.file_3;
                file_1.mv('./public/images/prodotti/' + codice + '_1', function (err) {
                    if (err) {
                        console.log(err);
                        return res.send(err);
                        //return res.status(500).send(err);
                    }
                    file_2.mv('./public/images/prodotti/' + codice + '_2', function (err) {
                        if (err) {
                            console.log(err);
                            return res.send(err);
                            //return res.status(500).send(err);
                        }
                        file_3.mv('./public/images/prodotti/' + codice + '_3', function (err) {
                            if (err) {
                                console.log(err);
                                return res.send(err);
                                //return res.status(500).send(err);
                            }
                            res.send('OK');
                        });
                    });
                });
            }
        });
    } else
        res.redirect('/amministrazione/login');
});
/* UPLOAD */
module.exports = router;