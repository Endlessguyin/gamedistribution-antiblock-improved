console.log(
    "%cGDAB is running!", 
    "color: white; " +
    "background-color: black; " +
    "font-size: 22px; " +
    "text-align: center; " +
    "display: block; " +
    "padding: 10px"
);
console.log(
    "%cGameDistribution-AntiBlock BETA, by syncintellect @ github", 
    "color: white; " +
    "background-color: black; " +
    "font-size: 12px; " +
    "text-align: center; " +
    "display: block; " + 
    "padding: 10px"
);
alert("If you see a confirmation prompt asking to leave the page, please select cancel.")

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
