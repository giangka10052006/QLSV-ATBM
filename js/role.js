const user = JSON.parse(localStorage.getItem("user"));

if (window.location.href.includes("admin-dashboard")) {
	if (!user || user.role !== "admin") {
		window.location.href = "access-denied.html";
	}
}

if (window.location.href.includes("teacher-dashboard")) {
	if (!user || user.role !== "teacher") {
		window.location.href = "access-denied.html";
	}
}

if (window.location.href.includes("student-dashboard")) {
	if (!user || user.role !== "student") {
		window.location.href = "access-denied.html";
	}
}
