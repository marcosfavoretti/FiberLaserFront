import { Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
// Importando os DTOs gerados pelo Kubb
import type { ListPlatesResponseDto } from '../../../api/fiberlaser/models/ListPlatesResponseDto';
import type { UserNestResponseDto } from '../../../api/fiberlaser/models/UserNestResponseDto';
import type { NestScriptresponseDTO } from '../../../api/fiberlaser/models/NestScriptresponseDTO';
import type { PlatesControllerListPlatesQueryParams } from '../../../api/fiberlaser/models/PlatesControllerListPlates';
import type { PaginatedListPlatesResponseDtoDto } from '../../../api/fiberlaser/models/PaginatedListPlatesResponseDtoDto';
import type { IdentifierPlateDto } from '../../../api/fiberlaser/models/IdentifierPlateDto';
// Importando os clients gerados pelo Kubb
import { productionControllerRequestOrders } from '../../../api/fiberlaser/client/productionControllerRequestOrders';
import { nestControllerGetCurrentNestsMethod } from '../../../api/fiberlaser/client/nestControllerGetCurrentNestsMethod';
import { platesControllerListPlates } from '../../../api/fiberlaser/client/platesControllerListPlates';
import { platesControllerReworkPlate } from '../../../api/fiberlaser/client/platesControllerReworkPlate';
import { nestControllerAutoRunMethod } from '../../../api/fiberlaser/client/nestControllerAutoRunMethod';
import { nestControllerManipulateScript } from '../../../api/fiberlaser/client/nestControllerManipulateScript';
import { platesControllerChangePlatesFifo } from '../../../api/fiberlaser/client/platesControllerChangePlatesFifo';
import { platesControllerDeleteSinglePlate } from '../../../api/fiberlaser/client/platesControllerDeleteSinglePlate';
import { nestControllerRemoveCurrentNestMethod } from '../../../api/fiberlaser/client/nestControllerRemoveCurrentNestMethod';
import { platesDeliveryControllerRegister } from '../../../api/fiberlaser/client/platesDeliveryControllerRegister';
import type { RegisterPlatesDeliveryDto } from '../../../api/fiberlaser/models/RegisterPlatesDeliveryDto';
import { platesDeliveryControllerList } from '../../../api/fiberlaser/client/platesDeliveryControllerList';
import type { ListPlatesDeliveryResponseDto } from '../../../api/fiberlaser/models/ListPlatesDeliveryResponseDto';
import {
    PlatesDeliveryControllerListQueryParamsStatusEnum,
    type PlatesDeliveryControllerListQueryParams
} from '../../../api/fiberlaser/models/PlatesDeliveryControllerList';
import { nestControllerGetScript, nestControllerRestartScript, PlatesControllerListPlatesQueryParamsModeEnum } from "@/api/fiberlaser";

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private readonly availablePlatesPageSize = 20;

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

    requestPlateRework(plateId: number): Observable<IdentifierPlateDto> {
        return from(
            platesControllerReworkPlate(plateId)
                .then(
                    result => result,
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

    requestAvaiablePlates(limit: number = this.availablePlatesPageSize): Observable<PaginatedListPlatesResponseDtoDto> {
        return from(this.fetchAvailablePlates(limit));
    }

    requestAllAvailablePlates(): Observable<ListPlatesResponseDto[]> {
        return from(this.fetchAllAvailablePlates());
    }

    requestPlatesDelivery(data: RegisterPlatesDeliveryDto): Observable<void> {
        return from(
            platesDeliveryControllerRegister(data).then(() => undefined)
        );
    }

    requestPlatesDeliveryList(
        status: PlatesDeliveryControllerListQueryParamsStatusEnum,
        page: number = 1,
        limit: number = 10,
        filters?: {
        serialNumber?: string;
        orderNum?: string;
        identifiersPlatesID?: number;
        partCode?: string;
        productName?: string
    }
    ): Observable<{ data: ListPlatesDeliveryResponseDto[], totalCount: number, totalPages: number, currentPage: number }> {
        const params: PlatesDeliveryControllerListQueryParams = {
            status,
            page,
            limit,
            ...filters
        };

        return from(
            platesDeliveryControllerList(params)
                .then(result => ({
                    data: result.data,
                    totalCount: result.total,
                    totalPages: result.totalPages,
                    currentPage: result.page
                }))
                .catch(error => {
                    console.error('Erro na chamada da API de entrega:', error);
                    throw error;
                })
        );
    }

    requestNotAvaiablePlates(page: number = 1, limit: number = 10, filters?: {
        serialNumber?: string;
        orderNum?: string;
        identifiersPlatesID?: number;
        partCode?: string;
        productName?: string
    }): Observable<{ data: ListPlatesResponseDto[], totalCount: number, totalPages: number, currentPage: number }> {
        const params: PlatesControllerListPlatesQueryParams = {
            mode: PlatesControllerListPlatesQueryParamsModeEnum.notavaiable,
            page,
            limit,
            ...filters
        };

        return from(
            platesControllerListPlates(params).then(result => ({
                data: result.data,
                totalCount: result.total,
                totalPages: result.totalPages,
                currentPage: result.page
            }))
        );
    }

    requestAvailablePlates(page: number = 1, limit: number = 10, filters?: {
        serialNumber?: string;
        orderNum?: string;
        identifiersPlatesID?: number;
        partCode?: string
    }): Observable<{ data: ListPlatesResponseDto[], totalCount: number, totalPages: number, currentPage: number }> {
        const params: PlatesControllerListPlatesQueryParams = {
            mode: PlatesControllerListPlatesQueryParamsModeEnum.avaiable,
            page,
            limit,
            ...filters
        };

        return from(
            platesControllerListPlates(params).then(result => ({
                data: result.data,
                totalCount: result.total,
                totalPages: result.totalPages,
                currentPage: result.page
            }))
        );
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

    requestRemoveCurrentNest(): Observable<UserNestResponseDto> {
        return from(
            nestControllerRemoveCurrentNestMethod()
                .then(
                    result => result
                )
        );
    }

    requestDeletePlate(plateId: number): Observable<void> {
        return from(
            platesControllerDeleteSinglePlate(plateId)
                .then(
                    () => undefined,
                    error => {
                        throw error;
                    }
                )
        );
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

    private async fetchAvailablePlates(limit: number): Promise<PaginatedListPlatesResponseDtoDto> {
        try {
            const firstPage = await platesControllerListPlates({
                mode: PlatesControllerListPlatesQueryParamsModeEnum.avaiable,
                page: 1,
                limit
            });

            console.log('Resultado bruto da API (available plates):', firstPage);

            const normalizedData = [...firstPage.data];
            const targetCount = Math.min(limit, firstPage.total);
            const apiIgnoredRequestedLimit =
                firstPage.total > normalizedData.length && normalizedData.length < targetCount;

            if (apiIgnoredRequestedLimit && firstPage.totalPages > 1) {
                for (let page = 2; page <= firstPage.totalPages && normalizedData.length < targetCount; page += 1) {
                    const nextPage = await platesControllerListPlates({
                        mode: PlatesControllerListPlatesQueryParamsModeEnum.avaiable,
                        page,
                        limit
                    });

                    normalizedData.push(...nextPage.data);
                }
            }

            return {
                ...firstPage,
                limit,
                data: normalizedData.slice(0, targetCount)
            };
        } catch (error) {
            console.error('Erro na chamada da API (available plates):', error);
            throw error;
        }
    }

    private async fetchAllAvailablePlates(): Promise<ListPlatesResponseDto[]> {
        const pageSize = 100;
        const firstPage = await platesControllerListPlates({
            mode: PlatesControllerListPlatesQueryParamsModeEnum.avaiable,
            page: 1,
            limit: pageSize
        });
        const data = [...firstPage.data];

        for (let page = 2; page <= firstPage.totalPages; page += 1) {
            const nextPage = await platesControllerListPlates({
                mode: PlatesControllerListPlatesQueryParamsModeEnum.avaiable,
                page,
                limit: pageSize
            });
            data.push(...nextPage.data);
        }

        return data;
    }

}
