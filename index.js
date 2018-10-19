//Grid setup
//Adjust gridHeight value to change grid size
const gridHeight = 5;
const gridSize = gridHeight ** 2;
const squareSize = `${(100 / gridHeight)}%`;

//DOM ELEMENTS
const grid = document.getElementById("div--grid");
const rightColumn = document.getElementById("div--right-column");
const navBar = document.getElementById("div--nav-bar");
const redInput = document.getElementById("input--red");
const greenInput = document.getElementById("input--green");
const blueInput = document.getElementById("input--blue");
const colorSubmitButton = document.getElementById("button--color-submit");
const hexInput = document.getElementById("input--hex");
const hexSubmitButton = document.getElementById("button--hex-submit");
const selectedColorDiv = document.getElementById("div--selected-color");
const sampleColor = document.getElementById("div--sample");
const colorHistoryDiv = document.getElementById("div--color-history");
const colorHistoryList = document.getElementById("ul--color-history-list");
const cssGradientDiv = document.getElementById("div--css-gradient");
const cssGradientSample = document.getElementById("div--gradient-sample");
const cssGradientSpan = document.getElementById("span--css-gradient");

//User actions
let colorSearch;
let colorHistory = [];

//Style settings
const maxRgbValue = 255;



// ------------ //
//Event handlers
// ------------ //

//Page will generate random colors on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  //randomColorObj() will generate a random object with a random RGB value
  colorSearch = randomColorObj();
  //Convert RGB to a hex code
  let foundHexCode = convertRgbToHexCode(colorSearch);
  //Update user input form in right column with the randomized data
  updateRgbForm(colorSearch);
  //Create a grid with the random color object
  createGrid(colorSearch);
});
//This function is invoked when RGB form is submitted
colorSubmitButton.onclick = function(event){
  //save colors from user input in an object to prepare for createGrid function
  colorSearch = {
    red: redInput.value,
    green: greenInput.value,
    blue: blueInput.value,
  }
  //Updates grid based on submitted RGB color
  createGrid(colorSearch);
}
//This function is invoked when Hex form is submitted.
hexSubmitButton.onclick = function(event){
  //obtains hexString from submitted form and updates all fields with appropriate info
  let hexString = hexInput.value;
  //Convert hex to RGB value to update RGB user input form
  let rgbValue = convertHexToRgb(hexString);
  //Updating user input fields
  updateAllForms(rgbValue, hexString);
  //Create a grid with the converted rgb value
  createGrid(rgbValue);
}
//This method handles when user clicks on one of the grid tiles
function handleSquareClick(event){
  //Display selectedColor div when a square is clicked for the first time
  selectedColorDiv.style.display = "inline";
  //Click will grab the desired node. (Will grab parent if child of desired node is clicked)
  let desiredNode;
  if(event.target.nodeName === "P"){
    desiredNode = event.target.parentNode;
  }
  else {
    desiredNode = event.target;
  }
  //Find background-color key on object and access value.
  let nodeValueArray = desiredNode.attributes.style.nodeValue.split(";");
  let backgroundColorString = nodeValueArray.find(string => string.includes("background-color"));
  //Prepare colors to update the sample color and forms
  let foundColorObject = parseRgb(backgroundColorString);
  let foundHexCode = convertRgbToHexCode(foundColorObject);
  //Update sample color by converting data into CSS-usable string
  sampleColor.style.backgroundColor = createColorString(foundColorObject);
  //Update forms to display current color data
  updateAllForms(foundColorObject, foundHexCode);
  //Clicking on a square will add it to color history later so user can revisit later
  addColorToHistory(foundHexCode);
}



// ------------ //
//Input handling
// ------------ //

//parses RGB string and returns an RGB object
function parseRgb(backgroundColorString){
  //remove unneccessary characters and split into array
  let parsedArray = backgroundColorString.replace(/[^0-9$.,]/g, '').split(",");
  return colorSearch = {
    red: parsedArray[0],
    green: parsedArray[1],
    blue: parsedArray[2],
  }
}
//Cleans colors for consistent manipulation after user submits
function handleUserInput({red, green, blue}){
  //Create array from arguments
  let colorArray = [red, green, blue];
  //Iterate over array and prepare colors either by randomly assigning value or processing string to be usable
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
//Converts rgb object to a CSS-usable string
function createColorString(colorObject){
  return `rgb(${colorObject.red}, ${colorObject.green}, ${colorObject.blue})`;
}
//Adds zeros to beginning of color string for conversion between RGB and hex later on
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
    let textToDisplay = convertRgbToHexCode(selectedColorsObject);
    text.innerText = `#${textToDisplay}`;

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

//Generates random object that assigns up to two values for RGB
function randomColorObj(){
  let randomObj = {};
  let colorArray = ["red", "green", "blue"];
  randomObj[colorArray[generateRandom(3)]] = generateRandomStringNumber(maxRgbValue);
  randomObj[colorArray[generateRandom(3)]] = generateRandomStringNumber(maxRgbValue);
  if(!randomObj["red"]){
    randomObj["red"] = "";
  }
  if(!randomObj["green"]){
    randomObj["green"] = "";
  }
  if(!randomObj["blue"]){
    randomObj["blue"] = "";
  }
  return randomObj;
}

//Generates random integer. Argument is the maximum value
function generateRandom(num){
  return Math.floor(Math.random() * Math.floor(num));
}

//Generates a random integer. Argument is maximum value. Outputs a string instead of number
function generateRandomStringNumber(num){
  return prepareRgbValue(Math.floor(Math.random() * Math.floor(num))).toString();
}

//Converts RGB object to a valid hex code. Also formats strings properly so that hex number is complete.
function convertRgbToHexCode({red, green, blue}){
  if(red == ""){
    red = generateRandomStringNumber(maxRgbValue);
  } else if(green == ""){
    green = generateRandomStringNumber(maxRgbValue);
  }
  else if(blue === ""){
    blue = generateRandomStringNumber(maxRgbValue);
  }
  let fullRed = fillString(parseInt(red).toString(16))
  let fullGreen = fillString(parseInt(green).toString(16))
  let fullBlue  = fillString(parseInt(blue).toString(16))
  let full = (fullRed + fullGreen + fullBlue);
  return full;
}

//Converts from hex to RGB value
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

//Adds neccessary zeros to convert string to Hex from RGB
function fillString(color){
  if (color.length < 2){
    return ("0" + color);
  }
  else {
    return color;
  }
}

//Declarative inputs

//Updates forms with apropriate rgb and hex values
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

//Color history
//Adds hex codes to color history and displays a list with a sample in right column
function addColorToHistory(hexCode){
  colorHistory.push(hexCode);
  let rgbObject = convertHexToRgb(hexCode);
  if(colorHistoryDiv.style.display !== "none"){
    colorHistoryDiv.style.display = "inline";
  }
  //Create elements that will contain color and text data
  let li = document.createElement("li");
  let colorSample = document.createElement("div");
  let colorSpan = document.createElement("span");

  //Add selectors for CSS to style
  li.className = "li--history"
  colorSample.className = "div--sample-li"

  //Add apropriate hexCode and text from selected color
  colorSample.style.backgroundColor = `#${hexCode}`;
  colorSpan.innerText = `#${hexCode}`

  //append elements to DOM
  li.append(colorSample);
  li.append(colorSpan);
  colorHistoryList.append(li);
  updateGradient(colorHistory)

  //Add event listener for when user clicks on history elements
  li.onclick = function(event){
    //update selectedColor when click on history li
    colorHistory.push(hexCode);
    sampleColor.style.backgroundColor = `#${hexCode}`;
    updateAllForms(rgbObject, hexCode);
    if(colorHistory.length >= 2){
      updateGradient(colorHistory)
    }
  }

}

//Updates the gradient and CSS when two or more colors have been selected
function updateGradient(colorHistory){
  if(colorHistory.length >= 2){
    cssGradientDiv.style.display = "inline";
     let gradientCSS = `linear-gradient(90deg, #${colorHistory[colorHistory.length - 1]} 0%, #${colorHistory[colorHistory.length - 2]} 100%)`
     cssGradientSpan.innerText = `background: ${gradientCSS};`;
     cssGradientSample.style.background = gradientCSS;
  }
}
