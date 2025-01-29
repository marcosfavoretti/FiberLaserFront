import { EventEmitter, Injectable } from "@angular/core";
import { Production } from "../models/Production";
import { ApiService } from "./Api.service";
import { catchError, tap } from "rxjs";
import { IdentifiersPlate } from "../models/IdentifiersPlate";
import { PopUpService } from "./pop-up.service";
import { LoadContentComponent } from "../../widgets/load-content/load-content.component";
import { ErrorPopupComponent } from "../../widgets/error-popup/error-popup.component";
@Injectable({
    providedIn: 'root'
})
export class ProductionManagerService {
    private production: Production[] = [];
    private event: EventEmitter<void> = new EventEmitter<void>();

    constructor(private api: ApiService, private popUp: PopUpService) {
        this.refreshNest();
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
        console.log(this.production.length)
        this.event.emit();
    }

    getEventEmitter(): EventEmitter<void> {
        return this.event;
    }

    getProduction(): Production[] {
        return this.production;
    }

    refreshNest(): void {
        this.popUp.open('production', LoadContentComponent, {}, false);
        this.api.requestAvaiablePlates()
            .pipe(
                tap((data) => {
                    this.setProduction(data);
                    this.popUp.close('production');
                }),
                catchError((err) => {
                    this.popUp.close('production');
                    this.popUp.open('error.nest', ErrorPopupComponent, err.response.data.message, true);
                    console.log(err)
                    throw new Error(err);
                })
            )
            .subscribe();
    }

    setProduction(production: Production[]): void {
        console.log(production)
        this.production.push(...production);
        this.event.emit();
    }

}