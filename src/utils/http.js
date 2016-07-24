
import request from 'superagent';

class http {
  static get(url) {
    let app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
    const promise = new Promise(function(resolve, reject) {
      console.log("is app:", app);
      app = false;
      if (app) {
        cordovaHTTP.get(url, (res) => { console.error(res); resolve(res); }, (err) => { console.error(err); reject(err); });
      } else {
        request.get(url).end((err, res) => {
          if (err) reject(err);
          resolve(res);
        });
      }
    });
    return promise;
  };
};

export default http;
