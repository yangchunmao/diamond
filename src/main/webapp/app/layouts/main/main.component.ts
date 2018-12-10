import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';

import { JhiLanguageHelper } from 'app/core';
import { SettingsService } from '../../shared';

@Component({
    selector: 'jhi-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class JhiMainComponent implements OnInit {
    triggerTemplate = null;
    isMobile = false;
    @ViewChild('trigger')
    customTrigger: TemplateRef<void>;

    constructor(private jhiLanguageHelper: JhiLanguageHelper, private router: Router, public settings: SettingsService) {}

    private getPageTitle(routeSnapshot: ActivatedRouteSnapshot) {
        let title: string = routeSnapshot.data && routeSnapshot.data['pageTitle'] ? routeSnapshot.data['pageTitle'] : 'diamondApp';
        if (routeSnapshot.firstChild) {
            title = this.getPageTitle(routeSnapshot.firstChild) || title;
        }
        return title;
    }

    ngOnInit() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.jhiLanguageHelper.updateTitle(this.getPageTitle(this.router.routerState.snapshot.root));
            }
        });
    }

    changeTrigger(): void {
        this.triggerTemplate = this.customTrigger;
    }
}
