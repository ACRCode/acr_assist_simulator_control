export class DataElementValues {

  private values: Map<string, any>;

  constructor(values: Map<string, any>) {
     this.values = values;
  }

  addOrUpdate(key: string , value: any) {
    this.values.set(key, value);
  }

  get(key: string): any {
    return this.values.get(key);
   }

   delete(key: string): any {
    return this.values.delete(key);
   }

   getAll(): Map<string, any> {
    return this.values;
   }

}
