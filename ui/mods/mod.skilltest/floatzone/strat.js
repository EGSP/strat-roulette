const data_folder_path = 'coui://ui/mods/mod.skilltest/data/';

const legion_commanders_catalog = [
    "/pa/units/commanders/l_overwatch/l_overwatch.json",
    "/pa/units/commanders/l_cyclops/l_cyclops.json",
    "/pa/units/commanders/l_cataphract/l_cataphract.json",
    "/pa/units/commanders/l_raptor/l_raptor.json",
    "/pa/units/commanders/l_quad/l_quad.json",
    "/pa/units/commanders/l_tank/l_tank.json"
]

const stage_conditions_EXAMPLE = ["modifier", "earlygame", "midgame", "endgame"]
const planet_conditions_EXAMPLE = ["any", "land", "naval", "orbital"]
const placement_types_EXAMPLE = ["land", "naval", "orbital"]
const modification_types_EXAMPLE = ["vanilla", "legion", "sw2", "s17"]

const fill_stage_recursion_depth_max = 4

handlers.commanders = function (payload) {
    commanders_PAYLOAD = payload

    load_data();
}
var commanders_PAYLOAD = null;

//view model setup
function stratModel() {
    var self = this;

    self.land = ko.observable(true)
    self.naval = ko.observable(false)
    self.orbital = ko.observable(false)

    self.modifiers = ko.observableArray([]);
    self.earlygame_tasks = ko.observableArray([]);
    self.midgame_tasks = ko.observableArray([]);
    self.endgame_tasks = ko.observableArray([]);

    self.earlygame_factories = ko.observableArray([]);
    self.midgame_factories = ko.observableArray([]);

    self.is_strategy_ready = ko.observable(false)

}
stratModel = new stratModel();


// BUTTONS ---------------------------------------------------------------
//controls the positioning of the frame
model.stratLockEvent = function () {
    common_button_actions()

    if (localStorage["frames_strat_frame_lockStatus"] == "true") {
        $("#strat_lock").attr("src", "coui://ui/mods/mod.skilltest/img/unlock.png");
        unlockFrame("strat_frame");
    } else {
        $("#strat_lock").attr("src", "coui://ui/mods/mod.skilltest/img/lock.png");
        lockFrame("strat_frame");
    }

}

model.processGenerateClick = function () {
    common_button_actions()

    //$("#generateStrat").css("opacity",0.5)
    //_.delay(function(){$("#generateStrat").css("opacity",1.0)},3000)
    api.audio.playSoundFromFile("/pa/audio/roulette.wav");

    var new_strategy = get_new_strategy()

    // debug(new_strategy, "new strategy")
    stratModel.modifiers(new_strategy.modifiers)
    stratModel.earlygame_tasks(new_strategy.earlygame_tasks)
    stratModel.midgame_tasks(new_strategy.midgame_tasks)
    stratModel.endgame_tasks(new_strategy.endgame_tasks)
    stratModel.earlygame_factories(new_strategy.earlygame_factories)
    stratModel.midgame_factories(new_strategy.midgame_factories)

    stratModel.is_strategy_ready(true)
}

var stratUIExpanded = ko.observable(true);
model.toggleStratUIExpanded = function () {
    common_button_actions()

    stratUIExpanded(!stratUIExpanded())
    if (stratUIExpanded() == true) {
        $("#strat_visible").attr("src", "coui://ui/mods/mod.skilltest/img/visible.png");
    } else {
        $("#strat_visible").attr("src", "coui://ui/mods/mod.skilltest/img/notVisible.png");

    }
}

model.toggleSwitch = function () {
    common_button_actions()

    var status = localStorage["frames_strat_frame_switchStatus"];
    if (status == "true") {
        status = "false";
    } else {
        status = "true";
    }

    update_tooltip_position()

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
    // console.log(status);
}

var tooltipPosition = ko.observable("right")
function update_tooltip_position() {
    if (localStorage["frames_strat_frame_switchStatus"] == "true") {
        return tooltipPosition("right");
    } else {
        return tooltipPosition("left");
    }
}

/**
 * Checks if any of the planet options in the `stratModel` are enabled, and returns `false` if only one is enabled, and `true` otherwise.
 *
 * @return {boolean} `false` if only one planet option is enabled, `true` otherwise.
 */
function can_disable_planet_option() {
    var counter = 0;
    if (stratModel.land() == true) {
        counter++;
    }
    if (stratModel.naval() == true) {
        counter++;
    }
    if (stratModel.orbital() == true) {
        counter++;
    }
    if (counter == 1) {
        return false;
    }

    return true;
}

model.toggleLand = function () {
    common_button_actions()

    var value = stratModel.land();
    if (value == true) {
        if (can_disable_planet_option() == false) {
            return;
        }
    }

    stratModel.land(!value)
    // console.log(stratModel.land())
    if (stratModel.land() == true) {
        $("#land-button-img").attr("src", "coui://ui/mods/mod.skilltest/img/land.png");
    } else {
        $("#land-button-img").attr("src", "coui://ui/mods/mod.skilltest/img/land-no.png");
    }

}

model.toggleNaval = function () {
    common_button_actions()

    var value = stratModel.naval();
    if (value == true) {
        if (can_disable_planet_option() == false) {
            return;
        }
    }

    stratModel.naval(!value)
    // console.log(stratModel.naval())
    if (stratModel.naval() == true) {
        $("#naval-button-img").attr("src", "coui://ui/mods/mod.skilltest/img/ship.png");
    } else {
        $("#naval-button-img").attr("src", "coui://ui/mods/mod.skilltest/img/ship-no.png");
    }

}

model.toggleOrbital = function () {
    common_button_actions()

    var value = stratModel.orbital();
    if (value == true) {
        if (can_disable_planet_option() == false) {
            return;
        }
    }

    stratModel.orbital(!value)
    console.log(stratModel.orbital())
    if (stratModel.orbital() == true) {
        $("#orbital-button-img").attr("src", "coui://ui/mods/mod.skilltest/img/planet.png");
    } else {
        $("#orbital-button-img").attr("src", "coui://ui/mods/mod.skilltest/img/planet-no.png");
    }

}

model.openDiscord = function () {
    engine.call('web.launchPage', 'https://discord.gg/pa');
}
// BUTTONS END -----------------------------------------------------------------

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

// example: player_factions = ["legion","mla"]
var player_factions = []

// example: player_modifications = ["legion","mla","sw2","s17"]
var player_modifications = []

// STATIC FUNCTIONS -------------------------------------------------------------
function load_data() {
    // FIRST STEP: GET PLAYER INFO
    // LOOK FOR FACTIONS
    var player_commanders = commanders_PAYLOAD;
    for (var i = 0; i < player_commanders.length; i++) {
        if (_.includes(legion_commanders_catalog, player_commanders[i])) {
            player_factions.push("legion")
        } else {
            player_factions.push("mla")
        }
    }

    // remove faction duplicates
    player_factions = _.uniq(player_factions)
    console.log("player_factions:/")
    console.log(player_factions)

    // LOOK FOR MODIFICATIONS
    api.mods.getMounted("server").then(function (mods) {
        player_modifications.push("vanilla")

        var identifiers = _.pluck(mods, "identifier")

        if (_.includes(identifiers, "com.pa.legion-expansion-server") ||
            _.includes(identifiers, "com.pa.legion-expansion-server.dev")) {
            player_modifications.push("legion")
        }

        if (_.includes(identifiers, "com.pa.daedelus.experimentals") ||
            _.includes(identifiers, "com.pa.daedelus.experimentals.dev")) {
            player_modifications.push("s17")
        }

        if (_.includes(identifiers, "pa.mla.unit.addon") ||
            _.includes(identifiers, "pa.mla.unit.addon.dev")) {
            player_modifications.push("sw2")
        }
    })

    // SECOND STEP: LOAD AND BUILD CATALOG
    // structure schema
    // {
    //     id: number
    //     content: string
    //     planet_conditions: [string]
    //     stage_conditions: [string]
    // }
    // loading catalog
    $.getJSON(data_folder_path.concat('catalog.json')).then(function (data) {
        data_build_items(data)
        data_build_factories(data)

        catalog = data
        console.log('catalog:/')
        console.log(catalog)
    });
}

const content_nested_id_multiplier = 1000;
function data_build_items(catalog) {
    // setup confilict ids
    var generated_items = []
    var being_removed_item_ids = []
    var index = 0
    while (index < catalog.items.length) {
        var item = catalog.items[index]

        if (item.faction == undefined) {
            item.faction = "any"
        }

        if (item.modification == undefined) {
            item.modification = "vanilla"
        }

        // GENERATING NEW ITEMS FROM ORIGINAL ITEM
        if (item.content.constructor === Array) {
            var content_as_array = item.content
            for (var i = 0; i < content_as_array.length; i++) {
                var content_item = content_as_array[i]

                // copy conditions from original item
                var new_generated_item = {
                    planet_conditions: item.planet_conditions,
                    stage_conditions: item.stage_conditions,
                    factory_conditions: item.factory_conditions,
                    faction: item.faction,
                    modification: item.modification
                }

                // make id and get content based on content_item type
                if (content_item.constructor === Object) {
                    new_generated_item.id = item.id * content_nested_id_multiplier + content_item.id
                    new_generated_item.content = content_item.content
                } else if (content_item.constructor === String) {
                    // if item id is 54 and multiplier is 1000 then id will be 54000 + i (position in array)
                    new_generated_item.id = item.id * content_nested_id_multiplier + i
                    new_generated_item.content = content_item
                }

                generated_items.push(new_generated_item)
            }

            // this item does not have its own content
            being_removed_item_ids.push(item.id)
        }
        index++
    }

    // remove items
    catalog.items = catalog.items.filter(function (item) {
        return being_removed_item_ids.indexOf(item.id) == -1
    })

    // add new items
    catalog.items = catalog.items.concat(generated_items)

    // remove items that depend on modifications that player does not have
    catalog.items = _.filter(catalog.items, function (item) {
        return item.modification == 'vanilla' || _.includes(player_modifications, item.modification)
    })
}

function data_build_factories(catalog) {
    for (var i = 0; i < catalog.factories.length; i++) {
        var factory = catalog.factories[i]
        if (factory.faction == undefined) {
            factory.faction = "any"
        }
    }
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
function get_random_value_by_weight(array, weight_property) {
    if (array.length == 0) { return undefined }

    // multiply random value between 0..1 by sum of all weights
    var weight_pointer = Math.random() * _.reduce(array, function (acc, obj) {
        if (obj[weight_property] == undefined) { return acc + 1 }
        return acc + obj[weight_property]
    }, 0);
    // var weight_pointer = Math.random();

    // console.log("weight_pointer: " + weight_pointer)

    var weight_pointer_treshold = 0
    for (var i = 0; i < array.length; i++) {
        weight_pointer_treshold += (array[i][weight_property] || 1)
        // console.log("weight_pointer_treshold: " + weight_pointer_treshold)
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

function get_multiple_random_array_values_by_weight(original_array, count, weight_property) {
    if (count > original_array.length) { count = original_array.length }

    var results = []
    var copied_array = original_array.slice()
    for (var i = 0; i < count; i++) {
        var result = get_random_value_by_weight(copied_array, weight_property)
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

// STRATEGY GENERATOR -----------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------

function get_new_strategy() {
    var modifiers_count = get_random_value_inclusive(1, catalog.max_modifiers_count)
    var earlygame_tasks_count = get_random_value_inclusive(1, catalog.max_earlygame_count)
    var midgame_tasks_count = get_random_value_inclusive(1, catalog.max_midgame_count)
    var endgame_tasks_count = get_random_value_inclusive(1, catalog.max_endgame_count)

    var fill_stages_recursion_depth = 0

    var items_copy = catalog.items.slice()
    // remove unused items with id = -1
    items_copy = _.filter(items_copy, function (item) {
        return item.id != -1;
    });

    items_copy = _.filter(items_copy, function (item) {
        return item.faction == "any" || _.includes(player_factions, item.faction);
    });

    var planet_conditions = get_selected_planet_conditions()
    debug(planet_conditions)

    // example of struct:
    // {
    //     factories: ["naval", "naval","air","naval"],
    //     types: ["naval", "air"],
    //}

    // GENERATE FACTORIES ORDER
    const earlygame_factories_order_lengths = [
        {
            value: 2,
            weight: 2.33
        },
        {
            value: 3,
            weight: 6.10
        },
        {
            value: 4,
            weight: 1.44
        },
        {
            value: 5,
            weight: 0.34
        }
    ]

    var earlygame_factories_order_length = get_random_value_by_weight(earlygame_factories_order_lengths, "weight").value.value
    var earlygame_factories_order = get_factories_order(planet_conditions, 1,
        earlygame_factories_order_length, true
    )
    var midgame_factories_order = get_factories_order(planet_conditions, 2,
        2, false
    )


    var modifiers = []
    var earlygame_tasks = []
    var midgame_tasks = []
    var endgame_tasks = []

    // GENERATE GAME STAGES
    function fill_stages_LOCAL() {
        fill_stages_recursion_depth ++;
        // PREVENT DEADLOCK
        if(fill_stages_recursion_depth > fill_stage_recursion_depth_max){
            return
        }
        if (_.isEmpty(modifiers)) {
            modifiers = get_multiple_random_array_values_by_weight(
                _.filter(items_copy, function (x) {
                    return does_item_match_conditions(
                        planet_conditions, ["modifier"],
                        // merged earlygame and midgame factory types
                        earlygame_factories_order.types.concat(midgame_factories_order.types),
                        x);
                }),
                modifiers_count, "weight")
            // remove selected items by filter
            items_copy = _.filter(items_copy, function (x) {
                return !_.includes(modifiers, x);
            });
        }

        if (_.isEmpty(earlygame_tasks)) {
            // EARLYGAME
            earlygame_tasks = get_multiple_random_array_values_by_weight(
                _.filter(items_copy, function (x) {
                    return does_item_match_conditions(
                        planet_conditions, ["earlygame"],
                        earlygame_factories_order.types,
                        x);
                }),
                earlygame_tasks_count, "weight")
            items_copy = _.filter(items_copy, function (x) {
                return !_.includes(earlygame_tasks, x);
            });
        }

        if (_.isEmpty(midgame_tasks)) {
            // MIDGAME
            midgame_tasks = get_multiple_random_array_values_by_weight(
                _.filter(items_copy, function does_item_match_conditions_midgame(x) {
                    return does_item_match_conditions(planet_conditions, ["midgame"],
                        midgame_factories_order.types,
                        x);
                }),
                midgame_tasks_count, "weight")
            items_copy = _.filter(items_copy, function (x) {
                return !_.includes(midgame_tasks, x);
            });
        }

        if (_.isEmpty(endgame_tasks)) {
            // ENDGAME
            endgame_tasks = get_multiple_random_array_values_by_weight(
                _.filter(items_copy, function does_item_match_conditions_endgame(x) {
                    return does_item_match_conditions(planet_conditions, ["endgame"],
                        ["any"], x);
                }),
                endgame_tasks_count, "weight")
            items_copy = _.filter(items_copy, function (x) {
                return !_.includes(endgame_tasks, x);
            });
        }

        var result = resolve_conflicting_items(
            [
                modifiers,
                earlygame_tasks,
                midgame_tasks,
                endgame_tasks
            ]
        )

        modifiers = result.items[0]
        earlygame_tasks = result.items[1]
        midgame_tasks = result.items[2]
        endgame_tasks = result.items[3]
        var removed_items_ids = result.removed_items_ids

        // IF SOME STAGES IS EMPTY
        if (
            modifiers.length == 0
            || earlygame_tasks.length == 0
            || midgame_tasks.length == 0
            || endgame_tasks.length == 0
        ) {
            // exclude removed by id items form items_copy
            items_copy = _.filter(items_copy, function (x) {
                return !_.includes(removed_items_ids, x.id);
            });

            fill_stages_LOCAL()
        }

    }

    fill_stages_LOCAL()

    return {
        modifiers: modifiers,
        earlygame_tasks: earlygame_tasks,
        midgame_tasks: midgame_tasks,
        endgame_tasks: endgame_tasks,

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
    var conditions = []
    if (stratModel.orbital() == true) {
        conditions.push("orbital")
    }

    if (stratModel.naval() == true) {
        conditions.push("naval")
    }

    if (stratModel.land() == true) {
        conditions.push("land")
    }

    return conditions
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
function get_factories_order(planet_conditions, tier, order_length, allow_same) {
    var factories_copy = catalog.factories.slice()

    // debug(factories_copy, "factories_copy")

    // FILTER FACTORIES
    // remove all factories that are not the selected tier
    factories_copy = _.filter(factories_copy, function (x) {
        return x.tier == tier;
    })

    factories_copy = _.filter(factories_copy, function (x) {
        return _.includes(player_factions, x.faction) || x.faction == "any";
    })


    // remove all land factories if land is not selected
    if (!_.includes(planet_conditions, "land")) {
        // console.log("land not selected")
        factories_copy = _.filter(factories_copy, function (factory_item) {
            if (factory_item.placement.length > 1 && _.includes(factory_item.placement, "land")) {
                // removing placement entry item if entry like ["land","naval"]
                factory_item.placement = _.filter(factory_item.placement, function (placement_item) {
                    return placement_item != "land";
                })
                // this factory will be excluded in the next steps
                return true;
            } else {
                return factory_item.placement[0] != "land";
            }
        });
    }

    if (!_.includes(planet_conditions, "naval")) {
        factories_copy = _.filter(factories_copy, function (factory_item) {
            if (factory_item.placement.length > 1 && _.includes(factory_item.placement, "naval")) {
                factory_item.placement = _.filter(factory_item.placement, function (placement_item) {
                    return placement_item != "naval";
                })
                // this factory will be excluded in the next steps
                return true;
            } else {
                return factory_item.placement[0] != "naval";
            }
        });
    }

    if (!_.includes(planet_conditions, "orbital")) {
        factories_copy = _.filter(factories_copy, function (factory_item) {
            if (factory_item.placement.length > 1 && _.includes(factory_item.placement, "orbital")) {
                factory_item.placement = _.filter(factory_item.placement, function (placement_item) {
                    return placement_item != "orbital";
                })
                // this factory will be excluded in the next steps
                return true;
            } else {
                return factory_item.placement[0] != "orbital";
            }
        });
    }

    debug(factories_copy, "factories_copy")

    // GENERATE ORDER
    var factory_order = {
        factories: [],
        // order of types garantees appearance of same type in order 
        types: []
    }

    for (var i = 0; i < order_length; i++) {
        if (factories_copy.length == 0) {
            // console.log("no factories left")
            // debug(planet_conditions, "planet conditions")
            // debug(tier, "tier")
            // debug(factory_order, "factory order")
            break;
        }

        // first pick
        var factory = null;
        if (i == 0) {
            factory = get_random_value_by_weight(factories_copy, "pick_first_weight").value
        } else {
            factory = get_random_value_by_weight(factories_copy, "weight").value
        }

        // push new factory in order
        factory_order.factories.push(factory)

        // debug(factory, "factory")

        // push new type in order if it doesn't exist
        if (!_.includes(factory_order.types, factory.type)) {
            factory_order.types.push(factory.type)
            if (!allow_same) {
                // exlude same type
                factories_copy = _.filter(factories_copy, function (x) {
                    return x.type != factory.type;
                })
            }
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
    if (does_item_match_faction_condition(item) == false) {
        // TODO: this check can be moved to data loading stage
        return false
    }
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

function does_item_match_faction_condition(item) {
    return item.faction == "any" || _.includes(player_factions, item.faction)
}


function resolve_conflicting_items(items_arrays) {
    // copy arrays to not modify original arrays
    var items_arrays = items_arrays.slice()
    var removed_items_ids = []
    // each conflict group contains two arrays (left,right)
    // for each conflict group we should look at the left and right arrays
    // if items_array contains an item that matches any side of conflict group
    // we should look at the other side ids and remove them from items_array

    // items does not have priority so first item we look at is prioritized

    var conflict_groups = catalog.conflict_groups.slice()

    for (var i = 0; i < conflict_groups.length; i++) {
        var conflict_group = conflict_groups[i]
        if (conflict_group.row != undefined) {
            var row = conflict_group.row
            for (var j = 0; j < row.length; j++) {
                var id = row[j]
                if (find_item_LOCAL(id) != undefined) {
                    // debug(row,"row before splice")
                    row.splice(j, 1)
                    // debug(row,"row after splice")
                    debug(row, "remove row")
                    remove_items_by_ids_LOCAL(row)
                    break
                }
            }
        } else {
            var left = conflict_group.left
            // ITERATE LEFT ARRAY
            for (var j = 0; j < left.length; j++) {
                var id = left[j]


                if (id < content_nested_id_multiplier) {
                    var left_group_item = find_item_LOCAL(id)
                    if (left_group_item != undefined) {
                        remove_items_by_ids_LOCAL(conflict_group.right)
                        break
                    } else {
                        // group contains parent item id so we should look for its children instead
                        var children_items = find_children_items_by_parent_id_LOCAL(id)
                        // we found childrens in left group
                        if (children_items.length > 0) {
                            remove_items_by_ids_LOCAL(conflict_group.right)
                            break
                        } else {
                            continue
                        }
                    }
                } else if (find_item_LOCAL(id) != undefined) {
                    debug("remove right ")
                    remove_items_by_ids_LOCAL(conflict_group.right)
                    // if we removed all conflict for a single item in group we can break
                    // to not iterate through the rest of the conflict group
                    break
                }
            }
        }


    }

    return { items: items_arrays, removed_items_ids: removed_items_ids }

    /**
    * Search for an item by its ID in the items arrays.
    *
    * @param {number} id - The ID of the item to find.
    * @return {Object} The item with the matching ID, or undefined if not found.
    */
    function find_item_LOCAL(id) {
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

    function find_children_items_by_parent_id_LOCAL(parent_id) {
        var children_items = []

        for (var i = 0; i < items_arrays.length; i++) {
            for (var j = 0; j < items_arrays[i].length; j++) {
                var item = items_arrays[i][j]
                var range = {
                    start: parent_id * content_nested_id_multiplier,
                    end: (parent_id + 1) * content_nested_id_multiplier
                }
                // example: if parent_id is 3, then we should iterate through items arrays from 3*1000 to (3+1)*1000, so 3000 to 4000
                if (item.id >= range.start && item.id < range.end) {
                    children_items.push(item)
                }
            }
        }

        return children_items
    }

    function remove_items_by_ids_LOCAL(ids) {
        for (var i = 0; i < ids.length; i++) {

            var remove_item_id = ids[i]

            if (remove_item_id < content_nested_id_multiplier) {
                var parent_item = find_item_LOCAL(remove_item_id)
                if (parent_item != undefined) {
                    // that means parent does not have content property as array,
                    // just single string entry
                    remove_item_by_id_LOCAL(parent_item.id)
                } else {
                    var children_items = find_children_items_by_parent_id_LOCAL(remove_item_id)
                    if (children_items.length > 0) {
                        debug(children_items, "children_items")
                        remove_items_by_ids_LOCAL(_.map(children_items, function (item) { return item.id }))
                    }
                }
            } else {
                remove_item_by_id_LOCAL(remove_item_id)
            }
        }
    }

    function remove_item_by_id_LOCAL(id) {
        for (var i = 0; i < items_arrays.length; i++) {
            for (var j = 0; j < items_arrays[i].length; j++) {
                if (items_arrays[i][j].id == id) {
                    debug(items_arrays[i][j], "remove item")
                    items_arrays[i].splice(j, 1)
                    removed_items_ids.push(id)
                }
            }
        }
    }


}

function debug(object, message) {
    console.log(JSON.stringify(object, null, 2) + " : " + ((message == null) ? "" : message))
}

function common_button_actions() {
    document.activeElement.blur()
}

//makes the floating frame for the view model
createFloatingFrame("strat_frame", 'auto', 'auto', { "offset": "topRight", "left": -240 });

//attaches the html to the frame
$.get("coui://ui/mods/mod.skilltest/floatzone/strat.html", function (html) {
    $("#strat_frame_content").append(html);
})