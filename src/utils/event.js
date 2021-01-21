export default class Event {
  constructor() {
    this.stack = [];
  }

  add(callback) {
    this.stack.push(callback);
  }

  notify(args) {
    this.stack.forEach(callback => {
      callback(args);
    })
  }
}