#Airbnbs API

* **Description**

  Get the features, one feature collection to a listed venue, of airbnb listings

  **Note**

  1. Currently only feature listings in San Francisco, New York, Paris, and London is available.

* **URL structure**

        http://uwalks.info/api/airbnbs/ickm16/features

* **Method**

  GET

* **URL params**

  **option** *required* The geospatial query type. `enum: ["rect", "point"]` default: `"point"` eg: `"rect"`.
  
  **market** *required* The queried market. eg: `"New York"`.
  
  **distFromCityCenter** *required when option = "point"* The radius of the queried circle in kilometer. default: `10` eg: `30`.
  
  **center** *required when option = "rect"* The longitude and latitude of the queried rectangular. Please follow the order longitude and then latitude. eg: `120.34,23.85`.
  
  **width** *required when option = "rect"* The width of the rectangular in kilometer. eg: `10`.
  
  **height** *required when option = "rect"* The height of the rectangular in kilometer. eg: `10`.
  
  **count** The number of returned documents. default `10`.


* **Returns**

		[
			{
				location: {
					lat: 'the latitute | Number | 23.5',
					lng: 'the longitute| Number | 120.0'
				},
				features: {
					property_type: 'airbnb property type | String | enum: ["House", "Apartment", "Condominium", "Dorm", "Townhouse", "Bed & Breakfast", "Bungalow", "Boat", "Camper/RV", "Loft", "Tent", "Treehouse", "Cabin", "Villa", "Castle", "Hut", "Train", "Cave", "Chalet", "Other"] ',
					room_type: 'airbnb room type | Number | enum: ["Entire home/apt", "Private room", "Shared room"] ',
					price: 'daily room price in USD | Number | 300.00',
					reviews_per_month: 'reviews per month | Number | 3.4'
				}
			}, {
			...
			}, ...
		]