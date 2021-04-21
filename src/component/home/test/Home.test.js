import React from "react";
import Home from "../Home";
import {render} from "@testing-library/react";
import {unmountComponentAtNode} from "react-dom";

describe('Render', ()=> {

    beforeEach(()=> {
        render(<Home />);
    });

    afterEach(() => {
        unmountComponentAtNode(<Home/>)
    });

    it('should renders no crash', () => {

    });
})
