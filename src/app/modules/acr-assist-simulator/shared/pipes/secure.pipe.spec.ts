import { SecurePipe } from './secure.pipe';

describe('SecurePipe', () => {
  it('create an instance', () => {
    const pipe = new SecurePipe(null, null, null);
    expect(pipe).toBeTruthy();
  });
});
