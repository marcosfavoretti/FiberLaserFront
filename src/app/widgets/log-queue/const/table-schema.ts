import { TableModel } from "../../../@core/Models/table.model";

export const tableSchema: TableModel = {
    title: '',
    totalize: false,
    columns: [
        {
            alias: 'Ordem',
            path: 'orderNum',
        },
        {
            alias: 'type',
            path: 'type',
        },
        {
            alias: 'serial',
            path: 'serialNumber',
        }
    ],
    paginator: true,
    ghostControll: []
}