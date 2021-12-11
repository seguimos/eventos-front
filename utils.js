export function errorsToArray (errors) {
  return Object.values(errors).reduce((acc, e) => {
    acc = [
      ...acc,
      ...e
    ]
    return acc
  })
}

export function formatDate (date) {
  if (!date) { return null }
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}

// Ray Casting Algorithm
export function coordinateInsidePolygon (coordinates, polyPoints) {
  const x = coordinates.lat
  const y = coordinates.lng

  let inside = false
  for (let i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
    const xi = polyPoints[i][1]; const yi = polyPoints[i][0]
    const xj = polyPoints[j][1]; const yj = polyPoints[j][0]

    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
    if (intersect) { inside = !inside }
  }
  return inside
}

export async function readImageFile (imageFile) {
  const canvas = document.createElement('canvas')
  const img = document.createElement('img')
  // create img element from File object
  img.src = await new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.readAsDataURL(imageFile)
  })
  await new Promise((resolve) => {
    img.onload = resolve
  })
  // draw image in canvas elementgf
  canvas.width = img.width
  canvas.height = img.height
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
  return canvas
}

export function scaleCanvas (canvas, scale) {
  const scaledCanvas = document.createElement('canvas')
  scaledCanvas.width = canvas.width * scale
  scaledCanvas.height = canvas.height * scale
  scaledCanvas
    .getContext('2d')
    .drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height)
  return scaledCanvas
}

export async function compressImageFile (imageFile, quality = 0.8, maxWith = 800, imageType = 'image/jpeg') {
  if (!imageFile) { return null }
  let canvas = await readImageFile(imageFile)
  if (canvas.width > maxWith) {
    canvas = scaleCanvas(canvas, maxWith / canvas.width)
  }
  const blob = await new Promise(resolve => canvas.toBlob(resolve, imageType, quality))
  return new File([blob], 'imageFile')
}
