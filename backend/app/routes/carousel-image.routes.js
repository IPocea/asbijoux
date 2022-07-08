require("dotenv").config();
module.exports = (app) => {
	const carouselImages = require("../controllers/file.controller.js");
	const carouselImages2 = require("../controllers/carousel-image.controller.js");
	let router = require("express").Router();
	// Create a new Image
	router.post(
		`/${process.env.API_KEY}/upload`,
		carouselImages.uploadImageCarousel
	);
	// Retrieve all Images
	router.get("/", carouselImages2.findAll);
	// for working link of Images
	router.get("/files/:name", carouselImages.download);
	// Delete a Image with id
	router.post(
		`/${process.env.API_KEY}/unlink`,
		carouselImages.deleteCarouselFile
	);
	// Delete all Images
	router.post(
		`/${process.env.API_KEY}/unlink-all`,
		carouselImages.deleteCarouselFiles
	);
	app.use("/api/carousel-images", router);
};
