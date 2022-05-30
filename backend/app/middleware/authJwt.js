const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
verifyToken = (req, res, next) => {
	let token = req.session.token;
	if (!token) {
		return res.status(403).send({
			message: "Tokenul nu a fost oferit!",
		});
	}
	jwt.verify(token, config.secret, (err, decoded) => {
		if (err) {
			return res.status(401).send({
				message: "Neautorizat!",
			});
		}
		req.userId = decoded.id;
		next();
	});
};
isAdmin = async (req, res, next) => {
	try {
		const user = await User.findByPk(req.userId);
		const roles = await user.getRoles();
		for (let i = 0; i < roles.length; i++) {
			if (roles[i].name === "admin") {
				return next();
			}
		}
		return res.status(403).send({
			message: "Necesita rol de Admin!",
		});
	} catch (error) {
		return res.status(500).send({
			message: "Nu am putut valida rolul adminului!",
		});
	}
};
isModerator = async (req, res, next) => {
	try {
		const user = await User.findByPk(req.userId);
		const roles = await user.getRoles();
		for (let i = 0; i < roles.length; i++) {
			if (roles[i].name === "moderator") {
				return next();
			}
		}
		return res.status(403).send({
			message: "Necesita rol de moderator!",
		});
	} catch (error) {
		return res.status(500).send({
			message: "Nu am putut valida rolul moderatorului!",
		});
	}
};
isModeratorOrAdmin = async (req, res, next) => {
	try {
		const user = await User.findByPk(req.userId);
		const roles = await user.getRoles();
		for (let i = 0; i < roles.length; i++) {
			if (roles[i].name === "moderator") {
				return next();
			}
			if (roles[i].name === "admin") {
				return next();
			}
		}
		return res.status(403).send({
			message: "Necesita rol de moderator sau de admin!",
		});
	} catch (error) {
		return res.status(500).send({
			message: "Nu am putut valida rolul de moderator sau de admin!",
		});
	}
};
const authJwt = {
	verifyToken,
	isAdmin,
	isModerator,
	isModeratorOrAdmin,
};
module.exports = authJwt;
