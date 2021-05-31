import { PORT_NAME } from '../constants';
import { VideoHistoryStore } from '../utils/VideoHistoryStore';

chrome.runtime.onConnect.addListener((port) => {
  console.assert(port.name === PORT_NAME);
  port.onMessage.addListener(async (msg) => {
    if (msg && msg.videoId) {
      await VideoHistoryStore.addVideoId(msg.videoId);
      const remainingVideosCount = await VideoHistoryStore.getNumVideosRemaining();
      const history = await VideoHistoryStore.getHistory();

      console.log('================');
      console.log(`background received videoId: ${msg.videoId}`);
      console.log(`history:`, { history });
      console.log(`remaining: ${remainingVideosCount}`);

      port.postMessage({ remainingVideosCount: remainingVideosCount });
    }
  });
});
