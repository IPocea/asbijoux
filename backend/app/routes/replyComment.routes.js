require("dotenv").config();

module.exports = (app) => {
	const replyComments = require("../controllers/replyComment.controller.js");
	let router = require("express").Router();
	// Create a new Comment
	router.post(`/${process.env.API_KEY_COMMENTS}/`, replyComments.create);
	// Retrieve all Comments
	router.get("/", replyComments.findAll);
	// Retrieve a single Comment with id
	router.get("/:id", replyComments.findOne);
	// Update a Comment with id
	router.put(`/${process.env.API_KEY_COMMENTS}/:id`, replyComments.update);
	// Delete a Comment with id
	router.delete(`/${process.env.API_KEY_COMMENTS}/:id`, replyComments.delete);
	app.use("/api/reply-comments", router);
};
