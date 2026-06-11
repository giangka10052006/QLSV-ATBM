function checkRole(requiredRole) {
	const user = JSON.parse(localStorage.getItem("currentUser"));

	if (!user) {
		window.location.href = "login.html";

		return;
	}

	if (user.role !== requiredRole) {
		window.location.href = "access-denied.html";
	}
}
