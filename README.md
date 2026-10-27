# TH02 – Trình phát nhạc mini

Dự án Vite + React + TypeScript cho bài thực hành TH02.

## Chạy dự án

Yêu cầu Node.js >= 22.12.

```bash
npm install
npm run dev
```

## Kiểm tra

```bash
npm test
npm run build
```

## Phần 1 đã hoàn thiện

- React Router với các route Thư viện, Yêu thích và Playlist.
- Thư viện 10.000 bài hát dùng `FixedSizeList` của `react-window`.
- Tìm kiếm có debounce 300ms bằng hook generic `useDebounce`.
- Lọc theo thể loại, sắp xếp theo tên/thời lượng.
- `SongRow` được bọc `React.memo`, danh sách dùng id bài hát làm key.
- Dữ liệu mẫu trong `src/data/songs.ts`, định dạng thời lượng trong `src/utils/format.ts`.

## Phần 2 đã hoàn thiện

- Trạng thái phát nhạc toàn cục bằng Zustand: hàng đợi, bài hiện tại, phát/tạm dừng, vị trí.
- Thanh phát nhạc cố định dưới trang với nút Trước, Phát/Tạm dừng, Sau và thanh tiến trình tự cập nhật mỗi giây.
- Thêm bài vào hàng đợi bằng nút `+ Hàng đợi`, tự bỏ qua bài đã có.
- Bảng hàng đợi mở từ thanh phát nhạc: xem danh sách, phát theo vị trí, xóa từng bài hoặc xóa tất cả.
- Yêu thích/bỏ yêu thích bằng nút tim, lưu vào `localStorage` với khóa `music-favorites`.
- Trang Yêu thích hiển thị danh sách đã lưu, cho phép phát từng bài hoặc phát tất cả.
- Bài đang phát được làm nổi bật trong thư viện và trang yêu thích.
