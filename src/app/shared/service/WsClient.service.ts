import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../@core/const/environment';
import { Events } from '../../@core/enum/Events.enum';
import { ProductionManagerService } from './ProductionManager.service';
import { NestManagerService } from './NestManager.service';

@Injectable({
    providedIn: 'root'
})
export class WsClientService {
    private socket: Socket;
    public online: boolean = false;
    
    constructor(
        private porductionManager: ProductionManagerService,
        private nestManager: NestManagerService
    ) {
        const wsUrl = `ws://${environment.API_IP}:${environment.WS_PORT}/fiberlaser`
        console.log(wsUrl);
        const socket = io(wsUrl, {
            forceNew: true,
            path: '/ws',
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000
        });
        this.socket = socket;
        this.setTriggers(socket);
    }


    private setTriggers(socket: Socket): void {
        socket.on(Events.NESTDONE, (data: string) => {
            console.log('nest foi feito');
            this.nestManager.refreshNest();
        });


        socket.on(Events.NEWPLATE, (data: string) => {
            console.log('nova placa processada');
            this.porductionManager.findPlateAndRemove(JSON.parse(data));
        })

        socket.on('connect', () => {
            console.log('ws connect')
            this.online = true;
        });

        socket.on('disconnect', () => {
            console.log('client disconnect')
            this.online = false;
        });

    }
}