const db = require("../models");
const Product = db.products;
const Op = db.Sequelize.Op;
// Create and Save a new Product
exports.create = (req, res) => {
	if (!req.body.title) {
		res.status(400).send({
			message: "Continutul nu poate fi gold!",
		});
		return;
	}
	// Create a Product
	const product = {
		title: req.body.title,
		description: req.body.description,
		category: req.body.category,
		isPublished: req.body.isPublished ? req.body.isPublished : false,
	};
	// Save Product in the database
	Product.create(product)
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || "O eroare a aparut in creerea produsului.",
			});
		});
};
// Retrieve all Products from the database.
exports.findAll = (req, res) => {
	const title = req.query.title;
	let condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
	Product.findAll({ include: ["comments", "images"], where: condition })
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message:
					err.message ||
					"O eroare a aparut in incercarea de a regasi produsul.",
			});
		});
};
// Find a single Product with an id
exports.findOne = (req, res) => {
	const id = req.params.id;
	Product.findByPk(id, { include: ["comments", "images"] })
		.then((data) => {
			if (data) {
				res.send(data);
			} else {
				res.status(404).send({
					message: `Nu pot gasi produsul cu id=${id}.`,
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: "Eroare in regasirea produsului cu id " + id,
			});
		});
};
// Update a Product by the id in the request
exports.update = (req, res) => {
	const id = req.params.id;
	Product.update(req.body, {
		where: { id: id },
	})
		.then((num) => {
			if (num == 1) {
				res.send({
					message: "Produsul a fost actualizat cu succes",
				});
			} else {
				res.send({
					message: `Nu pot actualiza produsul cu id=${id}. Poate ca produsul nu a fost gasit sau textul este gol!`,
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: "Eroare in actualizarea produsului cu id=" + id,
			});
		});
};
// Delete a Product with the specified id in the request
exports.delete = (req, res) => {
	const id = req.params.id;
	Product.destroy({
		where: { id: id },
	})
		.then((num) => {
			if (num == 1) {
				res.send({
					message: "Produsul a fost sters cu succes!",
				});
			} else {
				res.send({
					message: `Nu pot sterge produsul cu id=${id}. Poate ca produsul nu a putut fi gasit!`,
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: "Nu am putut sterge produsul cu id=" + id,
			});
		});
};

// Find all published Products
exports.findAllPublished = (req, res) => {
	Product.findAll({ include: ["comments"], where: { isPublished: true } })
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || "O eroare a aparut in regasirea produselor.",
			});
		});
};
