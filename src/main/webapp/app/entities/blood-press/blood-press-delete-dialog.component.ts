import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IBloodPress } from 'app/shared/model/blood-press.model';
import { BloodPressService } from './blood-press.service';

@Component({
    selector: 'jhi-blood-press-delete-dialog',
    templateUrl: './blood-press-delete-dialog.component.html'
})
export class BloodPressDeleteDialogComponent {
    bloodPress: IBloodPress;

    constructor(private bloodPressService: BloodPressService, public activeModal: NgbActiveModal, private eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.bloodPressService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'bloodPressListModification',
                content: 'Deleted an bloodPress'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-blood-press-delete-popup',
    template: ''
})
export class BloodPressDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ bloodPress }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(BloodPressDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.bloodPress = bloodPress;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
