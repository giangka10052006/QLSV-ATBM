const express = require("express");
const User = require("../models/User");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();
router.put(
	"/:id",
	authMiddleware,
	roleMiddleware("admin"),

	async (req, res) => {
		try {
			const { fullName, email, role } = req.body;

			const user = await User.findByIdAndUpdate(
				req.params.id,
				{
					fullName,
					email,
					role,
				},
				{
					new: true,
				},
			);

			res.json(user);
		} catch (error) {
			res.status(500).json({
				message: error.message,
			});
		}
	},
);
// Lấy danh sách tài khoản
router.get(
	"/",
	authMiddleware,
	roleMiddleware("admin"),

	async (req, res) => {
		try {
			const users = await User.find().select("-password");

			res.json(users);
		} catch (error) {
			res.status(500).json({
				message: error.message,
			});
		}
	},
);
router.delete(
	"/:id",
	authMiddleware,
	roleMiddleware("admin"),

	async (req, res) => {
		await User.findByIdAndDelete(req.params.id);

		res.json({
			message: "Xóa thành công",
		});
	},
);
router.put(
	"/:id/status",
	authMiddleware,
	roleMiddleware("admin"),

	async (req, res) => {
		const user = await User.findById(req.params.id);

		user.isActive = !user.isActive;

		await user.save();

		res.json(user);
	},
);
router.put(
	"/:id/role",
	authMiddleware,
	roleMiddleware("admin"),

	async (req, res) => {
		try {
			const { role } = req.body;

			const user = await User.findByIdAndUpdate(
				req.params.id,
				{ role },
				{ new: true },
			);

			res.json(user);
		} catch (error) {
			res.status(500).json({
				message: error.message,
			});
		}
	},
);
module.exports = router;
