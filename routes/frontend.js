var express = require('express');
var router = express.Router();

var monGlo = require('zzCustom/mongoGlobal');
var ObjectID = require("mongodb").ObjectID;

/* HOME */
router.get('/', function(req, res, next) {
    monGlo.find('prodotti', {}, { nome: 1 }, function(search_result) {
        res.render('template', { title: 'home', contenuto: 'categoria', prodotti: search_result });
    });
});
/* HOME */

/* REGISTRAZIONE */
router.get('/registrazione', function(req, res, next) {
    res.render('template', { title: 'registrazione', contenuto: 'registrazione' });
});
/* REGISTRAZIONE */

/* CATEGORIA */
router.get('/categoria', function(req, res, next) {
    var codice_categoria = req.query.cat;
    monGlo.find('categorie', { codice: Number(codice_categoria) }, {}, function(cat_search_result) {
        monGlo.find('prodotti', { codice_categoria: Number(cat_search_result[0].codice) }, { nome: 1 }, function(search_result) {
            res.render('template', { title: cat_search_result.nome, contenuto: 'categoria', prodotti: search_result });
        });
    });
});
/* CATEGORIA */

/* PRODOTTO */
router.get('/prodotto', function(req, res, next) {
    //Titolo = nome del prodotto
    res.render('template', { title: 'prodotto', contenuto: 'prodotto' });
});
/* PRODOTTO */

/* CARRELLO */
router.get('/carrello', function(req, res, next) {
    res.render('template', { title: 'carrello', contenuto: 'carrello' });
});
/* CARRELLO */

/* PROFILO */
router.get('/profilo', function(req, res, next) {
    res.render('template', { title: 'il mio profilo', contenuto: 'profilo', contenuto_sub: 'datiutente' });
});
router.get('/profilo/storicoordini', function(req, res, next) {
    res.render('template', { title: 'il mio profilo', contenuto: 'profilo', contenuto_sub: 'storicoordini' });
});
/* PROFILO */

module.exports = router;