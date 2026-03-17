import { Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
// Importando os DTOs gerados pelo Kubb
import type { ListPlatesResponseDto } from '../../../api/fiberlaser/models/ListPlatesResponseDto';
import type { UserNestResponseDto } from '../../../api/fiberlaser/models/UserNestResponseDto';
import type { NestScriptresponseDTO } from '../../../api/fiberlaser/models/NestScriptresponseDTO';
import type { PlatesControllerListPlatesQueryParams } from '../../../api/fiberlaser/models/PlatesControllerListPlates';
import type { PaginatedListPlatesResponseDtoDto } from '../../../api/fiberlaser/models/PaginatedListPlatesResponseDtoDto';
// Importando os clients gerados pelo Kubb
import { productionControllerRequestOrders } from '../../../api/fiberlaser/client/productionControllerRequestOrders';
import { nestControllerGetCurrentNestsMethod } from '../../../api/fiberlaser/client/nestControllerGetCurrentNestsMethod';
import { platesControllerListPlates } from '../../../api/fiberlaser/client/platesControllerListPlates';
import { platesControllerReworkPlate } from '../../../api/fiberlaser/client/platesControllerReworkPlate';
import { nestControllerAutoRunMethod } from '../../../api/fiberlaser/client/nestControllerAutoRunMethod';
import { nestControllerManipulateScript } from '../../../api/fiberlaser/client/nestControllerManipulateScript';
import { platesControllerChangePlatesFifo } from '../../../api/fiberlaser/client/platesControllerChangePlatesFifo';
import { nestControllerGetScript, nestControllerRestartScript, PlatesControllerListPlatesQueryParamsModeEnum } from "@/api/fiberlaser";

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    constructor() { }

    requestPedidos(): Observable<ListPlatesResponseDto[]> {
        return from(
            productionControllerRequestOrders()
                .then(
                    result => {
                        return Array.isArray(result) ? result : [];
                    }
                )
        );
    }

    requestAction(type: 'UP' | 'DOWN'): Observable<void> {
        return from(
            nestControllerManipulateScript({
                "action": type
            }).then(data => data)
        )
    }

    requestReset(): Observable<void> {
        return from(
            nestControllerRestartScript()
                .then(data => data)
        );
    }

    requestScripts(): Observable<NestScriptresponseDTO[][]> {
        return from(
            nestControllerGetScript()
                .then(
                    result => {
                        // O resultado já é um array de arrays (NestScriptresponseDTO[][])
                        return Array.isArray(result) ? result as unknown as NestScriptresponseDTO[][] : [];
                    },
                    error => {
                        throw error;
                    }
                )
        );
    }

    requestPlateRework(plateId: number): Observable<void> {
        return from(
            platesControllerReworkPlate(plateId)
                .then(
                    () => { },
                    error => {
                        throw error;
                    }
                )
        );
    }

    requestCurrentNests(): Observable<UserNestResponseDto | null> {
        return from(
            nestControllerGetCurrentNestsMethod()
                .then(
                    result => {
                        // O endpoint pode retornar um único objeto ou um array
                        return result;
                    }
                )
        )
    }

    requestAvaiablePlates(): Observable<PaginatedListPlatesResponseDtoDto> {
        return from(
            platesControllerListPlates({
                mode: PlatesControllerListPlatesQueryParamsModeEnum.avaiable
            })
                .then(
                    (result: PaginatedListPlatesResponseDtoDto) => {
                        console.log('Resultado bruto da API (available plates):', result);
                        return result;
                    }
                )
                .catch(error => {
                    console.error('Erro na chamada da API (available plates):', error);
                    throw error;
                })
        )
    }

    requestNotAvaiablePlates(page: number = 1, limit: number = 10, filters?: {
        serialNumber?: string;
        orderNum?: string;
        identifiersPlatesID?: number;
        partCode?: string
    }): Observable<{ data: ListPlatesResponseDto[], totalCount: number, totalPages: number, currentPage: number }> {
        const params: PlatesControllerListPlatesQueryParams = {
            mode: PlatesControllerListPlatesQueryParamsModeEnum.notavaiable,
            page,
            limit,
            ...filters
        };

        return from(
            platesControllerListPlates(params)
                .then(
                    (result: PaginatedListPlatesResponseDtoDto) => {
                        // Return the proper paginated structure
                        return {
                            data: result.data,
                            totalCount: result.total,
                            totalPages: result.totalPages,
                            currentPage: result.page
                        };
                    }
                )
                .catch(error => {
                    console.error('Erro na chamada da API (not available plates):', error);
                    throw error;
                })
        )
    }

    requestAutoRun(): Observable<UserNestResponseDto> {
        return from(
            nestControllerAutoRunMethod()
                .then(
                    result => {
                        return result;
                    }
                )
        )
    }

    /**
     * Solicita aumento de prioridade de uma produção.
     * @param productionId ID da produção a ter prioridade aumentada
     */
    requestPriorityIncrease(productionId: number): Observable<void> {
        return from(
            platesControllerChangePlatesFifo({
                productionid: productionId
            })
                .then(data => data)
        )
    }

}   