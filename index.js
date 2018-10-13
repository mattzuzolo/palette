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
const hexInput = document.getElementById("input--hex");
const colorSubmitButton = document.getElementById("button--color-submit")
const hexSubmitButton = document.getElementById("button--hex-submit");

//User search
let colorSearch;

//Style settings
const maxRgbValue = 255;

//Event handlers
document.addEventListener("DOMContentLoaded", () => {
  //Page generates random colors on DOMContentLoaded
  colorSearch = {
    red: generateRandom(maxRgbValue),
    green: generateRandom(maxRgbValue),
    blue: generateRandom(maxRgbValue),
  }
  let selectedColors = createColorString(colorSearch);
  createGrid(selectedColors);
})
colorSubmitButton.onclick = function(event){
  //This function is invoked when RGB form is submitted
  //save colors from user input in object
  colorSearch = {
    red: redInput.value,
    green: greenInput.value,
    blue: blueInput.value,
  }
  //Updates grid based on new RGB color
  createGrid(colorSearch)
}
hexSubmitButton.onclick = function(event){
  //This function is invoked when Hex form is submitted
  //obtains hexString from submitted form and updates all fields with appropriate info
  let hexString = hexInput.value;
  let rgbValue = convertHexToRgb(hexString);
  //Updating fields in declarative manner
  updateHexForm(hexString);
  updateRgbForm(rgbValue);
  createGrid(rgbValue);
}
function handleSquareClick(event) {
  //obtains styling from node's style upon click
  let desiredNode;
  if(event.target.nodeName === "P"){
    desiredNode = event.target.parentNode;
  }
  else {
    desiredNode = event.target;
  }
  let nodeValueArray = desiredNode.attributes.style.nodeValue.split(";");
  let backgroundColorString = nodeValueArray.find(string => string.includes("background-color"))
  let foundColorObject = parseRgb(backgroundColorString);
  let foundHexCode = convertRgbToHexCode(foundColorObject);
  updateAllForms(foundColorObject,foundHexCode);
}


//Input handling
function parseRgb(backgroundColorString){
  //parses style in form of string obtained from DOM
  let parsedArray = backgroundColorString.replace(/[^0-9$.,]/g, '').split(",")
  return colorSearch = {
    red: parsedArray[0],
    green: parsedArray[1],
    blue: parsedArray[2],
  }
}
function handleUserInput({red, green, blue}){
  let colorArray = [parseInt(red), parseInt(green), parseInt(blue)];
  let completeArray = colorArray.map(color => {
    if(isNaN(color)){
      return color = generateRandom(maxRgbValue);
    }
    else {
      return color;
    }
  })
  return {
    red: completeArray[0],
    green: completeArray[1],
    blue: completeArray[2],
  }
}
function createColorString(colorObject){
  return `rgb(${colorObject.red}, ${colorObject.green}, ${colorObject.blue})`;
}


//Grid management
function resetGrid(className){
  let squares = document.getElementsByClassName(className);
  while (0 < squares.length){
    squares[0].parentNode.removeChild(squares[0]);
  }
}
function createGrid(colorSearch){
  //Reset grid so that only one grid displays at any given moment
  resetGrid("square");
  for(let i = 0; i < gridSize; i++){
    //Find or generate colors that will determine each square's css
    //functions cleans and prepare user input to be used below. Generates random colors if neccessary
    let selectedColorsObject = handleUserInput(colorSearch);
    let selectedColorsString = createColorString(selectedColorsObject)

    //Create text nodes that display square color
    let text = document.createElement("p");
    text.className = "text";
    //Update each square to display current hex color
    text.innerText = `#${convertRgbToHexCode(selectedColorsObject)}`;

    //Create squares and add selectors and dynamic styling
    let square = document.createElement("div");
    square.className = `square ${i}`;
    square.style.width = squareSize;
    square.style.paddingBottom = squareSize;
    square.style.backgroundColor = selectedColorsString;

    //Append new nodes to display in DOM
    square.append(text);
    grid.append(square);

    //Add event listener to user can update form by clicking a square
    square.addEventListener("click", handleSquareClick);
  }
}


//Math functions
function generateRandom(num){
  return Math.floor(Math.random() * Math.floor(num));
}
function convertRgbToHexCode({red, green, blue}){
  console.log(`${parseInt(red).toString(16)}${parseInt(green).toString(16)}${parseInt(blue).toString(16)}`)
  return `${parseInt(red).toString(16)}${parseInt(green).toString(16)}${parseInt(blue).toString(16)}`
}
function convertHexToRgb(hexString){
  let rr = hexString.substr(0,2);
  let gg = hexString.substr(2,2);
  let bb = hexString.substr(4,2);
  return {
    red: parseInt(rr, 16),
    green: parseInt(gg, 16),
    blue: parseInt(bb, 16),
  }
}


//Declarative inputs
function updateRgbForm({red, green, blue}){
  redInput.value = red;
  greenInput.value = green;
  blueInput.value = blue;
}
function updateHexForm(hexString){
  hexInput.value = hexString;
}
function updateAllForms(rgbObject, hexString){
  updateRgbForm(rgbObject)
  updateHexForm(hexString)
}
