var express = require("express");
var router = express.Router();
var cmdline = require("child_process");

/* GET users listing. */
router.get("/", function(req, res, next) {
	res.send("respond with a resource");
});

// return the json output from taskwarrior
router.get("/getTasks", function(req, res, next) {
	cmdline.exec("task export", function(err, sto, ste) {
		res.send(sto);
	});
});

module.exports = router;
