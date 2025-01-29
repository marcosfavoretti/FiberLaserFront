import { ManagerFiberLaserNest } from "./ManagerFiberLaserNest";
import { ModelNest } from "./ModelNest";

export interface FiberLaserNest {
    proccessCounter: number;
    UserNestID: number;
    SeverTime: string;
    done: boolean;
    Name: string;
    ManagerFiberLaserNest: ManagerFiberLaserNest[];
    ModelNest: ModelNest;
}