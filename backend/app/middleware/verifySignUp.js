const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;
checkDuplicateUsernameOrEmail = async (req, res, next) => {
	try {
		// Username
		let user = await User.findOne({
			where: {
				username: req.body.username,
			},
		});
		if (user) {
			return res.status(400).send({
				message: "A esuat! Username-ul este deja in folosinta!",
			});
		}
		// Email
		user = await User.findOne({
			where: {
				email: req.body.email,
			},
		});
		if (user) {
			return res.status(400).send({
				message: "A esuat! Emailul este deja in folosinta!",
			});
		}
		next();
	} catch (error) {
		return res.status(500).send({
			message: "Nu pot valida username-ul!",
		});
	}
};
checkRolesExisted = (req, res, next) => {
	if (req.body.roles) {
		for (let i = 0; i < req.body.roles.length; i++) {
			if (!ROLES.includes(req.body.roles[i])) {
				res.status(400).send({
					message: "A esuat! Rolul nu exista = " + req.body.roles[i],
				});
				return;
			}
		}
	}

	next();
};
const verifySignUp = {
	checkDuplicateUsernameOrEmail,
	checkRolesExisted,
};
module.exports = verifySignUp;
