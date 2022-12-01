import { isNullOrUndefined } from 'util';

export abstract class BasicObject {
  // id of this element, I assume all elements from BE have some id
  protected _id: string;
  public get id(): string {
    return this._id;
  }
  public set id(value: string) {
    if (isNullOrUndefined(this._id)) {
      this._id = value;
    } else {
      throw new Error(BasicObject.name + ': changing id is not permitted!');
    }
  }

  // each object must be able to load it's data from json from BE
  public abstract fillDataFromJson(json: any);
  // each object must be able to cast it's data into body to be sent to BE
  public abstract castDataToJson(): object | string;
}
