//For future reference: 76 x 88

var troll = document.getElementById('troll');

var creatures = {};
const images = "assets/images/";
var preloader = [];

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

creatures["troll_1"].currentAnim = "idle";

var animInt = setInterval(function(){ 
    var arr = Object.keys(creatures);
    for (var i = 0; i < arr.length; i++) {
        var creature = creatures[arr[i]];
        var anim = creature[creature.currentAnim];
        if (anim && creature.currFrame % anim.wait == 0) {
            troll.style.backgroundImage = "url(" + anim.keyFrames[anim.frame] + ")";
            troll.style.backgroundSize = anim.size;
            troll.style.backgroundPositionX = anim.bgX;
            troll.style.backgroundPositionY = anim.bgY;
            anim.frame++;
            if (anim.frame >= anim.keyFrames.length ) {
                anim.frame = 0;
                if (creature.currentAnim == "dead") {
                    anim.frame = anim.keyFrames.length-1;
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


document.onkeyup = function(event) {
    if (event.key == " ") {
        creatures["troll_1"].currentAnim = "attack";
        creatures["troll_1"].currFrame = 0;
    }
    else if (event.key == "w") {
        creatures["troll_1"].currentAnim = "walk";
        creatures["troll_1"].currFrame = 0;
    }
    else if (event.key == "h") {
        creatures["troll_1"].currentAnim = "hurt";
        creatures["troll_1"].currFrame = 0;
    }
    else if (event.key == "d") {
        creatures["troll_1"]["dead"].frame = 0;
        creatures["troll_1"].currentAnim = "dead";
        creatures["troll_1"].currFrame = 0;
    }
    else if (event.key == "b") {
        creatures["troll_1"].currentAnim = "break";
        creatures["troll_1"].currFrame = 0;
    }
}