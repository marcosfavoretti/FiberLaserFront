import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DataScriptService {
    private dataScriptSubject = new BehaviorSubject<Array<Array<{ data: string, current: boolean }>>>([]);
    public dataScript$ = this.dataScriptSubject.asObservable();

    setNewData(data: Array<Array<{ data: string, current: boolean }>>) {
        this.dataScriptSubject.next(data);
    }

    getCurrentData(): Array<Array<{ data: string, current: boolean }>> {
        return this.dataScriptSubject.getValue();
    }
}