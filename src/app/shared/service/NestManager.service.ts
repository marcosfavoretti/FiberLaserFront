import { EventEmitter, Injectable } from "@angular/core";
import { ApiService } from "./Api.service";
import { catchError, tap } from "rxjs";
import { FiberLaserNest } from "../models/FiberLaserNest";
import { PopUpService } from "./pop-up.service";
import { LoadContentComponent } from "../../widgets/load-content/load-content.component";
import { ErrorPopupComponent } from "../../widgets/error-popup/error-popup.component";
import { IdentifiersPlate } from "../models/IdentifiersPlate";

@Injectable({
    providedIn: 'root'
})
export class NestManagerService {
    private readonly nest: FiberLaserNest[] = [];
    private nestComplete: EventEmitter<FiberLaserNest> = new EventEmitter();
    private newNest: EventEmitter<FiberLaserNest[]> = new EventEmitter();
    constructor(private api: ApiService, private popUp: PopUpService) {
        // this.refreshNest();
    }

    getNestCompleteEvent(): EventEmitter<FiberLaserNest>{
        return this.nestComplete;
    }

    nestCompleteEmit(fiberlaserNest: FiberLaserNest):void{
        this.nestComplete.emit(fiberlaserNest);
    }


    getNests(): FiberLaserNest[] {
        return this.nest;
    }

    getEvent(): EventEmitter<FiberLaserNest[]> {
        return this.newNest;
    }

    findAndDeleteNest(nest: FiberLaserNest): void {
        const index = this.nest.findIndex(n => n.UserNestID === nest.UserNestID);
        if (index !== -1) {
            this.nest.splice(index, 1);
        }
        console.error('nao foi achado')
        this.newNest.emit(this.nest);
    }

    findAndProcessPlate(plate: IdentifiersPlate): void {
        this.nest.flatMap(n => n.ManagerFiberLaserNest)
            .filter(m => m.IdentifiersPlates.IdentifiersPlatesID === plate.IdentifiersPlatesID)
            .forEach(m => m.IdentifiersPlates.Done = true);
    }

    refreshNest(): void {
        this.popUp.open('nest', LoadContentComponent, [], false);
        this.api.requestCurrentNests()
            .pipe(
                tap((data) => {
                    console.log('quer mais nest', data);
                    this.popUp.close('nest');
                    this.setNest(data);
                }),
                catchError((err) => {
                    this.popUp.close('nest');
                    console.log(err)
                    this.popUp.open('error.nest', ErrorPopupComponent, err, true);
                    throw new Error(err);
                })
            )
            .subscribe();
    }

    removeNest(nest: FiberLaserNest): void {
        this.nest.splice(this.nest.indexOf(nest), 1);
    }

    addNest(nest: FiberLaserNest): void {
        this.nest.push(nest);
    }

    setNest(nest: FiberLaserNest[]): void {
        this.nest.splice(0, this.nest.length)
        this.nest.push(...nest);
        this.newNest.emit(this.nest);
    }
}