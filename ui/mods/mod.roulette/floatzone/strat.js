//view model setup
function stratModel() {
    var self = this;
    //ui related observables
    self.winChance = ko.observable("unknown")
    self.difficulty = ko.observable("unknown")
    self.openingDifficulty = ko.observable(1)
    self.earlyGameDifficulty = ko.observable(1)
    self.midGameDifficulty = ko.observable(1)
    self.endGameDifficulty = ko.observable(1)
    self.modifierDifficulty = ko.observable(1)
    self.memeDifficulty = ko.observable(1)
    self.hardModifierDifficulty = ko.observable(1)
    self.naval = ko.observable(false)
    self.hybrid = ko.observable(false)
    self.orbital = ko.observable(false)
    self.hardMode = ko.observable(false)
    self.openingFacs = ko.observable([])
    self.openingT2Facs = ko.observable([])
    self.openingFabs = ko.observable([])
    self.openingName = ko.observable("")
    self.openingFabsName = ko.observable("")
    self.openingModifier = ko.observable("")
    self.earlyGame = ko.observable("")
    self.midGame = ko.observable("")
    self.endGame = ko.observable("")
    self.modifier = ko.observable("")
    self.hardModifier = ko.observable("")
    self.t2Choice = ko.observable("")
    self.stratGenerated = ko.observable(false)
    self.meme = ko.observable("")

}
stratModel = new stratModel();

model.toggleHybrid = function () {
    stratModel.naval(!stratModel.naval())
}

model.toggleOrbital = function () {
    stratModel.naval(!stratModel.naval())
}

//makes the floating frame for the view model
createFloatingFrame("strat_frame", 'auto', 'auto', { "offset": "topRight", "left": -240 });

//attaches the html to the frame
$.get("coui://ui/mods/mod.roulette/floatzone/strat.html", function (html) {
    $("#strat_frame_content").append(html);
})


//controls the positioning of the frame
model.stratLockEvent = function () {
    if (localStorage["frames_strat_frame_lockStatus"] == "true") {
        $("#strat_lock").attr("src", "coui://ui/mods/mod.roulette/img/unlock.png");
        unlockFrame("strat_frame");
    } else {
        $("#strat_lock").attr("src", "coui://ui/mods/mod.roulette/img/lock.png");
        lockFrame("strat_frame");
    }

}


var stratUIExpanded = ko.observable(true);
model.toggleStratUIExpanded = function () {
    stratUIExpanded(!stratUIExpanded())
    if (stratUIExpanded() == true) {
        $("#strat_visible").attr("src", "coui://ui/mods/mod.roulette/img/visible.png");
    } else {
        $("#strat_visible").attr("src", "coui://ui/mods/mod.roulette/img/notVisible.png");

    }
}

model.toggleSwitch = function () {
    var status = localStorage["frames_strat_frame_switchStatus"];
    if(status == "true") {
        status = "false";
    } else {
        status = "true";
    }
    localStorage.setItem("frames_strat_frame_switchStatus", status);
    if(localStorage["frames_strat_frame_switchStatus"] == "true") {
        // just doesnt work, naaaahhh
        // var str = "linear-gradient(135deg, rgba(53, 53, 53, 0.38) 0%, rgba(255, 255, 255, 0) 100%) !important"
        // $(".content-viewport").css("background",str);
        $("#viewport").css("flex-direction", "row-reverse");
        
    }else{
        // var str = "linear-gradient(135deg, rgba(53, 53, 53, 0.38) 0%, rgba(255, 255, 255, 0) 100%) !important"
        // $("#content-viewport").css("background",str);
        $("#viewport").css("flex-direction", "row");
        
    }

    console.log(status);
}
model.toggleNaval = function () {
    stratModel.naval(!stratModel.naval())
    console.log(stratModel.naval())
    if (stratModel.naval() == true) {
        $("#naval-button-img").attr("src", "coui://ui/mods/mod.roulette/img/ship.png");
    } else {
        $("#naval-button-img").attr("src", "coui://ui/mods/mod.roulette/img/ship-no.png");
    }
}

model.toggleOrbital = function () {
    stratModel.orbital(!stratModel.orbital())
    console.log(stratModel.orbital())
    if(stratModel.orbital() == true) {
        $("#orbital-button-img").attr("src", "coui://ui/mods/mod.roulette/img/planet.png");
    } else {
        $("#orbital-button-img").attr("src", "coui://ui/mods/mod.roulette/img/planet-no.png");
    }
}


//add difficulty values to each strat

//add button options to specify if it is naval start, hybrid or orb
//hybrid builds may have any normal fac replace naval if shore is too far(e.g small lake somewhere)
//if naval/hybrid, orb only changes early game+ options

//always

// map with localized strings

function dic(key) {
    return loc('!LOC:' + key);
}

var openingBuilds = [
    [["air"], "air first", 1.5],
    [['bot'], "bot first", 1.0],
    [["vehicle"], "vehicle first", 1.2],
    [["vehicle", "air", "vehicle"], "heavy vehicle", 1.3],
    [["vehicle", "air", 'bot'], "reverse 1-1-1", 1.2],
    [["vehicle", "vehicle",], "double vehicle", 1.3],
    [['bot', "air"], "meta build", 1.0],
    [['bot', "power", "air"], "meta macro", 1.0],
    [['bot', "air", "vehicle"], "1-1-1", 1.1],
    [['bot', 'bot'], "double bot", 1.3],
    [['bot', "vehicle", "air"], "bot-vehicle-air", 1.2],
    [['bot', "air", "air"], "bot-2air", 1.0],
    [["vehicle", "air", "air"], "vehicle-2air", 1.1],
    [['bot', 'bot', 'bot'], loc('bot-comrush'), 1.4],
    [['bot', "air", 'bot', 'bot', 'bot'], "phyrric comrush", 1.3],
    [["vehicle", "vehicle", "vehicle", "vehicle"], "ferret comrush", 1.4],
    [["metal", 'bot', "power"], "metal-fac-power", 1.4],
    [["metal", "metal"], "2+metal with com during build", 1.2],
]

// var openingBuilds = [
//     [["air"],dictionary['air first'],1.5], 
// ]

var hybridOpeningBuilds = [
    [["naval"], "naval first", 1.0],
    [["air"], "air first", 1.6],
    [['bot'], "bot first", 1.0],
    [["vehicle"], "vehicle first", 1.2],
    [["naval", "air"], "naval-air", 1.1],
    [['bot', "naval"], "bot-naval", 1.2],
    [["vehicle", "naval"], "vehicle-naval", 1.3],
    [['bot', "air", "naval"], "fast standard", 1.0],
    [['bot', "air", "air", "naval"], "air heavy standard", 1.0],
    [['bot', "air", 'bot', "naval"], "bot heavy standard", 1.0],
]

var navalOpeningBuilds = [
    [["naval"], "naval first", 1.0],
    [["naval", "metal", "air"], "meta", 1.0],
    [["naval", "metal", "power", "air"], "meta macro", 1.0],
    [["naval", "naval"], "double naval", 1.2],
    [["naval", "air", "air"], "naval-2air", 1.2],
    [["naval", "air", "naval"], "naval-air-naval", 1.0]
]

//early game is pre t2
//------------------------------------------------------------
//TODO add some boosting builds
var earlyGame = [
    ["boost air", 1.1],
    ["fab drops", 1.1],
    ["spark/inferno drop", 1.0],
    ["commander rush", 1.4],
    ["fab heavy", 1.2],
    ["no scouting", 1.1],
    ["no defenses", 1.2],
    ["early orbital", 1.4],
    ["pre fab units", 1.1],
    ["wrong way(expand backwards)", 1.2],
    ["gren heavy", 1.2],
    ["line base", 1.05],
    ["base rush(build base towards opponent aggressively)", 1.2],
    ["no fab snipes", 1.2],
    ["drifter heavy", 1.2],
    ["boost a t1 fac", 1.1],
    ["proxy t2", 1.2],
    ["no proxy factories", "1.6"]
]

var navalEarlyGame = [["piranha spam", 1.1], ["commander rush", 1.6], ["fab heavy", 1.3], ["no scouting", 1.2], ["no defenses", 1.2], ["make an early barnacle", 1.1]]

var hybridEarlyGame = [["piranha spam", 1.1], ["commander rush", 1.4], ["fab heavy", 1.2], ["no scouting", 1.2], ["no defenses", 1.3], ["no fab snipes", 1.2], ["spark/inferno drop", 1.0], ["aggressive naval proxy", 1.2], ["drifter heavy", 1.1]]

var orbitalEarlyGame = [["commander rush", 1.5], ["early invasion", 1.3], ["build an anchor", 1.1], ["teleporter rush", 1.2], ["offensive astreus drop", 1.2], ["no scouting", 1.3], ["no defenses", 1.2], ["no fab snipes", 1.3], ["astreus com within first few minutes", 1.7]]
//------------------------------------------------------------
//randomized and mid/late game options are restricted to that choice
var firstT2 = ["air", 'bot', "vehicle"]
var firstT2Naval = ["naval", "air"]
var firstT2Hybrid = ["air", 'bot', "vehicle", "naval"]

//post first t2
//------------------------------------------------------------
var midGame = [["gren heavy", 1.2], ["pelter spam", 1.3], ["silver push", 1.1], ["air heavy", 1.1], ["reclaim/stitch heavy", 1.2], ["teleporter push", 1.1]]
var orbitalMidGame = [["anchor harass", 1.4], ["t2 fab first", 1.1]] //added if orbital selected
var navalMidGame = [["torpedo launcher creep", 1.1], ["kaiju spam", 1.2], ["t2 fab first", 1.3]] //added if t2 naval option
var vehicleMidGame = [["manhattan first unit", 1.4], ["vanguard drop", 1.0], ["t2 fab first", 1.1], ["leveler drop", 1.05]] //added if t2 vehicles option
var botMidGame = [["locust swarm/spam", 1.3], ["t2 bot drop", 1.1], ["mend creep", 1.2], ["t2 fab first", 1.1], ["colonel rush", 1.3], ["heavy bluehawk", 1.4], ["heavy booms", 1.3]] //added if t2 bots option
var airMidGame = [["early hornet", 1.1], ["attempt wyrm snipe", 1.3], ["early angel", 1.1], ["no t2 fighters", 1.4], ["no kestrels", 1.2], ["t2 fab first", 1.2]] //added if t2 air option

//post second t2
//------------------------------------------------------------
var lateGame = [["Use a nuke", 1.2], ["build a titan", 1.2], ["use omegas", 1.1], ["use unit cannons", 1.05], ["Make a holkins", 1.1], ["defense creep", 1.2]]
var orbitalLateGame = [["sxx snipe", 1.3], ["omega snipe", 1.0], ["use helios", 1.2]] //added if orbital selected
var vehicleLateGame = [["make an ares", 1.1], ["sheller spam", 1.3], ["large scale t2 drop", 1.2]] //added if t2 vehicles option
var botLateGame = [["make an atlas", 1.2], ["colonel spam", 1.4], ["heavy gile", 1.3], ["slammer drop", 1.1],] //added if t2 bots option
var airLateGame = [["make a zeus", 1.2], ["attempt a hornet snipe", 1.2], ["heavy horsefly", 1.1], ["make 3+ angels", 1.2]] //added if t2 air option
var navalLateGame = [["kaiju spam", 1.1], ["advanced torpedo launcher creep", 1.2]] //added if t2 naval option
//------------------------------------------------------------

//have a chance to occur(30%)
var playstyleModifier = [
    ["1 air fac", 1.4],
    ["commander not allowed to move", 1.2],
    ["bot heavy no dox", 1.3],
    ["no bombers", "1.3"],
    ["heavy defenses", "1.4"],
    ["delayed com push", "1.6"],
    ["defensive play", '1.3'],
    ["aggressive play", "1.2"],
    ["max 1 t2 fac", '1.05'],
    ["all t2 should be proxies", "1.2"],
    ["no defenses", "1.4"],
    ["no radar", "1.2"],
    ["no reclaim", "1.2"]
]

var hardModeModifier = [
    ["fab flood(first factory can only make fabs and cannot be turned off)", 1.7],
    ["t1 only", 1.4],
    ["no t1 power", 2.2],
    ["fab only", 1.8],
    ["patrol only for offense(can defend normally)", 2.0],
    ["no micro during engagements(units shooting)", 1.4],
    ["strykers instead of ants/drifters", 1.4],
    ["no levelers/slammers/kestrels/t2 fighters", 1.5],
    ["only com is allowed to make t1 metal", 2.5],
    ["com can't make power", "1.3"],
    ["no raiding(all attacks must go in a straight as possible line to enemy base from yours)", 2]
]

//have a chance to occur(10-20%)
var memeOptions = [
    ["mine his metal/stitch drop", 1.3],
    ["only bots", 1.8],
    ["only vehicles", 2],
    ["max 3 fabs", 1.5],
    ["t2 rush(after 4 facs including proxies)", 1.3],
    ["large inferno drop(5+)", 1.2],
    ["large boom drop", 1.4],
    ["angel based snipe", 1.2],
    ["anchor creep", 1.8],
    ["teleporter rush", 1.2],
    ["try a bombersnipe", 1.4],
    ["heavy t1 boosting", 1.6],
    ["proxy only(1-2 fac per metal cluster based on size)", 2.0]
]


//generates a build order based off setting, will do the first x facs and fab opener
//e.g 
//can either generalize or use math to ensure the efficiency of the build order stays above a certain amount on average
//problem is the only valid things in a BO are metal, power, facs. storage is bad
var buildbarIcons = {
    "air": "air/air_factory/air_factory_icon_buildbar",
    "bot": "land/bot_factory/bot_factory_icon_buildbar",
    "vehicle": "land/vehicle_factory/vehicle_factory_icon_buildbar",
    "naval": "sea/naval_factory/naval_factory_icon_buildbar",
    "t2air": "air/air_factory_adv/air_factory_adv_icon_buildbar",
    "t2bot": "land/bot_factory_adv/bot_factory_adv_icon_buildbar",
    "t2vehicle": "land/vehicle_factory_adv/vehicle_factory_adv_icon_buildbar",
    "t2naval": "sea/naval_factory_adv/naval_factory_adv_icon_buildbar",
    "orbital": "land/orbital_launcher/orbital_launcher_icon_buildbar",
    "metal": "land/metal_extractor/metal_extractor_icon_buildbar",
    "power": "land/metal_extractor/metal_extractor_icon_buildbar",
}

var fabBuildBars = [["Air", ""], ['bot', ""], ["Vehicle", ""], ["Naval", ""]]

var fabOpener = [[2, 0.1], [3, 0.5], [4, 0.3], [5, 0.1]]


//example build = [['bot',"air","vehicle"],"1-1-1"]
model.generateBuildOrder = function (chosenBuild) {
    //chosenBuild = [['bot',"air","vehicle"],"1-1-1"]
    var openingFacs = []
    var fabType = ""
    for (var i = 0; i < chosenBuild[0].length; i++) {
        if (i == 0) {
            fabType = " " + chosenBuild[0][0] + " fabs"
            if (chosenBuild[0][0] == "metal" || chosenBuild[0][0] == "power") {
                fabType = " fabs"
            }
        }
        openingFacs.push({
            factory: chosenBuild[0][i],
            buildBar: buildbarIcons[chosenBuild[0][i]]
        })
    }
    stratModel.openingFacs(openingFacs)
    stratModel.openingName(chosenBuild[1])
    var fabNumber = randomWeightedChoice(fabOpener)
    if (openingFacs[0].factory == "naval") { fabNumber-- }
    if (openingFacs[0].factory == "air" && fabNumber > 3) { fabNumber = "whatever you want" }
    stratModel.openingFabsName("Open with " + fabNumber + fabType)
}

model.generateT2BuildOrder = function (firstT2, secondT2) {
    var openingFacs = []

    openingFacs.push({
        factory: firstT2,
        buildBar: buildbarIcons["t2" + firstT2],
        has_next: true
    })

    openingFacs.push({
        factory: secondT2,
        buildBar: buildbarIcons["t2" + secondT2],
        has_next: false
    })

    stratModel.openingT2Facs(openingFacs)
}

function randomWeightedChoice(array) {
    var rolledValue = Math.random();
    var total = 0
    for (var i = 0; i < array.length; i++) {
        total += array[i][1]
        if (rolledValue < total) { return array[i][0] }
    }
    return "Invalid Weighting"
}

function randomChoice(array, chance) {
    if (chance == undefined) { chance = 1.0 }
    var finalResult = array[Math.floor(Math.random() * array.length)]
    var chanceNum = Math.random()
    if (chance > chanceNum) { return finalResult }
    else { return ["no change", 1.0] }

}

function randomT2Choices(choiceArray) {
    var firstT2 = randomChoice(choiceArray)
    choiceArray = _.without(choiceArray, firstT2)
    var secondT2 = randomChoice(choiceArray)
    return [firstT2, secondT2]
}

model.generateStrategy = function () {
    var calculatedDifficulty = 1.0;

    stratModel.stratGenerated(true)
    var possibleBuildOrders = openingBuilds
    if (stratModel.hybrid() == true) { possibleBuildOrders = hybridOpeningBuilds }
    if (stratModel.naval() == true) { possibleBuildOrders = navalOpeningBuilds }
    var choice = randomChoice(possibleBuildOrders)

    calculatedDifficulty = calculatedDifficulty * choice[2]
    stratModel.openingDifficulty(choice[2])

    model.generateBuildOrder(choice)

    var earlyGameOptions = earlyGame
    if (stratModel.hybrid() == true) { earlyGameOptions = hybridEarlyGame }
    if (stratModel.naval() == true) { earlyGameOptions = navalEarlyGame }

    var choice = randomChoice(earlyGameOptions)

    calculatedDifficulty = calculatedDifficulty * choice[1]
    stratModel.earlyGameDifficulty(choice[1])

    stratModel.earlyGame(choice[0])

    var t2Choices = randomT2Choices(firstT2)
    var firstT2Choice = t2Choices[0]
    var secondT2Choice = t2Choices[1]

    if (stratModel.naval() == true) {
        var t2Choices = randomT2Choices(firstT2Naval)
        var firstT2Choice = t2Choices[0]
        var secondT2Choice = t2Choices[1]
    }
    if (stratModel.hybrid() == true) {
        var t2Choices = randomT2Choices(firstT2Hybrid)
        firstT2Choice = t2Choices[0]
        secondT2Choice = t2Choices[1]
        if (stratModel.naval() == true) {
            firstT2Choice = randomChoice(firstT2Naval)
            secondT2Choice = randomChoice(_.without(firstT2Hybrid, firstT2Choice))
        }
    }

    stratModel.t2Choice(firstT2Choice + " / " + secondT2Choice)
    model.generateT2BuildOrder(firstT2Choice, secondT2Choice)

    //---------------------------
    var midGameOptions = midGame

    if (firstT2Choice == "air") { midGameOptions = midGameOptions.concat(airMidGame) }
    if (firstT2Choice == 'bot') { midGameOptions = midGameOptions.concat(botMidGame) }
    if (firstT2Choice == "naval") { midGameOptions = midGameOptions.concat(navalMidGame) }
    if (firstT2Choice == "vehicle") { midGameOptions = midGameOptions.concat(vehicleMidGame) }

    var choice = randomChoice(midGameOptions)

    calculatedDifficulty = calculatedDifficulty * choice[1]
    stratModel.midGameDifficulty(choice[1])
    stratModel.midGame(choice[0])

    //---------------------------
    var lateGameOptions = lateGame

    if (firstT2Choice == "air" || secondT2Choice == "air") { lateGameOptions = lateGameOptions.concat(airLateGame) }
    if (firstT2Choice == 'bot' || secondT2Choice == 'bot') { lateGameOptions = lateGameOptions.concat(botLateGame) }
    if (firstT2Choice == "naval" || secondT2Choice == "naval") { lateGameOptions = lateGameOptions.concat(navalLateGame) }
    if (firstT2Choice == "vehicle" || secondT2Choice == "vehicle") { lateGameOptions = lateGameOptions.concat(vehicleLateGame) }
    if (stratModel.orbital() == true) { lateGameOptions = lateGameOptions.concat(orbitalLateGame) }
    var choice = randomChoice(lateGameOptions)

    calculatedDifficulty = calculatedDifficulty * choice[1]
    stratModel.endGameDifficulty(choice[1])

    stratModel.endGame(choice[0])

    //---------------------------

    var choice = randomChoice(playstyleModifier, 0.5)

    calculatedDifficulty = calculatedDifficulty * choice[1]
    stratModel.modifierDifficulty(choice[1])
    stratModel.modifier(choice[0])

    var choice = randomChoice(memeOptions, 0.2)

    calculatedDifficulty = calculatedDifficulty * choice[1]
    stratModel.memeDifficulty(choice[1])

    stratModel.meme(choice[0])

    if (stratModel.hardMode() == true) {
        choice = randomChoice(hardModeModifier)
        stratModel.hardModifier(choice[0])
        stratModel.hardModifierDifficulty(choice[1])
        calculatedDifficulty = calculatedDifficulty * choice[1]
    }
    else {
        stratModel.hardModifier("none")
        stratModel.hardModifierDifficulty(1.0)
    }
    calculatedDifficulty = calculatedDifficulty.toFixed(2)
    stratModel.difficulty(calculatedDifficulty)
    var winChance = 0.5 / calculatedDifficulty * 100
    winChance = winChance.toFixed(1)
    stratModel.winChance("%" + winChance)
}



model.processGenerateClick = function () {
    //$("#generateStrat").css("opacity",0.5)
    //_.delay(function(){$("#generateStrat").css("opacity",1.0)},3000)
    api.audio.playSoundFromFile("/pa/audio/roulette.wav");
    model.generateStrategy();
    // _.delay(model.generateStrategy, 3000)

}