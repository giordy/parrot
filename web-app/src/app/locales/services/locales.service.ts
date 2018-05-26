
import {share, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { BehaviorSubject ,  Observable } from 'rxjs';



import { APIService } from './../../shared/api.service';
import { Pair, Locale, LocaleInfo, ExportFormat } from './../model';
import { LocalesList, LocaleExportFormats } from './../../app.constants';

@Injectable()
export class LocalesService {

    private _activeLocale = new BehaviorSubject<Locale>(null);
    public activeLocale: Observable<Locale> = this._activeLocale.asObservable();

    private _locales = new BehaviorSubject<Locale[]>([]);
    public locales: Observable<Locale[]> = this._locales.asObservable();

    public get localeInfoList(): LocaleInfo[] {
        return LocalesList;
    }

    public get availableExportFormats(): ExportFormat[] {
        return LocaleExportFormats;
    }

    constructor(private api: APIService) { }

    requestExport(projectId: string, localeIdent: string, format: ExportFormat): Observable<any> {
        return this.api.requestDownload({
            uri: `/projects/${projectId}/locales/${localeIdent}/export/${format.apiIdent}`,
            method: 'GET',
        }).pipe(
            map(blob => {
                FileSaver.saveAs(blob, `${localeIdent}${format.extension}`)
            }));
    }

    createLocale(projectId: string, locale: Locale): Observable<Locale> {
        let request = this.api.request({
            uri: `/projects/${projectId}/locales`,
            method: 'POST',
            body: JSON.stringify(locale),
        }).pipe(
            map(res => {
                let locale = res.payload;
                if (!locale) {
                    throw new Error("no locale in response");
                }
                return locale;
            }
            ),share(),);

        request.subscribe(locale => {
            this._locales.next(this._locales.getValue().concat(locale));
        }, () => { });

        return request;
    }

    updateLocalePairs(projectId: string, localeIdent: string, pairs: Pair[]): Observable<Locale> {
        let request = this.api.request({
            uri: `/projects/${projectId}/locales/${localeIdent}/pairs`,
            method: 'PATCH',
            body: JSON.stringify({'pairs': pairs}),
        }).pipe(
            map(res => {
                let payload = res.payload;
                if (!payload) {
                    throw new Error("no payload in response");
                }
                return payload;
            }),share(),);

        request.subscribe(result => {
            let next = this._locales.getValue().map(loc => {
                return loc.id === result.id ? result : loc
            });
            this._locales.next(next);
            this._activeLocale.next(result);
        }, () => { });

        return request;
    }

    fetchLocales(projectId: string): Observable<Locale[]> {
        let request = this.api.request({
            uri: `/projects/${projectId}/locales/`,
            method: 'GET',
        }).pipe(
            map(res => {
                let locales = res.payload;
                if (!locales) {
                    throw new Error("no locales in response");
                }
                return locales;
            }),share(),);

        request.subscribe(locales => {
            this._locales.next(locales);
        }, () => { });

        return request;
    }

    fetchLocale(projectId: string, localeIdent: string): Observable<Locale> {
        let request = this.api.request({
            uri: `/projects/${projectId}/locales/${localeIdent}`,
            method: 'GET',
        }).pipe(
            map(res => {
                let locale = res.payload;
                if (!locale) {
                    throw new Error("no locale in response");
                }
                return locale;
            }),share(),);

        request.subscribe(result => {
            let current = this._locales.getValue();
            let next = [];

            if (current.length <= 0) {
                next.concat(result);
            } else {
                next = current.map(loc => {
                    return loc.id === result.id ? result : loc
                });
            }

            this._locales.next(next);
            this._activeLocale.next(result);
        }, () => { });

        return request;
    }

    deleteLocale(projectId: string, localeIdent: string): Observable<any> {
        let request = this.api.request({
            uri: `/projects/${projectId}/locales/${localeIdent}`,
            method: 'DELETE'
        }).pipe(
            share());

        request.subscribe(
            () => {
                let locales = this._locales.getValue().filter(_locale => _locale.ident !== localeIdent);
                this._locales.next(locales);
                this._activeLocale.next(null);
            });

        return request;
    }
}
