require("dotenv").config();
module.exports = (app) => {
	const products = require("../controllers/product.controller.js");
	let router = require("express").Router();
	// Create a new Product
	router.post(`/${process.env.API_KEY}/`, products.create);
	// Retrieve all Product
	router.get(`/${process.env.API_KEY}`, products.findAll);
	router.get("/public", products.findAllPublic);
	// Retrieve a single Product with id
	router.get("/:id", products.findOne);
	// Retrieve a single Product by id with active comments
	router.get("/active-comments/:id", products.findOneActiveComments);
	// Retrieve all categories of the Products
	router.get(
		`/find/categories/${process.env.API_KEY}`,
		products.findAllCategories
	);
	// Retrieve all published categories
	router.get("/find/published/categories", products.findAllPublishedCategories);
	// Retrieve all Products of the selected category
	router.get("/find/category", products.findAllByCategory);
	// Update a Product with id
	router.put(`/${process.env.API_KEY}/:id`, products.update);
	// Delete a Product with id
	router.delete(`/${process.env.API_KEY}/:id`, products.delete);
	app.use("/api/products", router);
};
