import startOfDay from 'date-fns/startOfDay';
import { Storage } from './Storage';

const STORAGE_KEY_HISTORY = '__TIME_RECLAIMER_STORAGE_KEY_HISTORY__';
const STORAGE_KEY_SETTINGS = '__TIME_RECLAIMER_STORAGE_KEY_SETTINGS__';

type Settings = {
  numVideosPerDay: number;
  disabled: {
    [key: string]: boolean;
  };
};

type HistoryMap = {
  [key: string]: string[];
};

const defaultSettings: Settings = {
  numVideosPerDay: 5,
  disabled: {},
};
const defaultHistory: HistoryMap = {};

export class VideoHistoryStore {
  public static async setSettings(settings: Partial<Settings>): Promise<void> {
    const existing = await Storage.get<Settings>(STORAGE_KEY_SETTINGS);
    const merged = { ...existing, ...settings };
    await Storage.put<Settings>(STORAGE_KEY_SETTINGS, merged);
  }

  public static async getSettings(): Promise<Settings> {
    const settings = (await Storage.get<Settings>(STORAGE_KEY_SETTINGS)) || defaultSettings;
    return settings;
  }

  public static async getHistory(): Promise<HistoryMap> {
    const history = (await Storage.get<HistoryMap>(STORAGE_KEY_HISTORY)) || defaultHistory;
    return history;
  }

  public static async addVideoId(videoId: string): Promise<void> {
    const timestamp = VideoHistoryStore.timestamp();
    const history = await VideoHistoryStore.getHistory();
    if (!history[timestamp]) {
      history[timestamp] = [];
    }
    if (!history[timestamp].some((item) => item === videoId)) {
      history[timestamp].push(videoId);
    }
    await Storage.put<HistoryMap>(STORAGE_KEY_HISTORY, history);
  }

  public static async addTwoVideosToToday() {
    const settings = await VideoHistoryStore.getSettings();
    await VideoHistoryStore.setSettings({
      ...settings,
      numVideosPerDay: settings.numVideosPerDay + 2,
    });
  }

  public static async isEnabledForToday() {
    const settings = await VideoHistoryStore.getSettings();
    const timestamp = VideoHistoryStore.timestamp();
    return !Boolean(settings.disabled[timestamp]);
  }

  public static async enableForToday() {
    const settings = await VideoHistoryStore.getSettings();
    const timestamp = VideoHistoryStore.timestamp();
    const disabled = { ...settings.disabled, [timestamp]: false };
    await VideoHistoryStore.setSettings({ ...settings, disabled });
  }

  public static async disableForToday() {
    const settings = await VideoHistoryStore.getSettings();
    const timestamp = VideoHistoryStore.timestamp();
    const disabled = { ...settings.disabled, [timestamp]: true };
    await VideoHistoryStore.setSettings({ ...settings, disabled });
  }

  public static async getNumVideosRemaining() {
    const settings = await VideoHistoryStore.getSettings();
    const history = await VideoHistoryStore.getHistory();
    const timestamp = VideoHistoryStore.timestamp();
    const historyToday = history[timestamp];
    const numVideosWatched = historyToday ? historyToday.length : 0;
    const { numVideosPerDay = defaultSettings.numVideosPerDay, disabled = {} } = settings;
    const isDisabled = disabled[timestamp];
    if (isDisabled) {
      return 999;
    }
    return Math.max(numVideosPerDay - numVideosWatched, 0);
  }

  private static timestamp(): number {
    return startOfDay(new Date()).getTime();
  }
}
