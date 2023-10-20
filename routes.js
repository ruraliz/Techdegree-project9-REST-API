'use strict';

const express = require('express');
const { asyncHandler } = require('./middleware/async-handler');
const { User, Course } = require('./models');
const { authenticateUser } = require('./middleware/auth-user');

// Construct a router instance.
const router = express.Router();

// Route that returns a list of users.
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    res.status(200).json({ id: user.id, name: user.firstName, lastName: user.lastName, emailAddress: user.emailAddress});
  }));

// Route that creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res.location('/').status(201).json({ "message": "Account successfully created!" });
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });   
      } else {
        throw error;
      }
    }
  }));
// Route that returns a list of courses.
router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        attributes: ['title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'], 
        include:[
            {
                model: User,
                as: 'courseUser',
                attributes: ['id', 'firstName', 'lastName', 'emailAddress']
            }
        ],
    })
    res.json(courses).status(200);
  }));

//Route that will return the corresponding course
router.get('/courses/:id', asyncHandler(async(req, res) => {
    const course = await Course.findByPk(req.params.id, {
        attributes: ['title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'], 
        include: [{
            model: User,
            as: 'courseUser',
            attributes: ['id', 'firstName', 'lastName', 'emailAddress']
        }]
    });
    if(course){
        res.json(course).status(200);
    } else{
        res.status(404).json({message: `There are no course with id: ${req.params.id}.`})
    }
}));


//Route that will create a new course
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    try {
        let course=  await Course.create(req.body)
      res.location(`courses/${course.id}`).status(201).json({ "message": "Course successfully created!" }).end();
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });   
      } else {
        throw error;
      }
    }
  }));

//Route that will update the corresponding course 
router.post ('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if(course){
            if(course.userId == req.currentUser.id){
                await course.update(req.body)
                res.status(204).end();
            }else{
                res.status(403).json({message: "Access denied."})
            }
        } else{
            res.status(404).json({message: 'The course was not found.'})
        }    
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
          const errors = error.errors.map(err => err.message);
          res.status(400).json({ errors });   
        } else {
          throw error;
        }
      }

}))
//Route that will delete the corresponding course

router.delete ('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if(course){
            if(course.userId == req.currentUser.id){
                await course.destroy();
                res.status(204).end();
            } else{
                res.status(403).json({message: 'Access denied.'})
            }
        }else{
            res.status(404).json({message: 'The course was not found.'})
        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
          const errors = error.errors.map(err => err.message);
          res.status(400).json({ errors });   
        } else {
          throw error;
        }
      }

}))

module.exports = router;