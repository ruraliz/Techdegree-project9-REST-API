'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Course extends Model {
    }
    Course.init({
        title:{
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notNull:{
                    msg: 'Must provide a title'
                },
                notEmpty:{
                    msg: 'Please provide a title'
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate:{
                notNull:{
                    msg: 'Must provide a description'
                },
                notEmpty:{
                    msg: 'Please provide a course description'
                }
            }
        },
        estimatedTime:{
            type: DataTypes.STRING,
        },
        materialsNeeded:{
            type: DataTypes.STRING,
        },
    }, {sequelize})
    Course.associate = (models) =>{
        Course.belongsTo(models.User, {
            as: 'courseUser',
            foreignKey:{
                fieldName: 'userId',
                allowNull: false
            }
        })
    }
    return Course;
}