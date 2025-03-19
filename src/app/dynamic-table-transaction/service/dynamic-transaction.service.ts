import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { Observable, tap } from 'rxjs';
import { IAddDynamicTableTransaction } from '../interface/table-transaction.model';

@Injectable({
    providedIn: 'root'
})
export class dynamicTransactionService {

    serviceApiUrl: string = environment.serviceApiUrl;

    constructor(private http: HttpClient) { }

    getProducts() {
        return this.http.get(this.serviceApiUrl + 'products')
    }

    getDynamicTablesById(subProductId: number) {
        return this.http.get(this.serviceApiUrl + 'dynamic-tables/' + subProductId)
    }

    getSubProductDetailById(subDynamicProductId: number) {
        return this.http.get(this.serviceApiUrl + 'dynamic-tables/data/' + subDynamicProductId)       
    }

    addDynamicProduct(payload: IAddDynamicTableTransaction): Observable<IAddDynamicTableTransaction> {
        return this.http.post<IAddDynamicTableTransaction>(`${this.serviceApiUrl + 'dynamic-tables'}`, payload).pipe(
            tap((response) => {
                console.log(response)
            })
        );
    }

    updateDynamicProduct(payload: IAddDynamicTableTransaction, id: number): Observable<IAddDynamicTableTransaction> {
        return this.http.patch<IAddDynamicTableTransaction>(`${this.serviceApiUrl + 'dynamic-tables/' + id}`, payload).pipe(
            tap((response) => {
                console.log(response)
            })
        );
    }

    deleteDynamicProductById(id: number) {
        return this.http.delete(this.serviceApiUrl + "dynamic-tables/" + id)
    }
}
