export const priorityOptions = [
  {
    value: 1,
    label: 'Thấp',
  },
  {
    value: 2,
    label: 'Trung bình',
  },
  {
    value: 3,
    label: 'Cao',
  },
];

export const statusOptions = [
  {
    value: 1,
    label: 'Chưa thực hiện',
  },
  {
    value: 2,
    label: 'Đang thực hiện',
  },
  {
    value: 3,
    label: 'Đã thực hiện',
  },
];

export const rateOptions = [
  {
    value: '1 sao',
    label: '1 sao',
    
  },
  {
    value: '2 sao',
    label: '2 sao',
  },
  {
    value: '3 sao',
    label: '3 sao',
  },
  {
    value: '4 sao',
    label: '4 sao',
  },
  {
    value: '5 sao',
    label: '5 sao',
  },

]

export const typeOptions = [
  {
    value: 1,
    label: 'Cá nhân',
  },
  {
    value: 2,
    label: 'Nhóm',
  },
];

export const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/3607/3607444.png'

export const DEFAULT_PROJECT_AVT = '/icons/project.png'

export const getAvatar = (email: string) => {
  return `https://firebasestorage.googleapis.com/v0/b/ui-ux-f447b.appspot.com/o/${email}?alt=media`
}