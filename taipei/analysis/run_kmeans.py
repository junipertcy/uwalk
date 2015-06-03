from time import time
import numpy as np
import matplotlib.pyplot as plt
from sklearn import metrics
from sklearn.cluster import KMeans
from sklearn.datasets import load_digits
from sklearn.decomposition import PCA
from sklearn.preprocessing import scale
from mpl_toolkits.mplot3d import Axes3D


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


##################################################################################
# KMeans
data = np.load('data_types.npy')
labels = np.load('labels_types.npy')
#data = scale(data)
n_samples, n_features = data.shape
n_labels = len(np.unique(np.load('c_labels.npy')))
print n_features, n_labels
sample_size = len(np.unique(labels))
n_clusters=6



kmeans = KMeans(init='k-means++', n_clusters=n_clusters, n_init=10)
t0 = time()
kmeans.fit(data)
t_batch = time() - t0

kmeans_labels = kmeans.labels_
kmeans_cluster_center = kmeans.cluster_centers_
kmeans_labels_unique = np.unique(kmeans_labels)
np.save('kmeans_labels', kmeans_labels)
np.save('kmeans_cluster_center', kmeans_cluster_center)
print len(kmeans_labels)
print len(kmeans_cluster_center)



print(79 * '_')
print('% 9s' % 'init'
      '    time  inertia    homo   compl  v-meas     ARI AMI  silhouette')

bench_k_means(estimator=kmeans, name="k-means++", data=data)


#################################################################################
#PCA
#
pca = PCA(n_components=min(n_samples,n_features)).fit(data)
bench_k_means(KMeans(init=pca.components_, n_clusters=n_clusters, n_init=1),name="PCA-based",data=data)
print(79 * '_')

#################################################################################
# Visualize the results on PCA-reduced data
reduced_data = PCA(n_components=3).fit_transform(data)
print 'PCA dimension: ',reduced_data.shape
kmeans = KMeans(init='k-means++', n_clusters=n_clusters, n_init=10)
kmeans.fit(reduced_data)


# Plot
fig = plt.figure(figsize=(10.0,8.0), tight_layout = True)
ax = fig.add_subplot(111,projection='3d')

plt.plot(reduced_data[:, 0], reduced_data[:, 1], reduced_data[:, 2],'k.', markersize=8)
#plt.plot(data[:, 0], data[:, 1], data[:, 2],'k.', markersize=5)
#centroids = kmeans.cluster_centers_
#plt.scatter(centroids[:, 0], centroids[:, 1],marker='x', s=169, linewidths=3,color='r', zorder=10)
plt.xticks(())
plt.yticks(())
plt.show()


#################################################################################
# Get the histogram pattern
kmeans_cluster_center = kmeans_cluster_center.astype(int)
fig = plt.figure(figsize=(10.0,8.0), tight_layout = True)
width =0.3
ind = np.arange(n_labels)
ind = [i+1 for i in ind]
for s in range(n_clusters):
	ax = fig.add_subplot(n_clusters,1,s+1)
	plt.bar(ind,kmeans_cluster_center[s], width)
	print kmeans_cluster_center[s]
	plt.ylim(0, 100)
	plt.xticks(ind)

plt.show()
