import {Injectable} from '@angular/core';
import * as FileSaver from 'file-saver';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import {APIService} from './../../shared/api.service';
import {ExportFormat, Locale, LocaleInfo, Pair} from './../model';
import {LocaleExportFormats, LocalesList} from './../../app.constants';

@Injectable()
export class LocalesService {

  private _referenceLocale = new BehaviorSubject<Locale>(null);
  private _activeLocale = new BehaviorSubject<Locale>(null);
  public referenceLocale: Observable<Locale> = this._referenceLocale.asObservable();
  public activeLocale: Observable<Locale> = this._activeLocale.asObservable();

  private _locales = new BehaviorSubject<Locale[]>([]);
  public locales: Observable<Locale[]> = this._locales.asObservable();

  public get localeInfoList(): LocaleInfo[] {
    return LocalesList;
  }

  public get availableExportFormats(): ExportFormat[] {
    return LocaleExportFormats;
  }

  constructor(private api: APIService) {
  }

  requestExport(projectId: string, localeIdent: string, format: ExportFormat): Observable<any> {
    return this.api.requestDownload({
      uri: `/projects/${projectId}/locales/${localeIdent}/export/${format.apiIdent}`,
      method: 'GET',
    })
      .map(blob => {
        FileSaver.saveAs(blob, `${localeIdent}${format.extension}`);
      });
  }

  createLocale(projectId: string, locale: Locale): Observable<Locale> {
    const request = this.api.request({
      uri: `/projects/${projectId}/locales`,
      method: 'POST',
      body: JSON.stringify(locale),
    })
      .map(res => {
          const loc = res.payload;
          if (!loc) {
            throw new Error('no locale in response');
          }
          return loc;
        }
      ).share();

    request.subscribe(loc => {
      this._locales.next(this._locales.getValue().concat(loc));
    }, () => {
    });

    return request;
  }

  updateLocalePairs(projectId: string, localeIdent: string, pairs: Pair[]): Observable<Locale> {
    const request = this.api.request({
      uri: `/projects/${projectId}/locales/${localeIdent}/pairs`,
      method: 'PATCH',
      body: JSON.stringify({'pairs': pairs}),
    })
      .map(res => {
        const payload = res.payload;
        if (!payload) {
          throw new Error('no payload in response');
        }
        return payload;
      }).share();

    request.subscribe(result => {
      const next = this._locales.getValue().map(loc => {
        return loc.id === result.id ? result : loc;
      });
      this._locales.next(next);
      this._activeLocale.next(result);
    }, () => {
    });

    return request;
  }

  fetchLocales(projectId: string): Observable<Locale[]> {
    const request = this.api.request({
      uri: `/projects/${projectId}/locales/`,
      method: 'GET',
    })
      .map(res => {
        const locales = res.payload;
        if (!locales) {
          throw new Error('no locales in response');
        }
        return locales;
      }).share();

    request.subscribe(locales => {
      this._locales.next(locales);
    }, () => {
    });

    return request;
  }

  fetchLocale(projectId: string, localeIdent: string): Observable<Locale> {
    const request = this.api.request({
      uri: `/projects/${projectId}/locales/${localeIdent}`,
      method: 'GET',
    })
      .map(res => {
        const locale = res.payload;
        if (!locale) {
          throw new Error('no locale in response');
        }
        return locale;
      }).share();

    request.subscribe(result => {
      const current = this._locales.getValue();
      let next = [];

      if (current.length <= 0) {
        next.concat(result);
      } else {
        next = current.map(loc => {
          return loc.id === result.id ? result : loc;
        });
      }

      this._locales.next(next);
      this._activeLocale.next(result);
    }, () => {
    });

    return request;
  }

  fetchReferenceLocale(projectId: string): Observable<Locale> {
    const request = this.api.request({
      uri: `/projects/${projectId}/locales/en_US`,
      method: 'GET',
    })
      .map(res => {
        const locale = res.payload;
        if (!locale) {
          throw new Error('no locale in response');
        }
        return locale;
      }).share();

    request.subscribe(result => {
      this._referenceLocale.next(result);
    }, () => {
    });

    return request;
  }

  deleteLocale(projectId: string, localeIdent: string): Observable<any> {
    const request = this.api.request({
      uri: `/projects/${projectId}/locales/${localeIdent}`,
      method: 'DELETE'
    })
      .share();

    request.subscribe(
      () => {
        const locales = this._locales.getValue().filter(_locale => _locale.ident !== localeIdent);
        this._locales.next(locales);
        this._activeLocale.next(null);
      });

    return request;
  }
}
