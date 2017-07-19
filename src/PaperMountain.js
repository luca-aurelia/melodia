import React, { Component } from 'react'
import paper from 'paper'
import mountainSVG from './mountain.svg'
import mountainImage from './mountain.jpg'
import play from './play'

const tool = new paper.Tool()
const closeTo = (x, y, sigma = 0.001) => Math.abs(x - y) < sigma
const start = paths => {
  const image = document.querySelector('.mountain img')
  const nearEdge = p =>
    closeTo(p.x, 0) || closeTo(p.y, 0) ||
    closeTo(p.x, 1) || closeTo(p.y, 1)
  paper.view.viewSize = new paper.Size(image.width, image.height)
  paths.forEach(path => {
    path.strokeColor = 'black'
    path.opacity = 0.0
    path.strokeWidth = 5
  })
  const onMouseMove = event => {
    paths.forEach(path => {
      path.intersectionGroup.visible = false
    })
    if (event.item) {
      event.item.intersectionGroup.visible = true
    }
  }
  const onMouseUp = event => {
    if (event.item && event.item.intersectionGroup) {
      const intersections = event.item.intersectionGroup.children
        .map(intersection => intersection.normalizedCenter)
      play(intersections)
    }
  }
  tool.onMouseUp = onMouseUp
  tool.onMouseMove = onMouseMove
  const xSamplingInterval = image.width / 100
  paths.forEach(path => {
    path.intersectionGroup = new paper.Group()
    path.intersectionGroup.visible = false
    for (var x = 0; x < image.width; x += xSamplingInterval) {
      const vertical = new paper.Path()
      vertical.visible = false
      vertical.add(new paper.Point(x, 0))
      vertical.add(new paper.Point(x, image.height))

      const intersections = path.getIntersections(vertical)
      intersections.forEach(intersection => {
        const p = intersection.point
        const normalizedP = {
          x: p.x / image.width,
          y: p.y / image.height
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
      })
      vertical.remove()
    }
  })
}

export default class PaperMountain extends Component {
  gotCanvas (canvas) {
    paper.setup(canvas)
    paper.project.importSVG(mountainSVG, group => {
      const children = group.children.slice().filter(child => child.getIntersections)
      group.remove()
      group.removeChildren()
      children.forEach(child => {
        paper.project.activeLayer.addChild(child)
      })
      start(children)
    }, { insert: false })
  }
  render (props) {
    return <div className='mountain'>
      <canvas className='overlay' ref={this.gotCanvas.bind(this)} />
      <img src={mountainImage} alt='mountain' />
    </div>
  }
}
