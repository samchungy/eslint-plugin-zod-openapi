const skuba = require('eslint-config-skuba');

module.exports = [
  {
    ignores: ['src/rules/**/tests/*-disable-lint*.ts'],
  },
  ...skuba,
];
