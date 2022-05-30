module.exports = (sequelize, DataTypes) => {
	const Image = sequelize.define("image", {
		type: {
			type: DataTypes.STRING,
		},
		name: {
			type: DataTypes.STRING,
		},
		url: {
			type: DataTypes.STRING,
		},
	});
	return Image;
};
