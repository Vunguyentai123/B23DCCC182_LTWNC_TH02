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
