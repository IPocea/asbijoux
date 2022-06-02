const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const app = express();
require("dotenv").config();
app.use(
	cors({
		credentials: true,
		// origin: ["http://192.168.0.106:4200"],
		origin: ["http://localhost:4200"],
	})
);
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(
	cookieSession({
		name: "user-session",
		keys: [process.env.key1],
		secret: process.env.secret, // should use as secret environment variable
		httpOnly: true,
	})
);
const db = require("./app/models");
const Role = db.role;
// db.sequelize.sync({ force: true }).then(() => {
// 	console.log("Drop and Resync Db");
// 	initial();
// });
db.sequelize.sync();
// function initial() {
// 	Role.create({
// 		id: 1,
// 		name: "user",
// 	});

// 	Role.create({
// 		id: 2,
// 		name: "moderator",
// 	});

// 	Role.create({
// 		id: 3,
// 		name: "admin",
// 	});
// }
// simple route
app.get("/", (req, res) => {
	res.json({ message: "Welcome to AsBijoux." });
});
require("./app/routes/auth.routes.js")(app);
require("./app/routes/user.routes.js")(app);
require("./app/routes/product.routes.js")(app);
require("./app/routes/comment.routes.js")(app);
require("./app/routes/image.routes.js")(app);
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});
