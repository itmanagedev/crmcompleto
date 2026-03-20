export interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  companyId: string
  status: 'active' | 'inactive'
}

export interface Company {
  id: string
  name: string
  industry: string
  website: string
}
