export interface TableRowAction {
    key: string;
    icon: string;
    label?: string;
    visible?: boolean;
    disabled?: boolean;
    severity?: "secondary" | "success" | "info" | "warn" | "help" | "danger" | "contrast";
    outlined?: boolean;
    rounded?: boolean;
}

export interface tableColumns{
    alias: string;
    path: string;
    isImg?: boolean;
    isCheckBox?: boolean;
    isActionList?: boolean;
    toTotalize?: boolean;
}
export interface ghostControllColumn{
    path: string;
    desc: string;
    ifValueEqual?: any;
    ifValueGreater?: any;
    color: string;
}
export interface TableModel{
    title: string;
    paginator?: boolean;
    totalize: boolean;
    columns?: Array<tableColumns>;
    ghostControll?: Array<ghostControllColumn>
}
