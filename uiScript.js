const addCssAttributeButton = document.getElementById("addCSSAttributeButton");
const cssAttributeClassName = "cssAttribute";
const codeOutput = document.getElementById("codeOutput");

function addCssAttributeField(){
    var lastCssAttributeField = getCurrentCssAttributeElements();
    lastCssAttributeField = lastCssAttributeField[lastCssAttributeField.length - 1];

    //Add after last element one break with new Input and deleteButton
    var newBr = document.createElement("br");
    var newInput = document.createElement("input");
    var newDeleteButton = document.createElement("input");

    newInput.setAttribute("class", cssAttributeClassName);
    newInput.setAttribute("type", lastCssAttributeField.getAttribute("type"));
    newInput.setAttribute("placeholder", lastCssAttributeField.getAttribute("placeholder"));

    newDeleteButton.setAttribute("type", "button");
    newDeleteButton.setAttribute("class", "removeCssAttribute");
    newDeleteButton.setAttribute("value", "X");

    //Add Eventlistener to Button
    newDeleteButton.addEventListener("click", deleteCssAttributeField);

    //if first Add
    if(getCurrentCssAttributeElements().length <= 1){
    lastCssAttributeField.after(newBr);
    }else{
    lastCssAttributeField.nextElementSibling.after(newBr);
    }
    newBr.after(newInput);
    newInput.after(newDeleteButton);
}

function printlnCodeOutput(textToPrint){
    codeOutput.value += textToPrint.trim() + "\n";
}

function clearCodeOutput(){
   codeOutput.value = "";
}

function deleteCssAttributeField(){
   //Remove elements from tree
   this.previousElementSibling.remove();
   this.previousElementSibling.remove();
   this.remove();
}

function deleteEmptyCssAttributFields(){
   //Get Current AttributeElements
   var currentAttributFields = getCurrentCssAttributeElements();

   //Check each field
   //(Skip first field)
   var emptyAttributeFieldIds = [];

   for(var i = 1; i < currentAttributFields.length; i++){
     //Check if Field is empty
     var currentAttributFieldValue = currentAttributFields[i].value.trim();

     //check if Value is empty and save the id
     if(currentAttributFieldValue.length == 0){
       emptyAttributeFieldIds.push(i);
     }

   }

   //Delete all empty fields
   for(var i = emptyAttributeFieldIds.length - 1; i >= 0; i--){
     currentAttributFields[emptyAttributeFieldIds[i]].nextElementSibling.click();
   }

   //move second to first if first one empty
   if(currentAttributFields[0].value.length == 0){
     //only if second one exists
     if(currentAttributFields.length > 1){
            currentAttributFields[0].value = currentAttributFields[1].value;
            currentAttributFields[1].nextElementSibling.click();
     }

    }

}

function getCurrentCssAttributeElements(){
  return document.getElementsByClassName(cssAttributeClassName);
}

function onDocumentLoad(){
  //Write KeyframeCount caption
  var keyframeInput = document.getElementById("stepCountInput");
  var min = keyframeInput.getAttribute("min");
  var max = keyframeInput.getAttribute("max");

  if(min == null || min == ""){
    min = 2;
    keyframeInput.setAttribute("min", min);
  }

  if(max == null || max == ""){
    max = 2;
    keyframeInput.setAttribute("max", max);
  }

  keyframeInput.before("(max: "+ max +", min: "+ min +"): ");
}

//Add Eventlisteners
addCSSAttributeButton.addEventListener("click", addCssAttributeField)
window.addEventListener("load", onDocumentLoad);
