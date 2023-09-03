tickerMessageInput.addEventListener("keyup",inputChecking);
tickerLengthInput.addEventListener("keyup",inputChecking);

const validMessageInputs = [/[A-z]/, " ", "\n", String.fromCharCode(160)];

// Check every character in the message field and show an error if there
// is an invalid character.
function messageInputChecking(){
  let message = tickerMessageInput;
  // loop through each character in the message and check if the character is 
  // one of our valid characters.
  for (let i=0; i<message.innerText.length; i++){
      let validCounts = 0;
      for (let j = 0; j<validMessageInputs.length; j++){
          if (message.innerText[i].match(validMessageInputs[j])){
              validCounts++;
          }
      }
      // if contains no valid characters
      if (validCounts == 0) {
          showMessageError("Please only use letters and spaces.");
          return false;
      }
  }
  // if includes escape
  if (message.innerText.includes("\\")){
      showMessageError("Message cannot include backslash.");
      return false;
  }
  // the message is empty if it contains a \n or nothing and no letters
  if ((message.innerText.match(/\n/) || message.innerText == "") && !message.innerText.match(/[A-z]/)){
      showMessageError("Message cannot be blank.");
      return false;
  }
  
  message.classList.remove("inputInvalid");
  infoMessage.style.display = "none";
  return true;
}

function lengthInputChecking(){
  for (let i=0; i<tickerLengthInput.value.length;i++){
      if (!tickerLengthInput.value[i].match(/\d/)){
          showLengthError("Length must be a number.");
          return false;
      }
  }

  if (tickerLengthInput.value == ""){
      showLengthError("Length cannot be blank.");
      return false;
  }
  
  if (tickerLengthInput.value < 10 || tickerLengthInput.value > 500){
      showLengthError("Length must be 10 - 500, inclusive.");
      return false;
  }
  tickerLengthInput.classList.remove("inputInvalid");
  infoLength.style.display = "none";
  return true;
}

function showMessageError(errorMessage){
  tickerMessageInput.classList.add("inputInvalid");
  updateTickerButton.setAttribute("disabled", "true");
  infoMessage.style.display = "unset";
  infoMessage.innerText = errorMessage;
}

function showLengthError(errorMessage){
  tickerLengthInput.classList.add("inputInvalid");
  updateTickerButton.setAttribute("disabled", "true");
  infoLength.style.display = "unset";
  infoLength.innerText = errorMessage;
}

function inputChecking(){
  messageValid = messageInputChecking();
  lengthValid = lengthInputChecking();
  if (messageValid & lengthValid){
      updateTickerButton.removeAttribute("disabled");
  }
}
