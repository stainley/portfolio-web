import React from "react";
import {render, screen} from '@testing-library/react';

import About from '../About';

describe('Render without crash', () => {

    it('About components no crash', () => {
        render(<About />);

        const linkElement = screen.getByText(/About Me/i);
        expect(linkElement).toBeInTheDocument();
    });

});
