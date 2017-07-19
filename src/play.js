import Tone from 'tone'
const synth = new Tone.PolySynth(6, Tone.Synth).toMaster()

const timeSteps = []
for (var x = 0; x < 100; x++) {
  timeSteps
}
const scale = [
  'C1', 'D1', 'E1', 'F1', 'G1', 'A1', 'B1',
  'C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2',
  'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3',
  'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4',
  'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5',
  'C6', 'D6', 'E6', 'F6', 'G6', 'A6', 'B6',
  'C7', 'D7', 'E7', 'F7', 'G7', 'A7', 'B7',
  'C8', 'D8', 'E8', 'F8', 'G8', 'A8', 'B8'
]
const play = points => {
  points = points.map(({ x, y }) => ({ x, y: 1 - y }))
  const notes = points.map(({ x, y }) => {
    return {
      pitch: scale[Math.round(y * (scale.length - 1))],
      time: x * 100
    }
  })
  notes.forEach(note => {
    var vel = Math.random() * 0.5 + 0.5
    const time = '+' + (note.time * 0.1)
    synth.triggerAttackRelease(note.pitch, 0.1, time, vel)
  })
  console.log(notes)
}

export default play
