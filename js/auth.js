// Đăng ký

async function register(event) {
	event.preventDefault();

	const fullName = document.getElementById("fullName").value;

	const email = document.getElementById("email").value;

	const password = document.getElementById("password").value;

	const role = document.getElementById("role").value;

	const response = await fetch("http://localhost:5000/api/auth/register", {
		method: "POST",

		headers: {
			"Content-Type": "application/json",
		},

		body: JSON.stringify({
			fullName,
			email,
			password,
			role,
		}),
	});

	const data = await response.json();

	alert(data.message);
}

// Tạo Admin mặc định

if (!localStorage.getItem("admin@gmail.com")) {
	const admin = {
		fullName: "Administrator",
		email: "admin@gmail.com",
		password: "123456",
		role: "admin",
	};

	localStorage.setItem(admin.email, JSON.stringify(admin));
}

// Đăng nhập

async function login(event) {
	event.preventDefault();

	const email = document.getElementById("email").value;

	const password = document.getElementById("password").value;

	try {
		const response = await fetch("http://localhost:5000/api/auth/login", {
			method: "POST",

			headers: {
				"Content-Type": "application/json",
			},

			body: JSON.stringify({
				email,
				password,
			}),
		});

		const data = await response.json();

		if (response.ok) {
			localStorage.setItem("token", data.token);

			localStorage.setItem("user", JSON.stringify(data.user));

			alert("Đăng nhập thành công");

			// Phân quyền giao diện

			if (data.user.role === "admin") {
				window.location.href = "admin-dashboard.html";
			} else if (data.user.role === "teacher") {
				window.location.href = "teacher-dashboard.html";
			} else {
				window.location.href = "student-dashboard.html";
			}
		} else {
			alert(data.message);
		}
	} catch (error) {
		console.log(error);

		alert("Lỗi kết nối server");
	}
}

// Đăng xuất

function logout() {
	localStorage.removeItem("token");

	localStorage.removeItem("user");

	window.location.href = "login.html";
}