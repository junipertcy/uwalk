#特定點方圓四里有誰

import json
from pymongo import MongoClient
from pprint import pprint

client = MongoClient("mongodb://localhost:27017")
db = client.taipei
db_geo = client.taipei.geo
db = client.taipei.const
db_llarray = client.taipei.llarray


with open('geometry.json') as data_file:
    data = json.load(data_file)

data[0]["geometry"]["coordinates"][0]

def higher_player():
    result = db_llarray.aggregate({
      "$match":{
        "coordinates" : {
          "$geoWithin" : {
            "$centerSphere":
              [[121.51115442138645, 25.142421821901504], 4000]
            }
          }
        }
    })

  return result


if __name__ == "__main__":
  result = higher_player()
  pprint(result)