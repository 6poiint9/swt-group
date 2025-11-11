    const argon2 = require('argon2');
    const User = require('../querie/db_querie')
    
    
    const validatePassword = async(username, password) => {
    const uCheck = validateUsername(username);
    const pCheck = validatePassword(password);

    if (!uCheck.ok || !pCheck.ok) {
      return res.status(401).json({ success: false, message: 'invalid login' });
    }

    // Lookup user in DB
    const user = await User.getUserbyUsername(uCheck.value);
    if (!user) return res.status(401).json({ success: false, message: 'invalid login' });

    // Verify password
    const valid = await argon2.verify(user.password, pCheck.value);
    if (!valid) return res.status(401).json({ success: false, message: 'invalid login' });

    }
    
   module.exports = {
    validatePassword
   };