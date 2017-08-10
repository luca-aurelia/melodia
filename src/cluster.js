import kmeans from 'ml-kmeans'

const toNestedArray = ({ x, y }) => [y]
const compareCentroids = (cluster1, cluster2) => {
  if (cluster1.centroid < cluster2.centroid) {
    return -1 // cluster1 comes first
  } else if (cluster2.centroid < cluster1.centroid) {
    return 1 // cluster2 comes first
  } else {
    return 0
  }
}
const clustersReducer = result => (clusters, point) => {
  const { clusterId } = point
  if (clusters[clusterId] == null) {
    clusters[clusterId] = []
    clusters[clusterId].centroid = result.centroids[clusterId].centroid[0]
  }
  clusters[clusterId].push(point)
  return clusters.sort(compareCentroids)
}

const cluster = (points, keyFunc) => {
  const nestedArrays = points.map(keyFunc).map(toNestedArray)
  const numberOfClusters = 2
  const startingPoints = [[0], [1]]
  const result = kmeans(
    nestedArrays,
    numberOfClusters,
    startingPoints
  )

  return result.clusters
    .map((clusterId, index) => {
      const point = points[index]
      point.clusterId = clusterId
      return point
    })
    .reduce(
      clustersReducer(result),
      []
    )
}

export default cluster
