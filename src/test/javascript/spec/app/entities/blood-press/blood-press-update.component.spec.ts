/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { DiamondTestModule } from '../../../test.module';
import { BloodPressUpdateComponent } from 'app/entities/blood-press/blood-press-update.component';
import { BloodPressService } from 'app/entities/blood-press/blood-press.service';
import { BloodPress } from 'app/shared/model/blood-press.model';

describe('Component Tests', () => {
    describe('BloodPress Management Update Component', () => {
        let comp: BloodPressUpdateComponent;
        let fixture: ComponentFixture<BloodPressUpdateComponent>;
        let service: BloodPressService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DiamondTestModule],
                declarations: [BloodPressUpdateComponent]
            })
                .overrideTemplate(BloodPressUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(BloodPressUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(BloodPressService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new BloodPress(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.bloodPress = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new BloodPress();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.bloodPress = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.create).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));
        });
    });
});
