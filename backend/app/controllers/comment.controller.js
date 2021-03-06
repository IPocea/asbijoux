const db = require("../models");
const Comment = db.comments;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
	if (!req.body.name) {
		res.status(400).send({
			message: "Continutul nu poate fi gol!",
		});
		return;
	}
	const comment = {
		name: req.body.name,
		text: req.body.text,
		email: req.body.email,
		isActivated: req.body.isActivated ? req.body.isActivated : false,
		productId: req.body.productId,
	};

	Comment.create(comment)
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || "O eroare a aparut in crearea comentariului.",
			});
		});
};

exports.findAll = (req, res) => {
	const name = req.query.name;
	let condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
	Comment.findAll({ include: ["product", "reply_comments"], where: condition })
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || "O eroare a aparut in regasirea comentariilor.",
			});
		});
};

exports.findOne = (req, res) => {
	const id = req.params.id;
	Comment.findByPk(id, { include: ["product", "reply_comments"] })
		.then((data) => {
			if (data) {
				res.send(data);
			} else {
				res.status(404).send({
					message: `Nu pot gasi comentariul cu id=${id}.`,
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: "Eroare in regasirea comentariului cu id=" + id,
			});
		});
};

exports.update = (req, res) => {
	const id = req.params.id;
	Comment.update(req.body, {
		where: { id: id },
	})
		.then((num) => {
			if (num == 1) {
				res.send({
					message: "Comentariul a fost actualizat cu succes.",
				});
			} else {
				res.send({
					message: `Nu pot modifica comentariul cu id=${id}. Comentariul poate nu a fost gasit sau continutul este gol!`,
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: "Eroare in updatarea comentariului cu id=" + id,
			});
		});
};

exports.delete = (req, res) => {
	const id = req.params.id;
	Comment.destroy({
		where: { id: id },
	})
		.then((num) => {
			if (num == 1) {
				res.send({
					message: "Comentariul a fost sters cu succes!",
				});
			} else {
				res.send({
					message: `Nu pot sterge comentariul cu id=${id}. Comentariul poate nu a fost gasit!`,
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: "Nu am putut sterge comentariul cu id=" + id,
			});
		});
};

exports.deleteAll = async (req, res) => {
	const ids = req.body.ids.map((ele) => ele.id);
	try {
		const num = await Comment.destroy({
			where: { id: ids },
		});
		if (num == ids.length) {
			return res.json({
				message: "Comentariile au fost sterse cu succes!",
			});
		} else {
			return res.json({
				message:
					"Nu pot sterge comentariile selectate. Comentariile poate nu au fost gasite!",
			});
		}
	} catch (error) {
		return res.json({
			message: "Nu am putut sterge comentariile selectate.",
		});
	}
};
