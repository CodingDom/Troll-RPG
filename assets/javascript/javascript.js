//For future reference: 76 x 88

var troll = document.getElementById('troll');
var anims = [];
const images = "assets/images/troll_1/";

function addAnim() {
    for (var i = 0; i < arguments.length; i++) {
        anims.push(images + arguments[i]);
    };
};

addAnim("Idle_000","Idle_001","Idle_002","Idle_003","Idle_004","Idle_005","Idle_006","Idle_007","Idle_008","Idle_009");

var num = 0;
var animInt = setInterval(function(){ 
    num++;
    if (num >= anims.length) {
        num = 0;
    };
    troll.src = anims[num] + ".png";
},60);
