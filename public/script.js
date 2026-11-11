// FRONT END: JavaScript chạy trong TRÌNH DUYỆT.
// Nhiệm vụ: nói chuyện với back end qua API (fetch) rồi cập nhật giao diện.

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const emptyMsg = document.getElementById("empty-msg");

// ---------- Gọi API ----------

// Lấy toàn bộ việc từ server rồi vẽ lại danh sách
async function loadTodos() {
  const res = await fetch("/api/todos");
  const todos = await res.json();
  render(todos);
}

// Gửi việc mới lên server
async function addTodo(text) {
  await fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  loadTodos();
}

// Đổi trạng thái hoàn thành
async function toggleTodo(id) {
  await fetch(`/api/todos/${id}`, { method: "PUT" });
  loadTodos();
}

// Xoá một việc
async function deleteTodo(id) {
  await fetch(`/api/todos/${id}`, { method: "DELETE" });
  loadTodos();
}

// ---------- Vẽ giao diện ----------

function render(todos) {
  list.innerHTML = ""; // xoá danh sách cũ
  emptyMsg.hidden = todos.length > 0;

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.done ? " done" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = todo.text; // textContent giúp tránh lỗi bảo mật XSS

    const del = document.createElement("button");
    del.className = "delete-btn";
    del.textContent = "✕";
    del.setAttribute("aria-label", "Xoá");
    del.addEventListener("click", () => deleteTodo(todo.id));

    li.append(checkbox, span, del);
    list.appendChild(li);
  });
}

// ---------- Sự kiện ----------

form.addEventListener("submit", (event) => {
  event.preventDefault(); // không cho trình duyệt tải lại trang
  const text = input.value.trim();
  if (!text) return;
  addTodo(text);
  input.value = "";
  input.focus();
});

// Khi trang vừa mở: tải dữ liệu
loadTodos();
