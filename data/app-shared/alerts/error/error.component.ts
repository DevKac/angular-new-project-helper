import { Component, OnInit } from '@angular/core';

import { BasicMessage } from '../basic-message';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent extends BasicMessage implements OnInit {

  constructor () {
    super();
  }

  protected getMsgTypeString(messageType: ErrorMsgType): string {
    switch (messageType) {
      case ErrorMsgType.serverError: {
        return 'COMMON.' + ErrorMsgType.serverError;
      }
      case ErrorMsgType.undefinedError: {
        return 'COMMON.' + ErrorMsgType.undefinedError;
      }
      default: {
        return null;
      }
    }
  }

  ngOnInit() { }

}

export enum ErrorMsgType {
  serverError = 'server-error',
  unauthorizedUser = 'unauthorized-user',
  undefinedError = 'undefined-error',
  undescribedError = 'undescribed-error',
  failedToLoadData = 'loading-data-failed',
  failedToSaveData = 'save-data-failed',
  failedToProcessData = 'processed-data-failed'
}
