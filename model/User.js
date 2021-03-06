'use strict';

const { STRING, TEXT, DATE, BIGINT } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (service_container, sequelize) => {
  const User = sequelize.define('user', {
    id: {
      type: BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: STRING(255),
      allowNull: true,
    },
    email: {
      type: STRING(180),
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
        len: [0, 50],
      },
    },
    auth: {
      type: STRING(180),
    },
  }, {
    tableName: 'users',
    createdAt: 'created',
    updatedAt: 'modified',
    indexes: [
      { fields: ['email'], unique: true },
      { fields: ['created'] },
    ],
    hooks: {},
    instanceMethods: {
      // WARNING INSTANCE METHODS REMOVED IN v4!!!!
    },
    underscored: true,
  });

  //Return a Promise to return true or false
  User.prototype.verifyPassword = function(password) {
    if (!this.auth) {
      throw new Error('This account does not have a password set.  Please reset the password.');
    }
    return bcrypt.compareAsync(password, this.auth);
  };

  //returns a Promise to set the password and save to db
  User.prototype.setPasswordAndSave = function(new_password) {
    return this.setPassword(new_password)
      .then(() => this.save());
  };

  //returns a Promise to set the password
  User.prototype.setPassword = function(new_password) {
    return bcrypt.genSaltAsync(10)
      .then(salt => bcrypt.hashAsync(new_password, salt))
      .then(hash => {
        this.auth = hash;
      });
  };

  User.prototype.publish = function() {
    return {
      class: 'user',
      id: this.id,
      username: this.username,
      email: this.email,
    }
  };

  User.prototype.getUsername = function() {
    return this.username || this.email;
  };

  return User;
};
