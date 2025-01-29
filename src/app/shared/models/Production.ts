import { IdentifiersPlate } from "./IdentifiersPlate";
import { ProductionData } from "./ProductionData";


export interface Production {
    ProductionID: number;
    OrderNum: string;
    PartCode: string;
    PartName: string;
    PlanQty: number;
    PlannedEndTimestamp: string;
    productionData?: ProductionData[];
    Identifiersplates?: IdentifiersPlate[];
}