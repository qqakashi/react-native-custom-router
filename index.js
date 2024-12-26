/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import NewApp from './newapp';
import App from "./App";
import {name as appName} from './app.json';
LogBox.ignoreAllLogs(true)
AppRegistry.registerComponent(appName, () => App);
