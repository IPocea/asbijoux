const authJwt = require("./authJwt.js");
const verifySignUp = require("./verifySignUp.js");
const uploadFileMiddleware = require("./upload.js");
module.exports = {
	authJwt,
	verifySignUp,
	uploadFileMiddleware,
};
