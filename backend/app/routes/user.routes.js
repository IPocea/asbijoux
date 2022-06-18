const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller.js");
module.exports = function (app) {
	app.use(function (req, res, next) {
		res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
		next();
	});
	app.get("/api/send-key/all", controller.allAccess);
	app.get("/api/send-key/user", [authJwt.verifyToken], controller.userBoard);
	app.get(
		"/api/send-key/mod",
		[authJwt.verifyToken, authJwt.isModerator],
		controller.moderatorBoard
	);
	app.get(
		"/api/send-key/admin",
		[authJwt.verifyToken, authJwt.isAdmin],
		controller.adminBoard
	);
	app.get(
		"/api/send-comments-key/admin",
		[authJwt.verifyToken, authJwt.isAdmin],
		controller.adminComments
	);
};
