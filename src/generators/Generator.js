/**
 * Generator superclass.
 */
export default class Generator {
  /**
   * All generators must implement this method.
   *
   * @returns {Array<Object>}
   */
  nextBar() {
    return new Error('needs override');
  }
}
