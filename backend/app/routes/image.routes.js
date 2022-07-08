require("dotenv").config();
module.exports = (app) => {
	const images = require("../controllers/file.controller.js");
	const images2 = require("../controllers/image.controller.js");
	let router = require("express").Router();
	// Create a new Image
	router.post(`/${process.env.API_KEY}/upload`, images.upload);
	// Retrieve all Images
	router.get(`/${process.env.API_KEY}`, images2.findAll);
	// for working link of Images
	router.get(`/files/${process.env.API_KEY}`, images.getListFiles);
	router.get("/files/:name", images.download);
	// Delete a Image with id
	router.post(`/${process.env.API_KEY}/unlink`, images.deleteFile);
	router.post(`/${process.env.API_KEY}/unlink-all`, images.deleteFiles);
	app.use("/api/images", router);
};
