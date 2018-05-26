
import {of as observableOf,  Observable } from 'rxjs';

export class TranslateServiceStub {

	setDefaultLang(key: any): any {
		return observableOf(key);
	}

	getBrowserCultureLang(key: any): any {
		return observableOf(key);
	}

	use(key: any): any {
		return observableOf(key);
	}
}
