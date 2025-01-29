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