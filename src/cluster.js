import kmeans from 'ml-kmeans'

const toNestedArray = ({ x, y }) => [y]

const cluster = points => {
  const result = kmeans(
    points.map(toNestedArray),
    2,
    'random'
  )

  return result.clusters
    .map((clusterId, index) => {
      const point = points[index]
      point.clusterId = clusterId
      return point
    })
    .reduce((clusters, point) => {
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
    }, [])
}

export default cluster
