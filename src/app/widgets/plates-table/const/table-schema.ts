import { TableModel } from "../../../@core/Models/table.model";

export const tableSchema: TableModel = {
    title: 'Placas Não Disponíveis',
    totalize: false,
    
    columns: [
        {
            alias: 'Ações',
            isCheckBox: true,
            path: ''
        },
        {
            alias: 'ID',
            path: 'id'
        },
        {
            alias: 'Tipo',
            path: 'type',
        },
        {
            alias: 'Ordem',
            path: 'orderNum',
        },
        {
            alias: 'Serial',
            path: 'serialNumber',
        },
        {
            alias: 'Peça',
            path: 'partCode',
        },
        {
            alias: 'Status',
            path: 'statusText'
        }
    ],
    paginator: true,
    ghostControll: []
};