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
	Product.findAll({
		include: [
			{
				model: db.comments,
				as: "comments",
				include: { model: db.replyComments, as: "reply_comments" },
			},
			{ model: db.images, as: "images" },
		],
		where: condition,
	})
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
exports.findAllPublic = (req, res) => {
	const title = req.query.title;
	let condition = title
		? { title: { [Op.like]: `%${title}%` }, [Op.not]: [{ isPublished: false }] }
		: { [Op.not]: [{ isPublished: false }] };
	Product.findAll({
		include: [
			{
				model: db.comments,
				as: "comments",
				attributes: { exclude: ["email"] },
				required: false,
				where: { [Op.not]: [{ isActivated: false }] },
				include: { model: db.replyComments, as: "reply_comments" },
			},
			{ model: db.images, as: "images" },
		],
		where: condition,
	})
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
// Find all Products with selected category
exports.findAllByCategory = (req, res) => {
	const category = req.query.category;
	let condition = category
		? {
				category: {
					[Op.and]: {
						[Op.startsWith]: `${category}`,
						[Op.endsWith]: `${category}`,
					},
				},
				[Op.not]: [{ isPublished: false }],
		  }
		: {
				[Op.not]: [{ isPublished: false }],
		  };
	Product.findAll({
		include: [
			{
				model: db.comments,
				as: "comments",
				attributes: { exclude: ["email"] },
				required: false,
				where: { [Op.or]: [{ isActivated: true }, { isActivated: null }] },
				include: { model: db.replyComments, as: "reply_comments" },
			},
			{ model: db.images, as: "images" },
		],
		where: condition,
	})
		.then((data) => {
			if (data) {
				res.send(data);
			} else {
				res.status(404).send({
					message: `Nu pot gasi produsele cu categoria=${category}.`,
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message:
					err.message ||
					"O eroare a aparut in incercarea de a regasi produsele.",
			});
		});
};
// Find all categories of Product
exports.findAllCategories = (req, res) => {
	Product.findAndCountAll({ group: ["category"] })
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message:
					err.message ||
					"O eroare a aparut in incercarea de a regasi categoriile.",
			});
		});
};

// Find all published Categories
exports.findAllPublishedCategories = (req, res) => {
	Product.findAndCountAll({ where: { isPublished: true }, group: ["category"] })
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message:
					err.message ||
					"O eroare a aparut in incercarea de a regasi categoriile.",
			});
		});
};
// Find a single Product with an id
exports.findOne = (req, res) => {
	const id = req.params.id;
	Product.findByPk(id, {
		include: [
			{
				model: db.comments,
				as: "comments",
				attributes: { exclude: ["email"] },
				required: false,
				where: { [Op.or]: [{ isActivated: true }, { isActivated: null }] },
				include: { model: db.replyComments, as: "reply_comments" },
			},
			{ model: db.images, as: "images" },
		],
	})
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
exports.findOneActiveComments = (req, res) => {
	const id = req.params.id;
	Product.findByPk(id, {
		include: [
			{
				model: db.comments,
				as: "comments",
				attributes: { exclude: ["email"] },
				required: false, // if no comment exist will still return empty array even if we have where condition bellow
				where: { [Op.not]: [{ isActivated: false }] },
				include: { model: db.replyComments, as: "reply_comments" },
			},
			{ model: db.images, as: "images" },
		],
	})
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
