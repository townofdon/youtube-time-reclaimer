export class AppCheck {
  public static isYoutubeVideo() {
    const EXPECTED_HOST = 'www.youtube.com';
    const EXPECTED_PATH = '/watch';
    if (window.location.host !== EXPECTED_HOST) return false;
    if (window.location.pathname !== EXPECTED_PATH) return false;
    return true;
  }

  public static getYoutubeVideoId() {
    return window.location.search.split('&')[0].replace('?v=', '');
  }
}
