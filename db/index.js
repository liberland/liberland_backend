const MemoryStore = require('koa-session-memory');

const memoryStore = new MemoryStore();

module.exports = {
  memoryStore,
};
