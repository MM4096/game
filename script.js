var money = 0;
var added = 0;
var workMoney = 0;
// index 0 is used for begging
// index 1 is used for working
// index 2 is for time before you can get a new job
var timeUsed = [0, 0, 0];

window.onbeforeunload = function () {
    saveProgress();
}


// Function to load saved data. Use >> for logging.
$(document).ready(function() {
    if (localStorage.getItem("logging") == null) {
        localStorage.setItem("logging", "True")
    }
    if (localStorage.getItem("money") != null) {
        money = parseFloat(localStorage.getItem("money"));
        if (localStorage.getItem("logging") == "True") {
            output("success", ">>Restored data component: Money");
        }
    }

    if (localStorage.getItem("timeUsed0") != null) {
        timeUsed[0] = parseFloat(localStorage.getItem("timeUsed0"));
        if (localStorage.getItem("logging") == "True") {
        output("success", ">>Restored data component: timeUsed0");
        }
    }

    if (localStorage.getItem("timeUsed1") != null) {
        timeUsed[1] = parseFloat(localStorage.getItem("timeUsed1"));
        if (localStorage.getItem("logging") == "True") {
            output("success", ">>Restored data component: timeUsed1");
        }
    }

    if (localStorage.getItem("timeUsed2") != null) {
        timeUsed[2] = parseFloat(localStorage.getItem("timeUsed2"));
        if (localStorage.getItem("logging") == "True") {
            output("success", ">>Restored data component: timeUsed2");
        }
    }

    if (localStorage.getItem("jobMoney") != null) {
        workMoney = parseFloat(localStorage.getItem("jobMoney"));
        if (localStorage.getItem("logging") == "True") {
            output("success", ">>Restored data component: jobMoney");
        }
    }

    output("warning", "To turn on/off logging, use settings logging on/off");

})


//From mozarilla js docs (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }


$(document).on('keypress',function(e) {
    if(e.which == 13) {
        enter();
    }
});

// Command entering
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

        case "work":
            work();
            break
        
        case "settings":
            settings(command[1], command[2]);
            break

        case "job":
            job();
            break

        case "dig":
            dig();
            break

        default:
            let cmdStr = "Invalid command '" + command[0] + "'. Use help to see a list of commands"
            output("error", cmdStr);
    }
}



function beg() {
    if (Date.now() - timeUsed[0] > 8000) {

        if (getRandomInt(1, 6) == 1) {
            added = getRandomInt(1, 10);
            money += added;
            let cmdStr = "Yay! you got $" + added + "!";
            output("success", cmdStr);
    
        } else {
            output("normal", "You got nothing. At least you tried");
        }
        timeUsed[0] = Date.now();
    } else {
        let timeLeft = Math.ceil(8 - (Date.now() - timeUsed[0]) / 1000);
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

function work() {
    if (Date.now() - timeUsed[1] > 3600000) {     // 3600000 is one hour
        if (workMoney > 0) {
            added = workMoney;
            money += added;
            let cmdStr = "You got $" + added + " for working!";
            output("success", cmdStr);
            timeUsed[1] = Date.now();
        } else {
            output("warning", "You need a job first! Use <i>job</i> to get a job.")
            if (localStorage.getItem("logging") == "True") {
                output("warning", ">>Work timer not reset. Reason: Didn't work")
            }
        }
    } else {
        let timeLeft = Math.ceil(60 - (Date.now() - timeUsed[1])/60000);
        let cmdStr = "Woah user! You're too exited for work! You have " + timeLeft + " minutes before you can work again!";
        output("warning", cmdStr);
    }
}

function saveProgress() {
    localStorage.setItem("money", money);
    localStorage.setItem("timeUsed0", timeUsed[0]);
    localStorage.setItem("timeUsed1", timeUsed[1]);
    localStorage.setItem("timeUsed2", timeUsed[2]);
    localStorage.setItem("jobMoney", workMoney);
}

function settings(settingName, settingAugment) {
    switch (settingName) {
        case "logging":
            if (settingAugment == "on") {
                localStorage.setItem("logging", "True");
                output("success", "Logging set to on");
            } else if (settingAugment == "off") {
                localStorage.setItem("logging", "False");
                output("success", "Logging set to off")
            } else if (settingAugment == "undefined") {
                output("error", "settings > logging requires one augment: on/off");
            } else {
                output("error", "Unrecognized augment: " + settingAugment);
            }
        break

        case "reset":
            if (prompt("Are you sure? Your progress will be reset. Type 'y' (lowercase) to continue. Press enter to cancel") == "y") {
                money = 0;
                workMoney = 0;
                localStorage.setItem("logging", "True");
                timeUsed[0] = 0;
                timeUsed[1] = 0;
                timeUsed[2] = 0;
                output("success", "Deleted all user info.");
            }
        break

        default:
            let cmdStr = "Error. Unrecognized setting " + settingName;
            output("error", cmdStr);
    }
}

function job() {
    if (Date.now() - timeUsed[2] > 10800000) {     // 10800000 is 3 hours
        if (workMoney >= 0) {
            if (workMoney - 100 < 1) {
                workMoney = getRandomInt(150, 300);
            } else {
                workMoney = getRandomInt(workMoney - 100, workMoney + 150);
            }
        } else {
            workMoney = getRandomInt(150, 300);
        }
        let cmdStr = "You got a new job that gives you $" + workMoney + " for working!";
        output("success", cmdStr);
        timeUsed[2] = Date.now();
    } else {
        let timeLeft = Math.ceil(180 - (Date.now() - timeUsed[1])/60000);
        let cmdStr = "Woah user! You can't switch jobs that fast! You have " + timeLeft + " minutes before you can switch jobs again!";
        output("warning", cmdStr);
    }
}