
# Angular New Project Helper

## Usage

Aim of this project is to help with quicker start-up of new Angular project. After calling "ng new project-name" navigate to this project directory. From directory of this project call "./angular-new-project-helper.sh". There  is a required parameter "-p" or "--path" which contains path to the new project.

**Optional parameters:**
You can add "-s" or "--style" to define if your project is using and preprocessor. E.g. if your app is using less add --style=less to the call.

## Post-install requirements

This helper tries to avoid changing files that already exist in the project, e.g. app.module.ts. As a result a number of additional changes are required.

### Font Awesome

[Link to the package](https://www.npmjs.com/package/angular-font-awesome)

**Import the module**

```typescript
//...
import { AngularFontAwesomeModule } from 'angular-font-awesome';
@NgModule({
  //...
  imports: [
    //...
    AngularFontAwesomeModule
  ],
  //...
})
export class AppModule { }
```

**Add the font-awesome CSS to styles inside the angular.json**

```json
"styles": [
	"node_modules/font-awesome/css/font-awesome.css",
  "styles.css"  
],
```

*NOTE: If using any preprocessor just change the css to correct extension, e.g. scss*

### Ngx translate

[Link to the package](https://github.com/ngx-translate/core)

**Import the TranslateModule**

```typescript
//...
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
  // return new TranslateHttpLoader(http, BackEndPath + '/api/assets/i18n/', '.json');
}

@NgModule({
    imports: [
        //...
        HttpClientModule,
        TranslateModule.forRoot({
		      loader: {
		        provide: TranslateLoader,
		        useFactory: HttpLoaderFactory,
		        deps: [HttpClient]
		      }
		    }),
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

*NOTE: Default (en and pl) json files were already added to /api/assets/i18n*

**Import TranslateService in app.component.ts**

```typescript
//...
import { TranslateService } from '@ngx-translate/core';

//...

export class AppComponent {
  title = 'app';

  constructor (
    private translate: TranslateService
  ) {
    translate.addLangs(['en', 'pl']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|pl/) ? browserLang : 'pl');
  }
}
```

## Example of usage

### Component

Simple demo of a basic container

```typescript
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { BasicComponent } from '../app-shared/abstracts/basic-component';
import { SharedService } from '../app-shared/shared-service';
import { ErrorMsgType } from '../app-shared/alerts/error/error.component';
import { LoadingMsgType } from '../app-shared/alerts/loading/loading.component';
import { SuccessMsgType } from '../app-shared/alerts/success/success.component';
import { TestObject } from './test-object';
import { TestServiceService } from './test-service.service';
import { TimeHowLongToShowAlerts } from '../app-shared/config';

//...

export class TestComponentComponent extends BasicComponent implements OnInit {
	public listOfObjects: TestObject[];

  constructor(
    protected translate: TranslateService,
    private testService: TestServiceService,
    public sharedService: SharedService
  ) {
    super(translate, sharedService);
  }

  // PROTECTED REGION
  protected updateDataFromServices() {
    this.showLoading(LoadingMsgType.loadingData);
    this.testService.getListOfTestObjects().then(
      result => {
        this.listOfObjects = result;
        this.showSuccess(SuccessMsgType.loadedData, TimeHowLongToShowAlerts, true);
      }, error => {
        console.log(error);
        this.showError(ErrorMsgType.serverError, TimeHowLongToShowAlerts, true);
      }
    );
  }
  // End of PROTECTED REGION

  ngOnInit() {
  	// this is not necessary
  	this.resetAlerts();
  	this.updateDataFromServices();
  }

	// PUBLIC REGION
  // End of PUBLIC REGION

}

```

```html
<!-- Container for loading -->
<ng-container *ngIf="loading; else not_loading">
  <app-loading [message]="loadingMsg"
               [categories]="[]"
  ></app-loading>
</ng-container>
<ng-template #not_loading>
	<!-- Data of your component while loading is done -->
</ng-template>
<!-- End of Container for loading -->
<!-- Information about error -->
<div *ngIf="error">
  <app-error
    [message]="errorMsg"
    [categories]="[]"
  ></app-error>
</div>
<!-- End of Information about error -->
<!-- Information about success -->
<div *ngIf="success">
  <app-success
    [message]="successMsg"
    [categories]="[]"
  ></app-success>
</div>
<!-- End of Information about success -->
```

### Model

Simple demo of a basic object

```typescript
import { BasicObject } from '../app-shared/abstracts/basic-object';

export class TestObject extends BasicObject {
	constructor() {
    super();
  }

  public fillDataFromJson(json: any) {
    // console.log(json);
    if (json) {
      const data = JSON.parse(JSON.stringify(json));
      if (data) {
        this._id = data._id;
        for (const val of Object.keys(data.metadata)) {
          // add some values
        }
      } else {
        throw new Error('No data to fill from');
      }
    } else {
      throw new Error('Data is null in fillDataFromJson for ' + TestObject.name);
    }
    // console.log(this);
  }
  public castDataToJson() {
    return {
      'id': this.id
    };
  }
}
```

### Service

Simple demo of a basic service

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isNullOrUndefined } from 'util';

import { BasicService } from '../app-shared/abstracts/basic-service';
import { TestObject } from './test-object';

@Injectable({
  providedIn: 'root'
})
export class TestServiceService extends BasicService {

  constructor(protected http: HttpClient) {
    super(http);
  }

  // PUBLIC REGION
  public getListOfTestObjects(): Promise<TestObject[]> {
    const methodUrl = '/api/test-objects';

    return this.getAll<TestObject>(methodUrl, TestObject);
  }
  public getOneTestObject(id: string): Promise<TestObject> {
    if (isNullOrUndefined(id)) {
      throw new Error('Get ' + TestObject.name + ' error: id is empty');
    }
    const methodUrl = '/api/test-object/' + id;

    return this.getOne<TestObject>(methodUrl, TestObject);
  }
  public addNewTestObject(newTestObject: TestObject): Promise<boolean> {
    const methodUrl = '/api/test-object';

    return this.postOne<TestObject>(methodUrl, newTestObject);
  }
  public updateTestObject(editTestObject: TestObject): Promise<boolean> {
    const methodUrl = '/api/test-object';

    return this.putOne<TestObject>(methodUrl, editTestObject);
  }
  public removeDynamicObject(testObjectToDelete: TestObject): Promise<boolean> {
    const methodUrl = '/api/test-object';
    if (isNullOrUndefined(testObjectToDelete) || isNullOrUndefined(testObjectToDelete.id)) {
      throw new Error('Delete ' + TestObject.name + ' error: id is empty');
    }

    return this.deleteOne<TestObject>(methodUrl, testObjectToDelete.id);
  }
  // End of PUBLIC REGION
}
```

## Connecting to Back-End

By default app uses path defined in src/app/app-shared/config.ts. Alternatively it can use proxy as defined in proxy.conf.json. In that case add --proxy-config proxy.conf.json" to "npm start" command and set BackEndPath in src/app/app-shared/config.ts to empty string.