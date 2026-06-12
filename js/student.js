const API_URL = "http://localhost:5000/api/students";

const token = localStorage.getItem("token");

async function loadStudents() {
	const response = await fetch(API_URL, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const students = await response.json();

	const table = document.getElementById("studentTable");

	table.innerHTML = "";

	students.forEach((student) => {
		table.innerHTML += `
		<tr>

			<td>${student.studentCode}</td>

			<td>${student.fullName}</td>

			<td>${student.className}</td>

			<td>${student.email}</td>

			<td>${student.phone}</td>

			<td>

				<button class="edit-btn" onclick="editStudent('${student._id}')">
					Sửa
				</button>

				<button class="delete-btn" onclick="deleteStudent('${student._id}')">
					Xóa
				</button>

			</td>

		</tr>
		`;
	});
}
async function addStudent() {
	const studentCode = prompt("Mã sinh viên:");

	const fullName = prompt("Họ tên:");

	const className = prompt("Lớp:");

	const email = prompt("Email:");

	const phone = prompt("Số điện thoại:");

	const gpa = prompt("GPA:");

	const token = localStorage.getItem("token");

	const response = await fetch("http://localhost:5000/api/students", {
		method: "POST",

		headers: {
			"Content-Type": "application/json",

			Authorization: `Bearer ${token}`,
		},

		body: JSON.stringify({
			studentCode,
			fullName,
			className,
			email,
			phone,
			gpa,
		}),
	});

	const data = await response.json();

	alert("Thêm thành công");

	loadStudents();
}

async function editStudent(id) {
	const fullName = prompt("Nhập tên mới:");

	if (!fullName) return;

	await fetch(`http://localhost:5000/api/students/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			fullName,
		}),
	});

	alert("Cập nhật thành công");

	loadStudents();
}

async function deleteStudent(id) {
	if (!confirm("Bạn có chắc muốn xóa?")) return;

	await fetch(`http://localhost:5000/api/students/${id}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	alert("Xóa thành công");

	loadStudents();
}
loadStudents();
