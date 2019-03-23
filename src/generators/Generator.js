/**
 * Generator superclass.
 */
export default class Generator {

  /**
   * All generators must implement this method.
   *
   * @returns {Array<Tone.Event>|Array<Array>}
   */
  nextBar() {
    new Error('needs override');
  }
}