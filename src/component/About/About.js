import React from "react";

const About = ({title, description}) => {
    let data = null;

    return(
        <div>
            About Me
            {description === null? <h1>Cannot be null</h1>: <h1>{description}</h1>};
        </div>
    );
};

export default About;
