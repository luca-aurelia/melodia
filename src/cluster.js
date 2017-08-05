import kmeans from 'ml-kmeans'

const toNestedArray = ({ x, y }) => [y]
const clustersReducer = result => (clusters, point) => {
  const { clusterId } = point
  if (clusters[clusterId] == null) {
    clusters[clusterId] = []
    clusters[clusterId].centroid = result.centroids[clusterId].centroid[0]
  }
  clusters[clusterId].push(point)
  return clusters.sort((cluster1, cluster2) => {
    if (cluster1.centroid < cluster2.centroid) {
      return -1 // cluster1 comes first
    } else if (cluster2.centroid < cluster1.centroid) {
      return 1 // cluster2 comes first
    } else {
      return 0
    }
  })
}

const cluster = (points, keyFunc) => {
  const result = kmeans(
    points.map(keyFunc).map(toNestedArray),
    2,
    [[0], [1]]
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
