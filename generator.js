const generateCssButton = document.getElementById("generateCssButton");
const argumentStarts = ["%d", "%r"];

function generateCss(){
  //Break if not every value is present
  if(document.getElementById("stepCountInput").value.length <= 0){
    return;
  }

   const currentKeyFrameCount = parseInt(document.getElementById("stepCountInput").value);
  //Delete all Empty fields
   deleteEmptyCssAttributFields();


   //Get currentContent
   var currentAttributeContent = getCssAttributeContent();

   if(currentAttributeContent.length >= 1 && currentAttributeContent[0].length == 0){
    return;
   }

   //clear output for new
   clearCodeOutput();

   //Calculate % increment for each keyframe and set starting default
    //Calculate
    const percentIncrement = 100/(currentKeyFrameCount - 1);
    //Default
    var currentKeyFramePercentValue = 0;

   //Generate values for each keyframe
   for(var i = 0; i < currentKeyFrameCount; i++){
    var currentKeyFrameValues = [];

    //Replace all the arguments
   for(var a = 0; a < currentAttributeContent.length; a++){
     currentKeyFrameValues.push(findAndReplaceArguments(currentAttributeContent[a]));
   }

   //Print Current Keyframe
    //Header
   printlnCodeOutput(Math.round(currentKeyFramePercentValue) + "% {");
   //print each value
   for(var a = 0; a < currentKeyFrameValues.length; a++){
     printlnCodeOutput(currentKeyFrameValues[a] + ";");
   }
   //print bottom
   printlnCodeOutput("}");


   currentKeyFramePercentValue += percentIncrement;
 }

}

function findAndReplaceArguments(cssAttributeString){
  //Check if Arguments are in String
  for(var i = 0; i < argumentStarts.length; i++){
     if(cssAttributeString.includes(argumentStarts[i])){
        //Finding and replacing the argument until now arguments are found anymore
        var allArgumentsDone = false;

        while(!allArgumentsDone) {
         var currentReplacingIndex = cssAttributeString.search(argumentStarts[i] + "{");
         //Check if there are arguments left
          if(currentReplacingIndex != -1){
            //extract Argument
            var currentArgumentIndex = currentReplacingIndex;
            var currentArgumentString = "";

            while(cssAttributeString.charAt(currentArgumentIndex) != "}"){
              currentArgumentString += cssAttributeString.charAt(currentArgumentIndex);
              currentArgumentIndex++;
            }

            //Ad last bracke
            currentArgumentString += "}";

            //Execute the Argument and get corresponding value
            var argumentValue = executeArgument(currentArgumentString);

            //Replace argument with value
            cssAttributeString = cssAttributeString.replace(currentArgumentString, argumentValue);

          }else{
            allArgumentsDone = true;
          }

        }

     }
  }

  return cssAttributeString;

}

function executeArgument(argument){
   //extract argument start
   var argumentStart = argument.charAt(1);

   switch(argumentStart){
     case "d":
     //Extract first number
     var currentArgumentParameterIndex = argument.search("{");
     //Go to first Value Index
     currentArgumentParameterIndex++;
     //Extract From-Value
     var fromValueString = "";

     while(argument.charAt(currentArgumentParameterIndex) != '-'){
       //Dont save if char is an space
       if(argument.charAt(currentArgumentParameterIndex) != ' '){
       fromValueString += argument.charAt(currentArgumentParameterIndex);
       }
       currentArgumentParameterIndex++;
     }

     //Extract to-Value String and fixedNumberString
     var toValueString = "";
     var fixedNumberString = "";
     //Skip -
     currentArgumentParameterIndex++;

    //Extract fixedNumber if exists
    if(argument.includes(",")){

     while(argument.charAt(currentArgumentParameterIndex) != ','){
       //Dont save if char is an space
       if(argument.charAt(currentArgumentParameterIndex) != ' '){
       toValueString += argument.charAt(currentArgumentParameterIndex);
       }
       currentArgumentParameterIndex++;
     }

     //Skip ,
     currentArgumentParameterIndex++;

     while(argument.charAt(currentArgumentParameterIndex) != '}'){
       //Dont save if char is an space
       if(argument.charAt(currentArgumentParameterIndex) != ' '){
        fixedNumberString += argument.charAt(currentArgumentParameterIndex);
       }
       currentArgumentParameterIndex++;
     }


   }else{
     //Extract only to Value String and Set fixedNumber to default
     //Default
    fixedNumberString = "0";

    //Extract To-Value
    while(argument.charAt(currentArgumentParameterIndex) != '}'){
      //Dont save if char is an space
      if(argument.charAt(currentArgumentParameterIndex) != ' '){
      toValueString += argument.charAt(currentArgumentParameterIndex);
      }
      currentArgumentParameterIndex++;
    }

   }

     //Cast values
     var from = parseFloat(fromValueString);
     var to = parseFloat(toValueString);
     var fixedNumber = parseInt(fixedNumberString);

     //Generate Random number
      var randomNumber = getRandomFloatBetween(from, to);

     //Fit number according to input values
     if(fixedNumber > 0){
       //Return random number with instructed after Comma count
       return randomNumber.toFixed(fixedNumber);
     }else{
       //Return rounded Value
       return Math.round(randomNumber);
     }

     break;

     case "r":
     //Extract argument list
     var currentArgumentParameterIndex = argument.search("{");
     //Go to first list value Index
     currentArgumentParameterIndex++;
     //Extract argument list
     var argumentList = [];

     var currentArgumentListIndex = 0;
     while(argument.charAt(currentArgumentParameterIndex) != "}"){

       if(argument.charAt(currentArgumentParameterIndex) == ";"){
         currentArgumentListIndex++;
       }else{

       if(currentArgumentListIndex == argumentList.length){
         argumentList.push(argument.charAt(currentArgumentParameterIndex));
       }else{
         argumentList[currentArgumentListIndex] += argument.charAt(currentArgumentParameterIndex);
       }

     }

       currentArgumentParameterIndex++;
     }

     //Remove unwanted whitespaces
     for(var i = 0; i < argumentList.length; i++){
       argumentList[i] = argumentList[i].trim();
     }

     //Get random index for list
     var randomIndex = getRandomIntBetween(0, argumentList.length - 1);

     //return corresponding value
     return argumentList[randomIndex];

     break;
   }

}

//Returns a float between two values
function getRandomFloatBetween(from, to){
  var maxRandomAmount = to - from;

  var randomAddAmount = Math.random() * maxRandomAmount;

  return from + randomAddAmount;
}

//Returns an integer between
function getRandomIntBetween(from, to){
  return Math.round(getRandomFloatBetween(from, to));
}

//Returns an String-Array with each Css Attribute Field
function getCssAttributeContent(){
   //Attribut Fields
   var cssAttributeFields = getCurrentCssAttributeElements();
   //Content Array
   var cssAttributeContent = [];

   for(var i = 0; i < cssAttributeFields.length; i++){
      cssAttributeContent.push(cssAttributeFields[i].value.trim());
   }

   return cssAttributeContent;
}

//Set event Listeners
generateCssButton.addEventListener("click", generateCss);
