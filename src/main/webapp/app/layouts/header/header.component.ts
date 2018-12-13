import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '../../shared';
import { JhiLanguageHelper, Principal, LoginModalService, LoginService } from 'app/core';
import { JhiLanguageService } from 'ng-jhipster';
import { SessionStorageService } from 'ngx-webstorage';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { VERSION } from 'app/app.constants';
import { ProfileService } from '../profiles/profile.service';

@Component({
    selector: 'jhi-header',
    templateUrl: './header.component.html',
    styleUrls: ['header.css']
})
export class HeaderComponent implements OnInit {
    isNavbarCollapsed: boolean;
    @Input()
    isMobile: boolean;
    languages: any[];
    modalRef: NgbModalRef;
    inProduction: boolean;
    swaggerEnabled: boolean;
    version: string;

    // 初始化的顺序有很多影响!!!
    constructor(
        public settings: SettingsService,
        private loginService: LoginService,
        private languageService: JhiLanguageService,
        private languageHelper: JhiLanguageHelper,
        private sessionStorage: SessionStorageService,
        private principal: Principal,
        private loginModalService: LoginModalService,
        private profileService: ProfileService,
        private router: Router
    ) {
        this.version = VERSION ? 'v' + VERSION : '';
        this.isNavbarCollapsed = true;
    }

    ngOnInit() {
        this.languageHelper.getAll().then(languages => {
            this.languages = languages;
        });

        this.profileService.getProfileInfo().then(profileInfo => {
            this.inProduction = profileInfo.inProduction;
            this.swaggerEnabled = profileInfo.swaggerEnabled;
        });
    }

    changeLanguage(languageKey: string) {
        this.sessionStorage.store('locale', languageKey);
        this.languageService.changeLanguage(languageKey);
    }

    collapseNavbar() {
        this.isNavbarCollapsed = true;
    }

    toggleCollapsedSidebar() {
        this.settings.setLayout('collapsed', !this.settings.layout.collapsed);
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    getImageUrl() {
        return this.isAuthenticated() ? this.principal.getImageUrl() : null;
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    logout() {
        this.collapseNavbar();
        this.loginService.logout();
        this.router.navigate(['']);
    }
}
