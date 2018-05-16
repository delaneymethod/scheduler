/* eslint-disable import/first */
global.window = {};

import 'mock-local-storage';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

window.localStorage = global.localStorage;

window.sessionStorage = global.sessionStorage;
/* eslint-enable import/first */

configure({ adapter: new Adapter() });
