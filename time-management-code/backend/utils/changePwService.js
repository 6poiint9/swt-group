const argon2 = require('argon2');
const User = require('../models/user');
const changePassword = async(userId, password) => {

    try{
        const hashedPassword = await argon2.hash(password);
        await User.update({ password_hash: hashedPassword}, { where: {id: userId}})
        return true;
    }
    
    catch (error){

    }

 }

 module.exports = {
    changePassword
 };


