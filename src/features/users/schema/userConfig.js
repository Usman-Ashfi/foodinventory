export const userRoles = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
]

export const userInitialForm = {
  username: '',
  fullName: '',
  password: '',
  role: 'user',
}

export const validUserRoles = userRoles.map((role) => role.value)
