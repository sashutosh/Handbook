var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: "process.env.JWT_SECRET",
  userProperty: 'payload'
});

var ctrlAuth = require('../controllers/authentication');
var schoolCtrl = require('../controllers/school');

router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.delete('/school/:SchoolId', schoolCtrl.deleteSchool);
module.exports = router;