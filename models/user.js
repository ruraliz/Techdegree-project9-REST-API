'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
    class User extends Model {}
    User.init({
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull:{
                    msg: "First name is required"
                },
                notEmpty:{
                    msg: "Please provide a first name"
                }
            }
        },
        lastName:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull:{
                    msg: "last name is required"
                },
                notEmpty:{
                    msg: "Please provide a last name"
                }
            }
        },
        emailAddress:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
              msg: 'The email address you entered already exists'
            },
            validate: {
              notNull: {
                msg: 'An email address is required'
              },
              notEmpty: {
                msg: 'Please provide an email address'
              },
              isEmail:{
                msg: 'Please provide a valid email address'
              }
            }
        },
        password: {
            type: DataTypes.STRING,  
            allowNull: false,
            validate: {
              notNull: {
                msg: 'A password is required'
              },
              notEmpty: {
                msg: 'Please provide a password'
              },
            },
            set(val) {
              // if ( val === this.password ) {
              const hashedPassword = bcrypt.hashSync(val, 10);
              this.setDataValue('password', hashedPassword);
            }
        }
    }, {sequelize});
    User.associate = (models)=>{
      User.hasMany(models.Course, {
        as: 'courseUser',
        foreignKey:{
          firstName: 'userId',
          allowNull: false,
        }
      })
    }
    return User;
}