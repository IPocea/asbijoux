require("dotenv").config();
const util = require("util");
const multer = require("multer");
const maxSize = 4 * 1024 * 1024;
const directoryPath = process.env.directoryPath;

let storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, directoryPath);
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-asbijoux-${file.originalname}`);
	},
});

let uploadFile = multer({
	storage: storage,
	limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
