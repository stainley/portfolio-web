import React, {useState} from "react";
import {render} from "@testing-library/react";
import Portfolio from "../Portfolio";

beforeEach(() => {
    render(<Portfolio />);
});

describe('renders', () => {

    it('Portfolio component not crash', () => {
        expect(<Portfolio/>).toBeTruthy();
    });
});
