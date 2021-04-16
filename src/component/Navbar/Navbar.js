import React from "react";
import NavbarItems from "./NavbarItems";

const Navbar = (props) => {

    return(
        <>
            <div>NavBar Component {props.child}</div>
            <NavbarItems />
            <NavbarItems />
        </>
    );
};

export default Navbar;
