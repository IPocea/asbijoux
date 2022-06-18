const db = require("../models");
const ReplyComment = db.replyComments;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
	if (!req.body.name) {
		res.status(400).send({
			message: "Continutul nu poate fi gol!",
		});
		return;
	}
	const replyComment = {
		name: req.body.name,
		text: req.body.text,
		isActivated: req.body.isActivated ? req.body.isActivated : true,
		commentId: req.body.commentId,
	};

	ReplyComment.create(replyComment)
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
	const commentId = req.query.commentId;
	let condition = commentId ? { commentId: { [Op.eq]: commentId } } : null;
	ReplyComment.findAll({ include: ["comment"], where: condition })
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
	ReplyComment.findByPk(id, { include: ["comment"] })
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
	ReplyComment.update(req.body, {
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
	ReplyComment.destroy({
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
