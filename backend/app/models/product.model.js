module.exports = (sequelize, Sequelize) => {
	const Product = sequelize.define("product", {
		title: {
			type: Sequelize.STRING,
		},
		description: {
			type: Sequelize.STRING(15000),
		},
		category: {
			type: Sequelize.STRING,
		},
		isPublished: {
			type: Sequelize.BOOLEAN,
		},
	});
	return Product;
};
