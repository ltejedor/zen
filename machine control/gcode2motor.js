let sqrt_2_over_2 = 0.70710678118

let corexy = createSynchronizer([motora, motorb])
console.log(corexy)

motora.setCurrentScale(0.55)
motora.setStepsPerUnit(20)
motorb.setCurrentScale(0.55)
motorb.setStepsPerUnit(20)

// let gcode = "
  
// "
let gcode = "G01 X0 Y0 Z1\nG01 X50 Y0 Z1\nG01 X0 Y50 Z1"
let lines = gcode.split('\n')

for(let i = 0; i < lines.length; i += 1){
  let line = lines[i]
  coords = line.split(' ')

  console.log(coords)

  x = parseFloat(coords[1].replace('X', ''))
  y = parseFloat(coords[2].replace('Y', ''))

  // coord = [x + y, x - y]
  coord = [sqrt_2_over_2 * (x + y), sqrt_2_over_2 * (x - y)]

  // console.log(coord)
  // coord = [x, y]

  console.log([x, y])
  await corexy.absolute(coord, 40, 400)
}
