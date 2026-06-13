const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");
const studentRoutes = require("./routes/studentRoutes");
const userRoutes = require("./routes/userRoutes");
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/users", userRoutes);
app.get("/", (req, res) => {
	res.send("SecureEdu API Running");
});
app.get(
	"/api/profile",

	authMiddleware,

	(req, res) => {
		res.json({
			message: "Bạn đã đăng nhập",

			user: req.user,
		});
	},
);
app.get(
	"/api/admin",

	authMiddleware,

	roleMiddleware("admin"),

	(req, res) => {
		res.json({
			message: "Chào Admin",
		});
	},
);
app.get(
	"/api/teacher",

	authMiddleware,

	roleMiddleware("teacher", "admin"),

	(req, res) => {
		res.json({
			message: "Teacher Dashboard",
		});
	},
);
app.get(
	"/api/student",

	authMiddleware,

	roleMiddleware("student", "admin"),

	(req, res) => {
		res.json({
			message: "Student Dashboard",
		});
	},
);
app.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});
