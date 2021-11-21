import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Header from './components/Header'
import Atendimentos from './components/Atendimentos'
import Prescricao from './components/Prescricao';
import Procedimentos from './components/Procedimentos';

class App extends Component
{
    render() {
        return(
          <Router>
            <div className="container">
              <Header/>
              <Switch>
                <Route path='/' component={Atendimentos} exact/>
              </Switch>
              <Switch>
                <Route path='/prescricoes/:id' component={Prescricao} exact/>
              </Switch>
              <Switch>
                <Route path='/procedimentos/:id' component={Procedimentos} exact/>
              </Switch>
            </div>
          </Router>
        )
    }
}
export default App