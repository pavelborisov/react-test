import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import {Provider} from "mobx-react";

import GameLogicStore from "./GameLogicStore";

ReactDOM.render(
    <Provider gameLogicStore={new GameLogicStore()}><App /></Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
