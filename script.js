var money = 0;
var added = 0;

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
    value = $("#input").val();
    $("#input").val("");
    command = value.split(" ");

    switch (command[0]) {
        case "beg":
            beg()
            break
        
        default:
            let cmdStr = "Invalid command '" + command[0] + "'"
            output("error", cmdStr)
    }
}



function beg() {
    if (getRandomInt(1, 4) == 1) {
        added = getRandomInt(1, 10)
        money += added
        let cmdStr = "Yay! you got $" + added + ", and you have $" + money + " in total!"
        output("success", cmdStr)

    } else {
        output("normal", "You got nothing. At least you tried >:)")
    }
}


function output(type, text){
    let classType = ""
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
    $("#output").prepend("<li class='" + classType + "'>" + text + "</li>")
}