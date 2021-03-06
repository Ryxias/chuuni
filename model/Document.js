'use strict';

const { STRING, TEXT, DATE, BIGINT } = require('sequelize');

module.exports = (service_container, sequelize) => {

  /**
   * Some silly generic document store
   * You can store things by name and look them up later.  You can also set an expiration.
   */
  const Document = sequelize.define('document', {
    id: {
      type: BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: STRING(255),
      allowNull: false,
    },
    content: {
      type: TEXT,
      allowNull: false,
    },
    expiry: {
      type: DATE,
      allowNull: false,
    },
  }, {
    tableName: 'documents',
    createdAt: 'created',
    updatedAt: 'modified',
    indexes: [
      { fields: ['name'], unique: true },
    ],
    hooks: {},
    instanceMethods: {},
  });

  return Document;
};
