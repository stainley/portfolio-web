import React from "react";
import {render} from "@testing-library/react";
import About from "../About";

describe('Renders', ()=>{

    it('About component do not crash', () => {
        render(<About />);
    });

});
