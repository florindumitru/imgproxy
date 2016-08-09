module.exports = function (prefix) {
  return function (url, callback) {
    var img = document.createElement('img')

    img.src = url

    // Image works
    img.onload = function () {
      callback(null, url)
    }

    // Image didn't work, so proxy
    img.onerror = function () {
      var a = document.createElement('a')
      var img2 = document.createElement('img')

      a.href = url
      url = img2.src = prefix + '/' +
        a.host + a.pathname + a.search + a.hash

      img2.onload = function ()  {
        callback(null, url)
      }

      img2.onerror = function () {
        callback(new Error())
      }
    }
  }
}