export class Storage {
  public static get<T = any>(key: string): Promise<T> {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(key, (data) => {
        // Pass any observed errors down the promise chain.
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(data && data[key]);
      });
    });
  }

  public static put<T = any>(key: string, value: T): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set({ [key]: value }, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve();
      });
    });
  }
}
