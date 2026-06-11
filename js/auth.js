// Đăng ký

function register(e) {
	e.preventDefault();

	const fullName = document.getElementById("fullName").value;
	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;
	const confirmPassword = document.getElementById("confirmPassword").value;
	const role = document.getElementById("role").value;

	if (password !== confirmPassword) {
		alert("Mật khẩu xác nhận không khớp!");
		return;
	}

	if (localStorage.getItem(email)) {
		alert("Email đã tồn tại!");
		return;
	}

	const user = {
		fullName,
		email,
		password,
		role,
	};

	localStorage.setItem(email, JSON.stringify(user));

	alert("Đăng ký thành công!");

	window.location.href = "login.html";
}


// Tạo Admin mặc định

if (!localStorage.getItem("admin@gmail.com")) {

	const admin = {
		fullName: "Administrator",
		email: "admin@gmail.com",
		password: "123456",
		role: "admin"
	};

	localStorage.setItem(
		admin.email,
		JSON.stringify(admin)
	);
}

// Đăng nhập

function login(e) {

	e.preventDefault();

	const email =
		document.getElementById("email").value;

	const password =
		document.getElementById("password").value;

	const user =
		JSON.parse(localStorage.getItem(email));

	if (!user) {
		alert("Tài khoản không tồn tại!");
		return;
	}

	if (user.password !== password) {
		alert("Sai mật khẩu!");
		return;
	}

	localStorage.setItem(
		"currentUser",
		JSON.stringify(user)
	);

	if (user.role === "admin") {
		window.location.href =
			"admin-dashboard.html";
	}
	else if (user.role === "teacher") {
		window.location.href =
			"teacher-dashboard.html";
	}
	else {
		window.location.href =
			"student-dashboard.html";
	}
}

// Đăng xuất

function logout() {

	localStorage.removeItem(
		"currentUser"
	);

	window.location.href =
		"login.html";
}
