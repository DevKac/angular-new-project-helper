import { Component, OnInit } from '@angular/core';

import { BasicMessage } from '../basic-message';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent extends BasicMessage implements OnInit {

  constructor () {
    super();
  }

  protected getMsgTypeString(messageType: SuccessMsgType): string {
    // no custom overload
    return null;
  }

  ngOnInit() { }

}

export enum SuccessMsgType {
  loadedData = 'loaded-data',
  processedData = 'processed-data',
  savedData = 'saved-data'
}
