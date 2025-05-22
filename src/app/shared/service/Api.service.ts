import { Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
import { Production } from "../models/Production";
import { Client } from "../client/Client";
import { FiberLaserNest } from "../models/FiberLaserNest";

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    constructor() { }

    requestPedidos(): Observable<Production[]> {
        return from(
            Client.get<Production[]>(`/production`)
                .then(
                    result => {
                        return result.data;
                    }
                )
        );
    }

    requestAction(type: 'UP' | 'DOWN'):Observable<void>{
        return from(
            Client.post<void>('nest/script', {
                "action": type
              }).then(data=>data.data)
        )
    }

    requestReset():Observable<void>{
        return from(
            Client.post<void>('nest/script/restart').then(data=>data.data)
        )
    }

    requestScripts(): Observable<Array<{ current: boolean, data: string }[]>> {
        return from(
            Client.get<Array<{ current: boolean, data: string }[]>>(`/nest/script`)
                .then(
                    result => result.data,
                    error => {
                        throw error;
                    }
                )
        );
    }

    requestPlateRework(plateId: number): Observable<void> {
        return from(
            Client.post<void>(`/plates/${plateId}/rework`)
                .then(
                    () => {},
                    error => {
                        throw error;
                    }
                )
        );
    }

    requestCurrentNests(): Observable<FiberLaserNest[]> {

        return from(
            Client.get<FiberLaserNest[]>(`/nest/current`)
                .then(
                    result => {
                        return result.data;
                    }
                )
        )
    }

    requestAvaiablePlates(): Observable<Production[]> {

        return from(
            Client.get<Production[]>(`/plates?mode=avaiable`)
                .then(
                    result => {
                        return result.data;
                    }
                )
        )
    }

    requestNotAvaiablePlates(): Observable<Production[]> {
        return from(
            Client.get<Production[]>(`/plates?mode=notavaiable`)
                .then(
                    result => {
                        return result.data;
                    }
                )
        )
    }

    requestAutoRun(): Observable<FiberLaserNest> {

        return from(
            Client.post<FiberLaserNest>('/nest/run')
                .then(
                    result => {
                        return result.data;
                    }
                )
        )
    }

}   