const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

const router = express.Router();
const jwt = require("jsonwebtoken");
router.post("/register", async (req, res) => {
	try {
		const { fullName, email, password, role } = req.body;

		const userExists = await User.findOne({ email });

		if (userExists) {
			return res.status(400).json({
				message: "Email đã tồn tại",
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			fullName,

			email,

			password: hashedPassword,

			role,
		});

		res.status(201).json({
			message: "Đăng ký thành công",
			user,
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
});

router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({
				message: "Email không tồn tại",
			});
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(400).json({
				message: "Sai mật khẩu",
			});
		}

		const token = jwt.sign(
			{
				id: user._id,
				role: user.role,
			},

			process.env.JWT_SECRET,

			{
				expiresIn: "1d",
			},
		);

		res.json({
			message: "Đăng nhập thành công",

			token,

			user: {
				id: user._id,
				fullName: user.fullName,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
});
router.post("/create-admin", async (req, res) => {
	try {
		const adminExists = await User.findOne({
			email: "admin@gmail.com",
		});

		if (adminExists) {
			return res.json({
				message: "Admin đã tồn tại",
			});
		}

		const hashedPassword = await bcrypt.hash("123456", 10);

		const admin = await User.create({
			fullName: "Administrator",

			email: "admin@gmail.com",

			password: hashedPassword,

			role: "admin",
		});

		res.json({
			message: "Tạo Admin thành công",

			admin,
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
});
module.exports = router;
