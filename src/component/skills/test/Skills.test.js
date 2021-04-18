import React from "react";
import {render, screen} from "@testing-library/react";
import Skills from "../Skills";
import userEvent from "@testing-library/user-event";

beforeEach(() => {
    render(<Skills />);
});


describe('renders', () => {

    it('skill component not crash', () => {
        userEvent.type(screen.getByRole('textbox'), 'Hello World');
        expect(screen.getByRole('textbox')).toHaveValue('Hello World');
    });


});


describe('Logic', () => {

    it('skill component not crash', () => {
        userEvent.type(screen.getByRole('textbox'), 'Hello World');
        expect(screen.getByRole('textbox')).toHaveValue('Hello World');
    });
});
