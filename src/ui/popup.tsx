import * as React from 'react';
import * as ReactDOM from 'react-dom';

import '../styles/popup.css';

class Popup extends React.Component {
  render() {
    return (
      <div className="popup-padded">
        <h4>Tube Time Reclaimer</h4>
        <p>Reclaim your life back from the YouTube vortex.</p>
      </div>
    );
  }
}

// --------------

ReactDOM.render(<Popup />, document.getElementById('root'));
