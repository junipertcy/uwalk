import numpy as np
from matplotlib import pyplot as plt
from matplotlib import patches as mpatches
from matplotlib.patches import Polygon
from matplotlib.collections import PatchCollection
import matplotlib.cm as cm
from shapely.geometry import Polygon, MultiPolygon, shape
import json
import io

#################################################################################
# Load JSON file
with open('../geomonster/data/G97_A_CAVLGE_P.json') as geo_file:
	geo_file = json.load(geo_file)

print geo_file['features'][0]['properties'].keys()

#coords = geo_file['features'][0]['geometry']['properties']

#################################################################################
# Convert each JSON district path into separated python patches, and get all path into "district" object
fig = plt.figure(facecolor="white")
ax = fig.gca()
patches =[]
for f in range(len(geo_file['features'])):

	coords = geo_file['features'][f]['geometry']['coordinates']
	points = np.array(coords[0])
	polygon = mpatches.Polygon(points)

	patches.append(polygon)
	
colors = 100*np.random.rand(len(patches))
pcoll = PatchCollection(patches, cmap = cm.Reds, alpha = 0.6)
pcoll.set_array(np.array(colors))
ax.add_collection(pcoll)
plt.axis('equal')
plt.axis('off')
plt.show()
 
district = pcoll.properties()['paths']

#################################################################################
# Assign all contruction locations to corresponding districts as label and save into 
# data_types and labels_types

location = np.load('c_location.npy')
labels = np.load('c_labels.npy')
#labels_weighting = np.load('label_weighting1_8.npy')
labels_number = len(np.unique(labels))
data = np.zeros((len(district),labels_number))
print data.shape

for d in range(len(district)):
	inside = district[d].contains_points(location)
	for j in range(len(inside)):
		if inside[j] == True:
			data[d,(labels[j]-1)] = data[d,(labels[j]-1)]+1
			

#data = data / labels_weighting[None,:]
#data = data.astype(int)
new_labels = range(len(data))
new_labels = [n+1 for n in new_labels]
print sum(sum(data))
np.save('data_types',data)
np.save('labels_types',new_labels)














