import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderWithProviders } from '../../test/renderWithProviders'
import PlaylistsPage from './PlaylistsPage'

describe('PlaylistsPage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('báo lỗi khi tạo playlist với tên trống', async () => {
    const user = userEvent.setup()
    renderWithProviders(<PlaylistsPage />)

    await user.click(screen.getByRole('button', { name: 'Tạo' }))

    expect(
      screen.getByText('Tên playlist không được để trống'),
    ).toBeInTheDocument()
  })

  it('tạo playlist, hiển thị trong danh sách và lưu localStorage', async () => {
    const user = userEvent.setup()
    renderWithProviders(<PlaylistsPage />)

    await user.type(screen.getByLabelText('Tên playlist'), 'Chạy bộ')
    await user.click(screen.getByRole('button', { name: 'Tạo' }))

    expect(screen.getByText('Chạy bộ')).toBeInTheDocument()
    expect(screen.getByText('0 bài')).toBeInTheDocument()

    await waitFor(() => {
      expect(window.localStorage.getItem('music-playlists')).toContain(
        'Chạy bộ',
      )
    })
  })

  it('báo lỗi khi tên playlist trùng không phân biệt hoa thường', async () => {
    const user = userEvent.setup()
    renderWithProviders(<PlaylistsPage />)
    const input = screen.getByLabelText('Tên playlist')

    await user.type(input, 'Chạy bộ')
    await user.click(screen.getByRole('button', { name: 'Tạo' }))
    await user.type(input, 'chạy bộ')
    await user.click(screen.getByRole('button', { name: 'Tạo' }))

    expect(screen.getByText('Tên playlist đã tồn tại')).toBeInTheDocument()
    expect(screen.getAllByText('Chạy bộ')).toHaveLength(1)
  })

  it('xóa playlist khỏi danh sách', async () => {
    const user = userEvent.setup()
    renderWithProviders(<PlaylistsPage />)

    await user.type(screen.getByLabelText('Tên playlist'), 'Chạy bộ')
    await user.click(screen.getByRole('button', { name: 'Tạo' }))
    await user.click(screen.getByRole('button', { name: 'Xóa' }))

    expect(screen.queryByText('Chạy bộ')).not.toBeInTheDocument()
    expect(screen.getByText('Chưa có playlist nào.')).toBeInTheDocument()
  })
})
