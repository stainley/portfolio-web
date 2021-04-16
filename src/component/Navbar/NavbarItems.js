import React from "react";

const NavbarItems = (props) => {
    return (
        <div>
            <button onClick={props.addElement}>Add</button>
        </div>
    );
};

export default NavbarItems;
