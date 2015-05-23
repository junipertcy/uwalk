#

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

my_list=[]

def higher_player():
  for i in range(len(data)):
    result = db_llarray.aggregate([{
      "$match":{
        "coordinates" : {
          "$geoWithin" : {
            "$geometry":{
              "type": "Polygon",
              "coordinates": data[i]["geometry"]["coordinates"]
            }
          }
        }
      }
    },{
      "$group": {
        "_id": "$_id",
        "leeID": {"$push": i}
      }
    }])
    my_list.append(result["result"])






  db_llarray.find_one_and_replace(
    {"_id": result["result"][0]["_id"]},
    result["result"][0]
  )





  return result


if __name__ == "__main__":
  result = higher_player()
  pprint(result)