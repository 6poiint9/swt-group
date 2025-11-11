const Parser = require('/middleware/parser');
const checkauth = require('/middleware/checkauth');
const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/changepassword'), Parser, async (req,res) => {

    try {
    const userId = req.userData.userId;
    const {oldPassword, newPasswordOne, newPasswordTwo} = req.body;

    const user = await authservice.authenticateUser(username, oldPassword);

    if (newPasswordOne != newPasswordTwo){
         return res.status(400).json({message: "Die Beiden neuen Passwörter stimmen nicht überein."})}

    if (newPasswordOne < 10)
    {
        return res.status(400).json({message: "Passwortrichtlinie nicht eingehalten!"})
    }

    if (await changePwservice.changePassword(userId, newPasswordOne)){
        return res.status(200).json({message: "Passwort erfolgreich geändert!"})
    } else {
        return res.status(500).json({message: "Fehler beim Ändern des Passworts!"})
    }

    } catch (error) {
       return res.status(400).json({message: error.message});
    }

}