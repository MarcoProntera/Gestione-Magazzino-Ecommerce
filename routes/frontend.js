var express = require('express');
var router = express.Router();

var monGlo = require('zzCustom/mongoGlobal');
var ObjectID = require("mongodb").ObjectID;

/* HOME */
router.get('/', function (req, res, next) {
    monGlo.find('menu', {}, { codice: 1 }, function (dati_menu) {
        monGlo.find('categorie', {}, { codice_menu: 1 }, function (dati_categorie) {
            monGlo.find('prodotti', {}, { nome: 1 }, function (search_result) {
                res.render('template', { title: 'home', contenuto: 'categoria', menu: dati_menu, categorie: dati_categorie, prodotti: search_result, menuattivo: null });
            });
        });
    });
});
/* HOME */

/* REGISTRAZIONE */
router.get('/registrazione', function (req, res, next) {
    monGlo.find('menu', {}, { codice: 1 }, function (dati_menu) {
        monGlo.find('categorie', {}, { codice_menu: 1 }, function (dati_categorie) {
            monGlo.find('prodotti', {}, { nome: 1 }, function (search_result) {
                res.render('template', { title: 'registrazione', contenuto: 'registrazione', menu: dati_menu, categorie: dati_categorie, prodotti: search_result, menuattivo: null });
            });
        });
    });
});
/* REGISTRAZIONE */

/* CATEGORIA */
router.get('/categoria', function (req, res, next) {
    var codice_categoria = req.query.cat;
    monGlo.find('menu', {}, { codice: 1 }, function (dati_menu) {
        monGlo.find('categorie', {}, { codice_menu: 1 }, function (dati_categorie) {
            monGlo.find('categorie', { codice: Number(codice_categoria) }, {}, function (cat_search_result) {
                monGlo.find('prodotti', { codice_categoria: Number(cat_search_result[0].codice) }, { nome: 1 }, function (search_result) {
                    res.render('template', { title: cat_search_result.nome, contenuto: 'categoria', menu: dati_menu, categorie: dati_categorie, prodotti: search_result, menuattivo: cat_search_result[0].codice_menu });
                });
            });
        });
    });
});
/* CATEGORIA */

/* PRODOTTO */
router.get('/prodotto', function (req, res, next) {
    //Titolo = nome del prodotto
    var codice_prodotto = req.query.pro;
    monGlo.find('menu', {}, { codice: 1 }, function (dati_menu) {
        monGlo.find('categorie', {}, { codice_menu: 1 }, function (dati_categorie) {
            monGlo.find('prodotti', { codice: Number(codice_prodotto) }, {}, function (dati_prodotto) {
                monGlo.find('categorie', { codice: Number(dati_prodotto.codice_categoria) }, {}, function (cat_search_result) {
                    res.render('template', { title: 'prodotto', contenuto: 'prodotto', menu: dati_menu, categorie: dati_categorie, dati_prodotto: dati_prodotto, menuattivo: cat_search_result[0].codice_menu });
                });
            });
        });
    });
});
/* PRODOTTO */

/* CARRELLO */
router.get('/carrello', function (req, res, next) {
    monGlo.find('menu', {}, { codice: 1 }, function (dati_menu) {
        monGlo.find('categorie', {}, { codice_menu: 1 }, function (dati_categorie) {
            res.render('template', { title: 'carrello', contenuto: 'carrello', menu: dati_menu, categorie: dati_categorie, menuattivo: null });
        });
    });
});
/* CARRELLO */

/* PROFILO */
router.get('/profilo', function (req, res, next) {
    monGlo.find('menu', {}, { codice: 1 }, function (dati_menu) {
        monGlo.find('categorie', {}, { codice_menu: 1 }, function (dati_categorie) {
            res.render('template', { title: 'il mio profilo', contenuto: 'profilo', contenuto_sub: 'datiutente', menu: dati_menu, categorie: dati_categorie, menuattivo: null });
        });
    });
});
router.get('/profilo/storicoordini', function (req, res, next) {
    monGlo.find('menu', {}, { codice: 1 }, function (dati_menu) {
        monGlo.find('categorie', {}, { codice_menu: 1 }, function (dati_categorie) {
            res.render('template', { title: 'il mio profilo', contenuto: 'profilo', contenuto_sub: 'storicoordini', menu: dati_menu, categorie: dati_categorie, menuattivo: null });
        });
    });
});
/* PROFILO */

module.exports = router;