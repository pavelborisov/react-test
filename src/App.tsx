import * as React from 'react';

import Field from './Field';

import './App.css';
import { Game } from './Game';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Field w={Game.field.width} h={Game.field.height}/>
      </div>    
      );
  }
}

export default App;
