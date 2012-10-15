impact-mobile-plugins
=====================

Plugins for use in mobile game development via ImpactJS and Ejecta


Usage
=====
Drop in your lib/plugins folder. Make sure to require 'plugins.touch-joystick' and 'plugins.touch-joystick-zone'


touch-joystick
==============

Gives the user full analog-style movement via touch controls without having to worry about creating a clumsy on-screen controller.

When the user touches the screen, the origin of the touch is saved until they release the touch. All movement with that finger is tracked relative to the origin, and the plugin makes this available to the developer.

You can disable touches in specified regions by calling addDeadZone(x, y, width, height)

Particularly useful in 2D top-down perspective games.


touch-joystick-zone
===================

Allows the developer to assign a zone in which analog touch inputs are accepted. The origin is tracked (like in touch-joystick), and the module returns the delta.

Particularly useful for creating areas that respond to swipe or drag motions. For example, you could create a zone used to track the movement required to swing a sword. Also very useful for tracking short "swipe" motions.