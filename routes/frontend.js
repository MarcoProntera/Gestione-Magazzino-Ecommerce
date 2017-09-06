var express = require('express');
var router = express.Router();

/* HOME */
router.get('/', function(req, res, next) {
    res.render('template', { title: 'home', contenuto: 'categoria' });
});
/* HOME */

/* REGISTRAZIONE */
router.get('/registrazione', function(req, res, next) {
    res.render('template', { title: 'registrazione', contenuto: 'registrazione' });
});
/* REGISTRAZIONE */

/* CATEGORIA */
router.get('/categoria', function(req, res, next) {
    //titolo = nome della categoria
    res.render('template', { title: 'categoria', contenuto: 'categoria' });
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