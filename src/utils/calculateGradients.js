import hexToRgb from './hexToRgb'

export default (numElements, color1, color2) => {
  // Receives the number of elements, the first color of the gradient
  // and the last color. Calculates the micro gradients to be applyed 
  // to each element giving a impression of a big uniform gradient.

  color1 = hexToRgb(color1)
  color2 = hexToRgb(color2)
  
  let firstColor = color1;
  let matrixColors = [];

  const diffR = color2.r - color1.r
  const diffG = color2.g - color1.g
  const diffB = color2.b - color1.b
  
  for (let i = numElements; i >= 0; i--){
    
    let arr = []
    arr[0] = firstColor

    let nextColor = { 
      r: firstColor.r + (diffR / numElements), 
      g: firstColor.g + (diffG/ numElements), 
      b: firstColor.b + (diffB / numElements) 
    }

    arr[1] = nextColor

    firstColor = nextColor

    matrixColors.push(arr)
  }

  // returns a matrix of type [[..., ...], [..., ...]] containing
  // the initial and end points of the gradients for element.

  return matrixColors
}