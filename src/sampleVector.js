import paper from 'paper'

const closeTo = (x, y, sigma = 0.0001) => Math.abs(x - y) < sigma
const nearEdge = ({ x, y }) =>
  closeTo(x, 0, 0.0001) || closeTo(y, 0, 0.05) ||
  closeTo(x, 1, 0.0001) || closeTo(y, 1, 0.05)

const sampleVector = (path, image) => {
  const xSamplingInterval = image.bounds.width / 100
  path.intersectionGroup = new paper.Group()
  const samples = []
  for (var x = 0; x < image.bounds.width; x += xSamplingInterval) {
    const vertical = new paper.Path()
    vertical.visible = false
    vertical.add(new paper.Point(x, 0))
    vertical.add(new paper.Point(x, image.bounds.height))

    const intersections = path.getIntersections(vertical)
    intersections.forEach(intersection => {
      const p = intersection.point
      const normalizedP = {
        x: p.x / image.bounds.width,
        y: p.y / image.bounds.height
      }
      if (nearEdge(normalizedP)) {
        return
      }
      const circle = paper.Path.Circle({
        center: p,
        radius: 2,
        fillColor: 'red',
        parent: path.intersectionGroup
      })
      circle.normalizedCenter = normalizedP
      samples.push(circle)
    })
    vertical.remove()
  }
  return samples
}

export default sampleVector
