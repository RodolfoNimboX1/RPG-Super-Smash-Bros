$(document).ready(function (){
// Global Variables

var characters = {
    'Mario': {
    name: "Mario",
    stamina: 150,
    imageUrl: "assets/images/mario.png",
    power: 55
    },
    'Kirby': {
    name: "Kirby",
    imageUrl: "assets/images/kirby.png",
    stamina: 150,
    power: 25
    },
    'Pikachu': {
        name: "Pikachu",
        imageUrl: "assets/images/pikachu.png",
        stamina: 150,
        power: 30
    },
    'Link':{
        name: "Link",
        imageUrl: "assets/images/link.png",
        stamina: 150,
        power: 35
    }
}

var selectedChar;
var selectedDefender;
var enemies = [];
var attackResult;
var wins = 0; //will be reset after each game
var losses = 0;
totalWins = 0;

// which one is your character, enemies and defender
var renderChar = function(characters, renderArea, makeChar) {
    var charDiv = $("<div class='character' data-name='" + characters.name + "'>");
    var charName = $("<div class='character-name'>").text(characters.name);
    var charImage = $("<img alt='image' class='character-image'>").attr("src", characters.imageUrl);
    var charHealth = $("<div class='character-health'>").text(characters.stamina);
    charDiv.append(charName).append(charImage).append(charHealth);
    $(renderArea).append(charDiv);

    if (makeChar == "enemy") {
        $(charDiv).addClass("enemy");
    } else if (makeChar == "defender") {
        selectedDefender = characters;
        $(charDiv).addClass("target-enemy");
    }
};

// render characters

var stageCharacters = function(charObj, areaRender) {
    if (areaRender == "#characters") {
        $(areaRender).empty();
        for (var key in charObj) {
            if (charObj.hasOwnProperty(key)) {
                renderChar(charObj[key], areaRender, " ");
            }
        }
    }

// render my selected character

if (areaRender == "#selected-char") {
    $("#selected-char").prepend("Your Character");
    renderChar(charObj, areaRender, " ");
    $("#attack-btn").css("visibility", "visible");
}

// render enemies

if (areaRender == "#enemies") {
    $("#enemies").prepend("Choose your next enemy");
    for (var i = 0; i < charObj.length; i++) {
        renderChar(charObj[i], areaRender, "enemy");
    }
}

// render defender

$(document).on("click", ".enemy", function (){
    name = ($(this).data("name"));

    if ($("#defender").childern().length == 0) {
        stageCharacters(name, "#defender");
        $(this).hide();
    }
});

// render defender in area

if (areaRender == "#defender") {
    $(areaRender).empy();
    
    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].name == charObj) {
            $("#defender").append("Your next opponent")
            renderChar(enemies[i], areaRender, "#defender");
        }
    }
}

// re render defender after it looses

if (areaRender == "enemyDamage") {
    $("#selected-character").empy();
    renderChar(charObj, "#selected-character", " ");
}

// render defeated enemy

if (areaRender == "enemyDefeated") {
    $("#defender").empty();
    var gameMessage = "You have defeated " + charObj.name + ", choose another enemy!";
    alert(gameMessage);
}
};

renderAllCharacters(characters, "#characters", function() {

$(document).on("click", "#character", function() {
name = $(this).data("name");
if (!selectedChar) {
    selectedChar = characters[name];
    for (var key in characters) {
        $("#characters").push(characters[key]);
    }
}

$("#characters").hide();
renderAllCharacters(selectedChar, "#characters");
renderAllCharacters(enemies, "#enemies");
});
});

});

// functions for action!

$("#attack-btn").on("click", function() {

    if ($("#defender").childern().length !== 0) {
        var attackMssg = "You attacked " + selectedDefender.name + " for " + selectedDefender.power + " damage";
        $("#log-attack").html = attackMssg;
        selectedDefender.stamina = selectedDefender.stamina - selectedChar.power;

        if (selectedDefender.stamina > 0){
            renderAllCharacters(selectedDefender, "playerDamage");

            var counterAttack = selectedDefender.name + "attacked you for " + selectedDefender.power + " damage";
            $("#log-defender").html = counterAttack;

            selectedChar.stamina = selectedChar - selectedDefender.power;
            renderAllCharacters(selectedChar, "enemyDamage");

            if (selectedChar.stamina <= 0) {
                alert("You have been defeated...YOU LOSE!");
                $("#attack-btn").unbind("click");
            }
        } else {
            renderAllCharacters(selectedDefender, "enemyDefeated");
            wins++;
            totalWins++;

            if (wins >= 3) {
                alert("GAME!");
            }
        }
    } else {
        alert("No enemies here");
    }
});