
var express = require('express');
var ctrlHome = require('../controllers/home');
var ctrlOthers = require('../controllers/others');
var router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});




/* Home pages */
router.get('/', ctrlOthers.angularApp);
router.get('/about', ctrlOthers.about);


module.exports = router;
