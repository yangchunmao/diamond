import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DiamondSharedModule } from 'app/shared';
import { DiamondAdminModule } from 'app/admin/admin.module';
import {
    BloodPressComponent,
    BloodPressDetailComponent,
    BloodPressUpdateComponent,
    BloodPressDeletePopupComponent,
    BloodPressDeleteDialogComponent,
    bloodPressRoute,
    bloodPressPopupRoute
} from './';

const ENTITY_STATES = [...bloodPressRoute, ...bloodPressPopupRoute];

@NgModule({
    imports: [DiamondSharedModule, DiamondAdminModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        BloodPressComponent,
        BloodPressDetailComponent,
        BloodPressUpdateComponent,
        BloodPressDeleteDialogComponent,
        BloodPressDeletePopupComponent
    ],
    entryComponents: [BloodPressComponent, BloodPressUpdateComponent, BloodPressDeleteDialogComponent, BloodPressDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DiamondBloodPressModule {}
