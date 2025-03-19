import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { tableComponents } from '../interface/table-component.model';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class dynamicService {

    serviceApiUrl: string = environment.serviceApiUrl;

    constructor(private http: HttpClient) { }

    getComponents() {
        return this.http.get(this.serviceApiUrl + 'components')
    }

    getComponentById(id: number) {
        return this.http.get(`${this.serviceApiUrl + 'components/' + id}`);
    }

    addComponent(payload: tableComponents): Observable<any> {
        return this.http.post<tableComponents>(`${this.serviceApiUrl + 'components'}`, payload).pipe(
            tap((response) => {
                console.log(response)
            })
        );
    }

    updateComponent(payload: tableComponents, id: number): Observable<tableComponents> {
        return this.http.put<tableComponents>(`${this.serviceApiUrl + 'components/' + id}`, payload).pipe(
            tap((response) => {
                console.log(response)
            })
        );
    }

    deleteComponentById(id: number) {
        return this.http.delete(this.serviceApiUrl + "components/" + id)
    }
}
