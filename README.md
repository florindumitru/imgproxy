# iproxy [![Build Status](https://travis-ci.org/expressjs/iproxy.png)](https://travis-ci.org/expressjs/iproxy)

This is an image proxy for node.js/browser.
This library is full-stack, meaning there is a backend as well as frontend library that work together.
The backend library is meant to be used as a connect/express middleware, but it can be used without.
The frontend library is optional, but it requires the backend library to work.

## Use Case

User images won't always show up on your site:

- Many image hosts, such as imgur, do not support HTTPS. If your site only uses HTTPS, you're going to get mixed message warnings or these images won't load at all.
- Some image hosts block hotlinking.

Both of these problems can be solved by proxying images through your server.
Generally speaking, you should put this proxy instance behind a cache as this module does not cache any images.
If you use CloudFlare as a CDN, you can even prevent hotlinking.

Inspiration: [camo](https://github.com/atmos/camo).

## Installation

In node.js:

```bash
npm install iproxy
```

For the browser, we use [component](https://github.com/component/component):

```bash
component install expressjs/iproxy
```

## API

### Node.js

You should mount the middleware to some prefix. For example, we'll use the prefix `/proxy`:

```js
app.use('/proxy', require('iproxy'))
```

### URLs

Assume we use the prefix `/proxy`. Images are now proxied at the address `'/proxy/' + url` where `url` is the URL of the image without the protocol. ex., `/proxy/i.imgur.com/mFtyLGJ.gif` would proxy the image `http://i.imgur.com/mFtyLGJ.gif` through your server.

### Browser

We want to create an `iproxy` instance with the prefix `/proxy`:

```js
var iproxy = require('iproxy')('/proxy')
```

- `iproxy(url, callback)`
  - `url` - the image URL you want to proxy.
  - `callback(err, url)`
      - `err` - if non-`null`, the image failed to load and proxy.
      - `url` - the image URL that worked - either the original URL or the proxied URL.

```js
iproxy('http://i.imgur.com/mFtyLGJ.gif', function (err, url) {
  // Input URL will match the output URL
  // because the image works
  url === 'http://i.imgur.com/mFtyLGJ.gif'
})
iproxy('https://i.imgur.com/mFtyLGJ.gif', function (err, url) {
  // The output URL will be a proxied URL
  // since imgur doesn't support HTTPS
  url === '/proxy/i.imgur.com/mFtyLGJ.gif'
})
```

Note: it's up to you what protocol you'd like to test. You may want to use `//i.imgur.com/mFtyLGJ.gif` protocol-less URLs.

## License

The MIT License (MIT)

Copyright (c) 2013 Jonathan Ong me@jongleberry.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.# imgproxy
