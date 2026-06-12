const express = require("express");

const Student = require("../models/Student");

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// CREATE - Thêm sinh viên
router.post(
	"/",
	authMiddleware,
	roleMiddleware("admin"),

	async (req, res) => {
		try {
			const student = await Student.create(req.body);

			res.status(201).json(student);
		} catch (error) {
			res.status(500).json({
				message: error.message,
			});
		}
	},
);

// READ - Xem tất cả sinh viên
router.get(
	"/",
	authMiddleware,
	roleMiddleware("admin", "teacher"),

	async (req, res) => {
		try {
			const students = await Student.find();

			res.json(students);
		} catch (error) {
			res.status(500).json({
				message: error.message,
			});
		}
	},
);

// UPDATE
router.put(
	"/:id",
	authMiddleware,
	roleMiddleware("admin"),

	async (req, res) => {
		try {
			const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
				new: true,
			});

			res.json(student);
		} catch (error) {
			res.status(500).json({
				message: error.message,
			});
		}
	},
);

// DELETE
router.delete(
	"/:id",
	authMiddleware,
	roleMiddleware("admin"),

	async (req, res) => {
		try {
			await Student.findByIdAndDelete(req.params.id);

			res.json({
				message: "Xóa sinh viên thành công",
			});
		} catch (error) {
			res.status(500).json({
				message: error.message,
			});
		}
	},
);
router.put(
	"/:id/gpa",

	authMiddleware,

	roleMiddleware("teacher"),

	async (req, res) => {
		try {
			const { gpa } = req.body;

			const student = await Student.findByIdAndUpdate(
				req.params.id,

				{
					gpa,
				},

				{
					new: true,
				},
			);

			res.json(student);
		} catch (error) {
			res.status(500).json({
				message: error.message,
			});
		}
	},
);
router.get(
	"/my-profile",

	authMiddleware,

	roleMiddleware("student"),

	async (req, res) => {
		try {
			const student = await Student.findOne({
				userId: req.user.id,
			});

			res.json(student);
		} catch (error) {
			res.status(500).json({
				message: error.message,
			});
		}
	},
);
module.exports = router;
