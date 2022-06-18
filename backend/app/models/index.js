const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
	host: dbConfig.HOST,
	dialect: dbConfig.dialect,
	operatorsAliases: 0,
	pool: {
		max: dbConfig.pool.max,
		min: dbConfig.pool.min,
		acquire: dbConfig.pool.acquire,
		idle: dbConfig.pool.idle,
	},
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.products = require("./product.model.js")(sequelize, Sequelize);
db.comments = require("./comment.model.js")(sequelize, Sequelize);
db.images = require("./image.model.js")(sequelize, Sequelize);
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
db.comments.belongsTo(db.products, {
	foreignKey: "productId",
	as: "product",
});
db.replyComments.belongsTo(db.comments, {
	foreignKey: "commentId",
	as: "comment",
});
db.images.belongsTo(db.products, {
	foreignKey: "productId",
	as: "product",
});
module.exports = db;
