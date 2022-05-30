require("dotenv").config();
const { uploadFileMiddleware } = require("../middleware");
const fs = require("fs");
const baseUrl = "http://localhost:8080/api/images/files/";
const directoryPath = process.env.directoryPath;
const db = require("../models");
const Image = db.images;

const upload = async (req, res) => {
	try {
		await uploadFileMiddleware(req, res);

		if (req.file == undefined) {
			return res.status(400).send({ message: "Te rog sa adaugi o imagine!" });
		}

		Image.create({
			type: req.file.mimetype,
			name: req.file.filename,
			url: baseUrl + req.file.filename,
			productId: req.body.productId,
		});

		res.status(200).send({
			message: "Imaginea a fost adaugata cu succes!",
		});
	} catch (err) {
		if (err.code == "LIMIT_FILE_SIZE") {
			return res.status(500).send({
				message: "Imaginile nu pot avea mai mult de 4MB!",
			});
		}

		res.status(500).send({
			message: `Nu am putut incarca imaginea: ${req.file.originalname}. ${err}`,
		});
	}
};

const getListFiles = (req, res) => {
	fs.readdir(directoryPath, function (err, files) {
		if (err) {
			res.status(500).send({
				message: "Nu pot scana imaginea!",
			});
		}

		let fileInfos = [];

		files.forEach((file) => {
			fileInfos.push({
				name: file,
				url: baseUrl + file,
			});
		});

		res.status(200).send(fileInfos);
	});
};

const download = (req, res) => {
	const fileName = req.params.name;

	res.download(directoryPath + fileName, fileName, (err) => {
		if (err) {
			res.status(500).send({
				message: "Nu pot descarca imaginea.",
			});
		}
	});
};

const deleteFile = (req, res) => {
	let path = directoryPath + req.body.fileName;
	const id = req.body.imageId;
	Image.destroy({
		where: { id: id },
	})
		.then((num) => {
			if (num == 1) {
				fs.unlink(path, (err) => {
					if (err) {
						res.send(err.message);
						return;
					}
					res.send("Imaginea a fost stearsa cu success!");
				});
			} else {
				res.send({
					message: `Nu pot sterge imaginea cu id=${id}. Poate ca imaginea nu a fost gasita!`,
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: "Nu am putut sterge imaginea cu id=" + id,
			});
		});
};

module.exports = {
	upload,
	getListFiles,
	download,
	deleteFile,
};
