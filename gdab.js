console.log(
    "%cGDAB is running!", 
    "color: white; " +
    "background-color: black; " +
    "font-size: 22px; " +
    "text-align: center; " +
    "display: block; " +  // Needed for text-align to work
    "padding: 10px"      // Adds some spacing around the text
);
console.log(
    "%cGameDistribution-AntiBlock BETA, by syncintellect @ github", 
    "color: white; " +
    "background-color: black; " +
    "font-size: 12px; " +
    "text-align: center; " +
    "display: block; " +  // Needed for text-align to work
    "padding: 10px"      // Adds some spacing around the text
);
alert("If you see a confirmation prompt asking to leave the page, please click cancel.")

window.onbeforeunload = function (e) {
  var message = "a",
    e = e || window.event;
  // For IE and Firefox
  if (e) {
    e.returnValue = message;
  }

  // For Safari
  return message;
};
