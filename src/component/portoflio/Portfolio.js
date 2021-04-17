import React from 'react';

import './Portfolio.css';

const Portfolio = (props) => {

    return (
        <>
            <div className="ui-portfolio">
                <h3>Portfolio</h3>
                <h1>Environment: {props.environment}</h1>
            </div>
            <div>

            </div>
        </>
    );
}

export default Portfolio;
