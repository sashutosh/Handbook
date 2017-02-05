
var express = require('express');
var ctrlHome = require('../controllers/home');
var router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});




/* Home pages */
router.get('/', ctrlHome.homePage);
/*router.get('/', function(req, res) {
  res.send('home page');
});*/


module.exports = router;
