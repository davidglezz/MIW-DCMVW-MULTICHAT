module.exports = class Command {
  constructor(topic, fn, args) {
    this.topic = topic;
    this.fn = fn;
    this.args = args;
  }
}
