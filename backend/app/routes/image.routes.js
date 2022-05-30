require("dotenv").config();
module.exports = (app) => {
	const images = require("../controllers/file.controller.js");
	const images2 = require("../controllers/image.controller.js");
	let router = require("express").Router();
	// Create a new Image
	router.post(`/${process.env.API_KEY}/upload`, images.upload);
	// Retrieve all Images
	router.get("/", images2.findAll);
	// for working link of Images
	router.get("/files", images.getListFiles);
	router.get("/files/:name", images.download);
	// Retrieve a single Image with id
	router.get("/:id", images2.findOne);
	// Delete a Image with id
	router.post(`/${process.env.API_KEY}/unlink`, images.deleteFile);
	app.use("/api/images", router);
};
