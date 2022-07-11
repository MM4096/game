var money = 0;
var added = 0;
// index 0 is used for begging
var timeUsed = [0];

//From mozarilla js docs (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }


$(document).on('keypress',function(e) {
    if(e.which == 13) {
        enter();
    }
});


function enter() {
    value = $("#input").val().toLowerCase();
    $("#input").val("");
    command = value.split(" ");

    switch (command[0]) {
        case "beg":
            beg();
            break;
        
        case "balance":
            balance();
            break;
        
        case "help":
            help();
            break;
        
        default:
            let cmdStr = "Invalid command '" + command[0] + "'. Use help to see a list of commands"
            output("error", cmdStr);
    }
}



function beg() {
    if (Date.now() - timeUsed[0] > 5000) {
        if (getRandomInt(1, 4) == 1) {
            added = getRandomInt(1, 10);
            money += added;
            let cmdStr = "Yay! you got $" + added + "!";
            output("success", cmdStr);
    
        } else {
            output("normal", "You got nothing. At least you tried >:)");
        }
        timeUsed[0] = Date.now();
    } else {
        timeLeft = Math.ceil(5 - (Date.now() - timeUsed[0]) / 1000);
        output("warning", "Chill out user! You can't beg so fast! You have " + timeLeft + " seconds before you can beg again");
    }
    
}


function output(type, text){
    let classType = "";
    switch (type) {
        case "error":
            classType = "error"
            break
        
        case "warning":
            classType = "warning"
            break

        case "success":
            classType = "success"
            break
        
        default:
            classType = "normal"
    }
    $("#output").prepend("<li class='" + classType + "'>" + text + "</li>");
}

function balance() {
    let cmdStr = "You have $" + money + " in your account!"
    output("normal", cmdStr)
}

function help() {
    output("normal", helpText)
}