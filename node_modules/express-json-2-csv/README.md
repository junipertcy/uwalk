# express-json-2-csv
An [express.js](http://expressjs.com) middleware for easy providing response CSV

[![Build Status](https://travis-ci.org/limjoe/express-csv.svg?branch=master)](https://travis-ci.org/limjoe/express-csv)

## Install
   $ npm install express-json-2-csv

## Usage

Just `app.use` it!

     app.use(require('express-json-2-csv')());

## Example

```js
    app.get('/', function(req, res) {
        res.csv([
            ['foo', 'bar', null, 'mock'],
            ['1', '2', undefined, '3']
        ])
    });
```

    RESPONSE
		hearders:
			{ 'x-powered-by': 'Express',
              'content-type': 'text/csv; charset=utf-8',
              'content-disposition': 'attachment; filename=export.csv',
              'content-length': '$LENGTH',
              etag: 'W/"8-c57db25c"',
              date: 'Sun, 21 Dec 2014 03:41:14 GMT',
              connection: 'close' 
            }
        text:
            foo, bar, , mock
            1, 2, , 3       

Also, you can pass an array of objects to be serialized, in which case the object's properties will be iterated over.  E.g.:

```js
    res.csv([
        {
            SN: 000001,
            Major:0001,
            Minor: 0001
        },{
            SN: 000002,
            Major:0002,
            Minor: 0002 
        }
    ])
//=> 000001, 0001, 0001
//=> 000002, 0002, 0002

```

## Changelog

###0.2.2

* Fix utils purify method if value is not a string 

## License

The MIT License (MIT)

Copyright (c) 2014 Qiao Lin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.