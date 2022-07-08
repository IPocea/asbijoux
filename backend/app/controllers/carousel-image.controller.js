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
