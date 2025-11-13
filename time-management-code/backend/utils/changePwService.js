const argon2 = require('argon2');
const User = require('../querie/db_querie');
const changePassword = async(username, password) => {

    try{
        const hashedPassword = await argon2.hash(password);
        await User.changePasswordByUsername(username, hashedPassword);
        return true;
    }
    
    catch (error){

    }

 }

 module.exports = {
    changePassword
 };


