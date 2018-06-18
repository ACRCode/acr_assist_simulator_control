import { Dictionary } from './dictionary';
import { FileDetails } from './file-details.model';

describe('Dictionary Class', () => {

  let instance: Dictionary<FileDetails>;
  let fileDetails: FileDetails;
  let result: any;

  beforeEach(() => {
    instance = new Dictionary<FileDetails>();
  });

  afterEach(() => {
    instance = undefined;
    fileDetails = undefined;
    result = undefined;
  });

  it('Created the Dictionary class', () => {
    expect(instance).toBeTruthy();
  });

  it('Called Count() to get the count of current items in empty dictionary', () => {
    result = instance.Count();
    expect(result).toBeDefined();
    expect(result).toEqual(0);
  });

  it('Called Add method to push item into dictionary', () => {
    fileDetails = new FileDetails('sample', 'sample.xml', 'sample content');
    instance.Add(fileDetails.fileLabel, fileDetails);

    result = instance.Count();
    expect(result).toBeDefined();
    expect(result).toEqual(1);
  });

  it('Called Remove method to push item into dictionary', () => {
    fileDetails = new FileDetails('sample', 'sample.xml', 'sample content');

    // Adds item to a dictionary
    instance.Add(fileDetails.fileLabel, fileDetails);

    result = instance.Count();
    expect(result).toBeDefined();
    expect(result).toEqual(1);

    // Removes item to a dictionary
    instance.Remove(fileDetails.fileLabel);

    result = instance.Count();
    expect(result).toBeDefined();
    expect(result).toEqual(0);
  });

  it('Called ContainsKey(key: string) method to check if key exists in a dictionary', () => {
    fileDetails = new FileDetails('sample', 'sample.xml', 'sample content');

    // Adds item to a dictionary
    instance.Add(fileDetails.fileLabel, fileDetails);

    result = instance.ContainsKey(fileDetails.fileLabel);
    expect(result).toBeDefined();
    expect(result).toBeTruthy();
  });

  it('Called Item(key: string) method to return specific item using key', () => {
    fileDetails = new FileDetails('sample', 'sample.xml', 'sample content');

    // Adds item to a dictionary
    instance.Add(fileDetails.fileLabel, fileDetails);

    result = instance.Item(fileDetails.fileLabel);
    expect(result).toBeDefined();
    expect(result).toBeTruthy();

    expect(result.fileLabel).toBeDefined();
    expect(result.fileLabel).toBeTruthy();
    expect(result.fileLabel).toEqual(fileDetails.fileLabel);
    expect(result.fileName).toBeDefined();
    expect(result.fileName).toBeTruthy();
    expect(result.fileName).toEqual(fileDetails.fileName);
    expect(result.fileContents).toBeDefined();
    expect(result.fileContents).toBeTruthy();
    expect(result.fileContents).toEqual(fileDetails.fileContents);
  });

  it('Called Keys() method to return all the keys', () => {
    fileDetails = new FileDetails('sample', 'sample.xml', 'sample content');

    // Adds item to a dictionary
    instance.Add(fileDetails.fileLabel, fileDetails);

    fileDetails = new FileDetails('sample1', 'sample1.xml', 'sample content1');
    instance.Add(fileDetails.fileLabel, fileDetails);

    result = instance.Keys();
    expect(result).toBeDefined();
    expect(result).toBeTruthy();

    expect(result[0]).toBeDefined();
    expect(result[0]).toEqual('sample');
    expect(result[1]).toBeDefined();
    expect(result[1]).toEqual('sample1');
  });

  it('Called Values() method to return all the values', () => {
    fileDetails = new FileDetails('sample', 'sample.xml', 'sample content');

    // Adds item to a dictionary
    instance.Add(fileDetails.fileLabel, fileDetails);

    fileDetails = new FileDetails('sample1', 'sample1.xml', 'sample content1');
    instance.Add(fileDetails.fileLabel, fileDetails);

    result = instance.Values();
    expect(result).toBeDefined();
    expect(result).toBeTruthy();

    result.forEach(element => {
        expect(element).toBeDefined();
        expect(element).toBeTruthy();

        expect(element.fileLabel).toBeDefined();
        expect(element.fileLabel).toBeTruthy();
        expect(element.fileName).toBeDefined();
        expect(element.fileName).toBeTruthy();
        expect(element.fileContents).toBeDefined();
        expect(element.fileContents).toBeTruthy();
    });
  });

});
