import React from 'react'
import '.LogReg.css'
import user_icon from '../assets/Icons/user_icon.png'
import pass_icon from '../assets/Icons/pass_icon.png'

const [action,setAction] = useState("Login");

const logreg = () => {
    return (
        <div className='container'>
            <div className='header'>
                <div className='text'>Login</div>
                <div className="underline"></div>
            </div>
            <div className='inputs'>
                <div className='input'>
                    <img src="user_icon" alt="" />
                    <input type="text" placeholder='Username'/>
                </div>
                <div className='inputs'>
                    <img src="pass_icon" alt="" />
                    <input type="password" placeholder='Password' />
                </div>
            </div>
            <div className="submit-container">
                <div className="submit">Login</div>
            </div>
        </div>
    )
}
export default logreg;