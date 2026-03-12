import { Injectable } from "@angular/core";
import { IdentifiersPlate } from "../models/IdentifiersPlate";

@Injectable({
    providedIn: 'root'
})
export class DemoPlateService {
    // Static demo plates for operator reference
    private demoPlates: IdentifiersPlate[] = [
        {
            type: "Demo Plate",
            IdentifiersPlatesID: 1,
            Serial: "DEMO001",
            platesType: "DEFAULT",
            Done: false,
            QrCode: "DEMO001_QR_CODE",
            CodCliente: "CLIENTE_DEMO"
        },
        {
            type: "Demo Plate",
            IdentifiersPlatesID: 2,
            Serial: "DEMO002",
            platesType: "DYNAPACFOPS",
            Done: false,
            QrCode: "DEMO002_QR_CODE",
            CodCliente: "CLIENTE_DEMO"
        },
        {
            type: "Demo Plate",
            IdentifiersPlatesID: 3,
            Serial: "DEMO003",
            platesType: "_3CXJCBPlate",
            Done: false,
            QrCode: "DEMO003_QR_CODE",
            CodCliente: "CLIENTE_DEMO"
        },
        {
            type: "Demo Plate",
            IdentifiersPlatesID: 4,
            Serial: "DEMO004",
            platesType: "_426JCBPLATE",
            Done: false,
            QrCode: "DEMO004_QR_CODE",
            CodCliente: "CLIENTE_DEMO"
        },
        {
            type: "Demo Plate",
            IdentifiersPlatesID: 5,
            Serial: "DEMO005",
            platesType: "DYNAPACROPS",
            Done: false,
            QrCode: "DEMO005_QR_CODE",
            CodCliente: "CLIENTE_DEMO"
        },
        {
            type: "Demo Plate",
            IdentifiersPlatesID: 6,
            Serial: "DEMO006",
            platesType: "D1000",
            Done: false,
            QrCode: "DEMO006_QR_CODE",
            CodCliente: "CLIENTE_DEMO"
        },
        {
            type: "Demo Plate",
            IdentifiersPlatesID: 7,
            Serial: "DEMO007",
            platesType: "D600",
            Done: false,
            QrCode: "DEMO007_QR_CODE",
            CodCliente: "CLIENTE_DEMO"
        },
        {
            type: "Demo Plate",
            IdentifiersPlatesID: 8,
            Serial: "DEMO008",
            platesType: "D800",
            Done: false,
            QrCode: "DEMO008_QR_CODE",
            CodCliente: "CLIENTE_DEMO"
        },
        {
            type: "Demo Plate",
            IdentifiersPlatesID: 9,
            Serial: "DEMO009",
            platesType: "D1250",
            Done: false,
            QrCode: "DEMO009_QR_CODE",
            CodCliente: "CLIENTE_DEMO"
        }
    ];

    getDemoPlates(): IdentifiersPlate[] {
        return [...this.demoPlates];
    }

    getDemoPlateByType(type: string): IdentifiersPlate | undefined {
        return this.demoPlates.find(plate => plate.platesType === type);
    }

    getAllPlateTypes(): string[] {
        return [...new Set(this.demoPlates.map(plate => plate.platesType))];
    }
}