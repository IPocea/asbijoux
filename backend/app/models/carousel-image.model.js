module.exports = (sequelize, DataTypes) => {
	const CarouselImage = sequelize.define("carousel_images", {
		type: {
			type: DataTypes.STRING,
		},
		name: {
			type: DataTypes.STRING,
		},
		url: {
			type: DataTypes.STRING,
		},
		position: {
			type: DataTypes.INTEGER,
		},
	});
	return CarouselImage;
};
