var express = require('express');
var router = express.Router();

/* GET home page. */
// APPARENTLUY RENDER PASSES SERVER SIDE VARIABLES BACK IN JSON
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
