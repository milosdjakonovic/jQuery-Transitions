### jQuery transitions
**This project is discontinued**

The aim of this project was to build reliable `CSS transitions` based animation engine. While this certainly is possible, such approach has it's own limitations which cannot be overcomed (for example, controlling the running animation, except finish, pause and reverse actions).

With this library one can animate CSS properties that are subject to CSS transitions, animate back (reverse), pause and to forcibly finish the animation.
This library lacks animation 'resume' and 'sequence' methods, which was planned to be developed.

#### Why cancelling the project?
It is relatively easy to animate things with CSS transitions using jQuery: 

```javascript
$('#target')
  .css('transition', 'height 0.3s ease-out, opacity 0.3s ease 0.5s')
  .addClass('animatedSomething')
  .one('transitionend webkitTransitionEnd oTransitionEnd', callback)
```

and when you need more control, it is half a foot to requirement that cannot be fulfilled with CSS transitions. Use some of the JavaScript animation functions/libraries instead (e.g. jQuery animate, velocityJS, GSAP).
