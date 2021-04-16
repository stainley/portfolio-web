import React from "react";
import NavbarItems from "./NavbarItems";

const Navbar = (props) => {

    const addElement = () => {
        console.log('Clicked');
    }

    return(
        <>
            <div>NavBar Component {props.child}</div>
            <NavbarItems addElement={addElement}/>
            <NavbarItems addElement={addElement}/>
        </>
    );
};

export default Navbar;
