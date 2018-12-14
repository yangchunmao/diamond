import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';

import { IBloodPress } from 'app/shared/model/blood-press.model';
import { BloodPressService } from './blood-press.service';
import { IUser, UserService } from 'app/core';

@Component({
    selector: 'jhi-blood-press-update',
    templateUrl: './blood-press-update.component.html'
})
export class BloodPressUpdateComponent implements OnInit {
    bloodPress: IBloodPress;
    isSaving: boolean;

    users: IUser[];
    timestamp: string;

    constructor(
        private jhiAlertService: JhiAlertService,
        private bloodPressService: BloodPressService,
        private userService: UserService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ bloodPress }) => {
            this.bloodPress = bloodPress;
            this.timestamp = this.bloodPress.timestamp != null ? this.bloodPress.timestamp.format(DATE_TIME_FORMAT) : null;
        });
        this.userService.query().subscribe(
            (res: HttpResponse<IUser[]>) => {
                this.users = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.bloodPress.timestamp = this.timestamp != null ? moment(this.timestamp, DATE_TIME_FORMAT) : null;
        if (this.bloodPress.id !== undefined) {
            this.subscribeToSaveResponse(this.bloodPressService.update(this.bloodPress));
        } else {
            this.subscribeToSaveResponse(this.bloodPressService.create(this.bloodPress));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IBloodPress>>) {
        result.subscribe((res: HttpResponse<IBloodPress>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackUserById(index: number, item: IUser) {
        return item.id;
    }
}
