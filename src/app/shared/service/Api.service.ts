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
}
