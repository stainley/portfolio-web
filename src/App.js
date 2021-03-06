import './App.css';

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import About from "./component/about/About";
import Navbar from "./component/navbar/Navbar"
import Portfolio from './component/portoflio/Portfolio'
import Home from './component/home/Home';

const App = () => {

    const personalInformation = {
        "headline": "Title",
        "description": "Description to be complete"
    };

    const envValue = process.env.REACT_APP_ENV;

    return (

        <div className="App">
            <Router>
                <Navbar/>
                <Switch>
                    <Route path="/about">
                        <About
                            description={personalInformation.description}
                            headline={personalInformation.headline}
                        />
                    </Route>
                    <Route path="/portfolio">
                        <Portfolio environment={envValue}/>
                    </Route>
                    <Route path="/">
                        <Home/>
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
