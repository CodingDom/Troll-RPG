var tick;

//Grabbing character divs
var player;
var enemy;

//List of creatures
var creatures = {};
var active = ["troll_1","troll_3"]; //The creatures on the battlefield

const images = "assets/images/";
var preloader = []; //Preloading all of the sprite animations
var debounce = false;
var entered = false; 

function addAnim(creature, animName, frames, size, bgX, bgY, wait, plays) {
    //Checking for existing creature name
    var newCreature = creatures[creature];
    if (!newCreature) {
        newCreature = {};
    };
    const originName = animName; //For grabbing the image name
    newCreature.currFrame = 0; //FPS useage

    newCreature.currentAnim = "walk";   

    animName = animName.toLowerCase();
    newCreature[animName] = {};
    newCreature[animName].keyFrames = [];
    newCreature[animName].wait = wait; //How long to wait between keyFrames
    newCreature[animName].frame = 0; //Animation's current keyFrame
    newCreature[animName].plays = plays; //Amount of times to play animation

    //Background image sizing/positioning for different sized png animation tracks
    newCreature[animName].bgX = bgX;
    newCreature[animName].bgY = bgY;
    newCreature[animName].size = size;

    //Looping through current animation's keyFrames
    for (var i = 0; i < frames; i++) {
        //Checking how many 0's to place before keyFrame number
        let pos = i;
        if (i < 10) {
            pos = "00" + i;
        }
        else if (i < 100) {
            pos = "0" + i;
        }
        //Adding image location to the current animation's keyFrame list
        newCreature[animName].keyFrames.push(images + creature + "/" + originName + "_" + pos + ".png");
        //Preloading each image
        preloader.unshift(new Image());
        preloader[0].src = images + creature + "/" + originName + "_" + pos + ".png";
    };
    creatures[creature] = newCreature; //To ensure the creature is up to date within the list of creatures
};

function damageDisplay(troll,dmg) {
    var newTag = $('<h2>');
    //Default styling for damage display
    var style = {
        "position":"absolute",
        "top":"40%",
        "color":"red",
        "font-size":"24px",
    }
    //Which side to base positioning on
    var dir = "right";
    if (troll == enemy) {
        dir = "left";
    };
    style[dir] = "53%";
    newTag.css(style);
    newTag.text("-" + dmg);
    newTag.insertBefore(troll); //So troll will display in the foreground
    newTag.animate({"top":"15%"},500);
    setTimeout(function() {
        newTag.animate({"opacity":0},350,function(){
            newTag.remove();
        });
    },200);
};

function attack(troll,name) {
    entered = false;
    $(".swapper").css("border-color","red");
    creatures[name].currentAnim = "walk";
    creatures[name].currFrame = 0;
    var originPos = parseInt(troll.parent().css("left").match(/\d+/)[0]); //Grabs number from string
    var moveTo = window.innerHeight*0.4; //40% of the window height or 40vh
    var newPos;
    var direction;
    if (troll == player) {
        newPos = originPos + moveTo + "px";
        direction = 1;
    }
    else {
        newPos = originPos - moveTo + "px";
        direction = -1;
    }
    originPos = originPos + "px";
    troll.parent().animate({"left":newPos},2000,function() {
        creatures[name].currentAnim = "attack";   
        setTimeout(function() {
            if (direction == 1) {
                creatures[active[1]].currentAnim = "hurt";
                enemy.css("filter","hue-rotate(300deg)");
                damageDisplay(enemy,30);
            }
            else {
                creatures[active[0]].currentAnim = "hurt";
                player.css("filter","hue-rotate(300deg)");
            };
            setTimeout(function(){
                creatures[name]['attack'].frame = 0;
                creatures[name].currentAnim = "walk";
                troll.css("transform","scaleX(" + -direction + ")");
                troll.parent().animate({"left":originPos},2000,function() {
                    creatures[name].currentAnim = "idle";
                    troll.css("transform","scaleX(" + direction + ")");
                    entered = true;
                    $(".swapper").css("border-color","white");
                });
            },200);
        },400);
        
    });
};

//Adding each set of animation tracks
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

$(document).ready(function(){

player = $("#player");
enemy = $("#enemy");

player.parent().css("left","-85vh");
enemy.parent().css("left","185vh");

enemy.css("transform","scaleX(-1)");



enemy.parent().animate({"left":"80vh"},5000,"linear", function() {
    creatures[active[1]].currentAnim = "idle";
});

player.parent().animate({"left":"20vh"},5000,"linear", function() {
    creatures[active[0]].currentAnim = "idle";
    entered = true;
});

function update(){ 
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
                troll.parent().css("z-index",5); 
            }
            else {
                troll.parent().css("z-index",1); 
            };
            anim.frame++;
            if (anim.frame >= anim.keyFrames.length ) {
                anim.frame = 0;
                if (creature.currentAnim == "dead") {
                    anim.frame = anim.keyFrames.length-1;
                }
                else if (anim.plays != "loop") {
                    if (creature.currentAnim == "hurt") {
                        troll.css("filter","hue-rotate(0deg)");
                    };
                    creature.currentAnim = "idle";
                    creature.currFrame = 0;
                };
            };
        };
        creature.currFrame++;
    };
};
tick = setInterval(update,17);

$(document).on("keyup", function(event) {
    if (entered != true) {
        return;
    };
    var key = event.key.toLowerCase();
    switch (key) {
        case " ":
            attack(player,active[0]);
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

//Resume when the user returns to the game window
$(window).focus(function(){
    if (tick){return};
    //Reloading images to fix flickering issues
    var newPreloader = [];
    for (var i = 0; i < preloader.length; i++) {
        let newImg = new Image();
        newImg.src = preloader[i].src;
        newPreloader.push(newImg);
    }
    preloader = newPreloader;
    newPreloader = null;
    //Resume fps handler
    tick = setInterval(update,17);
});

//Pause when the user leaves game window
$(window).blur(function(){
    clearInterval(tick);
    tick = undefined;
});

});

