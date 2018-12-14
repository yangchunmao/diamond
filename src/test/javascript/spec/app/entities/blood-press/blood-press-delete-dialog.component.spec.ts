/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { DiamondTestModule } from '../../../test.module';
import { BloodPressDeleteDialogComponent } from 'app/entities/blood-press/blood-press-delete-dialog.component';
import { BloodPressService } from 'app/entities/blood-press/blood-press.service';

describe('Component Tests', () => {
    describe('BloodPress Management Delete Component', () => {
        let comp: BloodPressDeleteDialogComponent;
        let fixture: ComponentFixture<BloodPressDeleteDialogComponent>;
        let service: BloodPressService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [DiamondTestModule],
                declarations: [BloodPressDeleteDialogComponent]
            })
                .overrideTemplate(BloodPressDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(BloodPressDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(BloodPressService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
