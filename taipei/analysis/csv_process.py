import csv  
import numpy as np
import numpy.random as npr
from time import time
import matplotlib.pyplot as plt
import matplotlib.cm as cm
from sklearn import metrics
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.preprocessing import scale
import os
import json
import io
import matplotlib.patches as mpatches
import matplotlib.path as mpath
from matplotlib.collections import PatchCollection
import re 
from matplotlib.patches import Polygon
from shapely.geometry import Polygon, MultiPolygon, shape

data_folder ='/Users/Apple/Documents/DataScience/geomonster/data'

def getPolygons(fn, key):
    polys = []
    with open(fn) as f:
        reader = csv.DictReader(f)
        polys = []
        areas = {}
        for row in reader:
            print row.keys()
            arean = float(row[key]) #
            wkt = row['WKT']
            # ignore interior rings
            if wkt.startswith("POLYGON"):
                wktm = re.match("POLYGON \(\(((?:[0-9.,]|\s)+)\)", wkt)
                if wktm:
                    wktt = wktm.group(1)
                    wktt = [x.split() for x in wktt.split(",")]
                    points = np.array([map(float, x) for x in wktt])
                    points = points.astype(int) # ints seem okay so far
                    areas[arean]  = mpatches.Polygon(points)
            elif wkt.startswith("MULTIPOLYGON"):
                # OHARE dammit
                subparts = re.findall("\(\(((?:[0-9.,]|\s)+)\)", wkt)
                points, codes = [], []
                for sub in subparts:
                    wktt = [x.split() for x in sub.split(",")]
                    # first elt of each polygon's code is a MOVETO, rest are LINETO
                    cs = [mpath.Path.LINETO] * len(wktt)
                    cs[0] = mpath.Path.MOVETO
                    codes += cs
                    points += [map(float, x) for x in wktt]
                ppts = np.array(points).astype(int)
                    
                p = mpath.Path(ppts, np.array(codes))
                areas[arean] = mpatches.PathPatch(p)
 
    polys = areas.items()
    polys.sort()
    
    return PatchCollection([p for n,p in polys])

def bench_k_means(estimator, name, data):
    t0 = time()
    estimator.fit(data)
    print('% 9s   %.2fs    %i   %.3f   %.3f   %.3f   %.3f   %.3f    %.3f'
          % (name, (time() - t0), estimator.inertia_,
             metrics.homogeneity_score(labels, estimator.labels_),
             metrics.completeness_score(labels, estimator.labels_),
             metrics.v_measure_score(labels, estimator.labels_),
             metrics.adjusted_rand_score(labels, estimator.labels_),
             metrics.adjusted_mutual_info_score(labels,  estimator.labels_),
             metrics.silhouette_score(data, estimator.labels_,
                                      metric='euclidean',
                                      sample_size=sample_size)))





# Some variables
labels =[]
X=[]
Y=[]
##



# Label
#
f = open('raw_ver5.csv', 'r')  
for row in csv.DictReader(f):
	labels.append(row['Double_label'])
f.close()
labels = np.array(labels)
labels[labels =='']='0'
labels = labels.astype(np.int)
print np.unique(labels)
#print labels.dtype

# Location 
f = open('raw_ver5.csv', 'r')  
for row in csv.DictReader(f):
	X.append([row['V1']])
	Y.append([row['V2']])
f.close()


x = np.array(X)
x[x=='']='0'
x = x.astype(np.float)
y = np.array(Y)
y[y=='']='0'
y = y.astype(np.float)


location = np.hstack((x,y))
np.save('c_location',location)
np.save('c_labels', labels)
n_labels = len(np.unique(labels))



# Split to two data set
location1_8 =[]
location9_14=[]
labels1_8=[]
labels9_14=[]
for la in range(len(labels)):
  if labels[la] <= 8:
    labels1_8.append(labels[la])
    location1_8.append(location[la].tolist())
  if labels[la] >= 9:
    labels9_14.append(labels[la]-8)
    location9_14.append(location[la].tolist())

location1_8 = np.array(location1_8)
location9_14 = np.array(location9_14)
labels1_8 = np.array(labels1_8)
labels9_14 = np.array(labels9_14)
np.save('location1_8', location1_8)
np.save('location9_14', location9_14)
np.save('labels1_8', labels1_8)
np.save('labels9_14', labels9_14)


# Get lable 11 only
# 
location_11=[]
target_label=11
for i in range(len(labels)):
  if labels[i] == target_label:
    location_11.append(location[i].tolist())

print 'location_11: ', len(location_11)
np.save('location_11', location_11)




# Get number for each request
target_label = np.arange(n_labels)
target_label = [i+1 for i in target_label]
print target_label
label_weighting = []
for t in target_label:
  index = np.ravel(np.argwhere(labels==t))
  location_new = location[index]
  label_weighting.append(len(location_new))


label_weighting1_8 = label_weighting[0:8]
label_weighting9_14 = label_weighting[8:]
print 'label weighting: ',label_weighting
print 'label 1~8 weighting',label_weighting1_8
print 'label 9~14 weighting',label_weighting9_14
np.save('label_weighting',label_weighting)
np.save('label_weighting1_8',label_weighting1_8)
np.save('label_weighting9_14',label_weighting9_14)





# KMeans
n_clusters=6
n_samples, n_features = location.shape
sample_size = 300#len(location)




# Plot Taipei City
with open('G97_A_CAVLGE_P.json') as geo_file:
  geo_file = json.load(geo_file)


#coords = geo_file['features'][0]['geometry']['properties']
fig = plt.figure(facecolor="white")
ax = fig.gca()
patches =[]

for f in range(len(geo_file['features'])):

  coords = geo_file['features'][f]['geometry']['coordinates']
  #print coords[0]
  points = np.array(coords[0])
  #print points
  polygon = mpatches.Polygon(points)
  #print polygon
  patches.append(polygon)
  #print polygon

colors = 100*np.random.rand(len(patches))
pcoll = PatchCollection(patches, cmap = cm.Reds, alpha = 0.6)
pcoll.set_array(np.array(colors))
ax.add_collection(pcoll)

# Plot every requests
#
plt.plot(location[:, 0], location[:, 1], 'b.', markersize=2)




#plt.title('Label: {}, data num: {}, cluster num: {}'.format('4~7',n_samples, n_clusters))
#plt.xlim(x_min, x_max)
#plt.ylim(y_min, y_max)
#plt.legend()
plt.axis('equal')
plt.axis('off')
#plt.xlim(296707.21899999998, 312983.07299999997)
#plt.ylim(2762851.2239999999, 2785988.7689999999)
plt.xticks(())
plt.yticks(())
plt.show()




