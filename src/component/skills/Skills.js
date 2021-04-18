import React from "react";
import {Fragment} from "react";

const Skills = ({skillname}) => {
    return(
        <Fragment>
            <h1>Skills</h1>
            <label htmlFor="skill">Skill</label>
            <input id="skill" type="text" value={skillname} />
            <button  type="button">Add</button>

            {alert(skillname.value)}
        </Fragment>
    );
}

export default Skills;
