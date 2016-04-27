#full_listings API

The airbnb data can be retrived via http://uwalk.elasticbeanstalk.com/api/airbnbs/

Summary:

  1. Query
  2. Return

### Get checkins around a point
* Get /api/airbnbs/ickm16/features

    Function:
      Get the features, one feature collection to a listed property, of airbnb listings

    Note:
      1. Currently only feature listings in San Francisco, New York, Paris, and London is available.
      2. TeTe is handsome.

    query: {
      market: 'New York',
      count: 10
    }

    Request: {
    }

    Response (200): {
      location: {
        lat: 'the latitute | Number | 23.5',
        lng: 'the longitute| Number | 120.0'
      },
      features: {
        property_type: 'airbnb property type | String | enum: ["House", "Apartment"] ',
        room_type: 'airbnb room type | String | enum: ["Entire home/apt"] ',
        price: 'daily room price in USD | Number | 300.00',
        reviews_per_month: 'reviews per month | Number | 3.4'
      }
    }


  Response (error):
    {errcode: -2, errmsg: 'No permission.'}

