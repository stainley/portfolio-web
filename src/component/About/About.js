import React from "react";

const About = ({title, description}) => {
    let data = null;

    return(
        <div>
            About Me {description === null? 'Cannot be null': <h1>{description}</h1>};
        </div>
    );
};

export default About;
