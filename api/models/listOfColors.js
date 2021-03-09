

var GroupOfColors = "FF0000#800000#FFFF00#808000#00FF00#008000#00FFFF#008080#0000FF#000080#FF00FF#800080";
var ListOfColors = GroupOfColors.split('#');
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
var randomNum = getRandomInt(ListOfColors.length);
var color = "0xFF"+ListOfColors[randomNum];
console.log(color)

module.exports = {
  randomColor: function(){
    var randomNum = getRandomInt(ListOfColors.length);
var color = "0xFF"+ListOfColors[randomNum];
console.log(color)
    return color;
  }
};