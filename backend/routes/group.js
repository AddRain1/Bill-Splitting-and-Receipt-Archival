const express = require('express');
const { body, validationResult } = require("express-validator");
const router = express.Router();

const groupAPI = require('../api/groupAPI');
const Group = require('../class/groupClass');
const userAPI = require('../api/usersAPI');
const accessHelper = require('../helpers/access');

//get a list of groups that the user is part of
//Authorization: Must be logged in. Can only see groups that they are a member of. 
router.get('/', async (req, res) => {
    const groups = await accessHelper.get_accessible_groups(req.user.user_id);
    if(!res.headersSent) res.status(200).json(groups);
});

//create a new group
//Authorization: Must be logged in. 
router.post('/add', [
    body("name", "Name must be under 100 characters")
        .trim()
        .isLength({max: 100})
        .escape(),
    body("description", "Description must be under 250 characters")
        .trim()
        .isLength({max: 250})
        .escape(),
    body("members", "Maximum members for a group is 250")
        .trim()
        .isArray({max: 249})
        .escape(),
    async (req, res, next) => {
      const errors = validationResult(req);
      //By default, admin is the user creating the group
      const group = new Group(req.user.user_id, req.body.name, req.body.description);
      req.body.members.push(req.user.user_id);
  
      if (errors.isEmpty()) {
        await groupAPI.addGroup(group, req.body.members);
        if(!res.headersSent) res.status(200).json(group);
      }
    }
]);

//get information of group with ID
//Authorization: Must be a member of the group
router.get('/:id', async (req, res) => {
    if(!accessHelper.check_group_accessible(req.user.user_id, req.params.id)) res.status(401).json({msg: 'User must be a member of the group'});
    else {
        const group = await groupAPI.getGroupByID(req.params.id);
        if(!res.headersSent) res.status(200).json(group);
    }
});

//get members of a group
//Authorization: Must be a member of the group
router.get('/:id/members', async (req, res) => {
    if(!accessHelper.check_group_accessible(req.user.user_id, req.params.id)) res.status(401).json({msg: 'User must be a member of the group'});
    else {
        const members = await groupAPI.getGroup_members(req.params.id);
        if(!res.headersSent) res.status(200).json(members);
    }
});

//add member to a group
//Authorization: Must be an admin of the group
router.post('/:id/members/add', async (req, res) => {
    const group = await groupAPI.getGroupByID(req.params.id);
    const user = await userAPI.getUserByID(req.body.member);
    if(req.user.user_id != group.admin_id) res.status(401).json({msg: 'User must be an admin of the group'});
    else {
        await groupAPI.addGroup_member(req.params.id, req.body.member);
        if(!res.headersSent) res.sendStatus(200);
    }
});

//remove member from a group
//Authorization: Must be an admin of the group
router.post('/:id/members/remove', async (req, res) => {
    const group = await groupAPI.getGroupByID(req.params.id);
    const user = await userAPI.getUserByID(req.body.member);
    if(req.user.user_id != group.admin_id) res.status(401).json({msg: 'User must be an admin of the group'});
    else if(req.user.user_id == req.body.member) res.status(400).json({msg: 'Admin cannot be deleted from the group'});
    else {
        await groupAPI.deleteGroup_member(req.params.id, req.body.member);
        if(!res.headersSent) res.sendStatus(200);
    }
});

//update group with ID
//Authorization: Must be the admin of the group
router.post('/:id/update', [
    body("name", "Name must be under 100 characters")
        .trim()
        .isLength({max: 100})
        .escape()
        .optional(),
    body("description", "Description must be under 250 characters")
        .trim()
        .isLength({max: 250})
        .escape()
        .optional(),
    async (req, res, next) => {
      const errors = validationResult(req);
      const group = await groupAPI.getGroupByID(req.params.id);
  
      if (errors.isEmpty()) {
        const promises = [];
        if(req.user.user_id != group.admin_id) res.status(401).json({msg: 'User must be an admin of the group to make changes'});

        if(req.body.name) promises.push(groupAPI.changeGroup(req.params.id, "name", req.body.name));
        if(req.body.description) promises.push(groupAPI.changeGroup(req.params.id, "description", req.body.description));
        if(req.body.admin_id) {
            const group_members = await groupAPI.getGroup_members(req.params.id);
            if(group_members.filter(m => m.user_id == req.body.admin_id).length == 0) res.status(401).json({msg: 'New admin must be a member of the group'});
            else promises.push(groupAPI.changeGroup(req.params.id, "admin_id", req.body.admin_id));
        }
        
        Promise.all(promises).then(() => {if(!res.headersSent) res.sendStatus(200);})
      }
    }
]);

//delete group with ID
//Authorization: Must be the admin of the group
router.post('/:id/delete', async (req, res) => {
    const group = await groupAPI.getGroupByID(req.params.id);
    if(req.user.user_id != group.admin_id) res.status(401).json({msg: 'User must be an admin'});
    else {
        await groupAPI.deleteGroup(req.params.id);
        if(!res.headersSent) res.status(200).json(JSON.stringify(group));
    }
});

module.exports = router;