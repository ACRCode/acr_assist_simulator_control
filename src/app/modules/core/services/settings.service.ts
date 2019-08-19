import { throwError as observableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SettingsService {
    private config: object;
    private configUrl = 'assets/config/settings.json';

    constructor(
        private httpService: HttpClient) {
    }

    loadConfiguration() {
        return new Promise((resolve, reject) => {
            this.httpService.get(this.configUrl).pipe(catchError((error: any) => {
                resolve(true);
                return observableThrowError(error.json().error || 'Server error');
            }))
                .subscribe((envResponse: any) => {
                    this.config = envResponse;
                    resolve(true);
                });
        });
    }

    get(key: any) {
        return this.config[`config`][key];
    }
}
