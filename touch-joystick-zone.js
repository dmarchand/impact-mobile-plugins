ig.module(
    'plugins.touch-joystick-zone'
)
.requires(
    'impact.system',
    'impact.input'
)
.defines(function(){

TouchJoystickZone = ig.Class.extend({

    // touch props
    delta: {x: 0, y:0},
    maxDelta: 100,
    touchId: 0,
    touchMinimumDelta: 5,
    touchZoneStart: {x:0, y:0},
    touchZoneSize: {x:0, y:0},

    init: function(startX, startY, width, height, minimumDelta) {
        document.addEventListener('touchmove', this.touchMove.bind(this), false);
        document.addEventListener('touchstart', this.touchStart.bind(this), false);
        document.addEventListener('touchend', this.touchEnd.bind(this), false);

        this.touchZoneStart.x = startX;
        this.touchZoneStart.y = startY;
        this.touchZoneSize.x = width;
        this.touchZoneSize.y = height;

        if (minimumDelta) {
            this.touchMinimumDelta = minimumDelta;
        }
    },

    touchStart: function(ev) {
        ev.preventDefault();

        var el = ig.system.canvas;
        var pos = {left:0, top:0};

        while (el != null) {
            pos.left += el.offsetLeft;
            pos.top += el.offsetTop;
            el = el.offsetParent;
        }

        var x = ev.touches[0].pageX - pos.left,
            y = ev.touches[0].pageY - pos.top;

        if (
            x > this.touchZoneStart.x && x < this.touchZoneStart.x + this.touchZoneSize.x &&
                y > this.touchZoneStart.y && y < this.touchZoneStart.y + this.touchZoneSize.y
            ) {
            this.touchId = ev.touches[0].identifier;
            this.touchStart.x = x;
            this.touchStart.y = y;
        }

    },

    touchEnd: function(ev) {
        ev.preventDefault();

        for (var i = 0; i < ev.changedTouches.length; i++) {
            if (ev.changedTouches[i].identifier === this.touchId) {
                this.touchId = 0;
                this.delta.x = 0;
                this.delta.y = 0;
                this.touchStart.x = 0;
                this.touchStart.y = 0;
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

            if (touch.identifier === this.touchId) {
                var touchCenterX = this.touchStart.x;
                var touchCenterY = this.touchStart.y;

                var deltaX = x - touchCenterX;
                var deltaY = y - touchCenterY;

                var winner = Math.max (Math.abs(deltaX), Math.abs(deltaY));
                if (winner < this.touchMinimumDelta) {
                    continue;
                }

                if (winner === Math.abs(deltaX)) {
                    this.delta.x = deltaX;
                    this.delta.y = 0;
                } else {
                    this.delta.x = 0;
                    this.delta.y = deltaY;
                }
            }
        }
    }



});

});