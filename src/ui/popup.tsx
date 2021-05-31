import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { port } from '../services/port';

import '../styles/popup.css';
import { VideoHistoryStore } from '../utils/VideoHistoryStore';

class Popup extends React.Component {
  state = {
    numVideosPerDay: 5,
    enabled: true,
  };

  async componentDidMount() {
    const settings = await VideoHistoryStore.getSettings();
    const numVideosPerDay = Number(settings.numVideosPerDay) || 5;
    const enabled = await VideoHistoryStore.isEnabledForToday();
    this.setState({ numVideosPerDay, enabled });
  }

  handleInputBlur: React.FocusEventHandler<HTMLInputElement> = (ev) => {
    const numVideosPerDay = Number(this.state.numVideosPerDay);
    VideoHistoryStore.setSettings({ numVideosPerDay });
  };

  handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    if (this.state[ev.target.name]) {
      this.setState({ [ev.target.name]: Number(ev.target.value) });
    }
  };

  handleCheckboxChange: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    if (this.state[ev.target.name]) {
      this.setState({ [ev.target.name]: Boolean(ev.target.checked) });
    }
    if (ev.target.name === 'enabled') {
      const enabled = Boolean(ev.target.checked);
      if (enabled) {
        VideoHistoryStore.enableForToday();
      } else {
        VideoHistoryStore.disableForToday();
      }
    }
  };

  render() {
    return (
      <div className="popup-padded">
        <h4 className="popup-heading">Tube Time Reclaimer</h4>
        <p className="popup-text">Reclaim your life back from the YouTube vortex.</p>
        <div className="divider" />
        <p className="popup-text">
          <strong>Instructions:</strong>
        </p>
        <p>
          When this extension is enabled, you will be allotted 5 YouTube videos a day. Once you reach the threshold, you
          will start being nagged.
        </p>
        <p>
          <strong>Settings: </strong>
        </p>
        <div>
          <p>
            <label htmlFor="enabled">
              Enabled&nbsp;&nbsp;
              <input
                type="checkbox"
                id="enabled"
                name="enabled"
                onChange={this.handleCheckboxChange}
                checked={Boolean(this.state.enabled)}
              />
            </label>
          </p>
          <p>
            <label htmlFor="numVideosPerDay">
              Daily Video Allotment&nbsp;&nbsp;
              <input
                id="numVideosPerDay"
                name="numVideosPerDay"
                onChange={this.handleInputChange}
                onBlur={this.handleInputBlur}
                value={String(this.state.numVideosPerDay) || ''}
              />
            </label>
          </p>
        </div>
        <p>
          <strong>Coming Soon: </strong>
        </p>
        <ul>
          <li>Updatable watch number</li>
          <li>Snooze feature</li>
          <li>Gamified perks</li>
        </ul>
      </div>
    );
  }
}

// --------------

ReactDOM.render(<Popup />, document.getElementById('root'));
