// eslint-disable-next-line @typescript-eslint/no-var-requires
const { dictionaryNew, dictionarySearch } = require('native');

export default class Dictionary {
  private dict: unknown;

  constructor(buffer: Buffer) {
    this.dict = dictionaryNew(buffer);
  }

  search(query: string): string[] {
    return dictionarySearch.call(this.dict, query);
  }
}
