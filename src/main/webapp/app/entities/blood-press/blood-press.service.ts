import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IBloodPress } from 'app/shared/model/blood-press.model';

type EntityResponseType = HttpResponse<IBloodPress>;
type EntityArrayResponseType = HttpResponse<IBloodPress[]>;

@Injectable({ providedIn: 'root' })
export class BloodPressService {
    public resourceUrl = SERVER_API_URL + 'api/blood-presses';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/blood-presses';

    constructor(private http: HttpClient) {}

    create(bloodPress: IBloodPress): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(bloodPress);
        return this.http
            .post<IBloodPress>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(bloodPress: IBloodPress): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(bloodPress);
        return this.http
            .put<IBloodPress>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IBloodPress>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IBloodPress[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IBloodPress[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    protected convertDateFromClient(bloodPress: IBloodPress): IBloodPress {
        const copy: IBloodPress = Object.assign({}, bloodPress, {
            timestamp: bloodPress.timestamp != null && bloodPress.timestamp.isValid() ? bloodPress.timestamp.toJSON() : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.timestamp = res.body.timestamp != null ? moment(res.body.timestamp) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((bloodPress: IBloodPress) => {
                bloodPress.timestamp = bloodPress.timestamp != null ? moment(bloodPress.timestamp) : null;
            });
        }
        return res;
    }
}
