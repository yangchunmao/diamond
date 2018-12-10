import { Component, OnInit, Input } from '@angular/core';
import { SettingsService } from '../../shared';

@Component({
    selector: 'jhi-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
    @Input()
    isMobile: boolean;

    constructor(public settings: SettingsService) {}

    ngOnInit() {}

    toggleCollapsedSidebar() {
        this.settings.setLayout('collapsed', !this.settings.layout.collapsed);
    }
}
