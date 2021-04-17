import React from "react";
import {render, screen} from "@testing-library/react";
import About from "../About";

describe('Renders', ()=>{

    it('About component do not crash', () => {
        render(<About />);

        const linkElement = screen.getByText(/About Me/i);
        expect(linkElement).toBeInTheDocument();
    });

});


describe('Logic', ()=>{

    it('when description is null', () => {
        const description = null;

        render(<About description={description}/>);

        const linkElement = screen.getByText('Cannot be null');
        expect(linkElement).toBeInTheDocument();
    });

    it('when description is not null', () => {
        const description = "Description";

        render(<About description={description}/>);

        const linkElement = screen.getByText(description);
        expect(linkElement).toBeInTheDocument();
    });

});
