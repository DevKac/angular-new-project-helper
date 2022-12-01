import { Input } from '@angular/core';
import { isNullOrUndefined } from 'util';

export abstract class BasicMessage {
  // lang categories from which to find translations
  @Input('categories') categories: string[];
  // text of the message
  @Input('message') message: string | any;

  constructor() { }

  protected abstract getMsgTypeString(messageType: any): string;

  // build message translate code from categories
  public getMsgString() {
    if (isNullOrUndefined(this.message)) {
      return '';
    }
    let stringLang = null;
    // try to use default message function
    stringLang = this.getMsgTypeString(this.message);
    // if default message function returned null use default function
    if (isNullOrUndefined(stringLang)) {
      if (this.categories && this.categories.length) {
        stringLang = '';
        for (const lang of this.categories) {
          stringLang += lang;
          stringLang += '.';
        }
      } else {
        stringLang = 'COMMON.';
      }
      stringLang += this.message;
    }
    return stringLang;
  }
}
export enum BasicMsgType {
  loadingMsg = 'loadingMsg',
  errorMsg = 'errorMsg',
  successMsg = 'successMsg'
}
