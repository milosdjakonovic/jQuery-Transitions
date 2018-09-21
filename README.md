### jQuery transitions
**This project is discontinued**

The aim of this project was to build reliable `CSS transitions` based animation engine. While this certainly is possible (and accomplished to some extent), such approach has it's own limitations which cannot be overcomed (for example, controlling the running animation, except finish, pause and reverse actions). Animation engine built on top of `CSS transitions` cannot offer more than very basic functionality.

With this library one can animate CSS properties that are subject to CSS transitions, animate back (reverse), pause and to forcibly finish the animation.
The library lacks animation 'resume' and 'sequence' methods, which was planned to be developed.

#### Why cancelling the project?
-It is relatively easy to animate things with CSS transitions using jQuery even without specific function:

```javascript
$('#target')
  .css('transition', 'height 0.3s ease-out, opacity 0.3s ease 0.5s')
  .css({
    height: '200px',
    opacity:1
  })
  .one('transitionend webkitTransitionEnd oTransitionEnd', callback)
```
and when you need more control, it is half a foot to requirement that cannot be fulfilled with CSS transitions. 

-From performance perspective, it is bad idea to animate anything other than `opacity`, `transform` and `filter` properties using transitions, which is also true for CSS keyframe animations.

For more control and better performance, usage of JavaScript animation libraries is recommended.
