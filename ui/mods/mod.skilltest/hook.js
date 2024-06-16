console.log("ui/mods/mod.skilltest/hook.js: ini")

$(document).ready(function () {
    console.log("ui/mods/mod.skilltest/hook.js: ready")
    console.log(model.player().commanders)


    // delay the message sending to give the panels time to initialize
    _.delay(function () {
        api.Panel.message(api.panels["LiveGame_FloatZone"].id, 'commanders', model.player().commanders);
    }, 3000)
})