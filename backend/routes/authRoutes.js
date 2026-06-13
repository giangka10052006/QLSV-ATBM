const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

const router = express.Router();
const jwt = require("jsonwebtoken");
const transporter = require("../services/emailService");
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

router.post(
	"/forgot-password",

	async (req, res) => {
		try {
			const { email } = req.body;

			const user = await User.findOne({
				email,
			});

			if (!user) {
				return res.status(404).json({
					message: "Email không tồn tại",
				});
			}

			const otp = Math.floor(100000 + Math.random() * 900000).toString();

			user.otp = otp;

			user.otpExpire = Date.now() + 5 * 60 * 1000;

			await user.save();

			await transporter.sendMail({
				from: process.env.EMAIL_USER,

				to: email,

				subject: "SecureEdu OTP",

				text: `Mã OTP của bạn là: ${otp}`,
			});

			res.json({
				message: "OTP đã gửi tới email",
			});
		} catch (error) {
			res.status(500).json({
				message: error.message,
			});
		}
	},
);
router.post(
	"/verify-otp",

	async (req, res) => {
		const { email, otp } = req.body;

		const user = await User.findOne({
			email,
		});

		if (!user || user.otp !== otp) {
			return res.status(400).json({
				message: "OTP không đúng",
			});
		}

		if (user.otpExpire < Date.now()) {
			return res.status(400).json({
				message: "OTP hết hạn",
			});
		}

		res.json({
			message: "OTP hợp lệ",
		});
	},
);
router.post(
	"/reset-password",

	async (req, res) => {
		const { email, newPassword } = req.body;

		const user = await User.findOne({
			email,
		});

		const hashedPassword = await bcrypt.hash(newPassword, 10);

		user.password = hashedPassword;

		user.otp = null;

		user.otpExpire = null;

		await user.save();

		res.json({
			message: "Đổi mật khẩu thành công",
		});
	},
);
module.exports = router;
