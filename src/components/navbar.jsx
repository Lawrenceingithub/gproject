import React from 'react';
import {Link} from 'react-router-dom';
import {ShoppingCart, User, SignIn, SignOut} from 'phosphor-react';
import "./navbar.css";


export const Navbar = () =>{
    return (
        <div className='navbar'>
            <div className='links'>
                <Link to="/"> Shop </Link>
                <Link to="/cart">
                    <ShoppingCart size={32}/>
                </Link>
                <Link to="/user">
                    <User size={32}/>
                </Link>
                <Link to="/login">
                    <SignIn size={32}/>
                </Link>
            </div>
        </div>
    )
}
