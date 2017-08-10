import React, { Component } from 'react'
import paper from 'paper'
import mountainVector from './mountain.svg'
import mountainRaster from './mountain.jpg'
import play from './play'
import LookAlike from 'look-alike'
import separateMelodies from './cluster'
import TransitionProperty from './TransitionProperty'
import sampleVector from './sampleVector'

const tool = new paper.Tool()
const start = (paths, image) => {
  paths.forEach(path => {
    path.strokeColor = 'black'
    path.opacity = 0
    path.strokeWidth = 5
  })
  const allPoints = paths.reduce((allPoints, path) => {
    const samples = sampleVector(path, image)
    return allPoints.concat(samples)
  }, [])
  const transitions = allPoints.map(point => {
    // hack for Look-Alike library
    point.toString = () => '[object Object]'
    return new TransitionProperty('opacity', 0.25, point)
  })
  paper.project.activeLayer.onFrame = event => {
    transitions.forEach(t => t.onFrame(event))
  }
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
  let previousNearestMelody = {}
  const onMouseMove = event => {
    const p = { x: event.point.x, y: event.point.y }
    const nearestNeighbor = lookAlikes.query(p, { normalize: false })[0]
    const nearestMelody = melodies[nearestNeighbor.clusterId]
    if (nearestMelody !== previousNearestMelody) {
      const otherMelodies = melodies.filter(melody => melody !== nearestMelody)
      otherMelodies.forEach(melody =>
        melody.forEach(p => { p.opacity = 0.3 })
      )
      nearestMelody.forEach(p => { p.opacity = 1 })
      previousNearestMelody = nearestMelody
    }
  }
  onMouseMove({ point: { x: 0, y: 0 } })
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
