//Grid setup
//Adjust gridHeight value to change grid size
const gridHeight = 5;
const gridSize = gridHeight ** 2;
//padding-bottom and width must be 1:1 ratio for div to be square.
const squareSize = `${100 / gridHeight}%`;

//DOM ELEMENTS
const navBar = document.getElementById("div--nav-bar")
const grid = document.getElementById("div--grid")
const redInput = document.getElementById("input--red");
const greenInput = document.getElementById("input--green");
const blueInput = document.getElementById("input--blue");
const colorSubmitButton = document.getElementById("button--color-submit")

//User search
let colorSearch;

//Style settings
const maxRGBValue = 255;

document.addEventListener("DOMContentLoaded", () => {
  colorSearch = {
    red: generateRandom(maxRGBValue),
    green: generateRandom(maxRGBValue),
    blue: generateRandom(maxRGBValue),
  }
  let selectedColors = createColorString(colorSearch);
  createGrid(selectedColors);
})

colorSubmitButton.onclick = function(event){
  colorSearch = {
    red: redInput.value,
    green: greenInput.value,
    blue: blueInput.value,
  }
  createGrid(colorSearch)
}


function createGrid(colorSearch){
  resetGrid("square");
  for(let i = 0; i < gridSize; i++){
    let selectedColors = createColorString(handleUserInput(colorSearch));

    //Create text nodes
    let text = document.createElement("p");
    text.className = "text";
    text.innerText = "#f7cc47";

    //Create squares
    let square = document.createElement("div");
    square.className = `square ${i}`;
    square.style.width = squareSize;
    square.style.paddingBottom = squareSize;
    square.style.backgroundColor = selectedColors;

    //Append new nodes to display in DOM
    square.append(text);
    grid.append(square);

    square.addEventListener("click", handleSquareClick);
  }
}

function handleSquareClick(event) {
  // console.log("YOU CLICKED ON", event.target.attributes.style.nodeValue)
  let nodeValueArray = event.target.attributes.style.nodeValue.split(";");
  let backgroundColorString = nodeValueArray.find(string => string.includes("background-color"))
  updateUserInput(parseRGB(backgroundColorString));

}

function parseRGB(backgroundColorString){
  let parsedArray = backgroundColorString.replace(/[^0-9$.,]/g, '').split(",")
  return colorSearch = {
    red: parsedArray[0],
    green: parsedArray[1],
    blue: parsedArray[2],
  }
}

function updateUserInput(colorObject){
  redInput.value = colorObject.red;
  greenInput.value = colorObject.green;
  blueInput.value = colorObject.blue;
}

function generateRandom(num){
  return Math.floor(Math.random() * Math.floor(num));
}

function handleUserInput({red, green, blue}){
  let colorArray = [parseInt(red), parseInt(green), parseInt(blue)];
  return colorArray.map(color => {
    if(isNaN(color)){
      return color = generateRandom(maxRGBValue);
    }
    else {
      return color;
    }
  })
}

function createColorString(colorArray){
  return `rgb(${colorArray[0]}, ${colorArray[1]}, ${colorArray[2]})`;
}

function resetGrid(className){
  let squares = document.getElementsByClassName(className);
  while (0 < squares.length){
    squares[0].parentNode.removeChild(squares[0]);
  }
}
