//Grid setup
//Adjust gridHeight value to change grid size
const gridHeight = 10;
const gridSize = gridHeight ** 2;
//padding-bottom and width must be 1:1 ratio for div to be square.
const squareSize = `${100 / gridHeight}%`;

//DOM ELEMENTS
const navBar = document.getElementById("div--nav-bar")
const grid = document.getElementById("div--grid")
const redInput = document.getElementById("input--red");
const greenInput = document.getElementById("input--green");
const blueInput = document.getElementById("input--blue");
const hexInput = document.getElementById("input--hex");
const colorSubmitButton = document.getElementById("button--color-submit")

//User search
let colorSearch;

//Style settings
const maxRGBValue = 255;

function createGrid(colorPicker){
  for (let i = 0; i < gridSize; i++){
    let square = document.createElement("div");
    let text = document.createElement("p");
    text.className = "text";
    text.innerText = "#f7cc47";
    square.className = `square ${i}`;
    square.style.width = squareSize;
    square.style.paddingBottom = squareSize;
    square.style.backgroundColor = colorPicker();
    square.append(text);
    grid.append(square);
  }
}

colorSubmitButton.onclick = function(event){
  colorSearch = {
    red: checkRGB(redInput.value),
    green: checkRGB(greenInput.value),
    blue: checkRGB(blueInput.value),
    hex: checkHex(hexInput.value),
  }
  redInput.value = colorSearch.red;
  greenInput.value = colorSearch.green;
  blueInput.value = colorSearch.blue;
  hexInput.value = colorSearch.hex;
}

function checkRGB(value){
  if (value > 255){
    return value = 255;
  }
  else if (value < 0){
    return value = 0;
  }
  return parseInt(value);
}

function checkHex(value){
  value = value.replace(/[^A-Fa-f0-9]/g, "");
  if(value.length === 3){
    return value;
  }
  else if(value.length === 6){
    return value;
  }
  else{
    return "ffffff"
  }
}

function generateRandom(num){
  return Math.floor(Math.random() * Math.floor(num));
}

function randomColor(){
  return `rgb(${generateRandom(maxRGBValue)}, ${generateRandom(maxRGBValue)}, ${generateRandom(maxRGBValue)})`
}

createGrid(randomColor)
