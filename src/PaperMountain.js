import React, { Component } from 'react'
import paper from 'paper'
import mountainVector from './mountain.svg'
import mountainRaster from './mountain.jpg'
import play from './play'
import LookAlike from 'look-alike'
import separateMelodies from './cluster'

const tool = new paper.Tool()
const closeTo = (x, y, sigma = 0.001) => Math.abs(x - y) < sigma
const start = (paths, image) => {
  const nearEdge = ({ x, y }) =>
    closeTo(x, 0) || closeTo(y, 0) ||
    closeTo(x, 1) || closeTo(y, 1)
  paths.forEach(path => {
    path.strokeColor = 'black'
    path.opacity = 0.5
    path.strokeWidth = 5
  })
  const xSamplingInterval = image.bounds.width / 100
  const allPoints = []
  paths.forEach(path => {
    path.intersectionGroup = new paper.Group()
    path.intersectionGroup.visible = true
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
        allPoints.push(circle)
        // hack for Look-Alike library
        circle.toString = () => '[object Object]'
      })
      vertical.remove()
    }
  })
  const melodies = separateMelodies(
    allPoints,
    intersection => intersection.normalizedCenter
  )
  const lookAlikes = new LookAlike(allPoints, {
    attributes: ['x', 'y'],
    key: circle => {
      const key = { x: circle.position.x, y: circle.position.y }
      return key
    }
  })
  const onMouseMove = event => {
    const p = { x: event.point.x, y: event.point.y }
    const nearestNeighbor = lookAlikes.query(p, { normalize: false })[0]
    allPoints.forEach(p => { p.visible = false })
    melodies[nearestNeighbor.clusterId].forEach(p => { p.visible = true })
  }
  const onMouseUp = event => {
    const p = { x: event.point.x, y: event.point.y }
    const nearestNeighbor = lookAlikes.query(p, { normalize: false })[0]
    play(melodies[nearestNeighbor.clusterId].map(circle => circle.normalizedCenter))
  }
  tool.onMouseUp = onMouseUp
  tool.onMouseMove = onMouseMove
}

export default class PaperMountain extends Component {
  gotCanvas (canvas) {
    paper.setup(canvas)
    paper.project.importSVG(mountainVector, group => {
      group.fitBounds(paper.view.bounds, false)
      const children = group.children.slice().filter(child => child.getIntersections)
      group.remove()
      group.removeChildren()
      children.forEach(child => {
        paper.project.activeLayer.addChild(child)
      })
      const raster = new paper.Raster({
        source: mountainRaster,
        position: paper.view.center
      })
      raster.onLoad = () => {
        raster.fitBounds(paper.view.bounds, false)
        raster.sendToBack()
        start(children, raster)
      }
    }, { insert: false })
  }
  render (props) {
    return <div className='mountain'>
      <canvas className='overlay' data-paper-resize='true' ref={this.gotCanvas.bind(this)} />
    </div>
  }
}
