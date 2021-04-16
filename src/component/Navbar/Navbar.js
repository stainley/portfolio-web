import React from "react";
import NavbarItems from "./NavbarItems";
import Portfolio from "../Portoflio/Portfolio";

const Navbar = (props) => {

    return(
        <>
            <div>NavBar Component {props.child}</div>
            <NavbarItems>
                <Portfolio />
            </NavbarItems>
        </>
    );
};

export default Navbar;
