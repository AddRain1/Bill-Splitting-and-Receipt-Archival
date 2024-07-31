import express from 'express';
import { Friends } from './friendClass.js';
import friendsAPI from './friendsAPI.js';
import mysql from 'mysql2/promise';

const app = express();

app.get('/allFriends', async (req, res) => {
    const friends = await friendsAPI.getAllFriends();
    res.send(friends);
});

app.get('/getfriendbyid/:id', async (req, res) => {
    console.log(req.params.id);
    const friends = await friendsAPI.getFriendById(req.params.id);
    res.send(friends);
});

app.get('/addfriend', async (req, res) => {
    await friendsAPI.addFriend('20200101000000', '20210101000000');
    const friends = await friendsAPI.getAllFriends();
    res.send(friends);
})

app.get('/addanotherfriend', async (req, res) => {
    await friendsAPI.addFriend('20210101000000', '20200101000000');
    const friends = await friendsAPI.getAllFriends();
    res.send(friends);  
})

app.get('/acceptfriend', async (req, res) => {
    await friendsAPI.acceptAddFriend('20200101000000', '20210101000000');
    const friends = await friendsAPI.getAllFriends();
    res.send(friends);
})

app.get('/deletefriend', async (req, res) => {
    await friendsAPI.deleteFriend('20200101000000', '20210101000000');
    const friends = await friendsAPI.getAllFriends();
    res.send(friends);
})

app.listen(3000);