//For future reference: 76 x 88

var troll = $('#troll');

var creatures = {};
const images = "assets/images/";
var preloader = [];
var debounce = false;

function addAnim(creature, animName, frames, size, bgX, bgY, wait, plays) {
    //Checking for existing creature name
    var newCreature = creatures[creature];
    if (!newCreature) {
        newCreature = {};
    };
    const originName = animName; //For grabbing the image name
    newCreature.currFrame = 0;
    animName = animName.toLowerCase();
    newCreature[animName] = {};
    newCreature[animName].keyFrames = [];
    newCreature[animName].size = size;
    newCreature[animName].bgX = bgX;
    newCreature[animName].bgY = bgY;
    newCreature[animName].wait = wait;
    newCreature[animName].frame = 0;
    newCreature[animName].plays = plays;
    for (var i = 0; i < frames; i++) {
        let pos = i;
        if (i < 10) {
            pos = "00" + i;
        }
        else if (i < 100) {
            pos = "0" + i;
        }
        newCreature[animName].keyFrames.push(images + creature + "/" + originName + "_" + pos + ".png");
        preloader.unshift(new Image());
        preloader[0].src = images + creature + "/" + originName + "_" + pos + ".png";
    };
    creatures[creature] = newCreature;
};

addAnim("troll_1","Idle", 10, "65%", "65%", "60%", 3, "loop");
addAnim("troll_1","Walk", 10, "72%", "73%", "60%", 4, "loop");
addAnim("troll_1","Dead", 10, "73%", "88%", "79%", 4, 1);
addAnim("troll_1","Hurt", 10, "73%", "43%", "50%", 4, 1);
addAnim("troll_1","Attack", 10, "100%", "", "", 4, 1);

creatures["troll_1"].currentAnim = "walk";

troll.css("left","-45%");

var animInt = setInterval(function(){ 
    var arr = Object.keys(creatures);
    for (var i = 0; i < arr.length; i++) {
        var creature = creatures[arr[i]];
        var anim = creature[creature.currentAnim];
        if (anim && creature.currFrame % anim.wait == 0) {
            troll.css("background-image","url(" + anim.keyFrames[anim.frame] + ")");
            troll.css("background-size",anim.size);
            troll.css("background-position-x",anim.bgX);
            troll.css("background-position-y",anim.bgY);
            anim.frame++;
            if (anim.frame >= anim.keyFrames.length ) {
                anim.frame = 0;
                if (creature.currentAnim == "dead") {
                    anim.frame = anim.keyFrames.length-1;
                    troll.slideUp();
                }
                else if (anim.plays != "loop") {
                    creature.currentAnim = "idle";
                    creature.currFrame = 0;
                };
            };
        };
        creature.currFrame++;
    };
},17);

troll.animate({"left":"20%"},5000,"linear", function() {
    creatures["troll_1"].currentAnim = "idle";
});


$(document).on("keyup", function(event) {
    switch (event.key) {
        case " ":
            creatures["troll_1"].currentAnim = "attack";
        break;
        case "w":
            creatures["troll_1"].currentAnim = "walk";
        break;
        case "h":
            creatures["troll_1"].currentAnim = "hurt";
        break;
        case "d":
            creatures["troll_1"].currentAnim = "dead";
        break;
        case "b":
            creatures["troll_1"].currentAnim = "break";
        break;
    };
    creatures["troll_1"].currFrame = 0;
});