(function($){
    
  // www.modernizr.com
    
    function transitionEnd() {
        var el = document.createElement('bootstrap');

        var transEndEventNames = {
          WebkitTransition : 'webkitTransitionEnd',
          MozTransition    : 'transitionend',
          OTransition      : 'oTransitionEnd otransitionend',
          transition       : 'transitionend'
        }

        for (var name in transEndEventNames) {
          if (el.style[name] !== undefined) {
            return { end: transEndEventNames[name] }
          }
        }

        return false; // no transitions supported
    }

    // http://blog.alexmaccaw.com/css-transitions
    // what's good enough for tw bootstrap is good enough for me
    $.fn.emulateTransitionEnd = function (duration) {
        var called = false;
        var $el = this;
        $(this).one('bsTransitionEnd', function () { called = true });
        var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
        setTimeout(callback, duration);
        return this;
    }
  
    $.support.transition = transitionEnd();

    if (!$.support.transition) return;

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments);
      }
    }    
    
    $.fn.removeInlineCss = function(style){
        var search = new RegExp(style + '[^;]+;?', 'g');
        return this.each(function(){
            $(this).attr('style', function(i, style){
                return style.replace(search, '');
            });
        });
    };    
    
    
  
    $.tansition_fn_data = {};// node: 
    /*
        $.fn_tansition_data_ = {
            node: node,
            
            
        };
    */
    
    $.fn.transition = function(props, callback){
        var transitionStr = '',
        i=0,
        // transition to properties    
        trToProps = {};
        for(var prop in props){
            if(typeof(props[prop][2])==='undefined')
                var ease = 'ease';
            else var ease = props[prop][2];
            transitionStr += prop + ' ' + props[prop][1] + 'ms ' + ease + ', ';
            trToProps[prop] = props[prop][0];
            i++;
        }
        //finally set transition property
        $(this).css('transition', transitionStr.slice(0, - 2))
        .css(trToProps).on('bsTransitionEnd', function(){
            if(--i === 0){
                //only calling transitionend for ONE property - the one with longest duration
                if(callback)
                callback.call();
            }
        });
        return this;
    }    
    
   
    
    
  
  
})(jQuery);