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
            path: 'IdentifiersPlatesID'
        },
        {
            alias: 'type',
            path: 'type',
        },
        {
            alias: 'Ordem',
            path: '24960308',
        },
        {
            alias: 'Serial',
            path: 'serialNumber',
        }
    ],
    paginator: true,
    ghostControll: []
}