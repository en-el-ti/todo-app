// ============================================================
// BACK END: máy chủ Node.js thuần (không cần cài thư viện)
// Chạy bằng lệnh:  node server.js
// ============================================================

const http = require("http");   // module có sẵn để tạo máy chủ web
const fs = require("fs");       // đọc/ghi file
const path = require("path");   // xử lý đường dẫn file

const PORT = 3000;
const DATA_FILE = path.join(__dirname, "data.json"); // "cơ sở dữ liệu" đơn giản
const PUBLIC_DIR = path.join(__dirname, "public");   // thư mục chứa front end

// ---------- Hàm đọc / ghi dữ liệu ----------
function readTodos() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return []; // chưa có file thì trả về danh sách rỗng
  }
}

function saveTodos(todos) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
}

// ---------- Hàm tiện ích trả JSON ----------
function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

// Đọc nội dung (body) mà trình duyệt gửi lên
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
  });
}

// Các loại file tĩnh và Content-Type tương ứng
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

// ---------- Máy chủ ----------
const server = http.createServer(async (req, res) => {
  const url = req.url.split("?")[0];

  // ===== API (back end) =====

  // Lấy danh sách việc
  if (url === "/api/todos" && req.method === "GET") {
    return sendJson(res, 200, readTodos());
  }

  // Thêm việc mới
  if (url === "/api/todos" && req.method === "POST") {
    try {
      const { text } = await readBody(req);
      if (!text || !text.trim()) {
        return sendJson(res, 400, { error: "Nội dung không được để trống" });
      }
      const todos = readTodos();
      const todo = { id: Date.now(), text: text.trim(), done: false };
      todos.push(todo);
      saveTodos(todos);
      return sendJson(res, 201, todo);
    } catch {
      return sendJson(res, 400, { error: "Dữ liệu gửi lên không hợp lệ" });
    }
  }

  // Đánh dấu hoàn thành / bỏ hoàn thành:  PUT /api/todos/123
  if (url.startsWith("/api/todos/") && req.method === "PUT") {
    const id = Number(url.split("/")[3]);
    const todos = readTodos();
    const todo = todos.find((t) => t.id === id);
    if (!todo) return sendJson(res, 404, { error: "Không tìm thấy" });
    todo.done = !todo.done;
    saveTodos(todos);
    return sendJson(res, 200, todo);
  }

  // Xoá việc:  DELETE /api/todos/123
  if (url.startsWith("/api/todos/") && req.method === "DELETE") {
    const id = Number(url.split("/")[3]);
    const todos = readTodos().filter((t) => t.id !== id);
    saveTodos(todos);
    return sendJson(res, 200, { ok: true });
  }

  // ===== Phục vụ file front end =====
  const filePath = path.join(PUBLIC_DIR, url === "/" ? "index.html" : url);

  // Chặn truy cập ra ngoài thư mục public
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("404 - Không tìm thấy trang");
    }
    const type = MIME[path.extname(filePath)] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`Máy chủ đang chạy tại http://localhost:${PORT}`);
});
