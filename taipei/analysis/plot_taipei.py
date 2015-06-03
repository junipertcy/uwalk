import numpy as np
from matplotlib import pyplot as plt
from matplotlib import patches as mpatches
from matplotlib.patches import Polygon
from matplotlib.collections import PatchCollection
import matplotlib.cm as cm
from shapely.geometry import Polygon, MultiPolygon, shape
import json
import geojson
import io

kmeans_labels = np.load('kmeans_labels.npy')
kmeans_cluster_center = np.load('kmeans_cluster_center.npy')
n_labels = len(np.unique(np.load('c_labels.npy')))
n_clusters = len(np.unique(kmeans_labels))

with open('../geomonster/data/G97_A_CAVLGE_P.json') as geo_file:
	geo_file = json.load(geo_file)


fig1 = plt.figure(figsize=(8.0,8.0), tight_layout = True,facecolor="white")
ax = fig1.gca()
patches =[]
colors = cm.Accent(np.linspace(0,1,n_clusters))
for f in range(len(geo_file['features'])):

	coords = geo_file['features'][f]['geometry']['coordinates']
	#print coords[0]
	points = np.array(coords[0])
	

	polygon = mpatches.Polygon(points, edgecolor = '0.4',facecolor = colors[kmeans_labels[f]])
	polygon.set_alpha(0.6)
	#print polygon
	patches.append(polygon)
	ax.add_patch(polygon)
	#print polygon


print len(patches)

label_type = ['A','B','C','D','E','F','G','H','I','J','K']
pattern =[]
for t in range(n_clusters):
	p = mpatches.Patch(color=colors[t], label ='Type '+label_type[t])
	pattern.append(p)


plt.legend(handles=pattern)
plt.title('{} labels K-means: {} clusters'.format(n_labels,n_clusters))
plt.axis('equal')
plt.axis('off')
#plt.show()


kmeans_cluster_center = kmeans_cluster_center.astype(int)
print kmeans_cluster_center[0]

fig2 = plt.figure(figsize=(6.0,8.0), tight_layout = True, facecolor ='w')
width =0.2
ind = np.arange(n_labels)
ind = [i+1 for i in ind]
for s in range(n_clusters):
	ax = fig2.add_subplot(n_clusters,1,s+1)
	plt.bar(ind,kmeans_cluster_center[s], width, color =colors[s], edgecolor = colors[s])
	print kmeans_cluster_center[s]
	plt.ylim(0, 100)
	plt.xticks(ind)

plt.show()