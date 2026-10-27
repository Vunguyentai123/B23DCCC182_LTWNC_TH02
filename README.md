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

## Phần 3 đã hoàn thiện

- Playlist quản lý bằng `useReducer` + 2 Context (`PlaylistStateContext`, `PlaylistDispatchContext`).
- Reducer thuần trong `playlistReducer.ts` với các action `create`, `rename`, `remove`, `addSong`, `removeSong`; thêm bài trùng sẽ bị bỏ qua.
- Middleware `withLogger` ghi log tên action, state trước và sau trong môi trường dev.
- Playlist được lưu vào `localStorage` với khóa `music-playlists`.
- Trang `/playlists`: tạo playlist, kiểm tra tên trống/trùng, xem chi tiết và xóa.
- Thư viện có ô chọn **Playlist đang chọn** và nút **+ Playlist** trên từng bài hát.
- Trang `/playlists/:id`: danh sách bài, bỏ bài, tổng thời lượng và **Phát tất cả**.
- Giao diện sáng/tối bằng `ThemeContext`, lưu lựa chọn trong `localStorage`.
- Các trang Yêu thích, Playlist và chi tiết Playlist được lazy-load theo route.
