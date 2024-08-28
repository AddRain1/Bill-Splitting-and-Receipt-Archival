const express = require('express');
const { body, validationResult } = require("express-validator");
const router = express.Router();
const Users = require("../class/userClass");

const userAPI = require('../api/usersAPI');
const bcrypt = require('bcrypt');

//get a list of users
//Authorization: Must be logged in. 
router.get('/', async (req, res) => {
    const user_list = await userAPI.getUsers();
    if(!res.headersSent) res.status(200).json(user_list);
});

//get information of user with ID
//Authorization: Must be logged in.
router.get('/:id', async (req, res) => {
    // Check if user logged in is the same as the user being requested
    // if they are the same, user can access everything
    // if they are not, user can only access first name, last name, profile description, user_id, and creation date
    if(req.user.user_id == req.params.id){
        const user = await userAPI.getUserByID(req.params.id);
        if(!res.headersSent) res.status(200).json(JSON.stringify(user));
    }
    else if(req.user.user_id != req.params.id){
        const userInfo = await userAPI.getUserByID(req.params.id);
        const userToSend = new Users(userInfo.username, userInfo.first_name, userInfo.last_name, null, null, userInfo.profile_description, userInfo.creation_date, userInfo.user_id);
        if(!res.headersSent) res.status(200).json(JSON.stringify(userToSend));
    }
    else{
        if(!res.headersSent) res.status(401).json("Unauthorized");
    }
});

//update user with ID
//Authorization: Must be logged in as the user being updated
//TODO: Possibly add ability to change email
router.post('/:id/update', [
    body("username", "username must be under 100 characters")
        .trim()
        .isLength({max: 100})
        .escape()
        .optional(),
    body("first_name", "first_name must be under 100 characters")
        .trim()
        .isLength({max: 100})
        .escape()
        .optional(),
    body("last_name", "last_name must be under 100 characters")
        .trim()
        .isLength({max: 100})
        .escape()
        .optional(),
    body("old_password", "old_password must be at least 8 characters")
        .trim()
        .isLength({min: 8})
        .escape()
        .optional(),
    body("new_password", "new_password must be at least 8 characters")
        .trim()
        .isLength({min: 8})
        .escape()
        .optional(),
    body("profile_description", "profile_description must be 250 characters or less")
        .trim()
        .isLength({max: 250})
        .escape()
        .optional(),
    async (req, res, next) => {
      const errors = validationResult(req);

        if(req.user.user_id != req.params.id) res.status(401).json({msg: 'Must be logged in as the user being modified.'});
        else {
            const user = await userAPI.getUserByID(req.params.id);

            if (errors.isEmpty()) {
                const promises = [];
                if(req.body.new_password && req.body.old_password) {
                    const salt = await bcrypt.genSalt(15);
                    const hashedPassword = await bcrypt.hash(req.body.new_password, salt);
                    const passwordMatch = await bcrypt.compare(req.body.old_password, user.password);
                    if(!passwordMatch) res.status(400).json({msg: 'Old password is incorrect'});
                    else promises.push(userAPI.changeUser(req.params.id, "password", hashedPassword));
                }

                if(req.body.username) {
                    const users = userAPI.getUsers('WHERE username=' + "'" + req.body.username + "'");
                    if(users.length == 0) promises.push(userAPI.changeUser(req.params.id, "username", req.body.username));
                    else res.status(400).json({msg: 'Username is already taken'});
                }
                if(req.body.first_name)promises.push(userAPI.changeUser(req.params.id, "first_name", req.body.first_name));
                if(req.body.last_name) promises.push(userAPI.changeUser(req.params.id, "last_name", req.body.last_name));
                if(req.body.profile_description) {
                    promises.push(userAPI.changeUser(req.params.id, "profile_description", req.body.profile_description));
                }
                Promise.all(promises).then(() => {if(!res.headersSent) res.sendStatus(200);})
            }   
        }
    }
]);

/* //delete user with ID
//Authorization: Must be logged in as the user being deleted
//TODO: Add some second check before deleting (enter password? Send email?)
//TODO: Address objects attached to the user
router.post('/:id/delete', async (req, res) => {
    if(req.user.user_id != req.params.id) res.status(401).json({msg: 'Must be logged in as the user being deleted.'});
    else {
        const user = await userAPI.getUserByID(req.params.id);
        await userAPI.deleteUser(req.params.id);
        if(!res.headersSent) res.status(200).json(JSON.stringify(user));
    }
}); */

module.exports = router;