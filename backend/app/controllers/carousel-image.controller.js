const db = require("../models");
const CarouselImage = db.carouselImages;
const Op = db.Sequelize.Op;

exports.findAll = (req, res) => {
	const name = req.query.name;
	let condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
	CarouselImage.findAll({ include: ["product"], where: condition })
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || "O eroare a aparut in regasirea imaginii.",
			});
		});
};

exports.findOne = (req, res) => {
	const id = req.params.id;
	CarouselImage.findByPk(id, { include: ["product"] })
		.then((data) => {
			if (data) {
				res.send(data);
			} else {
				res.status(404).send({
					message: `Nu pot gasi imaginea cu id=${id}.`,
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: "Eroare in regasirea imaginii cu id=" + id,
			});
		});
};
