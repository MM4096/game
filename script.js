var money = 0;
var added = 0;
var workMoney = 0;
// index 0 is used for begging
// index 1 is used for working
// index 2 is for time before you can get a new job
// index 3 is for digging
var timeUsed = [0, 0, 0, 0];
// index 1 is used for shovel
var items = [0]
var frenzy = 0

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

    for (let i = 0; i < timeUsed.length; i++) {
        if (localStorage.getItem("timeUsed" + i) != null) {
            timeUsed[i] = parseFloat(localStorage.getItem("timeUsed" + i));
            if (localStorage.getItem("logging") == "True") {
            output("success", ">>Restored data component: timeUsed" + i);
            }
        }
    }

    for (let i = 0; i < items.length; i++) {
        if (localStorage.getItem("item" + i) != null) {
            items[i] = parseFloat(localStorage.getItem("item" + i));
            if (localStorage.getItem("logging") == "True") {
            output("success", ">>Restored data component: item" + i);
            }
        }
    }

    if (localStorage.getItem("jobMoney") != null) {
        workMoney = parseFloat(localStorage.getItem("jobMoney"));
        if (localStorage.getItem("logging") == "True") {
            output("success", ">>Restored data component: jobMoney");
        }
    }
    if (localStorage.getItem("frenzy") != null) {
        frenzy = parseInt(localStorage.getItem("frenzy"));
        if (localStorage.getItem("logging") == "True") {
            output("success", ">>Restored data component: frenzy")
        }
    }

    if (getRandomInt(1, 101) == 1 && Date.now - frenzy > 10800000) {
        output("success", "Frenzy! Cooldown halved!");
        frenzy = Date.now();
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

// checks for frenzy

function isFrenzy() {
    let date = Date.now()
    if (frenzy > date - 3600000) {
        let timeLeft = 60 - Math.ceil((date - frenzy)/60000);
        let outputStr = "Frenzy active for " + timeLeft + " minutes";
        output("success", outputStr);
        return true;
    } else {
        print("no")
        return false;
    }
}

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
            
        case "buy":
            buy(command[1])
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
    let cooldown = 7000
    if (isFrenzy()) {
        cooldown = 3500
    }
    if (Date.now() - timeUsed[0] > cooldown) {

        if (getRandomInt(1, 4) == 1) {
            added = getRandomInt(1, 5);
            money += added;
            let cmdStr = "Yay! you got $" + added + "!";
            output("success", cmdStr);
    
        } else {
            output("normal", "You got nothing. At least you tried");
        }
        timeUsed[0] = Date.now();
    } else {
        let timeLeft = Math.ceil((cooldown / 1000) - (Date.now() - timeUsed[0]) / 1000);
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
    let cooldown = 3600000
    if (isFrenzy()) {
        cooldown = 1800000
    }
    if (Date.now() - timeUsed[1] > cooldown) {     // 3600000 is one hour
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
        let timeLeft = Math.ceil((cooldown / 1000) - (Date.now() - timeUsed[1])/60000);
        let cmdStr = "Woah user! You're too exited for work! You have " + timeLeft + " minutes before you can work again!";
        output("warning", cmdStr);
    }
}

function saveProgress() {
    localStorage.setItem("money", money);
    for (let i = 0; i < timeUsed.length; i++) {
        let cmdStr = "timeUsed" + i
        localStorage.setItem(cmdStr, timeUsed[i]);
    }
    for (let i = 0; i < items.length; i++) {
        let cmdStr = "item" + i
        localStorage.setItem(cmdStr, items[i]);
    }
    localStorage.setItem("jobMoney", workMoney);
    localStorage.setItem("frenzy", frenzy);
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

function buy(item) {
    switch (item) {
        case "shovel":
            if (money > 1999) {
                money -= 2000;
                items[0] += 1;
                let cmdStr = "You bought: <i>shovel</i> x1!";
                output("success", cmdStr);
            } else {
                let cmdStr = "You don't have enough money to buy <shovel> for $3000. You need $" + (3000 - money) + " more.";
                output("warning", cmdStr);
            }
        break

        default:
            if (item == null || item == undefined) {
                output("error", "buy command is missing 1 required augment 'item'");
            } else {
                output("error", "item <i>" + item + "</i> does not exist (yet)")
            }
    }
}

function dig() {
    let cooldown = 10000;
    if (isFrenzy()) {
        cooldown = 5000;
    }
    if (items[0] > 0) {
        if (Date.now() - timeUsed[3] > cooldown) { // 10 000 is 10 seconds

            if (getRandomInt(1, 6) == 1) {
                added = getRandomInt(3, 7);
                money += added;
                let cmdStr = "Yay! you got $" + added + "!";
                output("success", cmdStr);
        
            } else if (getRandomInt(1, 21) == 1) {
                items[0] -= 1;
                output("error", "Oh no! Your shovel broke!")
            } else {
                output("normal", "You got nothing. What did you expect? You're digging, after all.");
            }
            timeUsed[3] = Date.now();
        } else {
            let timeLeft = Math.ceil((cooldown / 1000) - (Date.now() - timeUsed[3]) / 1000);
            output("warning", "Chill out user! You can't dig so fast! You have " + timeLeft + " seconds before you can dig again");
        }
    } else {
        output("warning", "You don't have a shovel. You wouldn't like to dig without one now, do you? Use <i>buy shovel</i> to buy one for $3000");
    }
}