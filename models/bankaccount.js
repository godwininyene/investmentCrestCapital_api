"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BankAccount extends Model {
    static associate(models) {
      // Define association to User
      BankAccount.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }

  BankAccount.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A bank account must belong to a user",
          },
          notEmpty: {
            msg: "A bank account must belong to a user",
          },
        },
      },
      bankName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please provide bank name",
          },
          notEmpty: {
            msg: "Please provide bank name",
          },
        },
      },
      accountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please provide account number",
          },
          notEmpty: {
            msg: "Please provide account number",
          },
        },
      },
      accountName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please provide account name",
          },
          notEmpty: {
            msg: "Please provide account name",
          },
        },
      },
      accountType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "BankAccount",
    }
  );

  return BankAccount;
};