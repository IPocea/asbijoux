module.exports = (sequelize, DataTypes) => {
	const ReplyComment = sequelize.define("reply_comments", {
		name: {
			type: DataTypes.STRING,
		},
		text: {
			type: DataTypes.STRING(1000),
		},
		isActivated: {
			type: DataTypes.BOOLEAN,
		},
	});
	return ReplyComment;
};
