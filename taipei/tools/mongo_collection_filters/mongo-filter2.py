import json
from pymongo import MongoClient
from pprint import pprint

client = MongoClient("mongodb://localhost:27017")
db = client.taipei
db_lee = client.taipei.lee
db = client.taipei.const

def higher_player():
  result = db_lee.aggregate({"$project" : {"features.properties.FULL" : 1}})

  return result


if __name__ == "__main__":
  result = higher_player()
  pprint(result)