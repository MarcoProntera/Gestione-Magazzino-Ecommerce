var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  
  res.render('home', { title: 'home' });

  
});
router.get('/singin', function (req, res, next) {
  
  res.render('singin', { title: 'singin' });

  
});
router.get('/prodotticategoria', function (req, res, next) {
  
  res.render('prodotticategoria', { title: 'prodotticategoria' });

  
});
router.get('/dettagliprodotto', function (req, res, next) {
  
  res.render('dettagliprodotto', { title: 'dettagliprodotto' });

  
});
router.get('/carrello', function (req, res, next) {
  
  res.render('carrello', { title: 'carrello' });

  
});
router.get('/profiloutente', function (req, res, next) {
  
  res.render('profiloutente', { title: 'profiloutente' });

  
});
router.get('/datiutente', function (req, res, next) {
  
  res.render('datiutente', { title: 'datiutente' });

  
});

module.exports = router;
