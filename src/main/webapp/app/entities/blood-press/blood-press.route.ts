import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { BloodPress } from 'app/shared/model/blood-press.model';
import { BloodPressService } from './blood-press.service';
import { BloodPressComponent } from './blood-press.component';
import { BloodPressDetailComponent } from './blood-press-detail.component';
import { BloodPressUpdateComponent } from './blood-press-update.component';
import { BloodPressDeletePopupComponent } from './blood-press-delete-dialog.component';
import { IBloodPress } from 'app/shared/model/blood-press.model';

@Injectable({ providedIn: 'root' })
export class BloodPressResolve implements Resolve<IBloodPress> {
    constructor(private service: BloodPressService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BloodPress> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<BloodPress>) => response.ok),
                map((bloodPress: HttpResponse<BloodPress>) => bloodPress.body)
            );
        }
        return of(new BloodPress());
    }
}

export const bloodPressRoute: Routes = [
    {
        path: 'blood-press',
        component: BloodPressComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'diamondApp.bloodPress.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'blood-press/:id/view',
        component: BloodPressDetailComponent,
        resolve: {
            bloodPress: BloodPressResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'diamondApp.bloodPress.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'blood-press/new',
        component: BloodPressUpdateComponent,
        resolve: {
            bloodPress: BloodPressResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'diamondApp.bloodPress.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'blood-press/:id/edit',
        component: BloodPressUpdateComponent,
        resolve: {
            bloodPress: BloodPressResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'diamondApp.bloodPress.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const bloodPressPopupRoute: Routes = [
    {
        path: 'blood-press/:id/delete',
        component: BloodPressDeletePopupComponent,
        resolve: {
            bloodPress: BloodPressResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'diamondApp.bloodPress.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
