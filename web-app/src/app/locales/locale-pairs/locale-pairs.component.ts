import {Component, Input} from '@angular/core';

import {Locale, Pair} from '../model';
import {LocalesService} from '..';

@Component({
  selector: 'locale-pairs',
  templateUrl: './locale-pairs.component.html',
  styleUrls: ['locale-pairs.component.css']
})
export class LocalePairsComponent {

  @Input()
  set locale(value: Locale) {
    this._locale = value;
    this.pairs = this.transformPairs(value);
  }

  get locale(): Locale {
    return this._locale;
  }

  private _locale: Locale;

  @Input()
  loading = false;
  @Input()
  editable = false;

  public pairs: Pair[];
  private updatePending = false;

  constructor(private localesService: LocalesService) {
    this.commitPair = this.commitPair.bind(this);
  }

  commitPair(pair: Pair) {
    this.updatePending = true;
    // TODO: make this nice.
    this.locale.pairs[pair.key] = pair.value;
    this.localesService.updateLocalePairs(this.locale.project_id, this.locale.ident, this.locale.pairs)
      .subscribe(
        locale => {
          this.locale = locale;
        },
        err => console.log(err),
        () => {
          this.updatePending = false;
        }
      );
  }

  transformPairs(locale: Locale): Array<Pair> {
    if (!locale) {
      return [];
    }
    const pairs = locale.pairs;
    const result: Array<Pair> = [];
    const keys = Object.keys(pairs);
    for (let i = 0; i < keys.length; i++) {
      const pair = {
        key: keys[i],
        value: pairs[keys[i]]
      };
      result.push(pair);
    }
    return result;
  }
}
