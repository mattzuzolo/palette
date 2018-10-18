//Grid setup
//Adjust gridHeight value to change grid size
const gridHeight = 5;
const gridSize = gridHeight ** 2;
//padding-bottom and width must be 1:1 ratio for div to be square.
const squareSize = `${(100 / gridHeight) - 0.25}%`;

//DOM ELEMENTS
const grid = document.getElementById("div--grid")
const rightColumn = document.getElementById("div--right-column");
const navBar = document.getElementById("div--nav-bar")
const selectedColorDiv = document.getElementById("div--selected-color");
const sampleColor = document.getElementById("div--sample")
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
    red: generateRandomStringNumber(maxRgbValue),
    green: generateRandomStringNumber(maxRgbValue),
    blue: "",
  }
  let foundHexCode = convertRgbToHexCode(colorSearch);
  updateAllForms(colorSearch,foundHexCode);
  createGrid(colorSearch);
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
  updateAllForms(rgbValue, hexString)
  createGrid(rgbValue);
}
function handleSquareClick(event) {
  //Display selectedColor div when a square is clicked for the first time
  selectedColorDiv.style.display = "inline";
  //obtains styling from node's style upon click
  let desiredNode;
  //Get targeted node. Grab parent if user clicks on the text
  if(event.target.nodeName === "P"){
    desiredNode = event.target.parentNode;
  }
  else {
    desiredNode = event.target;
  }
  //Find background-color key on object and access value.
  let nodeValueArray = desiredNode.attributes.style.nodeValue.split(";");
  let backgroundColorString = nodeValueArray.find(string => string.includes("background-color"))
  let foundColorObject = parseRgb(backgroundColorString);
  let foundHexCode = convertRgbToHexCode(foundColorObject);
  sampleColor.style.backgroundColor = createColorString(foundColorObject);
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
  let colorArray = [red, green, blue];
  let newArray = colorArray.map(color => {
    if(color === ""){
      return generateRandomStringNumber(maxRgbValue);
    }
    else{
      return prepareRgbValue(color);
    }
  })
  return {
    red: newArray[0],
    blue: newArray[1],
    green: newArray[2],
  }
}
function createColorString(colorObject){
  return `rgb(${colorObject.red}, ${colorObject.green}, ${colorObject.blue})`;
}
function prepareRgbValue(color){
  if(color.length < 3){
    while(color.length < 3){
      color = "0" + color;
    }
  }
  return color;
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
    // console.log(`selectedColorsObject`, selectedColorsObject)
    let selectedColorsString = createColorString(selectedColorsObject)

    //Create text nodes that display square color
    let text = document.createElement("p");
    text.className = "p--square-hex-value";
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
function generateRandomStringNumber(num){
  return prepareRgbValue(Math.floor(Math.random() * Math.floor(num))).toString();
}
function convertRgbToHexCode({red, green, blue}){
  if(red == ""){
    red = generateRandomStringNumber(maxRgbValue);
  } else if(green == ""){
    green = generateRandomStringNumber(maxRgbValue);
  }
  else if(blue === ""){
    blue = generateRandomStringNumber(maxRgbValue);
  }
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
