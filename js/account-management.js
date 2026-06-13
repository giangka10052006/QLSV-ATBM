const token = localStorage.getItem("token");

async function loadUsers() {
	try {
		const response = await fetch("http://localhost:5000/api/users", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const users = await response.json();

		const table = document.getElementById("userTable");

		table.innerHTML = "";

		users.forEach((user) => {
			table.innerHTML += `
			<tr>
				<td>${user._id}</td>
				<td>${user.fullName}</td>
				<td>${user.email}</td>
				<td>${user.role}</td>
				<td>
					${user.isActive ? "Hoạt động" : "Đã khóa"}
				</td>
				<td class="action-buttons">

	      <button class="edit-btn" onclick="editUser(
			  '${user._id}',
			  '${user.fullName}',
			  '${user.email}',
			  '${user.role}'
		    )">

		    Sửa

	      </button>

	      <button class="lock-btn" onclick="toggleStatus('${user._id}')">

		    ${user.isActive ? "Khóa" : "Mở khóa"}

	      </button>

	      <button class="delete-btn" onclick="deleteUser('${user._id}')">

		    Xóa

	      </button>

        </td>
			</tr>
			`;
		});
	} catch (error) {
		console.error(error);
	}
}

async function deleteUser(id) {
	if (!confirm("Bạn có chắc muốn xóa?")) return;

	const response = await fetch(`http://localhost:5000/api/users/${id}`, {
		method: "DELETE",

		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const data = await response.json();

	alert(data.message);

	loadUsers();
}

async function toggleStatus(id) {
	const response = await fetch(`http://localhost:5000/api/users/${id}/status`, {
		method: "PUT",

		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	await response.json();

	loadUsers();
}
async function editUser(id, currentName, currentEmail, currentRole) {
	const fullName = prompt("Họ tên:", currentName);

	if (!fullName) return;

	const email = prompt("Email:", currentEmail);

	if (!email) return;

	const role = prompt("Vai trò (admin/teacher/student):", currentRole);

	if (!role) return;

	const response = await fetch(`http://localhost:5000/api/users/${id}`, {
		method: "PUT",

		headers: {
			"Content-Type": "application/json",

			Authorization: `Bearer ${token}`,
		},

		body: JSON.stringify({
			fullName,
			email,
			role,
		}),
	});

	await response.json();

	alert("Cập nhật thành công");

	loadUsers();
}
loadUsers();
