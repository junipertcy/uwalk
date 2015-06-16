# Code to calculate the number of *stations* contained
# in one taipei.LEE
#
#
#

import json
import matplotlib.path as mplPath
import numpy as np
from pymongo import MongoClient
from pprint import pprint
from shapely.geometry import Polygon



with open('../data/geometry.json') as data_file:
    data = json.load(data_file)

numLee = len(data)

# MRT
with open('../data/TpeMRTStations_TWD97.json') as data_fileMRT:
    dataMRT = json.load(data_fileMRT)

numMRT = len(dataMRT["features"])
aMRT = np.zeros((1,numLee))
for i in range(0,numLee):
  leePath = mplPath.Path(np.array(data[i]["geometry"]["coordinates"][0]))
  for j in range(0,numMRT):
    coord = dataMRT["features"][j]["geometry"]["coordinates"]
    aMRT[0, i] = aMRT[0, i] + leePath.contains_point((coord[0], coord[1]))


# BUS
with open('../data/allstoptwd97.json') as data_fileBUS:
    dataBUS = json.load(data_fileBUS)

numBUS = len(dataBUS["features"])
aBUS = np.zeros((1,numLee))
for i in range(0,numLee):
  leePath = mplPath.Path(np.array(data[i]["geometry"]["coordinates"][0]))
  for k in range(0,numBUS):
    coord = dataBUS["features"][k]["geometry"]["coordinates"]
    aBUS[0, i] = aBUS[0, i] + leePath.contains_point((coord[0], coord[1]))

aBUS.tofile('bus.csv', ',', format = '%i')


# Water
# MultiPolygon water regions are not included in this section
with open('../data/water.json') as data_water:
    dataWATER = json.load(data_water)

numWATER = len(dataWATER["features"])
aWater = np.zeros((1,numLee))
for i in range(0,numLee):
  leePath = Polygon(data[i]["geometry"]["coordinates"][0])
  for k in range(0,numWATER):
    coordWater = Polygon(dataWATER["features"][k]["geometry"]["coordinates"][0])
    aWater[0, i] = aWater[0, i] + leePath.intersection(coordWater).area

# degree-to-area transformation constant
ratio = 11177068521.957518
aWater = ratio*aWater
aWater.tofile('water.csv', ',', format = '%f')



# Water
# find the intersecting area of the prone-to-water-drone regions to Taipei districts
with open('../data/geo_disct.json') as data:
    dataGeo = json.load(data)

numDist = len(dataGeo["coordinates"])
aWater = np.zeros((1,numDist))
for i in range(0,numDist):
  leePath = Polygon(dataGeo["coordinates"][i])
  for k in range(0,numWATER):
    coordWater = Polygon(dataWATER["features"][k]["geometry"]["coordinates"][0])
    aWater[0, i] = aWater[0, i] + leePath.intersection(coordWater).area

# degree-to-area transformation constant
ratio = 11177068521.957518
aWater = ratio*aWater
aWater.tofile('water.csv', ',', format = '%f')






