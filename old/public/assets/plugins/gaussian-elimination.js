let gauss = function (mat) {
  function getRow (mat, i0) {
    for (let i = i0; i < mat.length; i++) {
      if (mat[i][i0] === 0) continue
      let tempRow = mat[i0]
      mat[i0] = mat[i]
      mat[i] = tempRow
      return mat[i0]
    }
  }

  function eliminateDown (mat, i0) {
    let row0 = mat[i0]
    for (let i = i0 + 1; i < mat.length; i++) {
      let row = mat[i]
      if (row[i0] === 0) continue
      let mul = row[i0] / row0[i0]
      for (let j = i0 + 1; j < row0.length; j++) { row[j] -= row0[j] * mul }
      row[i0] = 0
    }
  }

  function eliminateUp (mat, i0) {
    let row0 = mat[i0]
    for (let i = i0 - 1; i >= 0; i--) {
      let row = mat[i]
      if (row[i0] === 0) continue
      let mul = row[i0] / row0[i0]
      for (let j = i0 + 1; j < row0.length; j++) { row[j] -= row0[j] * mul }
      row[i0] = 0
    }
  }

  mat = mat.slice()
  for (let i = 0; i < mat.length; i++) mat[i] = mat[i].slice()

  for (let i = 0; i < mat.length - 1; i++) {
    getRow(mat, i)
    eliminateDown(mat, i)
  }
  let res = new Array(mat.length)
  for (let i = mat.length - 1; i > 0; i--) {
    eliminateUp(mat, i)
  }
  for (let i = 0; i < res.length; i++) {
    res[i] = mat[i][mat[i].length - 1] / mat[i][i]
  }
  return res
}

if (this.window && this === window) this.gauss = gauss
else module.exports = gauss
