//view model setup
function stratModel() {
        var self = this;
        //ui related observables
        self.naval = ko.observable(false)
        self.hybrid = ko.observable(false)
        self.orbital = ko.observable(false)
        self.openingFacs = ko.observable([])
        self.openingFabs = ko.observable([])
        self.openingName = ko.observable("")
        self.openingFabsName = ko.observable("")
        self.openingModifier = ko.observable("")
        self.earlyGame = ko.observable("")
        self.midGame = ko.observable("")
        self.endGame = ko.observable("")
        self.modifier = ko.observable("")
        self.t2Choice = ko.observable("")
        self.stratGenerated = ko.observable(false)
        self.meme = ko.observable("")
     
}
stratModel = new stratModel();

model.toggleNaval = function(){
    stratModel.naval(!stratModel.naval())
}

model.toggleHybrid = function(){
    stratModel.naval(!stratModel.naval())
}

model.toggleOrbital = function(){
    stratModel.naval(!stratModel.naval())
}

//makes the floating frame for the view model
createFloatingFrame("strat_frame", 450, 50, {"offset": "topRight", "left": -240});

//attaches the html to the frame
$.get("coui://ui/mods/mod.roulette/floatzone/strat.html", function (html) {
		$("#strat_frame_content").append(html);
})


//controls the positioning of the frame
model.stratLockEvent = function() {
    console.log("triggered")
if (localStorage["frames_strat_frame_lockStatus"] == "true") {
    $("#strat_lock").attr("src", "coui://ui/mods/mod.roulette/img/unlock-icon.png");
    unlockFrame("strat_frame");
} else  {
    $("#strat_lock").attr("src", "coui://ui/mods/mod.roulette/img/lock-icon.png");
    lockFrame("strat_frame");
}

}


var stratUIExpanded = ko.observable(true);

model.toggleStratUIExpanded = function(){
    stratUIExpanded(!stratUIExpanded())
    if (stratUIExpanded() == true) {
        $("#strat_visible").attr("src", "coui://ui/mods/mod.roulette/img/visible.png");
    } else  {
        $("#strat_visible").attr("src", "coui://ui/mods/mod.roulette/img/notVisible.png");
       
    }
}


//add difficulty values to each strat

//add button options to specify if it is naval start, hybrid or orb
//hybrid builds may have any normal fac replace naval if shore is too far(e.g small lake somewhere)
//if naval/hybrid, orb only changes early game+ options

//always
var openingBuilds = [
    [["air"],"air first"], 
    [["bot"],"bot first"], 
    [["vehicle"],"vehicle first"],
    [["bot","air"],"meta build"], 
    [["bot","power","air"],"meta macro"],
    [["bot","air","vehicle"],"1-1-1"], 
    [["bot","bot"],"double bot"], 
    [["bot","air","air"],"bot-2air"],
    [["vehicle","air","air"],"vehicle-2air"], 
    [["vehicle","vehicle"],"double vehicle"], 
    [["bot","bot","bot"],"bot-comrush"], 
    [["bot","air","bot","bot","bot"],"phyrric comrush"], 
    [["vehicle","vehicle","vehicle","vehicle"],"ferret comrush"],
    [["metal","power"],"metal-power-fac"], 
    [["metal","metal"],"2+metal with com during build"], 
]

var hybridOpeningBuilds = [
    [["naval"],"naval first"], 
    [["air"],"air first"], 
    [["bot"],"bot first"], 
    [["vehicle"],"vehicle first"], 
    [["naval", "air"],"naval-air"],
    [["bot", "naval"],"bot-naval"], 
    [["vehicle", "naval"],"vehicle-naval"], 
    [["bot", "air","naval"],"fast standard"], 
    [["bot", "air","air","naval"],"air heavy standard"], 
    [["bot", "air","bot","naval"],"bot heavy standard"], 
]

var navalOpeningBuilds = [
    [["naval"],"naval first"], 
    [["naval", "metal", "air"],"meta"], 
    [["naval", "metal", "power", "air"],"meta macro"],
    [["naval", "naval"],"double naval"], 
    [["naval", "air", "air"],"naval-2air"], 
    [["naval", "air", "naval"],"naval-air-naval"]
]

//early game is pre t2
//------------------------------------------------------------
var earlyGame = [
    "fab drops","spark/inferno drop", "commander rush","fab heavy", "no scouting",
    "no defenses","early orbital","pre fab units","wrong way(expand backwards)",
    "line base", "base rush(build base towards opponent aggressively)", "no fab snipes"
]

var navalEarlyGame = ["piranha spam","commander rush","fab heavy", "no scouting","no defenses","make an early barnacle"]

var hybridEarlyGame = ["piranha spam","commander rush","fab heavy", "no scouting","no defenses","no fab snipes","spark/inferno drop","aggressive naval proxy"]

var orbitalEarlyGame = ["commander rush","early invasion","build an anchor", "tele rush", "astreus drop","no scouting","no defenses","no fab snipes"]
//------------------------------------------------------------
//randomized and mid/late game options are restricted to that choice
var firstT2 = ["air","bot","vehicle","naval if applicable(bot otherwise)","naval if applicable(air otherwise)","naval if applicable(vehicle otherwise)"]

//post first t2
//------------------------------------------------------------
var midGame = ["manhattan first unit", "locust swarm", "t2 pelican drop", "mend creep", "drifter heavy","gren heavy","pelter spam", "silver push","air heavy", "reclaim/stitch heavy", "teleporter push"]
var navalMidGame = ["torpedo launcher creep","kaiju spam",""]
var hybridMidGame = []
var orbitalMidGame = []
var vehicleMidGame = []
var botMidGame = []
var airMidGame = []

//post second t2
//------------------------------------------------------------
var lateGame = ["Use a nuke","build a titan","use omegas","use unit cannons","Make a holkins","defense creep"]
var navalLateGame = []
var hybridLateGame = []
var orbitalLateGame = []
var vehicleLateGame = []
var botLateGame = []
var airLateGame = []
//------------------------------------------------------------

//have a chance to occur(30%)
var playstyleModifier = ["1 air fac","commander not allowed to move", "bot heavy no dox", "no bombers", "t1 only","turtle cancer","delayed com push", "proxy t2", "hyper-defensive play", "hyper-aggressive play"]

//have a chance to occur(10-20%)
var memeOptions = ["mine his metal/stitch drop","only bots", "only vehicles","max 3 fabs","t2 rush", "inferno drop","large boom drop", "angel based snipe","anchor creep","teleporter rush", "try a bombersnipe"]


//generates a build order based off setting, will do the first x facs and fab opener
//e.g 
//can either generalize or use math to ensure the efficiency of the build order stays above a certain amount on average
//problem is the only valid things in a BO are metal, power, facs. storage is bad
var buildbarIcons = {
    "air": "air/air_factory/air_factory_icon_buildbar",
    "bot": "land/bot_factory/bot_factory_icon_buildbar",
    "vehicle": "land/vehicle_factory/vehicle_factory_icon_buildbar",
    "naval":"naval/naval_factory/naval_factory_icon_buildbar",
    "orbital":"land/orbital_launcher/orbital_launcher_icon_buildbar",
    "metal":"land/metal_extractor/metal_extractor_icon_buildbar",
    "power":"land/metal_extractor/metal_extractor_icon_buildbar",
    }

var fabBuildBars = [["Air",""],["Bot",""],["Vehicle",""],["Naval",""]]

var fabOpener = [[2,0.1],[3,0.5],[4,0.3],[5,0.1]]


//example build = [["bot","air","vehicle"],"1-1-1"]
model.generateBuildOrder = function(chosenBuild){
    //chosenBuild = [["bot","air","vehicle"],"1-1-1"]
    var openingFacs = []
    var fabType = ""
    for(var i = 0; i<chosenBuild[0].length;i++){
      if(i == 0){fabType = " "+chosenBuild[0][0] + " fabs"}
      openingFacs.push({
        factory:chosenBuild[0][i],
        buildBar:buildbarIcons[chosenBuild[0][i]]
    })
    }
    stratModel.openingFacs(openingFacs)
    stratModel.openingName(chosenBuild[1])
    stratModel.openingFabsName("Open with "+randomWeightedChoice(fabOpener) + fabType)
}

function randomWeightedChoice(array){
    var rolledValue = Math.random();
    var total = 0
    for(var i = 0;i < array.length;i++){
        total += array[i][1]
        if(rolledValue< total){return array[i][0]}
    }
    return "Invalid Weighting"
}

function randomChoice(array, chance){
    if(chance == undefined){chance = 1.0}
    var finalResult = array[Math.floor(Math.random()*array.length)]
    var chanceNum = Math.random()
    console.log(chanceNum, chance)
    if(chance>chanceNum){return finalResult}
    else{return "standard play"}

}

model.generateStrategy = function(){
    $(".generateStrat").removeClass('icn-spinner')
    stratModel.stratGenerated(true)
    var possibleBuildOrders = openingBuilds
    if(stratModel.hybrid() == true){possibleBuildOrders = hybridOpeningBuilds}
    if(stratModel.naval() == true){possibleBuildOrders = navalOpeningBuilds}
    model.generateBuildOrder(randomChoice(possibleBuildOrders))

    var earlyGameOptions = earlyGame
    if(stratModel.hybrid() == true){earlyGameOptions = hybridEarlyGame}
    if(stratModel.naval() == true){earlyGameOptions = navalEarlyGame}
    stratModel.earlyGame(randomChoice(earlyGameOptions))

    var midGameOptions = midGame
    if(stratModel.hybrid() == true){midGameOptions = hybridMidGame}
    if(stratModel.naval() == true){midGameOptions = navalMidGame}
    if(stratModel.orbital() == true){midGameOptions = orbitalMidGame}
    stratModel.midGame(randomChoice(midGameOptions))

    var lateGameOptions = lateGame
    if(stratModel.hybrid() == true){midGameOptions = hybridLateGame}
    if(stratModel.naval() == true){midGameOptions = navalLateGame}
    if(stratModel.orbital() == true){midGameOptions = orbitalLateGame}
    stratModel.endGame(randomChoice(lateGameOptions))
    
    stratModel.t2Choice(randomChoice(firstT2) + " / "+randomChoice(firstT2))
    stratModel.modifier(randomChoice(playstyleModifier, 0.5))
    stratModel.meme(randomChoice(memeOptions, 0.2))
}




function processGenerateClick(){
    
    api.audio.playSoundFromFile("coui://ui/mods/mod.roulette/audio/roulette.wav");
    $(".generateStrat").addClass('icn-spinner')
    _.delay(model.generateStrategy, 3000)
   
}