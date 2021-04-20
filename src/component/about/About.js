import React from 'react';
import './About.css';

const About = ({headline, description, lightTextDesc, photo}) => {

    return (
        <div data-testid="id-name" className="about-ui" style={{ height: '85%' }}>
            <span>
                <h1 className="heading">{headline}</h1>
                <p>{description}</p>
            </span>
        </div>
    );
}

export default About;
