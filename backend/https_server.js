const https = require("https");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const app = express();
require("dotenv").config();
app.use(
	cors({
		credentials: true,
		origin: ["https://www.asbijoux.ro", "https://asbijoux.ro"],
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cookieSession({
		name: "user-session",
		keys: [process.env.key1],
		secret: process.env.secret,
		httpOnly: true,
		secure: true,
	})
);

const db = require("./app/models");
const Role = db.role;

db.sequelize.sync();

app.get("/", (req, res) => {
	res.json({ message: "Welcome to AsBijoux." });
});
require("./app/routes/auth.routes.js")(app);
require("./app/routes/user.routes.js")(app);
require("./app/routes/product.routes.js")(app);
require("./app/routes/comment.routes.js")(app);
require("./app/routes/image.routes.js")(app);
require("./app/routes/carousel-image.routes.js")(app);
require("./app/routes/replyComment.routes.js")(app);
https
	.createServer(
		{
			key: fs.readFileSync(
				"../ssl/keys/bec9d_c90a3_17796ddef161d0bf50a73d8b7849a856.key"
			),
			cert: fs.readFileSync("../ssl_files/asbijoux_ro.crt"),
			ca: [
				fs.readFileSync("../ssl_files/asbijoux_ro.p7b"),
				fs.readFileSync("../ssl_files/asbijoux_ro.ca-bundle"),
			],
		},
		app
	)
	.listen(60502, () => {
		console.log("server is runing at port 60502");
	});
