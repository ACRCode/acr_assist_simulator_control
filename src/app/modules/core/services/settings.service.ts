import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';


@Injectable()
export class SettingsConfig {
    private settings: Object;
    private configUrl = 'assets/config/settings.json';

    constructor(private httpService: Http) {
    }

    load() {
        return new Promise((resolve, reject) => {
            this.httpService.get(this.configUrl)
                .map(res => res.json())
                .subscribe((env_data) => {
                    this.settings = env_data;
                    resolve(true);
                });
        });
    }

    get(key: any) {
        return this.settings['config'][key];
    }
}