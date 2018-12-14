import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { DiamondPointsModule } from './points/points.module';
import { DiamondWeightModule } from './weight/weight.module';
import { DiamondBloodPressModule } from './blood-press/blood-press.module';
import { DiamondPreferencesModule } from './preferences/preferences.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    // prettier-ignore
    imports: [
        DiamondPointsModule,
        DiamondWeightModule,
        DiamondBloodPressModule,
        DiamondPreferencesModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DiamondEntityModule {}
