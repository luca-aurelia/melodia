const clamp = (value, { min, max }) => {
  if (value < min) return min
  if (value > max) return max
  return value
}

const lerp = (start, end, t) => {
  const slope = end - start
  return (slope * t) + start
}

const capitalize = s => s[0].toUpperCase() + s.slice(1)

class TransitionProperty {
  constructor (name, duration, item) {
    if (this.duration < 0) throw new Error('Duration can\'t be less than zero.')
    const self = this
    const privateName = `__transition__${name}`
    this.name = name
    this.duration = duration
    this.item = item

    this.privateName = privateName
    this.startValue = item[name]
    item[privateName] = item[name]
    Object.defineProperty(item, name, {
      get () {
        return self.getItemPropertyValue()
      },
      set (value) {
        self.startTime = null
        self.startValue = self.getItemPropertyValue()
        self.endValue = value
      }
    })
  }
  getItemPropertyValue () {
    const capitalized = capitalize(this.name)
    const getter = 'get' + capitalized
    return this.item[getter]()
  }
  setItemPropertyValue (value) {
    const capitalized = capitalize(this.name)
    const setter = 'set' + capitalized
    return this.item[setter](value)
  }
  onFrame (event) {
    const t = this.getTime(event)
    this.setItemPropertyValue(this.getCurrentValue(t))
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

module.exports = TransitionProperty
