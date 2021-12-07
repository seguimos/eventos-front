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
