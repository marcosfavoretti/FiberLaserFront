import { IdentifiersPlate } from "./IdentifiersPlate";

// ManagerFiberLaserNest não parece ter um DTO equivalente no Kubb, mantendo o modelo original
export interface ManagerFiberLaserNest {
    ManagerFiberLaserID: number;
    IdentifiersPlates: IdentifiersPlate;
}