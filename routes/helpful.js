var express = require('express');
var router = express.Router();
var cmdline = require('child_process');



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('helpful');
});

module.exports = router;