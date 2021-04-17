import React, {useState} from "react";
import {MenuItems} from './MenuItems';
import {Link} from 'react-router-dom';
import './Navbar.css';
import {Button} from "./Button/Button";

function Navbar() {

    const [click, setClick] = useState(false)

    const handleClick = () => setClick(!click);
    const name = "Stainley Lebron";

    return (
        <nav data-testid="navbar-test-id" className="NavbarItems">
            <h1 className="navbar-logo">{name}
                <a href="https://www.linkedin.com/in/stainleylebron/"
                   target="_blank"
                   rel="noreferrer">
                    <i id="social" className="fab fa-linkedin"/>
                </a>
                <a href="https://github.com/stainley"
                   target="_blank"
                   rel="noreferrer">
                    <i id="social" className="fab fa-github"/>
                </a>
            </h1>
            <div data-testid="click-icon" className="menu-icon" onClick={handleClick}>
                <i className={click ? 'fas fa-times' : 'fas fa-bars'}/>
            </div>
            <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                {MenuItems.map((item, index) => {
                    return (
                        <li key={index}>
                            <Link to={item.url} className={item.cName}>
                                {item.title}
                            </Link>
                        </li>
                    );
                })}
            </ul>
            <Button>Sign Up</Button>
        </nav>
    );

}

export default Navbar;
