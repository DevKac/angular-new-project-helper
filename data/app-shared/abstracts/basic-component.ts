import { OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isNullOrUndefined } from 'util';

import { SharedService } from '../shared.service';
import { BasicMsgType } from '../alerts/basic-message';
import { ErrorMsgType } from '../alerts/error/error.component';
import { LoadingMsgType } from '../alerts/loading/loading.component';
import { SuccessMsgType } from '../alerts/success/success.component';

export abstract class BasicComponent implements OnInit {
  // boolean defining if error is currently on
  error: boolean;
  // error message displayed to the user (after translating of course)
  errorMsg: string | ErrorMsgType;
  // mock for the error msg type, used in order to allow view to use it
  mockForErrorMsgTypeEnum = ErrorMsgType;
  // boolean defining if loading is currently on
  loading: boolean;
  // loading message displayed to the user (after translating of course)
  loadingMsg: string | LoadingMsgType;
  // mock for the loading msg type, used in order to allow view to use it
  mockForLoadingMsgTypeEnum = LoadingMsgType;
  // boolean defining if success is currently on
  success: boolean;
  // success message displayed to the user (after translating of course)
  successMsg: string | SuccessMsgType;
  // mock for the success msg type, used in order to allow view to use it
  mockForSuccessMsgTypeEnum = SuccessMsgType;

  constructor(
    protected translate: TranslateService,
    public sharedService: SharedService
  ) { }

  // PROTECTED REGION
  // each component should have a method of loading or updating it's data
  protected abstract updateDataFromServices();
  // End of PROTECTED REGION
  // PRIVATE REGION
  // show message of a BasicMsgType
  private showMessage(msgType: BasicMsgType, msgToDisplay: any) {
    if (msgType) {
      switch (msgType) {
        case BasicMsgType.loadingMsg: {
          this.loading = true;
          this.loadingMsg = msgToDisplay;
          break;
        }
        case BasicMsgType.errorMsg: {
          this.error = true;
          this.errorMsg = msgToDisplay;
          break;
        }
        case BasicMsgType.successMsg: {
          this.success = true;
          this.successMsg = msgToDisplay;
          break;
        }
        default: {
          throw new Error(BasicComponent.name + ': showMessage: unknown message type');
        }
      }
    } else {
      throw new Error(BasicComponent.name + ': showMessage: msgType can\'t be null');
    }
  }
  // hide message of a BasicMsgType
  private hideMessage(msgType: BasicMsgType) {
    if (msgType) {
      switch (msgType) {
        case BasicMsgType.loadingMsg: {
          this.loading = false;
          this.loadingMsg = null;
          break;
        }
        case BasicMsgType.errorMsg: {
          this.error = false;
          this.errorMsg = null;
          break;
        }
        case BasicMsgType.successMsg: {
          this.success = false;
          this.successMsg = null;
          break;
        }
        default: {
          throw new Error(BasicComponent.name + ': hideMessage:  unknown message type');
        }
      }
    } else {
      throw new Error(BasicComponent.name + ': hideMessage: msgType can\'t be null');
    }
  }
  // End of PRIVATE REGION

  ngOnInit() {
    this.resetAlerts();
    this.updateDataFromServices();
  }

  // PUBLIC REGION
  // hide all alerts unless specified in parameters not to
  public resetAlerts(resetLoading?: boolean, resetError?: boolean, resetSuccess?: boolean) {
    if (resetLoading === true || isNullOrUndefined(resetLoading)) {
      this.hideLoading();
    }
    if (resetError === true || isNullOrUndefined(resetError)) {
      this.hideError();
    }
    if (resetSuccess === true || isNullOrUndefined(resetSuccess)) {
      this.hideSuccess();
    }
  }
  // show loading message with a given text. If display time is specified then hide message after this time
  public showLoading(loadingMsg: string | LoadingMsgType, displayTime: number = 0) {
    this.showMessage(BasicMsgType.loadingMsg, loadingMsg);
    if (displayTime && displayTime > 0) {
      setTimeout(() => {
        this.hideLoading();
      }, displayTime);
    }
  }
  // show error message with a given text. If display time is specified then hide message after this time
  public showError(errorMsg: string | ErrorMsgType, displayTime: number = 0, hideLoading = false) {
    if (hideLoading) {
      this.hideLoading();
    }
    this.showMessage(BasicMsgType.errorMsg, errorMsg);
    if (displayTime && displayTime > 0) {
      setTimeout(() => {
        this.hideError();
      }, displayTime);
    }
  }
  // show success message with a given text. If display time is specified then hide message after this time
  public showSuccess(successMsg: string | SuccessMsgType, displayTime: number = 0, hideLoading = false) {
    if (hideLoading) {
      this.hideLoading();
    }
    this.showMessage(BasicMsgType.successMsg, successMsg);
    if (displayTime && displayTime > 0) {
      setTimeout(() => {
        this.hideSuccess();
      }, displayTime);
    }
  }
  // hide loading message
  public hideLoading() {
    this.hideMessage(BasicMsgType.loadingMsg);
  }
  // hide error message
  public hideError() {
    this.hideMessage(BasicMsgType.errorMsg);
  }
  // hide success message
  public hideSuccess() {
    this.hideMessage(BasicMsgType.successMsg);
  }
// End of PUBLIC REGION
}
