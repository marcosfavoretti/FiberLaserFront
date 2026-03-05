import { EventEmitter, Injectable } from "@angular/core";
import { Production } from "../models/Production";
import { ApiService } from "./Api.service";
import { catchError, Observable, tap } from "rxjs";
import { IdentifiersPlate } from "../models/IdentifiersPlate";
import { PopUpService } from "./pop-up.service";
import { ErrorPopupComponent } from "../../widgets/error-popup/error-popup.component";
import { PaginatedListPlatesResponseDtoDto } from "@/api/fiberlaser";
@Injectable({
    providedIn: 'root'
})
export class ProductionManagerService {
    private production: Production[] = [];
    private event: EventEmitter<Production[]> = new EventEmitter<Production[]>();

    constructor(private api: ApiService, private popUp: PopUpService) {
        // this.refreshNest();
    }

    findPlateAndRemove(plate: IdentifiersPlate): void {
        this.production.forEach(p => {
            const index = p.Identifiersplates!.findIndex(ip => ip.IdentifiersPlatesID === plate.IdentifiersPlatesID);
            if (index !== -1) {
                p.Identifiersplates!.splice(index, 1);
                console.log('mudou')
            }
            else {
                console.log('nothing')
            }
        });
        this.event.emit(this.production);
    }

    getEventEmitter(): EventEmitter<Production[]> {
        return this.event;
    }

    getProduction(): Production[] {
        return this.production;
    }

    refreshNest(): Observable<PaginatedListPlatesResponseDtoDto> {
        this.production = [];
        return this.api.requestAvaiablePlates()
            .pipe(
                tap((data) => {
                    console.log('Dados recebidos da API:', data);
                    this.setProduction(data.data);
                }),
                catchError((err) => {
                    this.popUp.open('error.nest', ErrorPopupComponent, err, true);
                    console.log('Erro ao carregar produções:', err)
                    throw err;
                })
            )

    }

    setProduction(production: Production[]): void {
        console.log('Produções recebidas no setProduction:', production);
        console.log('Quantidade de produções:', production.length);
        this.production.push(...production); // Substituir, em vez de adicionar
        console.log('Produções armazenadas:', this.production);
        this.event.emit(this.production);
    }

}