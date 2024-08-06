const express = require('express');
const { body, validationResult } = require("express-validator");
const router = express.Router();

const groupAPI = require('../api/groupAPI');
const Group = require('../class/groupClass');
const accessHelper = require('../helpers/access');

//get a list of groups that the user is part of
//Authorization: Must be logged in. Can only see groups that they are a member of. 
router.get('/', async (req, res) => {
    const groups = accessHelper.get_accessible_groups(req.user);
    res.json(JSON.stringify(groups));
});

//create a new group
//Authorization: Must be logged in. 
router.get('/add', [
    body("name", "Name must be under 100 characters")
        .trim()
        .isLength({max: 100})
        .escape(),
    body("description", "Description must be under 250 characters")
        .trim()
        .isLength({max: 250})
        .escape(),
    (req, res, next) => {
      const errors = validationResult(req);
      const group = new Group({
        name: req.body.name,
        description: req.body.description,
        admin_id: req.user
      });
  
      if (errors.isEmpty()) {
        groupAPI.addGroup(group);
        
        res.sendStatus(200).json(JSON.stringify(group));
      }
    }
]);

//get information of group with ID
//Authorization: Must be a member of the group
router.get('/:id', async (req, res) => {
    if(!accessHelper.check_group_accessible(req.user, req.params.id)) res.sendStatus(401).json({msg: 'User must be a member of the group'});
    else {
        const group = groupAPI.getGroupById(req.params.id);
        res.sendStatus(200).json(JSON.stringify(group));
    }
});

//update group with ID
//Authorization: Must be the admin of the group
router.get('/:id/update', [
    async (req, res) => {
        const group_members = groupAPI.getGroup_members(req.params.id);
        if(req.body.admin_id && !(req.body.admin_id in group_members)) {
            res.sendStatus(401).json({msg: 'Admin must be a member of the group'});
        }
    },
    body("name", "Name must be under 100 characters")
        .trim()
        .isLength({max: 100})
        .escape(),
    body("description", "Description must be under 250 characters")
        .trim()
        .isLength({max: 250})
        .escape(),
    (req, res, next) => {
      const errors = validationResult(req);
      const group = groupAPI.getGroupById(req.params.id);
  
      if (errors.isEmpty()) {
        if(req.body.name) groupAPI.changeGroup(req.params.id, "name", req.body.name);
        if(req.body.description) groupAPI.changeGroup(req.params.id, "description", req.body.description);
        if(req.user == group.admin_id && req.body.admin_id) groupAPI.changeGroup(req.params.id, "is_admin", req.body.admin_id);
        
        res.sendStatus(200).json(JSON.stringify(group));
      }
    }
]);

//delete group with ID
//Authorization: Must be the admin of the group
router.get('/:id/delete', async (req, res) => {
    const group = groupAPI.getGroupById(req.params.id);
    if(req.user != group.admin_id) res.sendStatus(401).json({msg: 'User must be an admin'});
    else {
        groupAPI.deleteGroup(req.params.id);
        res.sendStatus(200).json(JSON.stringify(group));
    }
});

module.exports = router;