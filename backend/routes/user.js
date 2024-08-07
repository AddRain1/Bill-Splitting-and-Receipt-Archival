const express = require('express');
const { body, validationResult } = require("express-validator");
const router = express.Router();

const userAPI = require('../api/usersAPI');
const User = require('../class/userClass');

//get a list of users
//Authorization: Must be logged in. 
router.get('/', async (req, res) => {
    const user_list = userAPI.getUsers();
    return user_list;
});

//create a new user
//Authorization: TODO: Must verify email to successfully create account
router.get('/add', [
    body("username", "username must be under 100 characters")
        .trim()
        .isLength({max: 100})
        .escape(),
    body("first_name", "first_name must be under 100 characters")
        .trim()
        .isLength({max: 100})
        .escape(),
    body("last_name", "last_name must be under 100 characters")
        .trim()
        .isLength({max: 100})
        .escape(),
    body("email", "email must be a valid email")
        .trim()
        .isEmail()
        .escape(),
    body("password", "password must be at least 8 characters")
        .trim()
        .isLength({min: 8})
        .escape(),
    body("profile_description", "profile_description must be 250 characters or less")
        .trim()
        .isLength({max: 250})
        .escape(),
    (req, res, next) => {
      const errors = validationResult(req);
      const user = new User({
        username: req.body.username,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        profile_description: req.body.profile_description,
      });
  
      if (errors.isEmpty()) {
        userAPI.addUser(user);
        
        res.sendStatus(200).json(JSON.stringify(user));
      }
    }
]);

//get information of user with ID
//Authorization: Must be logged in.
router.get('/:id', async (req, res) => {
    const user = userAPI.getUserByID(req.params.id);
    res.sendStatus(200).json(JSON.stringify(user));
});

//update user with ID
//Authorization: Must be logged in as the user being updated
//TODO: Possibly add ability to change email
router.get('/:id/update', [
    body("username", "username must be under 100 characters")
        .trim()
        .isLength({max: 100})
        .escape(),
    body("first_name", "first_name must be under 100 characters")
        .trim()
        .isLength({max: 100})
        .escape(),
    body("last_name", "last_name must be under 100 characters")
        .trim()
        .isLength({max: 100})
        .escape(),
    body("old_password", "old_password must be at least 8 characters")
        .trim()
        .isLength({min: 8})
        .escape(),
    body("new_password", "new_password must be at least 8 characters")
        .trim()
        .isLength({min: 8})
        .escape(),
    body("profile_description", "profile_description must be 250 characters or less")
        .trim()
        .isLength({max: 250})
        .escape(),
    (req, res, next) => {
      const errors = validationResult(req);

      if(req.user != req.params.id) res.sendStatus(401).json({msg: 'Must be logged in as the user being modified.'});
      const user = userAPI.getUserByID(req.user);
  
      if (errors.isEmpty()) {
        if(req.body.new_password) {
            //TODO: unhash user password
            if(req.body.old_password != user.password) res.sendStatus(401).json({msg: 'Old password is incorrect'});
            else userAPI.changeUser(req.params.id, "password", req.body.new_password);
        }

        if(req.body.username) userAPI.changeUser(req.params.id, "username", req.body.username);
        if(req.body.first_name) userAPI.changeUser(req.params.id, "first_name", req.body.first_name);
        if(req.body.last_name) userAPI.changeUser(req.params.id, "last_name", req.body.last_name);
        if(req.body.profile_description) userAPI.changeUser(req.params.id, "profile_description", req.body.profile_description);
        
        res.sendStatus(200).json(JSON.stringify(user));
      }
    }
]);

//delete user with ID
//Authorization: Must be logged in as the user being deleted
//TODO: Add some second check before deleting (enter password? Send email?)
router.get('/:id/delete', async (req, res) => {
    const user = userAPI.getUserByID(req.params.id);
    userAPI.deleteUser(req.params.id);
    res.sendStatus(200).json(JSON.stringify(user));
});

module.exports = router;