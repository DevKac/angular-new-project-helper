import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isNullOrUndefined } from 'util';

import { BackEndPath } from '../config';
import { BasicObject } from './basic-object';

export abstract class BasicService {

  constructor (
    protected http: HttpClient
  ) { }

  // STATIC REGION
  protected static getBackEndPath() {
    return BackEndPath;
  }
  private static generateOptionsAndHeader(body: any = null): object {
    // todo: rethink those
    const httpOptions = {
      headers: new HttpHeaders('application/json;charset=UTF-8'),
      withCredentials: true
    };
    if (body) {
      httpOptions['body'] = body;
    }
    return httpOptions;
  }
  private static navigateToGivenEntryPoint(entryPoint: string[], data: any) {
    let dataSource = data;
    if (!isNullOrUndefined(entryPoint) && entryPoint.length) {
      for (const subdata of entryPoint) {
        dataSource = dataSource[subdata];
      }
    }
    return dataSource;
  }
  public static addPagination(page: number, size: number) {
    if (isNullOrUndefined(page) || isNullOrUndefined(size)) {
      throw new Error (BasicService.name + ': addPagination: no pagination data!');
    }
    return 'page=' + page + '&size=' + size;
  }
  public static addSort(sort: string) {
    // todo: some enum?
    if (isNullOrUndefined(sort)) {
      throw new Error (BasicService.name + ': addSort: no sort data!');
    }
    return 'sort=' + sort;
  }
  // End of STATIC REGION
  // PROTECTED REGION
  // End of PROTECTED REGION
  // PRIVATE REGION
  // End of PRIVATE REGION
  // PUBLIC REGION
  // Get elements from given methodUrl and return results (found under the path specified by entryPoint) as an Array of T
  public getAll<T extends BasicObject>(methodUrl: string, type: { new(): T ; }, entryPoint: string[] = ['results']): Promise<T[]> {
    const httpOptions = BasicService.generateOptionsAndHeader();

    return new Promise((resolve, reject) => {
      this.http.get(BackEndPath + methodUrl, httpOptions).subscribe(
        response => {
          // console.log(response);
          const data = JSON.parse(JSON.stringify(response));
          const results = [];
          const dataSource = BasicService.navigateToGivenEntryPoint(entryPoint, data);
          if (dataSource) {
            for (const resultData of dataSource) {
              const newResult = new type();
              newResult.fillDataFromJson(resultData);
              if (newResult) {
                results.push(newResult);
              } else {
                throw new Error(BasicService.name + 'getAll< ' + type.name +  '>: one or more objects could not be loaded');
              }
            }
          } else {
            throw new Error(BasicService.name + ': getAll< ' + type.name +  '>: location specified by entryPoint is null');
          }
          resolve(results);
        },
        error => {
          reject(error);
        }
      );
    });
  }
  // Get one element from given methodUrl and return result (found under the path specified by entryPoint) as an Object of type T
  public getOne<T extends BasicObject>(methodUrl: string, type: { new(): T ; }, entryPoint: string[] = ['result']): Promise<T> {
    const httpOptions = BasicService.generateOptionsAndHeader();

    return new Promise((resolve, reject) => {
      this.http.get(BackEndPath + methodUrl, httpOptions).subscribe(
        response => {
          // console.log(response);
          const data = JSON.parse(JSON.stringify(response));
          const dataSource = BasicService.navigateToGivenEntryPoint(entryPoint, data);
          if (dataSource) {
            const newResult = new type();
            newResult.fillDataFromJson(dataSource);
            if (newResult) {
              resolve(newResult);
            } else {
              throw new Error(BasicService.name + 'getOne< ' + type.name +  '>: one or more objects could not be loaded');
            }
          } else {
            throw new Error(BasicService.name + ': getOne< ' + type.name +  '>: location specified by entryPoint is null');
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }
  // Post new element from given methodUrl and return boolean marking if it was a success
  public postOne<T extends BasicObject>(methodUrl: string, postObject: T, entryPoint: string[] = []): Promise<boolean> {
    const httpOptions = BasicService.generateOptionsAndHeader();

    return new Promise((resolve, reject) => {
      this.http.post(BackEndPath + methodUrl, postObject.castDataToJson(), httpOptions).subscribe(
        response => {
          // console.log(response);
          const data = JSON.parse(JSON.stringify(response));
          const dataSource = BasicService.navigateToGivenEntryPoint(entryPoint, data);
          if (dataSource) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }
  // Post given element from given methodUrl and return boolean marking if it was a success
  public putOne<T extends BasicObject>(methodUrl: string, objectT: T, entryPoint: string[] = []): Promise<boolean> {
    const httpOptions = BasicService.generateOptionsAndHeader();

    return new Promise((resolve, reject) => {
      this.http.put(BackEndPath + methodUrl, objectT.castDataToJson(), httpOptions).subscribe(
        response => {
          // console.log(response);
          const data = JSON.parse(JSON.stringify(response));
          const dataSource = BasicService.navigateToGivenEntryPoint(entryPoint, data);
          if (dataSource) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }
  // Delete element found be id and return boolean marking if it was a success
  public deleteOne<T extends BasicObject>(methodUrl: string, id: string, entryPoint: string[] = []): Promise<boolean> {
    const httpOptionsBody = {
      'id': id
    };
    const httpOptions = BasicService.generateOptionsAndHeader(httpOptionsBody);

    return new Promise((resolve, reject) => {
      this.http.delete(BackEndPath + methodUrl, httpOptions).subscribe(
        response => {
          // console.log(response);
          const data = JSON.parse(JSON.stringify(response));
          const dataSource = BasicService.navigateToGivenEntryPoint(entryPoint, data);
          if (dataSource) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }
  // End of PUBLIC REGION
}
