import { AppCheck } from '../utils/AppCheck';
import { port } from '../services/port';

import '../ui/presentation';

const notifyNewVideoId = () => {
  const videoId = AppCheck.getYoutubeVideoId();
  port.postMessage({ videoId });
};

// ripped from: https://stackoverflow.com/a/46428962
const listenForUrlChanges = () => {
  let oldHref = document.location.href;
  const bodyList = document.querySelector('body'),
    observer = new MutationObserver((mutations) => {
      mutations.forEach((_mutation) => {
        if (oldHref != document.location.href) {
          oldHref = document.location.href;
          notifyNewVideoId();
        }
      });
    });
  var config = {
    childList: true,
    subtree: true,
  };
  observer.observe(bodyList, config);
};

async function main() {
  try {
    if (!AppCheck.isYoutubeVideo()) {
      console.log('keep being productive, you beatiful human.');
      return;
    }

    notifyNewVideoId();
    listenForUrlChanges();
  } catch (err) {
    console.error(err);
  }
}

main();
