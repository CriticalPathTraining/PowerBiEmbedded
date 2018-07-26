import * as React from 'react';
import { render } from 'react-dom';
import App from './components/App';

var component = <App />;
var target  = document.getElementById('react-target');


render(component, target);