export default {
  // get source code from https://github.com/substack/point-in-polygon
  // ray-casting algorithm based on
	// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
  pointInPolygon(point, vs) {
    var x = point[0], y = point[1]
    
    var inside = false

    const xMin = vs[0][0] > vs[2][0] ? vs[2][0] : vs[0][0]
    const xMax = vs[0][0] < vs[2][0] ? vs[2][0] : vs[0][0]

    const yMin = vs[0][1] > vs[1][1] ? vs[1][1] : vs[0][1]
    const yMax = vs[0][1] < vs[1][1] ? vs[1][1] : vs[0][1]

    if (x > xMin && x < xMax && y > yMin && y < yMax) {
      inside = true
    }
    // for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    //     var xi = vs[i][0], yi = vs[i][1]
    //     var xj = vs[j][0], yj = vs[j][1]
        
    //     var intersect = ((yi > y) != (yj > y))
    //         && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
    //     if (intersect) inside = !inside
    // }
    return inside
  }, 
}