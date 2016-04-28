#full_listings API

The foursquare data can be retrived via http://uwalk.elasticbeanstalk.com/api/foursquares/

* Get /api/foursquares/ickm16/features

    Function:
      Get the features, one feature collection to a listed venue, of foursquares listings

    Note:
      1. Currently only feature listings in San Francisco, New York, Paris, and London is available.
      2. TeTe is handsome.

    Query:

      {
          market: 'New York',
          radiusFromCityCenter: 10,
          count: 10
        }

    Response (200):

    [
      location: {
            lat: 'the latitute | Number | 23.5',
          lng: 'the longitute| Number | 120.0'
          },
          features: {
            venue_type: 'foursquares venue type | String | enum: ["House", "Apartment"] ',
            totalCheckins: 'total checkin numbers | Number | enum: ["Entire home/apt"] ',
            visitPattern: 'daily room price in USD | Number | 300.00',
          }
        }
      ]

  Response (error):

      {errcode: 0, errmsg: 'Not set up any error codes.'}

