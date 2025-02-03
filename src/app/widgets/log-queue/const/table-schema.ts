import { TableModel } from "../../../@core/Models/table.model";

export const tableSchema: TableModel = {
    title: '',
    totalize: false,
    columns: [
        {
            alias: 'refazer',
            isCheckBox: true,
            path: ''
        },
        {
            alias: 'ID',
            path: 'id'
        },
        {
            alias: 'type',
            path: 'type',
        },
        {
            alias: 'Ordem',
            path: 'orderNum',
        },
        {
            alias: 'serial',
            path: 'serialNumber',
        }
    ],
    paginator: true,
    ghostControll: []
}