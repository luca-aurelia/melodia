import InlineSVG from 'react-inlinesvg'
import React, { Component } from 'react'
import mountainSVG from './mountain.svg'
import mountainImage from './mountain.jpg'

const pathSelectors = ['.one', '.two', '.three', '.four', '.five']
const gridBySelector = {}

const getPointsCloseTo = (x, points, radius = 100) => {
  const neighbors = []
  for (var i = 0; i < points.length; i++) {
    const point = points[i]
    if (Math.abs(point.x - x) < radius) {
      neighbors.push(point)
    }
  }
  return neighbors
}

function getPointsByPath () {
  pathSelectors.forEach(selector => {
    console.log('Working on', selector)
    const path = document.querySelector(selector)
    const length = path.getTotalLength()
    const samplingInterval = length / 1000
    const points = []
    for (var l = 0; l < length; l += samplingInterval) {
      points.push(path.getPointAtLength(l))
    }

    const image = document.querySelector('.mountain img')
    const xSamplingInterval = 10
    gridBySelector[selector] = {}
    for (var x = 0; x < image.width; x += xSamplingInterval) {
      const neighbors = getPointsCloseTo(x, points)
      gridBySelector[selector][x] = neighbors
    }
  })
  console.log(gridBySelector)
  console.log('Done.')
}

export default class Mountain extends Component {
  render (props) {
    return <div className='mountain'>
      <InlineSVG className='overlay' onLoad={getPointsByPath} src={mountainSVG} />
      <img src={mountainImage} alt='mountain' />
    </div>
  }
}
