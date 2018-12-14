import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBloodPress } from 'app/shared/model/blood-press.model';

@Component({
    selector: 'jhi-blood-press-detail',
    templateUrl: './blood-press-detail.component.html'
})
export class BloodPressDetailComponent implements OnInit {
    bloodPress: IBloodPress;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ bloodPress }) => {
            this.bloodPress = bloodPress;
        });
    }

    previousState() {
        window.history.back();
    }
}
