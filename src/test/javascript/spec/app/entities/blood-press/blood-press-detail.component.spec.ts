/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DiamondTestModule } from '../../../test.module';
import { BloodPressDetailComponent } from 'app/entities/blood-press/blood-press-detail.component';
import { BloodPress } from 'app/shared/model/blood-press.model';

describe('Component Tests', () => {
    describe('BloodPress Management Detail Component', () => {
        let comp: BloodPressDetailComponent;
        let fixture: ComponentFixture<BloodPressDetailComponent>;
        const route = ({ data: of({ bloodPress: new BloodPress(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DiamondTestModule],
                declarations: [BloodPressDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(BloodPressDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(BloodPressDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.bloodPress).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
