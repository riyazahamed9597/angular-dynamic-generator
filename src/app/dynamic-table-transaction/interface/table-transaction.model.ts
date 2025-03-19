export interface IProductsData {
    id: number,
    createdAt: Date,
    productName: string,
    status: string,
    subProducts: IsubProducts[];
}

export interface IsubProducts {
    id: number,
    createdAt: Date,
    name: string,
    status: string,
    path:string,
    icon:string,
    modifiedAt: Date,
    deletedAt: Date,
    fields: Ifields[],
    subProductId:string
}

export interface IAddDynamicTableTransaction {
    name: string,
    path: string,
    icon: string,
    fields: Ifields[],
    status: string,
    subProductId: number
}

export interface Ifields {
    title: string,
    keys: []
}
