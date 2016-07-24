

const toRad = function(number) {
  return number * Math.PI / 180;
}

class location {
  static getCurrentPosition(success, error, options){
    if (window.device.platform === "Android") {
      return window.GPSLocation.getCurrentPosition(success, error, options);
    }
    return window.navigator.geolocation.getCurrentPosition(success, error, options);
  }
  static calculateDistance(pos1, pos2) {
    console.log(pos1, pos2);
    const R = 6371; // km
    const dLat = toRad(pos2.latitude-pos1.latitude);
    const dLon = toRad(pos2.longitude-pos1.longitude);
    const lat1 = toRad(pos1.latitude);
    const lat2 = toRad(pos2.latitude);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}


export default location;
