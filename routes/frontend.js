var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
//contenuto offerte?!?!?
    res.render('template', { title: 'home', contenuto: 'categoria' });


});
router.get('/registrazione', function (req, res, next) {

    res.render('template', { title: 'registrazione', contenuto: 'registrazione'  });


});
router.get('/categoria', function (req, res, next) {
//titolo = nome della categoria
    res.render('template', { title: 'categoria', contenuto: 'categoria'  });


});
router.get('/prodotto', function (req, res, next) {
//Titolo = nome del prodotto
    res.render('template', { title: 'prodotto', contenuto: 'prodotto'  });


});
router.get('/carrello', function (req, res, next) {

    res.render('template', { title: 'carrello', contenuto: 'carrello' });


});

router.get('/profilo', function (req, res, next) {

    res.render('template', { title: 'il mio profilo', contenuto: 'profilo'  });


});

module.exports = router;