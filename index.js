module.exports = function () {
  var mesh = { positions: [[0,0]], cells: [] }
  mesh.positions.push([0,1])
  for (var i = 0; i <= 4; i++) {
    mesh.positions.push([i/4*2*Math.PI+Math.PI/4,1])
  }
  for (var i = 2; i < mesh.positions.length; i++) {
    mesh.cells.push([0,i-1,i])
  }
  return mesh
}
