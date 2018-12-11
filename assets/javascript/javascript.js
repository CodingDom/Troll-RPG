//For future reference: 76 x 88

var troll = document.getElementById('troll');
var anims = [];
const images = "assets/images/";

function addAnim(creature, animName,frames) {
    for (var i = 0; i < frames; i++) {
        let pos = i;
        if (i < 10) {
            pos = "00" + i;
        }
        else if (i < 100) {
            pos = "0" + i;
        }
        anims.push(images + creature + "/" + animName + "_" + pos + ".png");
    };
};

addAnim("troll_1","Idle", 10);

var num = 0;
var animInt = setInterval(function(){ 
    num++;
    if (num >= anims.length) {
        num = 0;
    };
    troll.src = anims[num];
},60);
