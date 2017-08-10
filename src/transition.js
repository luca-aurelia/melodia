import paper from 'paper'

const clamp = (value, { min, max }) => {
  if (value < min) return min
  if (value > max) return max
  return value
}

const lerp = (start, end, t) => {
  const slope = end - start
  return (slope * t) + start
}

class TransitionProperty {
  constructor (name, duration, item) {
    if (this.duration < 0) throw new Error('Duration can\'t be less than zero.')
    const self = this
    this.name = name
    this.duration = duration
    this.item = item
    const privateName = `__transition__${name}`
    this.privateName = privateName
    this.startValue = item[name]
    Object.defineProperty(item, name, {
      get () {
        return item[privateName]
      },
      set (value) {
        self.startTime = null
        self.startValue = item[privateName]
        self.endValue = value
      }
    })
  }
  onFrame (event) {
    const t = this.getTime(event)
    this.item[this.privateName] = this.getCurrentValue(t)
  }
  getCurrentValue (t) {
    return lerp(this.startValue, this.endValue, t)
  }
  getTime (event) {
    if (this.startTime == null) {
      this.startTime = event.time
    }
    // tsion c:
    const t = (event.time - this.startTime) / this.duration
    return clamp(t, { min: 0, max: 1 })
  }
}

class Transition {
  constructor (items, options) {
    this.properties = Object.keys(options).map(propertyName => {
      const duration = this.options[propertyName]
      return new TransitionProperty(propertyName, duration, items)
    })
  }
  onFrame (event) {
    this.properties.forEach(prop => prop.onFrame(event))
  }
}

const transitions = []

paper.onFrame = event => {
  transitions.forEach(transition => transition.onFrame(event))
}

const transition = (items, options) => {
  transitions.push(new Transition(items, options))
}

export default transition
