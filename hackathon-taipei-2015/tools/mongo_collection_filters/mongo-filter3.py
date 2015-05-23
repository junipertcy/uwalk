import json
from pymongo import MongoClient
from pprint import pprint

client = MongoClient("mongodb://localhost:27017")
db = client.taipei
db_bus = client.taipei.bus
db = client.taipei.const

def higher_player():
  result = db_bus.aggregate({"$project" : {"_id": 0, "geometry.coordinates" : 1}})

  return result


if __name__ == "__main__":
  result = higher_player()
  pprint(result)