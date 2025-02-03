export interface IdentifiersPlate {
    type: string;
    IdentifiersPlatesID: number;
    platesType: string;
    Done: boolean;
    QrCode: string;
    CodCliente: string;
    Serial: string;
    Ordem: string;
    CodItem: string;
    Peso: string;
    Data: string;
    [key: string]: any;//so para conseguir usar os atributos com os indices como string
}