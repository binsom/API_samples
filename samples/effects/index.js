Modelo.init({ "endpoint": "https://build-portal.modeloapp.com" });

var modelId = "93rjxWY4";
var appToken = 'c2FtcGxlcyx0ZVNhbXBsZVBhc3M1NDE='; // A sample app token
var c = document.getElementById("model");

document.body.appendChild(c);

Modelo.Auth.signIn(appToken,
    function () {
        var viewer = new Modelo.View.Viewer3D("model");
        // init slider
        $('#range1').range({
            min: 1.0,
            max: 100.0,
            start: 1.0,
            step: 1.0,
            onChange: function (value) {
                return;
            }
        });
        $('#range2').range({
            min: 1.0,
            max: 100.0,
            start: 30.0,
            step: 1.0,
            onChange: function (value) {
                return;
            }
        });
        // set details and contrast
        document.getElementById("sketch").onchange = function (evt) {
            viewer.setEffectEnabled("Sketch", document.getElementById("sketch").checked);
            $('#range1').range({
                min: 1.0,
                max: 100.0,
                start: 1.0,
                step: 1.0,
                onChange: function (value) {
                    viewer.setEffectParameter("Sketch", "detail", value);
                }
            });
            $('#range2').range({
                min: 1.0,
                max: 100.0,
                start: 30.0,
                step: 1.0,
                onChange: function (value) {
                    viewer.setEffectParameter("Sketch", "contrast", value);
                }
            });
        };
        document.getElementById("sketch_color").onchange = function (evt) {
            viewer.setEffectParameter("Sketch", "colored", document.getElementById("sketch_color").checked);
        };
        // set sketch color
        document.getElementById("Sketchcolor0").onclick = function (evt) {
            viewer.setEffectParameter("Sketch", "color", [0, 0, 0]);
        };
        document.getElementById("Sketchcolor128").onclick = function (evt) {
            viewer.setEffectParameter("Sketch", "color", [0.5, 0.5, 0.5]);
        };
        document.getElementById("Sketchcolor248").onclick = function (evt) {
            viewer.setEffectParameter("Sketch", "color", [1, 1, 1]);
        };
        // set surface color
        document.getElementById("Surfacecolor0").onclick = function (evt) {
            viewer.setEffectParameter("Sketch", "surfaceColor", [0, 0, 0]);
        };
        document.getElementById("Surfacecolor128").onclick = function (evt) {
            viewer.setEffectParameter("Sketch", "surfaceColor", [0.5, 0.5, 0.5]);
        };
        document.getElementById("Surfacecolor248").onclick = function (evt) {
            viewer.setEffectParameter("Sketch", "surfaceColor", [1, 1, 1]);
        };
        // load model
        viewer.loadModel(modelId,
            null,
            function () {
                viewer.addInput(new Modelo.View.Input.Mouse(viewer));
                var keyboard = new Modelo.View.Input.Keyboard(viewer);
                viewer.addInput(keyboard);
                keyboard.addKeyUpListener(function (keyboard) {
                    if (keyboard.key === 69) {
                    }
                });
                console.log("done");
            },
            function (errmsg) {
                console.log(errmsg);
            },
            function (per) {
                console.log(per);
            });
    },
    function (errmsg) {
        console.log(errmsg);
    });
