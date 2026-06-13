const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	fullName: {
		type: String,
		required: true,
	},

	email: {
		type: String,
		required: true,
		unique: true,
	},

	password: {
		type: String,
		required: true,
	},

	role: {
		type: String,
		enum: ["admin", "teacher", "student"],
		default: "student",
	},

	otp: {
		type: String,
		default: null,
	},

	otpExpire: {
		type: Date,
		default: null,
	},
	isActive: {
		type: Boolean,
		default: true,
	},
});

module.exports = mongoose.model("User", userSchema);
