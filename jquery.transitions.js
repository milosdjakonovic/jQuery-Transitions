(function($){
    

    /**
    *
    *   Part I
    *   cross browser transitionend event
    *   from modernizr & twbootstrap
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

    $.fn.emulateTransitionEnd = function (duration) {
        var called = false;
        var $el = this;
        $(this).one('bsTransitionEnd', function () { called = true });
        var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
        setTimeout(callback, duration);
        return this;
    }
  
    $.support.transition = transitionEnd();

    if (!$.support.transition) return; // no transitions supported. We're out of here,
    // $.fn.transition will not be declared...

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
            var computedStyle = window.getComputedStyle(self[0], null);
            for(var property in self.data('tansition_fn_data')['prevFtrProp']){
                self.css(property, computedStyle[property]).css('transition-duration', '0ms' );
            }
        }, 
        resume = function(){
            
        },
        finish = function(){
            
        },
        sequence = function(){
            for(var i=0; i<arg2.length;i++){
                console.log(arg2[i])
            }
        },
            
        composeCubicBezier = function(param){
            return ['cubic-bezier(' ,  param.join(', ') , ')'].join('');
        }
        
        
        if(typeof(arg1)==='string'){

            //we have command here..
            (arg1==='back')      && back();
            (arg1==='pause')     && pause();
            (arg1==='resume')    && resume();
            (arg1==='finish')    && finish();
            (arg1==='sequence')  && sequence();
            
        } else {

            //action
            var transitionStr = '',
            i=0,
            // transition to properties    
            trToProps = {};
            for(var prop in arg1){
                
                if(typeof(arg1[prop][2])==='undefined')
                    var ease = 'ease';
                else var ease = arg1[prop][2];
                if(typeof(arg1[prop][1])==='undefined')
                    var duration = '400';
                else var duration = arg1[prop][1];
                
                (typeof(ease)==='object') && (ease = composeCubicBezier(ease))
                

                transitionStr += prop + ' ' + duration + 'ms ' + ease + ', ';
                trToProps[prop] = arg1[prop][0];
                i++;
                //save state for back function
                //prevFtrProp previous for transition property
                (typeof(this.data('tansition_fn_data'))!=='object') && this.data('tansition_fn_data', {prevFtrProp:{}});

                this.data('tansition_fn_data')['prevFtrProp'][prop] = this.css(prop);

            }


            //finally set transition property
            this.css('transition', transitionStr.slice(0, - 2))
            .css(trToProps).on('bsTransitionEnd', function(){
                if(--i === 0){
                    //only calling transitionend for ONE property - the one with longest duration
                    if(arg2)
                    arg2.call(self,self);
                }
            });            
        }
        
        

        return this;
    }    
    
   
    
    
  
  
})(jQuery);
