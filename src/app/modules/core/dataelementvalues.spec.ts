import { DataElementValues } from './dataelementvalues';


describe('DataElementValues Class', () => {
    let instance: DataElementValues;
    let values: Map<string, any>;

    beforeEach(() => {
        createValues();
        instance = new DataElementValues(values);
    });

    afterEach(() => {
        instance = undefined;
        values = undefined;
    });

    function createValues() {
        values = new Map<string, any>();
        values.set('intial', '10');
    }

    it('Created the DataElementValues class', () => {
        expect(instance).toBeTruthy();

    });

    it('Called addOrUpdate(key: string , value: any) to add an element', () => {
        const key = 'diameter';
        const value = '10';

        instance.addOrUpdate(key, value);

        const result = instance.get('diameter');
        expect(result).toBeDefined();
        expect(result).toBeTruthy();
        expect(result).toEqual(value);
    });

    it('Called delete(key: string , value: any) with invalid key', () => {
        const key = 'invalid';
        const result = instance.delete(key);

        expect(result).toBeFalsy();
    });

    it('Called delete(key: string , value: any) with valid key', () => {
        const key = 'intial';
        const result = instance.delete(key);

        expect(result).toBeTruthy();
    });

    it('Called getAll() to return all the values', () => {
        const result = instance.getAll();

        expect(result).toBeDefined();
        expect(result).toBeTruthy();
        expect(result.get('intial')).toEqual('10');
    });

    it('Called get(key: string) with invalid value to return specific value', () => {
        const key = 'invalid';
        const result = instance.get(key);

        expect(result).toBeUndefined();
    });
});
