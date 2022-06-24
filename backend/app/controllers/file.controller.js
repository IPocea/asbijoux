require("dotenv").config();
const { uploadFileMiddleware } = require("../middleware");
const { unlink } = require("fs").promises;
const baseUrl = "http://localhost:8080/api/images/files/";
const directoryPath = process.env.directoryPath;
const db = require("../models");
const Image = db.images;
const CarouselImage = db.carouselImages;

const upload = async (req, res) => {
	try {
		await uploadFileMiddleware(req, res);

		if (req.file == undefined) {
			return res.status(400).json({ message: "Te rog sa adaugi o imagine!" });
		}
		try {
			await Image.create({
				type: req.file.mimetype,
				name: req.file.filename,
				url: baseUrl + req.file.filename,
				productId: req.body.productId,
				isMainImage: req.body.isMainImage ? req.body.isMainImage : false,
			});

			return res.status(200).json({
				message: "Imaginea a fost adaugata cu succes!",
			});
		} catch (error) {
			return res.json({ message: error.message });
		}
	} catch (err) {
		if (err.code == "LIMIT_FILE_SIZE") {
			return res.status(500).json({
				message: "Imaginile nu pot avea mai mult de 4MB!",
			});
		}

		return res.status(500).json({
			message: `Nu am putut incarca imaginea: ${req.file.originalname}. ${err}`,
		});
	}
};
const uploadImageCarousel = async (req, res) => {
	try {
		await uploadFileMiddleware(req, res);

		if (req.file == undefined) {
			return res.status(400).json({ message: "Te rog sa adaugi o imagine!" });
		}
		try {
			await CarouselImage.create({
				type: req.file.mimetype,
				name: req.file.filename,
				url: baseUrl + req.file.filename,
				position: req.body.position,
				productId: req.body.productId,
			});

			return res.status(200).json({
				message: "Imaginea a fost adaugata cu succes!",
			});
		} catch (error) {
			return res.json({ message: error.message });
		}
	} catch (err) {
		if (err.code == "LIMIT_FILE_SIZE") {
			return res.status(500).json({
				message: "Imaginile nu pot avea mai mult de 4MB!",
			});
		}

		return res.status(500).json({
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

const deleteFiles = async (req, res) => {
	let names = req.body.images.map((ele) => ele.name);
	let ids = req.body.images.map((ele) => ele.id);
	try {
		const num = await Image.destroy({
			where: { id: ids },
		});
		if (num == ids.length) {
			try {
				for (let name of names) {
					await unlink(directoryPath + name);
				}
				return res.json({ message: "Imaginea a fost stearsa cu success!" });
			} catch (error) {
				return res.json({ message: error.message });
			}
		} else {
			return res.json({
				message: `Nu pot sterge imaginea cu id=${id}. Poate ca imaginea nu a fost gasita!`,
			});
		}
	} catch (error) {
		return res.status(500).json({
			message: "Nu am putut sterge imaginea cu id=" + id,
		});
	}
};

const deleteFile = async (req, res) => {
	let path = directoryPath + req.body.fileName;
	const id = req.body.imageId;
	try {
		const num = await Image.destroy({
			where: { id: id },
		});
		if (num == 1) {
			try {
				await unlink(path);
				return res.json({ message: "Imaginea a fost stearsa cu success!" });
			} catch (error) {
				return res.json({ message: error.message });
			}
		} else {
			return res.json({
				message: `Nu pot sterge imaginea cu id=${id}. Poate ca imaginea nu a fost gasita!`,
			});
		}
	} catch (error) {
		return res.status(500).json({
			message: "Nu am putut sterge imaginea cu id=" + id,
		});
	}
};

const deleteCarouselFile = async (req, res) => {
	let path = directoryPath + req.body.fileName;
	const id = req.body.id;
	try {
		const num = await CarouselImage.destroy({
			where: { id: id },
		});
		if (num == 1) {
			try {
				await unlink(path);
				return res.json({ message: "Imaginea a fost stearsa cu success!" });
			} catch (error) {
				return res.json({ message: error.message });
			}
		} else {
			return res.json({
				message: `Nu pot sterge imaginea cu id=${id}. Poate ca imaginea nu a fost gasita!`,
			});
		}
	} catch (error) {
		return res.status(500).json({
			message: "Nu am putut sterge imaginea cu id=" + id,
		});
	}
};

module.exports = {
	upload,
	uploadImageCarousel,
	getListFiles,
	download,
	deleteFile,
	deleteFiles,
	deleteCarouselFile,
};
