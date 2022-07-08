require("dotenv").config();

module.exports = (app) => {
	const comments = require("../controllers/comment.controller.js");
	let router = require("express").Router();
	// Create a new Comment
	router.post("/", comments.create);
	// Retrieve all Comments
	router.get(`/${process.env.API_KEY}`, comments.findAll);
	// Retrieve a single Comment with id
	router.get(`/${process.env.API_KEY}/:id`, comments.findOne);
	// Update a Comment with id
	router.put(`/${process.env.API_KEY}/:id`, comments.update);
	// Delete a Comment with id
	router.delete(`/${process.env.API_KEY}/:id`, comments.delete);
	// Delete all Comments of a product with ids
	router.post(`/${process.env.API_KEY}/delete-all`, comments.deleteAll);
	app.use("/api/comments", router);
};
