import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { AppCheck } from '../utils/AppCheck';
import { port } from '../services/port';

import '../styles/presentation.css';
import { VideoHistoryStore } from '../utils/VideoHistoryStore';

const stopVideo = function () {
  setTimeout(() => {
    const iframe = document.querySelector('iframe');
    const video = document.querySelector('video');
    if (iframe) {
      const iframeSrc = iframe.src;
      iframe.src = iframeSrc;
    }
    if (video) {
      video.pause();
    }
  }, 0);
};

const Presentation: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  const [overlayShowing, setOverlayShowing] = React.useState(false);
  const [buttonsEnabled, setButtonsEnabled] = React.useState(0.0);
  const [count, setCount] = React.useState(0);
  const buttonsTimer = React.useRef(0);

  const _buttonsEnabled = React.useRef(buttonsEnabled);
  _buttonsEnabled.current = buttonsEnabled;
  const startEnableButtonsTimer = () => {
    setButtonsEnabled(0.0);
    buttonsTimer.current = setInterval(() => {
      const numSeconds = 4;
      const tick = 16 / 1000 / numSeconds;
      const newVal = Math.min(_buttonsEnabled.current + tick, 1);
      if (newVal >= 1) clearInterval(buttonsTimer.current);
      setButtonsEnabled(newVal);
    }, 16);
  };

  React.useEffect(() => {
    if (!AppCheck.isYoutubeVideo()) return;

    port.onMessage.addListener((msg) => {
      setVisible(true);

      if (msg && msg.remainingVideosCount !== undefined) {
        setCount(Number(msg.remainingVideosCount));
        if (msg.remainingVideosCount <= 0) {
          stopVideo();
          setOverlayShowing(true);
          startEnableButtonsTimer();
        }
      }
    });

    return () => {
      clearInterval(buttonsTimer.current);
    };
  }, []);

  const handleAddTwoVideos = async () => {
    await VideoHistoryStore.addTwoVideosToToday();
    const numRemaining = await VideoHistoryStore.getNumVideosRemaining();
    setTimeout(() => {
      setCount(numRemaining);
      setOverlayShowing(false);
    }, 0);
  };

  const handleDisableForToday = async () => {
    await VideoHistoryStore.disableForToday();
    const numRemaining = await VideoHistoryStore.getNumVideosRemaining();
    setTimeout(() => {
      setCount(numRemaining);
      setOverlayShowing(false);
    }, 0);
  };

  if (!visible) return null;

  const overlay = overlayShowing ? (
    <div className="overlay">
      <div className="large-text">
        <h1>Tube Quota Reached</h1>
        <h3>Hey! We had an agreement here.</h3>
      </div>
      <p>You wanted to escape from the YouTube vortex, well... here we are.</p>
      <div className="divider" />
      <p>So you've got a couple of options:</p>
      <div className="row">
        <div className="col">
          <div className="button-load-indicator primary" style={{ width: `${100 * buttonsEnabled}%` }} />
          <button className="btn primary" disabled={buttonsEnabled < 1} onClick={handleAddTwoVideos}>
            Snooze for 2 more Videos
          </button>
        </div>
        <div className="col">
          <div className="button-load-indicator warning" style={{ width: `${100 * buttonsEnabled}%` }} />
          <button className="btn warning" disabled={buttonsEnabled < 1} onClick={handleDisableForToday}>
            Disable For Rest of Today
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="container">
      <p className="count">{count}</p>
      <p className="desc">Videos Remaining</p>
      {overlay}
    </div>
  );
};

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
