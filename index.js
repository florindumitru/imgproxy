const http = require('http')
const url = require('url')
const fresh = require('fresh')

const proxyheaders = [
  'content-encoding',
  'content-length',
  'content-type',
  'etag',
  'expires',
  'last-modified',
  'vary'
]

module.exports = function (req, res, next) {
  var method = req.method
  if (method === 'OPTIONS') {
    res.statusCode = 204
    res.setHeader('Allow', 'HEAD,GET,OPTIONS')
    res.end()
    return
  }

  if (method !== 'HEAD' && method !== 'GET') {
    res.statusCode = 405
    res.setHeader('Allow', 'HEAD,GET,OPTIONS')
    res.end()
    return
  }

  var uri = req.url.slice(1)
  // if (!uri)
  //   return next(passError(400, 'URL required.'))
  // if (uri[0] === '/')
  //   return next(passError(400, 'URL must start with a /.'))
  // if (url.parse(uri).protocol)
  //   return next(passError(400, 'URL must not have a protocol.'))

  var options = url.parse(uri)
  if (!options.hostname)
    return next(passError(400, 'URL requires a hostname.'))
  if (!options.path)
    return next(passError(400, 'URL requires a path.'))

  var reqheaders = req.headers

  options.agent = false
  options.method = req.method
  options.headers = {
    Accept: reqheaders.accept || 'image/*',
    'User-Agent': reqheaders['user-agent']
  }

  http.request(options)
  .once('error', next)
  .once('response', function (cres) {
    if (cres.statusCode !== 200) {
      next(passError(404, 'Did not receive a 200 status code.'))
      cres.resume()
      return
    }

    var headers = cres.headers
    if (!/^image\//.test(headers['content-type'])) {
      next(passError(404, 'Invalid content type.'))
      cres.resume()
      return
    }

    proxyheaders.forEach(function (field) {
      var value = headers[field]
      if (value)
        res.setHeader(field, value)
    })

    res.setHeader('Cache-Control', headers['cache-control']
      || 'public, max-age=31536000')
    res.setHeader('X-Content-Type-Options', 'nosniff')

    if (fresh(req.headers, res._headers)) {
      cres.resume()
      res.statusCode = 304
      res.end()
    } else if (method === 'HEAD') {
      res.removeHeader('Content-Length')
      cres.resume()
      res.end()
    } else {
      cres.pipe(res)
    }
  })
  .end()
}

function passError(status, message) {
  var err = new Error(message)
  err.status = status
  return err
}