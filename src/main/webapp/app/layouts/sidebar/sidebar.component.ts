import { Component, OnInit, Input } from '@angular/core';
import { SettingsService } from '../../shared';
import { Router } from '@angular/router';
import { ProfileService } from '../profiles/profile.service';

@Component({
    selector: 'jhi-sidebar',
    templateUrl: './sidebar.component.html',
    styles: []
})
export class SidebarComponent implements OnInit {
    @Input()
    isMobile: boolean;
    inProduction: boolean;
    swaggerEnabled: boolean;

    constructor(public settings: SettingsService, private router: Router, private profileService: ProfileService) {}

    ngOnInit() {
        this.profileService.getProfileInfo().then(profileInfo => {
            this.inProduction = profileInfo.inProduction;
            this.swaggerEnabled = profileInfo.swaggerEnabled;
        });
    }

    tabClick(commands) {
        this.router.navigate([commands]);
    }
}
