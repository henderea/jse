const { VarList } = require('./vars');

let dataStore = {
  vars: new VarList()
};

module.exports = { dataStore };
