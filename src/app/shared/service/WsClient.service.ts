import { Injectable, isDevMode } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Events } from '../../@core/enum/Events.enum';
import { ProductionManagerService } from './ProductionManager.service';
import { NestManagerService } from './NestManager.service';
import { DataScriptService } from './DataScript.service';
import { environment } from '@/app/@core/const/environment';

@Injectable({
    providedIn: 'root'
})
export class WsClientService {
    private socket: Socket;
    public online: boolean = false;

    constructor(
        private porductionManager: ProductionManagerService,
        private nestManager: NestManagerService,
        private dataService: DataScriptService

    ) {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        let wsUrl = `${wsProtocol}//${window.location.host}/fiberlaser`;
        //se estiive em angular dev mode use o enviorment para pegar o host
        if (isDevMode()) {
            wsUrl = `${wsProtocol}//${environment.WS_IP}:${environment.WS_PORT}/fiberlaser`;
            console.log('DEV MODE ON --> ' + wsUrl);
        }
        console.log('DEBUG: wsUrl: ', wsUrl);
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
            this.nestManager.nestCompleteEmit(JSON.parse(data));
            //nao tirar o nest automatico.. pois ele serve para conferencia.
        });

        socket.on(Events.NEWDATA, (data: string) => {
            console.log(`novo dado: ${data}`)
            this.dataService.setNewData(JSON.parse(data))
        })

        socket.on(Events.NEWPLATE, (data: string) => {
            console.log('nova placa processada');
            this.porductionManager.findPlateAndRemove(JSON.parse(data));
            this.nestManager.findAndProcessPlate(JSON.parse(data));
        })

        socket.on('connect', () => {
            console.log('ws connect');
            this.online = true;
        });

        socket.on('disconnect', () => {
            console.log('client disconnect'); ''
            this.online = false;
        });

    }
}
