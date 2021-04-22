import React from "react";
import Home from "../Home";
import {render} from "@testing-library/react";

describe('Render', () => {

    beforeEach(() => {
        render(<Home/>);
    });

    it('should renders no crash', () => {
        expect(<Home/>).toBeTruthy();
    });
})
