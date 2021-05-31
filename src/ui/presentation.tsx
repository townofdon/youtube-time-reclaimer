import * as React from 'react';
import * as ReactDOM from 'react-dom';

import '../styles/presentation.css';

class Presentation extends React.Component {
  render() {
    return (
      <div className="container">
        <p className="count">5</p>
        <p className="desc">Videos Remaining</p>
      </div>
    );
  }
}

try {
  // dynamically mount a react app
  const REACT_ROOT_ID = '__ext_time_reclaimer_react_root__';
  const body = document.querySelector('body');
  const reactRoot = document.createElement('div');
  reactRoot.id = REACT_ROOT_ID;
  body.appendChild(reactRoot);
  ReactDOM.render(<Presentation />, document.getElementById(REACT_ROOT_ID));
} catch (err) {
  console.error(err);
}
