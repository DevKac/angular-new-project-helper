import { Component, OnInit } from '@angular/core';

import { BasicMessage } from '../basic-message';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent extends BasicMessage implements OnInit {

  constructor () {
    super();
  }

  protected getMsgTypeString(messageType: LoadingMsgType): string {
    // no custom overload
    return null;
  }

  ngOnInit() { }

}

export enum LoadingMsgType {
  loadingData = 'loading-data',
  processingData = 'processing-data',
  savingData = 'saving-data'
}
