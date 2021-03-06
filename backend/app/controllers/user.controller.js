require("dotenv").config();
exports.allAccess = (req, res) => {
	res.status(200).send("Public Content.");
};
exports.userBoard = (req, res) => {
	res.status(200).send("User Content.");
};
exports.adminBoard = (req, res) => {
	res.status(200).send(process.env.API_KEY);
};
exports.moderatorBoard = (req, res) => {
	res.status(200).send("Moderator Content.");
};
exports.adminComments = (req, res) => {
	res.status(200).send(process.env.API_KEY_COMMENTS);
};
