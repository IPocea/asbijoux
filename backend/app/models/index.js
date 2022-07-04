// const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
	process.env.DB,
	process.env.DB_USER,
	process.env.DB_PASSWORD,
	{
		host: process.env.DB_HOST,
		port: process.env.PORT || 3306,
		dialect: process.env.DB_DIALECT,
		operatorsAliases: 0,
		pool: {
			max: process.env.MAX_POOL,
			min: process.env.MIN_POOL,
			acquire: process.env.POOL_AQUIRE,
			idle: process.env.POOL_IDLE,
		},
	}
);
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.products = require("./product.model.js")(sequelize, Sequelize);
db.comments = require("./comment.model.js")(sequelize, Sequelize);
db.images = require("./image.model.js")(sequelize, Sequelize);
db.carouselImages = require("./carousel-image.model.js")(sequelize, Sequelize);
db.replyComments = require("./replyComment.model.js")(sequelize, Sequelize);
db.role.belongsToMany(db.user, {
	through: "user_roles",
	foreignKey: "roleId",
	otherKey: "userId",
});
db.user.belongsToMany(db.role, {
	through: "user_roles",
	foreignKey: "userId",
	otherKey: "roleId",
});
db.ROLES = ["user", "admin", "moderator"];
db.products.hasMany(db.comments, { as: "comments" });
db.products.hasMany(db.images, { as: "images" });
db.products.hasMany(db.carouselImages, { as: "carousel_images" });
db.comments.belongsTo(db.products, {
	foreignKey: "productId",
	as: "product",
});
db.comments.hasMany(db.replyComments, { as: "reply_comments" });
db.replyComments.belongsTo(db.comments, {
	foreignKey: "commentId",
	as: "comment",
});
db.images.belongsTo(db.products, {
	foreignKey: "productId",
	as: "product",
});
db.carouselImages.belongsTo(db.products, {
	foreignKey: "productId",
	as: "product",
});
module.exports = db;
