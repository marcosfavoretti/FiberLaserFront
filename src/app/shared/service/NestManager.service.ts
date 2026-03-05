import { EventEmitter, Injectable } from "@angular/core";
import { ApiService } from "./Api.service";
import { catchError, Observable, tap } from "rxjs";
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
    constructor(private api: ApiService, private popUp: PopUpService) { }

    getNestCompleteEvent(): EventEmitter<FiberLaserNest> {
        return this.nestComplete;
    }

    nestCompleteEmit(fiberlaserNest: FiberLaserNest): void {
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
        } else {
            console.warn('Nest não encontrado para remoção');
        }
        this.newNest.emit(this.nest);
    }

    findAndProcessPlate(plate: IdentifiersPlate): void {
        this.nest.flatMap(n => n.IdentifierPlates)
            .filter(m => m.IdentifiersPlatesID === plate.IdentifiersPlatesID)
            .forEach(m => m.Done = true);
    }

    refreshNest(): Observable<FiberLaserNest | null> {
        console.log('NestManagerService: Solicitando refresh do Nest...');
        return this.api.requestCurrentNests()
            .pipe(
                tap(
                    (data) => {
                        console.log('NestManagerService: Dados recebidos no refresh:', data);
                        this.popUp.close('nest');
                        // Se data for null, passamos array vazio para o setNest, o que limpará o estado.
                        this.setNest(data ? [data] : []);
                    }),
                catchError((err) => {
                    this.popUp.close('nest');
                    console.error('NestManagerService: Erro ao dar refresh no Nest:', err);
                    this.popUp.open('error.nest', ErrorPopupComponent, err, true);
                    throw err;
                })
            );
    }

    removeNest(nest: FiberLaserNest): void {
        const index = this.nest.indexOf(nest);
        if (index !== -1) {
            this.nest.splice(index, 1);
            this.newNest.emit(this.nest);
        }
    }

    removeAllNests(): void {
        this.nest.splice(0, this.nest.length);
        this.newNest.emit(this.nest);
    }

    addNest(nest: FiberLaserNest): void {
        this.nest.push(nest);
        this.newNest.emit(this.nest);
    }

    setNest(nest: FiberLaserNest[]): void {
        this.nest.splice(0, this.nest.length)
        this.nest.push(...nest);
        this.newNest.emit(this.nest);
    }

    hasNests(): boolean {
        return this.nest.length > 0;
    }
}