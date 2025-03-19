export interface tableComponents {
  name: string,
  key: string,
  type: string,
  isActive: boolean
}

export interface getTableComponents {
  name: string,
  key: string,
  type: string,
  isActive: boolean
  id: number,
  createdAt: Date,
  modifiedAt: Date,
  deletedAt: null,
}

export enum typeOptions {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Dropdown = 'dropdown',
  File = 'file'
}