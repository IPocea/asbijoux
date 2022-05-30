const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller.js");
require("dotenv").config();
module.exports = function (app) {
	app.use(function (req, res, next) {
		res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
		next();
	});
	app.post(
		`/api/${process.env.API_KEY}/auth/signup`,
		[
			verifySignUp.checkDuplicateUsernameOrEmail,
			verifySignUp.checkRolesExisted,
		],
		controller.signup
	);
	app.post(`/api/${process.env.API_KEY}/auth/signin`, controller.signin);
	app.post(`/api/${process.env.API_KEY}/auth/signout`, controller.signout);
};
