ig.module(
    'plugins.touch-joystick'
)
.requires(
    'impact.system',
    'impact.input',
    'impact.image'
)
.defines(function(){

TouchJoystick = ig.Class.extend({

    // touch props
    stickExists: false,
    stickPos: {x: 0, y:0},
    delta: {x: 0, y:0},
    maxDelta: 100,
    touchId: 0,
    touchMinimumDelta: 0,
    deadZones: [],

    init: function() {
        document.addEventListener('touchmove', this.touchMove.bind(this), false);
        document.addEventListener('touchstart', this.touchStart.bind(this), false);
        document.addEventListener('touchend', this.touchEnd.bind(this), false);
    },

    touchStart: function(ev) {
        ev.preventDefault();

        // If there's already a touch, exit
        if (this.stickExists) {
            return;
        }

        // Get real touch coords
        var el = ig.system.canvas;
        var pos = {left:0, top:0};

        while (el != null) {
            pos.left += el.offsetLeft;
            pos.top += el.offsetTop;
            el = el.offsetParent;
        }

        var x = ev.touches[0].pageX - pos.left,
            y = ev.touches[0].pageY - pos.top;


        // If we touch a dead zone, leave
        for(var i = 0; i < this.deadZones.length; i++) {
            var deadZone = this.deadZones[i];
            if (
                x > deadZone.position.x && x < deadZone.position.x + deadZone.size.x &&
                    y > deadZone.position.y && y < deadZone.position.y + deadZone.size.y
                ) {
                return;
            }
        }

        this.stickExists = true;
        this.stickPos.x = x;
        this.stickPos.y = y;
        this.touchId = ev.touches[0].identifier;


    },

    touchEnd: function(ev) {
        ev.preventDefault();

        for (var i = 0; i < ev.changedTouches.length; i++) {
            if (ev.changedTouches[i].identifier === this.touchId) {
                this.stickExists = false;
                this.stickPos.x = 0;
                this.stickPos.y = 0;
                this.delta.x = 0;
                this.delta.y = 0;
                this.touchId = 0;
            }
        }


    },

    touchMove: function(ev) {
        ev.preventDefault();

        var el = ig.system.canvas;
        var pos = {left:0, top:0};

        while (el != null) {
            pos.left += el.offsetLeft;
            pos.top += el.offsetTop;
            el = el.offsetParent;
        }

        for (var i = 0; i < ev.changedTouches.length; i++) {
            var touch = ev.changedTouches[i];
            var x = touch.pageX - pos.left,
                y = touch.pageY - pos.top;

            // calculate how much we've moved
            if (touch.identifier === this.touchId) {
                var deltaX = x - this.stickPos.x;
                var deltaY = y - this.stickPos.y;


                if (deltaX >= 0) {
                    this.delta.x = Math.min(deltaX, this.maxDelta);
                } else {
                    this.delta.x = Math.max(deltaX, -this.maxDelta);
                }

                if (deltaY >= 0) {
                    this.delta.y = Math.min(deltaY, this.maxDelta);
                } else {
                    this.delta.y = Math.max(deltaY, -this.maxDelta);
                }
            }
        }
    },

    addDeadZone: function(x, y, width, height) {
        this.deadZones.push(new DeadZone(x, y, width, height));
    }


});

DeadZone = ig.Class.extend({
    position: {x:0, y:0},
    size: {x:0, y:0},

    init: function(x, y, width, height) {
        this.position.x = x;
        this.position.y = y;
        this.size.x = width;
        this.size.y = height;
    }
});

});