const potrace = require('potrace')
const path = require('path')
const fs = require('fs')

const mountainPath = path.join(__dirname, 'src', 'mountain.jpg')
const vectorizedMountainPath = path.join(__dirname, 'src', 'mountain.svg')

console.log('Tracing ', mountainPath)
// potrace.posterize(mountainPath, { threshold: 220, steps: 5 }, (err, svg) => {
//   console.log('Traced.')
//   if (err) throw err
//   fs.writeFileSync(vectorizedMountainPath, svg)
// })
potrace.trace(mountainPath, { threshold: 120 }, (err, svg) => {
  console.log('Traced.')
  if (err) throw err
  fs.writeFileSync(vectorizedMountainPath, svg)
})
