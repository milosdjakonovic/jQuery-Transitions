/************************************************
 *                                              *
 *  jQuery transitions                          *
 *  @author Milos Djakonovic (@Miloshio)        *
 *  Copyright 2015 Milos Djakonovic             *
 *  Licensed under the MIT license              *
 *                                              *
 ************************************************/


(function(w,d,$){
    

    /**
    *
    *   Part I
    *   cross browser transitionend event
    *   from modernizr & twbootstrap
    *
    *   --------
    *   Bootstrap v3.3.5 (http://getbootstrap.com)
    *   Copyright 2011-2015 Twitter, Inc.
    *   Licensed under the MIT license
    *   --------
    *
    *   TODO: check if $.support.transition.end already exists
    *   (when Bootstrap's code is already included)
    *   and skip evaluation
    *
    *   @link www.modernizr.com
    *   @link getbootstrap.com
    *   @link blog.alexmaccaw.com/css-transitions
    *----------------------------------------------------------
    */
    
    function transitionEnd() {
        var el = d.createElement('bootstrap');

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

    $.fn.emulateTransitionEnd = function (duration) {
        var called = false;
        var $el = this;
        $(this).one('bsTransitionEnd', function () { called = true });
        var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
        w.setTimeout(callback, duration);
        return this;
    }
  
    $.support.transition = transitionEnd();

    if (!$.support.transition) return; // no transitions supported. We're out of here,
    // $.fn.transition will not be declared...
    // needs to be handled different way

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments);
      }
    }    

    
    
    /**
    *
    *   Part II
    *   $.fn.transition
    *----------------------------------------------------------
    */
    $.fn.transition = function(arg1, arg2){
        var self = this,
        back = function(){
            $.each($(self).data('tansition_fn_data')['prevFtrProp'], function(a,b){
                $(self).css(a,b);
            })
        },
        pause = function(){
            var computedStyle = w.getComputedStyle(self[0], null);
            for(var property in self.data('tansition_fn_data')['prevFtrProp']){
                self.css(property, computedStyle[property]).css('transition-duration', '0ms' );
            }
        }, 
        resume = function(){
            
        },
        finish = function(){
            self.css('transition-duration', '0ms');
        },
        sequence = function(){
            for(var i=0; i<arg2.length;i++){
                console.log(arg2[i])
            }
        },
            
        composeCubicBezier = function(param){
            return ['cubic-bezier(' ,  param.join(', ') , ')'].join('');
        },
        // transition to properties
        trToProps = {},
        
        //nubmer of properties being transitionend
        //very unoptimized enumeration type since
        //solve it later
        numOfProps=0,
            
        composeTransitionProperty = function(cssProps,self){

            var transitionStr = '';
            for(var prop in cssProps){
                
                if(typeof(cssProps[prop][2])==='undefined')
                    var ease = 'ease';
                else var ease = cssProps[prop][2];
                if(typeof(cssProps[prop][1])==='undefined')
                    var duration = '400';
                else var duration = cssProps[prop][1];
                
                (typeof(ease)==='object') && (ease = composeCubicBezier(ease))
                

                transitionStr += prop + ' ' + duration + 'ms ' + ease + ', ';
                trToProps[prop] = cssProps[prop][0];
                numOfProps++;
                //save state for back function
                //prevFtrProp previous for transition property
                (typeof(self.data('tansition_fn_data'))!=='object') && self.data('tansition_fn_data', {prevFtrProp:{}});

                self.data('tansition_fn_data')['prevFtrProp'][prop] = self.css(prop);

            }

            return transitionStr.slice(0, - 2);
        },
        exec = function(cssProps,callback,self){
            //finally set transition property
            self.css('transition', composeTransitionProperty(cssProps,self) )
            .css(trToProps).on('bsTransitionEnd', function(){
                if(--numOfProps === 0){
                    //only calling transitionend for ONE property - the one with longest duration - lost it for now
                    if(callback)
                    callback.call(self,self);
                }
            });
        }
        
        
        if(typeof(arg1)==='string'){

            //we have command here..
            (arg1==='back')      && back();
            (arg1==='pause')     && pause();
            (arg1==='resume')    && resume();
            (arg1==='finish')    && finish();
            (arg1==='sequence')  && sequence();

        } else
            //action
            exec(arg1,arg2,self);

        return this;
    }

})(window,document,jQuery);
