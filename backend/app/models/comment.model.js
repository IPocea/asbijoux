module.exports = (sequelize, DataTypes) => {
	const Comment = sequelize.define("comment", {
		name: {
			type: DataTypes.STRING,
		},
		text: {
			type: DataTypes.STRING(1000),
		},
		email: {
			type: DataTypes.STRING,
		},
		isActivated: {
			type: DataTypes.BOOLEAN,
		},
	});
	return Comment;
};
