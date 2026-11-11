# Ứng dụng "Việc cần làm" – dự án học web cơ bản

Một trang web nhỏ có đủ **front end** và **back end**, không cần cài thêm thư viện nào.

## Cách chạy

1. Cài [Node.js](https://nodejs.org) (bản LTS).
2. Mở terminal trong thư mục dự án và chạy:

   ```bash
   node server.js
   ```

3. Mở trình duyệt vào <http://localhost:3000>.

Dừng server bằng `Ctrl + C`.

## Cấu trúc thư mục

```
todo-app/
├── server.js        ← BACK END: máy chủ + API + lưu dữ liệu
├── data.json        ← "cơ sở dữ liệu" (tự tạo khi thêm việc đầu tiên)
└── public/          ← FRONT END: những gì trình duyệt tải về
    ├── index.html   ← cấu trúc trang (HTML)
    ├── style.css    ← giao diện (CSS)
    └── script.js    ← hành vi phía trình duyệt (JavaScript)
```

## Luồng hoạt động

```
Trình duyệt (front end)                    Máy chủ (back end)
-----------------------                    ------------------
1. Gõ localhost:3000        ───────────▶   server.js trả về index.html, style.css, script.js
2. script.js gọi fetch      ─ GET  /api/todos        ─▶  đọc data.json, trả về danh sách
3. Bấm "Thêm"               ─ POST /api/todos        ─▶  thêm vào data.json
4. Tick vào ô               ─ PUT  /api/todos/:id    ─▶  đổi done = true/false
5. Bấm ✕                    ─ DELETE /api/todos/:id  ─▶  xoá khỏi data.json
```

## Các API của back end

| Phương thức | Đường dẫn         | Việc làm                |
|-------------|-------------------|-------------------------|
| GET         | `/api/todos`      | Lấy danh sách việc      |
| POST        | `/api/todos`      | Thêm việc (`{text}`)    |
| PUT         | `/api/todos/:id`  | Đổi trạng thái xong/chưa |
| DELETE      | `/api/todos/:id`  | Xoá việc                |

## Bài tập gợi ý để học tiếp

1. Đổi màu chủ đạo trong `style.css`.
2. Thêm nút "Xoá tất cả việc đã xong".
3. Thêm chức năng sửa nội dung một việc (cần thêm API mới trong `server.js`).
4. Thêm bộ lọc: Tất cả / Đang làm / Đã xong.
5. Sau khi quen, học **Express.js** (thay cho module `http` thuần) và **SQLite** (thay cho `data.json`).
