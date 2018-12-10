import { Component, OnInit, Input } from '@angular/core';
import { SettingsService } from '../../shared';
import { Router } from '@angular/router';

@Component({
    selector: 'jhi-sidebar',
    templateUrl: './sidebar.component.html',
    styles: []
})
export class SidebarComponent implements OnInit {
    @Input()
    isMobile: boolean;

    constructor(public settings: SettingsService, private router: Router) {}

    ngOnInit() {}

    tabClick(commands) {
        this.router.navigate([commands]);
    }
}
