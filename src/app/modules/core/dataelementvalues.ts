export class DataElementValues {

  private values: Map<string, any>;

  constructor(values: Map<string, any>) {
     this.values = values;
  }

  addOrUpdate(key: string , value: any) {
    this.values[key] = value;
  }

  get(key: string): any {
    return this.values[key];
   }

   delete(key: string): any {
    return this.values.delete(key);
   }

   getAll(): Map<string, any> {
    return this.values;
   }

}
