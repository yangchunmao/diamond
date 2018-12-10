import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    layout = {
        collapsed: false
    };

    constructor() {}

    setLayout(index: any, val: any) {
        this.layout[index] = val;
    }
}
