export const getDate = () => {
    const date = new Date(); // Tạo đối tượng Date hiện tại

    const day = date.getDay(); // Lấy ra thứ (0: Chủ nhật, 1: Thứ hai, ..., 6: Thứ bảy)
    const month = date.getMonth() + 1; // Lấy ra tháng (0 - 11)
    const year = date.getFullYear(); // Lấy ra năm (đủ 4 chữ số)

    // Chuyển đổi thứ từ số sang tên
    const dayNames = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    const dayOfWeek = dayNames[day];
    return `${dayOfWeek}, ngày ${date.getDate()} tháng ${month}`
}


export const getDayPeriod = () => {
    const date = new Date(); // Tạo đối tượng Date hiện tại
    const hour = date.getHours(); // Lấy ra giờ trong khoảng từ 0 - 23

    let period;
    if (hour >= 5 && hour < 12) {
        period = 'buổi sáng';
    } else if (hour >= 12 && hour < 18) {
        period = 'buổi chiều';
    } else {
        period = 'buổi tối';
    }

    return period;
}