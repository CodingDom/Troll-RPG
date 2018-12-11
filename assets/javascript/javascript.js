//For future reference: 76 x 88

var player = $('#player');
var enemy = $('#enemy');

var creatures = {};
var active = ["troll_1","troll_3"];

const images = "assets/images/";
var preloader = [];
var debounce = false;
var entered = false;

function addAnim(creature, animName, frames, size, bgX, bgY, wait, plays) {
    //Checking for existing creature name
    var newCreature = creatures[creature];
    if (!newCreature) {
        newCreature = {};
    };
    const originName = animName; //For grabbing the image name
    newCreature.currFrame = 0;
    newCreature.currentAnim = "walk";   
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

function attack(troll,name,origPos,pos) {
    entered = false;
    creatures[name].currentAnim = "walk";
    creatures[name].currFrame = 0;
    troll.animate({"left":pos},2000,function() {
        creatures[name].currentAnim = "attack";   
        setTimeout(function() {
            if (active.indexOf(name) == 0) {
                creatures[active[1]].currentAnim = "hurt";
                enemy.css("filter","hue-rotate(300deg)");
            };
        },400);
        setTimeout(function(){
            creatures[name]['attack'].frame = 0;
            creatures[name].currentAnim = "walk";
            troll.css("transform","scaleX(-1)");
            troll.animate({"left":origPos},2000,function() {
                creatures[name].currentAnim = "idle";
                troll.css("transform","scaleX(1)");
                entered = true;
            });
        },600);
    });
};

addAnim("troll_1","Idle", 10, "65%", "65%", "60%", Math.floor(Math.random()*3)+3, "loop");
addAnim("troll_1","Walk", 10, "72%", "73%", "60%", 4, "loop");
addAnim("troll_1","Dead", 10, "73%", "88%", "79%", 4, 1);
addAnim("troll_1","Hurt", 10, "73%", "43%", "50%", 4, 1);
addAnim("troll_1","Attack", 10, "100%", "", "", 4, 1);

addAnim("troll_2","Idle", 10, "65%", "65%", "60%", Math.floor(Math.random()*3)+3, "loop");
addAnim("troll_2","Walk", 9, "72%", "73%", "60%", 4, "loop");
addAnim("troll_2","Dead", 10, "73%", "88%", "79%", 4, 1);
addAnim("troll_2","Hurt", 10, "73%", "43%", "50%", 4, 1);
addAnim("troll_2","Attack", 10, "100%", "", "", 4, 1);

addAnim("troll_3","Idle", 10, "65%", "65%", "60%", Math.floor(Math.random()*3)+3, "loop");
addAnim("troll_3","Walk", 9, "72%", "73%", "60%", 4, "loop");
addAnim("troll_3","Dead", 10, "73%", "88%", "79%", 4, 1);
addAnim("troll_3","Hurt", 10, "73%", "43%", "50%", 5, 1);
addAnim("troll_3","Attack", 10, "100%", "", "", 4, 1);

player.css("left","-85vh");
enemy.css("left","185vh");

enemy.css("transform","scaleX(-1)");



enemy.animate({"left":"80vh"},5000,"linear", function() {
    creatures[active[1]].currentAnim = "idle";
});

player.animate({"left":"20vh"},5000,"linear", function() {
    creatures[active[0]].currentAnim = "idle";
    entered = true;
});

var animInt = setInterval(function(){ 
    for (var i = 0; i < active.length; i++) {
        var creature = creatures[active[i]];
        var anim = creature[creature.currentAnim];
        var troll;
        if (i == 0) {
            troll = player;
        }
        else {
            troll = enemy;
        };
        if (anim && creature.currFrame % anim.wait == 0) {
            troll.css("background-image","url(" + anim.keyFrames[anim.frame] + ")");
            troll.css("background-size",anim.size);
            troll.css("background-position-x",anim.bgX);
            troll.css("background-position-y",anim.bgY);
            if (creature.currentAnim == "attack") {
                troll.css("z-index",5); 
            }
            else {
                troll.css("z-index",1); 
            };
            anim.frame++;
            if (anim.frame >= anim.keyFrames.length ) {
                anim.frame = 0;
                if (creature.currentAnim == "dead") {
                    anim.frame = anim.keyFrames.length-1;
                    // troll.slideUp();
                }
                else if (anim.plays != "loop") {
                    if (creature.currentAnim == "hurt") {
                        enemy.css("filter","hue-rotate(0deg)");
                    };
                    creature.currentAnim = "idle";
                    creature.currFrame = 0;
                };
            };
        };
        creature.currFrame++;
    };
},17);

$(document).on("keyup", function(event) {
    if (!entered) {
        return;
    };
    switch (event.key) {
        case " ":
            attack(player,active[0],"20vh","60vh");
        break;
        case "w":
            creatures[active[0]].currentAnim = "walk";
        break;
        case "h":
            creatures[active[0]].currentAnim = "hurt";
        break;
        case "d":
            creatures[active[0]].currentAnim = "dead";
        break;
        case "b":
            creatures[active[0]].currentAnim = "break";
        break;
    };
    creatures[active[0]].currFrame = 0;
});

