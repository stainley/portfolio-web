import React from 'react';
import ReactDOM, {unmountComponentAtNode} from 'react-dom';
import {render} from '@testing-library/react';
import App from "./App";

describe('rendering components', () => {
  let container = null;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  it('renders App component without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App/>, div);
  });

  it('renders App component navbar without crashing', () => {

    const wrapper = render(<App/>)

    const header = wrapper.getByTestId('navbar-test-id');
    expect(header).toBeTruthy();
  });
})
