var tick;
var autoPause;

//Grabbing character divs
var player;
var enemy;

const images = "assets/images/";
var preloader = []; //Preloading all of the sprite animations

var debounce = false;
var entered = false; 

//Stored game data
var myGameData = {
    playerStats: {
        hp: 120,
        maxHp: 120,
        dmgMultiplier: 1,
    },
    defaultStats: {
        ["troll_1"]: {
            hp: 120,
            maxHp: 120,
            power: 6,
            counter: 5,
        },
        ["troll_2"]: {
            hp: 150,
            maxHp: 150,
            power: 8,
            counter: 12,
        },
        ["troll_3"]: {
            hp: 180,
            maxHp: 180,
            power: 10,
            counter: 25,
        },
    },
    active: ["troll_1", "troll_3"], //The creatures on the battlefield
    creatures: {
        player: {},
        enemy: {}
    },
    tribes: {
        "grassland":"",
        "frostbite":"saturate(4) hue-rotate(90deg)",
        "sunflower":"saturate(7) hue-rotate(305deg)",
    },
}

//All gameplay functions
var myGameFunctions = {
    healthUpdate: function(user) {
        const healthFrame = "#" + user + "-health";
        let hp, maxHp, active;
        if (user == "enemy") {
            active = myGameData.active[1];
            hp = myGameData.defaultStats[active].hp;
            maxHp = myGameData.defaultStats[active].maxHp;
        }
        else {
            hp = myGameData.playerStats.hp;
            maxHp = myGameData.playerStats.maxHp;
            active = myGameData.active[0];
        }
        $(healthFrame + " .health-bar-background p").text(hp + "hp");
        $(healthFrame + " .health-bar").css("width",((hp/maxHp)*100) + "%");
        if (hp <= 0) {
            myGameData.creatures[user][active].currentAnim = "dead";
            myGameData.creatures[user][active].currFrame = 0;
        };
    },
    damageDisplay: function(troll,dmg) {
        let newTag = $('<h2>');
        //Default styling for damage display
        let style = {
            "position":"absolute",
            "top":"40%",
            "color":"red",
            "font-size":"24px",
        }
        //Which side to base positioning on
        let dir;
        if (troll == enemy) {
            dir = "left";
            myGameData.defaultStats[myGameData.active[1]].hp -= dmg;
            this.healthUpdate("enemy");
        }
        else {
            dir = "right";
            myGameData.playerStats.hp -= dmg;
            this.healthUpdate("player");
        }
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
    },
    attack: function(troll,user,name) {
        if (troll.css("opacity") != 1) {return;};
        entered = false;
        $(".swapper").css({"background-color":"rgba(0,0,0,0.5)"});
        myGameData.creatures[user][name].currentAnim = "walk";
        myGameData.creatures[user][name].currFrame = 0;
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
            myGameData.creatures[user][name].currentAnim = "attack";   
            setTimeout(function() {
                if (direction == 1) {
                    myGameData.creatures.enemy[myGameData.active[1]].currentAnim = "hurt";
                    enemy.css("filter",(enemy.tribe + "brightness(75%)"));
                    myGameFunctions.damageDisplay(enemy,myGameData.defaultStats[name].power*myGameData.playerStats.dmgMultiplier);
                    myGameData.playerStats.dmgMultiplier++;
                    $("#player-power").text(myGameData.defaultStats[name].power*myGameData.playerStats.dmgMultiplier);
                }
                else {
                    myGameData.creatures.player[myGameData.active[0]].currentAnim = "hurt";
                    player.css("filter",(player.tribe + "brightness(75%)"));
                    myGameFunctions.damageDisplay(player,myGameData.defaultStats[name].counter);
                };
                setTimeout(function(){
                    myGameData.creatures[user][name]['attack'].frame = 0;
                    myGameData.creatures[user][name].currentAnim = "walk";
                    troll.css("transform","scaleX(" + -direction + ")");
                    troll.parent().animate({"left":originPos},2000,function() {
                        myGameData.creatures[user][name].currentAnim = "idle";
                        troll.css("transform","scaleX(" + direction + ")");
                        entered = true;
                        $(".swapper").css({"background-color":""});
                        if (troll == player && myGameData.defaultStats[myGameData.active[1]].hp > 0) {
                            myGameFunctions.attack(enemy,"enemy",myGameData.active[1]);
                        };
                    });
                },200);
            },400);
            
        }.bind(this));
    },
    swapEnemy: function(newTroll) {
        if (!entered) {return};
        entered = false;
        if (enemy.css("opacity") == 0) {
            $("#enemy-health").find(".thumbnail").css("background-image",$("#" + newTroll).css("background-image"));
            $("#" + newTroll).css("display","none");
            myGameData.active[1] = newTroll;
            enemy.parent().css("left","185vh");
            enemy.css({"opacity":"1","filter":enemy.tribe});
            this.healthUpdate("enemy");
            enemy.parent().animate({"left":"80vh"},5000,"linear", function() {
                myGameData.creatures.enemy[myGameData.active[1]].currentAnim = "idle";
                entered = true;
            });
        }
        else {
            myGameData.creatures.enemy[myGameData.active[1]].currentAnim = "walk";
            enemy.css("transform","scaleX(1)");
            enemy.parent().animate({"left":"185vh"},5000,function(){
                enemy.css("transform","scaleX(-1)");
                if (myGameData.defaultStats[myGameData.active[1]].hp != 0) {
                    $("#" + myGameData.active[1]).css("display","block");
                };
                $("#enemy-health").find(".thumbnail").css("background-image",$("#" + newTroll).css("background-image"));
                $("#" + newTroll).css("display","none");
                myGameData.active[1] = newTroll;        
                myGameFunctions.healthUpdate("enemy");
                enemy.parent().animate({"left":"80vh"},5000,"linear", function() {
                    myGameData.creatures.enemy[myGameData.active[1]].currentAnim = "idle";
                    entered = true;
                });
            });
        };
    },
    update: function(){ 
        for (var i = 0; i < myGameData.active.length; i++) {
            let troll;
            let user;
            if (i == 0) {
                troll = player;
                user = "player";
            }
            else {
                troll = enemy;
                user = "enemy";
            };
            let creature = myGameData.creatures[user][myGameData.active[i]];
            let anim = creature[creature.currentAnim];
    
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
                        if (troll.css("opacity") == 1) {
                            troll.animate({"opacity":0},2000, function() {
                                anim.frame = 0;
                                creature.currentAnim = "idle";
                            });
                        }
                    }
                    else if (anim.plays != "loop") {
                        if (creature.currentAnim == "hurt") {
                            troll.css("filter",troll.tribe);
                        };
                        creature.currentAnim = "idle";
                        creature.currFrame = 0;
                    };
                };
            };
            creature.currFrame++;
        };
    },
};

//Setting up the game
var myGameArea = {
    addAnim: function(creature, animName, frames, size, bgX, bgY, wait, plays) {
        const originName = animName; //Before it changes to lower case
        //Creating seperate character objects for both player and enemy
        for (var i = 0; i < 2; i++) {
        let user;
        if (i == 0) {
            user = "player";
        }
        else {
            user = "enemy";
        };
        //Checking for existing creature name
        let newCreature = myGameData.creatures[user][creature];
        if (!newCreature) {
            newCreature = {};
        };
        
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
        for (let i = 0; i < frames; i++) {
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
            if (user == "player") {
                //Preloading each image
                preloader.unshift(new Image());
                preloader[0].src = images + creature + "/" + originName + "_" + pos + ".png";
            }
        };
        
        myGameData.creatures[user][creature] = newCreature; //To ensure the creature is up to date within the list of creatures
        };
        
    },
    loadUp: function(){
        var loaded = 0;

        for (var i = 0; i < preloader.length; i++) {
            preloader[i].onload = function() {
                loaded++;
                $("#load-bar").css("width",((loaded/preloader.length)*100) + "%");
            };
        };

        var numDots = 0;

        var loading = setInterval(function() {
            if (loaded >= preloader.length) {
                $("#load-text").text("Loaded");
                myGameArea.intro();
                setTimeout(function() {
                    $("#overlay").animate({"opacity":0.35},2000,function() {
                        $(this).html("");
                        $("#start-screen-ui").css({"z-index":"10"});
                    });
                },4000)
                
                clearInterval(loading);
                return;
            };
            var dots = "";
            for (var i = 0; i < numDots; i++) {
                dots += ".";
            }
            $("#load-text").text("Loading" + dots);
            numDots = numDots%3
            numDots++;
        }, 200);
    },
    intro: function() {
        let currentPick = "player";
        $("#gameplay-ui").css("display","none");
        $("#start-screen-ui").css({"display":"block"});
        if ($("#overlay").css("display") == "none") {
            $("#overlay").css({"display":"block","opacity":0.35});
        };

        $(".swapper").on("click", function(event) {
            var name = this.className.split(" ")[0];
            switch (currentPick) {
                case "player":
                $(this).parent().css("display","none");
                $("#start-title").text("Select An Opponent");
                $("#player-health .thumbnail").removeClass($("#player-health .thumbnail").prop("className").split(" ")[0]);
                $("#player-health .thumbnail").addClass(name);
                $("#player-power").text(myGameData.defaultStats[name].power*myGameData.playerStats.dmgMultiplier);
                myGameData.playerStats.hp = myGameData.defaultStats[name].maxHp;
                myGameData.playerStats.maxHp = myGameData.defaultStats[name].maxHp;
                currentPick = "enemy";
                player.tribe = myGameData.tribes[$(this).parent().prop("id")];
                myGameData.active[0] = name;
                break;
                case "enemy":
                currentPick = "none";
                enemy.tribe = myGameData.tribes[$(this).parent().prop("id")];
                myGameData.active[1] = name;
                $("#overlay, #start-screen-ui").css({"display":"none"})
                myGameArea.start();
                break;
            }
        });
    },
    start: function() {
        tick = setInterval(myGameFunctions.update,17);

        myGameFunctions.healthUpdate("player");
        myGameFunctions.healthUpdate("enemy");

        player.parent().css("left","-85vh");
        enemy.parent().css("left","185vh");

        player.css("filter",player.tribe);
        $("#player-health").find(".thumbnail").css("filter",player.tribe);

        $(".swapper").css("filter",enemy.tribe);
        $("#" + myGameData.active[1]).css("display","none");
        $("#enemy-health").find(".thumbnail").css("filter",enemy.tribe);
        enemy.css("filter",enemy.tribe);
        enemy.css("transform","scaleX(-1)");

        $("#gameplay-ui").css("display","block");

        enemy.parent().animate({"left":"80vh"},5000,"linear", function() {
            myGameData.creatures.enemy[myGameData.active[1]].currentAnim = "idle";
        });
        
        player.parent().animate({"left":"20vh"},5000,"linear", function() {
            myGameData.creatures.player[myGameData.active[0]].currentAnim = "idle";
            entered = true;
        });
        
        $(".swapper").on("click", function(event) {
            if (myGameData.active[1] != this.id) {
                myGameFunctions.swapEnemy(this.id);
            }
        });
        
        $(document).on("keyup", function(event) {
            if (entered != true) {
                return;
            };
            var key = event.key.toLowerCase();
            switch (key) {
                case " ":
                myGameFunctions.attack(player,"player",myGameData.active[0]);
                break;
                case "b":
                    myGameData.creatures.player[myGameData.active[0]].currentAnim = "break";
                break;
            };
            myGameData.creatures.player[myGameData.active[0]].currFrame = 0;
        });

        //Resume when the user returns to the game window
        $(window).focus(function(){
            clearTimeout(autoPause);
            autoPause = undefined;
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
            tick = setInterval(myGameFunctions.update,17);
        });

        //Pause when the user leaves game window
        $(window).blur(function(){
            if (autoPause){return};
            autoPause = setTimeout(function(){
                clearInterval(tick);
                tick = undefined;
            },1000*60);
        });
    },
};

//Adding each set of animation tracks
myGameArea.addAnim("troll_1","Idle", 10, "65%", "65%", "60%", Math.floor(Math.random()*3)+3, "loop");
myGameArea.addAnim("troll_1","Walk", 10, "72%", "73%", "60%", 4, "loop");
myGameArea.addAnim("troll_1","Dead", 10, "73%", "88%", "79%", 4, 1);
myGameArea.addAnim("troll_1","Hurt", 10, "73%", "43%", "50%", 4, 1);
myGameArea.addAnim("troll_1","Attack", 10, "100%", "", "", 4, 1);

myGameArea.addAnim("troll_2","Idle", 10, "65%", "65%", "60%", Math.floor(Math.random()*3)+3, "loop");
myGameArea.addAnim("troll_2","Walk", 9, "72%", "73%", "60%", 4, "loop");
myGameArea.addAnim("troll_2","Dead", 10, "73%", "88%", "79%", 4, 1);
myGameArea.addAnim("troll_2","Hurt", 10, "73%", "43%", "50%", 4, 1);
myGameArea.addAnim("troll_2","Attack", 10, "100%", "", "", 4, 1);

myGameArea.addAnim("troll_3","Idle", 10, "65%", "65%", "60%", Math.floor(Math.random()*3)+3, "loop");
myGameArea.addAnim("troll_3","Walk", 9, "72%", "73%", "60%", 4, "loop");
myGameArea.addAnim("troll_3","Dead", 10, "73%", "88%", "79%", 4, 1);
myGameArea.addAnim("troll_3","Hurt", 10, "73%", "43%", "50%", 5, 1);
myGameArea.addAnim("troll_3","Attack", 10, "100%", "", "", 4, 1);


//Where the game starts running
$(document).ready(function(){

player = $("#player");
enemy = $("#enemy");

player.tribe = myGameData.tribes["grassland"];
enemy.tribe = myGameData.tribes["sunflower"];

var tribeNames = Object.keys(myGameData.tribes);
for (var i = 0; i < tribeNames.length; i++) {
    const newTribe = $(`<div id="` + tribeNames[i] + `" class="tribe">
    <p>` + tribeNames[i] + ` Tribe</p>
    <div class="troll_1 swapper"></div>
    <div class="troll_2 swapper"></div>
    <div class="troll_3 swapper"></div>
</div>`)
    newTribe.css("filter",myGameData.tribes[tribeNames[i]]);
    $("#start-screen-ui").append(newTribe);
};

myGameArea.loadUp();

});

