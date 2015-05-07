import React from 'react';
import {root} from 'baobab-react/decorators';
import Lanes from './Lanes';
import persist from '../decorators/persist';
import storage from '../libs/storage';
import appActions from '../actions/AppActions';
import tree from './tree';

@persist(tree, storage, 'app')
@root(tree)
export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.actions = appActions(tree);
  }
  render() {
    return (
      <div className='app'>
        <div className='controls'>
          <button onClick={this.actions.createLane.bind(null, 'New lane')}>
            Add lane
          </button>
        </div>
        <Lanes />
      </div>
    );
  }
}
