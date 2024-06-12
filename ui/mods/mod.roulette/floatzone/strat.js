const data_folder_path = 'coui://ui/mods/mod.roulette/data/';


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

    self.modifiers = ko.observableArray([]);
    self.earlygame_tasks = ko.observableArray([]);
    self.midgame_tasks = ko.observableArray([]);
    self.endgame_tasks = ko.observableArray([]);

    self.earlygame_factories = ko.observableArray([]);
    self.midgame_factories = ko.observableArray([]);

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
    if (status == "true") {
        status = "false";
    } else {
        status = "true";
    }
    localStorage.setItem("frames_strat_frame_switchStatus", status);
    if (localStorage["frames_strat_frame_switchStatus"] == "true") {
        // just doesnt work, naaaahhh
        // var str = "linear-gradient(135deg, rgba(53, 53, 53, 0.38) 0%, rgba(255, 255, 255, 0) 100%) !important"
        // $(".content-viewport").css("background",str);
        $("#viewport").css("flex-direction", "row-reverse");

    } else {
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
    if (stratModel.orbital() == true) {
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

// loaded data
var catalog = {
    factories: [],
    max_modifiers_count: 0,
    max_earlygame_count: 0,
    max_midgame_count: 0,
    max_endgame_count: 0,

    conflict_groups: [],

    items: []
}

// STATIC FUNCTIONS -------------------------------------------------------------
function load_data() {
    // structure schema
    // {
    //     id: number
    //     content: string
    //     planet_conditions: [string]
    //     stage_conditions: [string]
    // }
    // loading catalog
    $.getJSON(data_folder_path.concat('catalog.json')).then(function (data) {
        catalog = data
        console.log('catalog:/')
        console.log(catalog)
    });
}

// STATIC FUNCTIONS MATH -------------------------------------------------------------
function get_random_value_inclusive(min, max) {
    return _.random(min, max);
}

/**
 * Returns a random value from an array along with its index.
 *
 * @param {Array} array - The array from which to select a random value.
 * @return {Object|undefined} An object containing the randomly selected value and its index, or undefined if the array is empty.
 * @example
 * var result = get_random_array_value(["foo", "bar", "baz"]);
 * var value = result.value
 * var index = result.index
 */
function get_random_array_value(array) {
    if (array.length == 0) { return undefined }

    var index = Math.floor(Math.random() * array.length);
    return {
        value: array[index],
        index: index
    };
}

/**
 * Returns a random value from an array based on the weights of each element. 
 * Array elements should be objects containing the weight property
 *
 * @param {Array<{value: any, weight: number}>} array - The array of objects containing the weight of each element.
 * @return {any} The randomly selected value from the array with index, or undefined if no value is found.
 * @example
 * var result = get_random_value_by_weight([{some_property: "foo", weight: 0.5}, {some_property: "bar", weight: 0.3}, {another_property: "baz", weight: 0.2}]);
 * var value = result.value
 * var index = result.index
 */
function get_random_value_by_weight(array) {
    if (array.length == 0) { return undefined }
    
    // multiply random value between 0..1 by sum of all weights
    var weight_pointer = Math.random() * _.reduce(array, function (acc, obj) 
    { 
        if(obj.weight == undefined) { return acc+1 }
        return acc + obj.weight
    }, 0);
    // var weight_pointer = Math.random();

    console.log("weight_pointer: "+weight_pointer)

    var weight_pointer_treshold = 0
    for (var i = 0; i < array.length; i++) {
        weight_pointer_treshold += (array[i].weight || 1)
        console.log("weight_pointer_treshold: "+weight_pointer_treshold)
        if (weight_pointer < weight_pointer_treshold) {
            return {
                value: array[i],
                index: i
            }
        }
    }
    return undefined
}

function get_multiple_random_array_values(original_array, count) {
    if (count > original_array.length) { count = original_array.length }

    var results = []
    var copied_array = original_array.slice()
    for (var i = 0; i < count; i++) {
        var result = get_random_array_value(copied_array)
        results.push(result.value)
        // remove selected value
        copied_array.splice(result.index, 1)
    }
    return results
}

function get_multiple_random_array_values_by_weight(original_array, count) {
    if (count > original_array.length) { count = original_array.length }

    var results = []
    var copied_array = original_array.slice()
    for (var i = 0; i < count; i++) {
        var result = get_random_value_by_weight(copied_array)
        results.push(result.value)
        // remove selected value
        copied_array.splice(result.index, 1)
    }
    return results
}

// STATIC FUNCTIONS MATH END -------------------------------------------------------------

function get_localized_string(key) {
    return loc('!LOC:' + key);
}


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

    // stratModel.modifiers(get_modifiers())
    // console.log(stratModel.modifiers)

    var new_strategy = get_new_strategy()
    stratModel.modifiers(new_strategy.modifiers)
    stratModel.earlygame_tasks(new_strategy.earlygame_tasks)
    stratModel.midgame_tasks(new_strategy.midgame_tasks)
    stratModel.endgame_tasks(new_strategy.endgame_tasks)
    stratModel.earlygame_factories(new_strategy.earlygame_factories)
    stratModel.midgame_factories(new_strategy.midgame_factories)

    // console.log("new strategy/:")
    // debug(new_strategy)
}

// STRATEGY GENERATOR -----------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------

function get_new_strategy() {
    var modifiers_count = get_random_value_inclusive(1, catalog.max_modifiers_count)
    var earlygame_tasks_count = get_random_value_inclusive(1, catalog.max_earlygame_count)
    var midgame_tasks_count = get_random_value_inclusive(1, catalog.max_midgame_count)
    var endgame_tasks_count = get_random_value_inclusive(1, catalog.max_endgame_count)



    var items_copy = catalog.items.slice()
    // remove unused items with id = -1
    items_copy = _.filter(items_copy, function (x) {
        return x.id != -1;
    });

    var planet_conditions = get_selected_planet_conditions()
    debug(planet_conditions)

    // example of struct:
    // {
    //     factories: ["naval", "naval","air","naval"],
    //     types: ["naval", "air"],
    //}
    const earlygame_factories_order_lengths =[
        {
            value:2,
            weight:2.33
        },
        {
            value:3,
            weight:6.10
        },
        {
            value:4,
            weight:1.44
        },
        {
            value:5,
            weight:0.34
        }
    ]

    var earlygame_factories_order_length = get_random_value_by_weight(earlygame_factories_order_lengths).value.value
    var earlygame_factories_order = get_factories_order(planet_conditions, 1,
        earlygame_factories_order_length
    )
    var midgame_factories_order = get_factories_order(planet_conditions, 2,
        2
    )

    var modifiers = get_multiple_random_array_values_by_weight(
        _.filter(items_copy, function (x) {
            return does_item_match_conditions(
                planet_conditions, ["modifier"],
                // merged earlygame and midgame factory types
                earlygame_factories_order.types.concat(midgame_factories_order.types),
                x);
        }),
        modifiers_count)
    // remove selected items by filter
    items_copy = _.filter(items_copy, function (x) {
        return !_.includes(modifiers, x);
    });

    // EARLYGAME
    var earlygame_tasks = get_multiple_random_array_values_by_weight(
        _.filter(items_copy, function (x) {
            return does_item_match_conditions(
                planet_conditions, ["earlygame"],
                earlygame_factories_order.types,
                x);
        }),
        earlygame_tasks_count)
    items_copy = _.filter(items_copy, function (x) {
        return !_.includes(earlygame_tasks, x);
    });

    // MIDGAME
    var midgame_tasks = get_multiple_random_array_values_by_weight(
        _.filter(items_copy, function does_item_match_conditions_midgame(x) {
            return does_item_match_conditions(planet_conditions, ["midgame"], 
                midgame_factories_order.types, 
                x);
        }),
        midgame_tasks_count)
    items_copy = _.filter(items_copy, function (x) {
        return !_.includes(midgame_tasks, x);
    });

    // ENDGAME
    var endgame_tasks = get_multiple_random_array_values_by_weight(
        _.filter(items_copy, function does_item_match_conditions_endgame(x) {
            return does_item_match_conditions(planet_conditions, ["endgame"],
                ["any"], x);
        }),
        endgame_tasks_count)

    var result = resolve_conflicting_items(
        [
            modifiers,
            earlygame_tasks,
            midgame_tasks,
            endgame_tasks
        ]
    )

    return {
        modifiers: result[0],
        earlygame_tasks: result[1],
        midgame_tasks: result[2],
        endgame_tasks: result[3],

        earlygame_factories: earlygame_factories_order.factories,
        midgame_factories: midgame_factories_order.factories
    }
}

/**
 * Returns an array of planet conditions based on the selected model's orbital and naval properties.
 *
 * @return {Array} An array of strings representing the planet conditions. The array contains "orbital" if the selected model is orbital, "naval" if the selected model is naval, and "land" if the selected model is not naval.
 */
function get_selected_planet_conditions() {
    var condtions = []
    if (stratModel.orbital() == true) {
        condtions.push("orbital")
    }

    if (stratModel.naval() == true) {
        condtions.push("naval")
    } else {
        condtions.push("land")
    }

    return condtions
}

/**
 * Generates the order of factories based on planet conditions, tier, and order length.
 *
 * @param {Array} planet_conditions - The conditions of the planet.
 * @param {number} tier - The selected tier for factories.
 * @param {number} order_length - The length of the order to generate.
 * @return {Object} An object containing the ordered factories and types.
 * @example 
 * var order = get_factories_order(["land"], 1, 3)
 * console.log(order)
 * // { factories: ["vehicle", "bot", "bot", "vehicle"], types: ["vehicle", "bot"] }
 */
function get_factories_order(planet_conditions, tier, order_length) {
    var factories_copy = catalog.factories.slice()

    // FILTER FACTORIES
    // remove all factories that are not the selected tier
    factories_copy = _.filter(factories_copy, function (x) {
        return x.tier == tier;
    })

    var air_factory_check = 0;

    // remove all land factories if land is not selected
    if (!_.includes(planet_conditions, "land")) {
        air_factory_check++;
        console.log("land not selected")
        factories_copy = _.filter(factories_copy, function (x) {
            console.log(x.type+" keep " +(x.type != "bot" && x.type != "vehicle"))
            return x.type != "bot" && x.type != "vehicle";
        });
    }

    if (!_.includes(planet_conditions, "naval")) {
        air_factory_check++;
        factories_copy = _.filter(factories_copy, function (x) {
            return x.type != "naval";
        });
    }

    if (air_factory_check == 2) {
        factories_copy = _.filter(factories_copy, function (x) {
            return x.type != "air";
        });
    }

    if (!_.includes(planet_conditions, "orbital")) {
        factories_copy = _.filter(factories_copy, function (x) {
            return x.type != "orbital";
        });
    }

    debug(factories_copy)

    // GENERATE ORDER
    var factory_order = {
        factories: [],
        // order of types garantees appearance of same type in order 
        types: []
    }

    for (var i = 0; i < order_length; i++) {
        var random_index = get_random_value_inclusive(0, factories_copy.length - 1)
        var factory = factories_copy[random_index]

        // push new factory in order
        factory_order.factories.push(factory)

        // push new type in order if it doesn't exist
        if (!_.includes(factory_order.types, factory.type)) {
            factory_order.types.push(factory.type)
        }
    }

    return factory_order
}


/**
 * Checks if the given item matches all the specified conditions.
 *
 * @param {Array} planet_conditions - An array of planet conditions to check against.
 * @param {Array} stage_conditions - An array of stage conditions to check against.
 * @param {Array} factory_conditions - An array of factory conditions to check against.
 * @param {Object} item - The item to check.
 * @return {boolean} Returns true if the item matches all the conditions, otherwise false.
 */
function does_item_match_conditions(planet_conditions, stage_conditions, factory_conditions, item) {
    if (does_item_match_any_planet_conditions(planet_conditions, item) == false) {
        return false
    }
    if (does_item_match_any_stage_conditions(stage_conditions, item) == false) {
        return false
    }
    if (does_item_match_any_factory_conditions(factory_conditions, item) == false) {
        return false
    }

    return true
}

/**
 * Checks if the given item matches the specified planet conditions.
 *
 * @param {Array} conditions - An array of planet conditions to check against.
 * @param {Object} item - The item to check.
 * @return {boolean} Returns true if the item matches all the conditions, otherwise false.
 * @deprecated not used yet
 */
function does_item_match_planet_conditions(conditions, item) {
    for (var i = 0; i < conditions.length; i++) {
        if (item.planet_conditions.includes(conditions[i]) == false) {
            return false
        }
    }
    return true
}

/**
 * Checks if the given item matches any of the specified planet conditions.
 *
 * @param {Array} conditions - An array of planet conditions to check against.
 * @param {Object} item - The item to check.
 * @return {boolean} Returns true if the item matches any of the conditions, otherwise false.
 */
function does_item_match_any_planet_conditions(conditions, item) {
    // console.log("does_item_match_any_planet_conditions")
    // console.log(item)
    // console.log(conditions)
    if (_.includes(item.planet_conditions, "any")) {
        return true
    }

    for (var i = 0; i < conditions.length; i++) {
        if (_.includes(item.planet_conditions, conditions[i])) {
            return true
        }
    }
    return false
}

/**
 * Checks if the given item matches any of the specified stage conditions.
 *
 * @param {Array} stage_conditions - An array of stage conditions to check against.
 * @param {Object} item - The item to check.
 * @return {boolean} Returns true if the item matches any of the stage conditions, otherwise false.
 */
function does_item_match_any_stage_conditions(stage_conditions, item) {
    for (var i = 0; i < stage_conditions.length; i++) {
        if (_.includes(item.stage_conditions, stage_conditions[i])) {
            return true
        }
    }
    return false
}

function does_item_match_any_factory_conditions(factory_conditions, item) {
    if (_.includes(item.factory_conditions, "any")) {
        return true
    }

    for (var i = 0; i < factory_conditions.length; i++) {
        if (_.includes(item.factory_conditions, factory_conditions[i])) {
            return true
        }
    }
    return false
}

/**
 * Resolves conflicts between items in the given arrays of items.
 *
 * @param {Array<Array<Object>>} items_arrays - An array of arrays of items, where each item is an object with an 'id' property.
 * @return {Array<Array<Object>>} The modified array of arrays of items, with conflicting items removed.
 */
function resolve_conflicting_items(items_arrays) {
    // copy arrays to not modify original arrays
    var items_arrays = items_arrays.slice()
    // each conflict group contains two arrays (left,right)
    // for each conflict group we should look at the left and right arrays
    // if items_array contains an item that matches any side of conflict group
    // we should look at the other side ids and remove them from items_array

    // items does not have priority so first item we look at is prioritized

    var conflict_groups = catalog.conflict_groups

    for (var i = 0; i < conflict_groups.length; i++) {
        var conflict_group = conflict_groups[i]
        var left = conflict_group.left
        for (var j = 0; j < left.length; j++) {
            if (find_item(left[j]) != undefined) {
                remove_items(conflict_group.right)
                // if we removed all conflict for a single item in group we can break
                // to not iterate through the rest of the conflict group
                break
            }
        }
    }

    return items_arrays

    /**
    * Search for an item by its ID in the items arrays.
    *
    * @param {number} id - The ID of the item to find.
    * @return {Object} The item with the matching ID, or undefined if not found.
    */
    function find_item(id) {
        // It iterates through each array in the outer loop 
        // and each element in the inner loop.
        for (var i = 0; i < items_arrays.length; i++) {
            for (var j = 0; j < items_arrays[i].length; j++) {
                if (items_arrays[i][j].id == id) {
                    return items_arrays[i][j]
                }
            }
        }

        return undefined
    }

    function remove_item(id) {
        for (var i = 0; i < items_arrays.length; i++) {
            for (var j = 0; j < items_arrays[i].length; j++) {
                if (items_arrays[i][j].id == id) {
                    items_arrays[i].splice(j, 1)
                }
            }
        }
    }

    function remove_items(ids) {
        for (var i = 0; i < ids.length; i++) {
            remove_item(ids[i])
        }
    }
}

function debug(object){
    console.log(JSON.stringify(object,null,2))
}


model.processGenerateClick = function () {
    //$("#generateStrat").css("opacity",0.5)
    //_.delay(function(){$("#generateStrat").css("opacity",1.0)},3000)
    api.audio.playSoundFromFile("/pa/audio/roulette.wav");
    model.generateStrategy();
    // _.delay(model.generateStrategy, 3000)

}


load_data();