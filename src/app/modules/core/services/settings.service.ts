import { throwError as observableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SettingsConfig {
    private _config: Object;
    private configUrl = 'assets/config/settings.json';

    constructor(private httpService: HttpClient) {
    }

    load() {
        return new Promise((resolve, reject) => {
            this.httpService
                .get(this.configUrl).pipe(catchError((error: any) => {
                    resolve(true);
                    return observableThrowError(error.json().error || 'Server error');
                }))
                .subscribe((envResponse: any) => {
                    this.configUrl = envResponse;
                    resolve(true);
                });
        });
    }

    get(key: any) {
        return this._config[key];
    }
}