import React from "react";
import ReactDOM from 'react-dom';
import About from "../About";
import {render} from "@testing-library/react";


describe('About Component Testing', () => {

    it('should not crashing', () => {
        const div = document.createElement("div");
        ReactDOM.render(<About />, div);
    });

    it('should has name component', () => {

        render(<About />).getByTestId('id-name');
    });
});
