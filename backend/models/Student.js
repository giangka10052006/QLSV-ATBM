const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	studentCode: String,
	fullName: String,
	className: String,
	email: String,
	phone: String,
	gpa: Number,
});

module.exports = mongoose.model("Student", studentSchema);
