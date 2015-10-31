(function($){
    
  // function transitionEnd from www.modernizr.com
    
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
    
    
    
    $.fn.transition = function(props, callback){
        var self = this,
        back = function(){
            $.each($(self).data('tansition_fn_data'), function(a,b){
                $(self).css(a,b);
            })
        },
        pause = function(){
            console.log('pause executed');
            var computedStyle = window.getComputedStyle(self[0], null);
            for(var property in self.data('tansition_fn_data')){
                self.css(property, computedStyle[property]).css('transition-duration', '0ms' );
            }
        }, 
        resume = function(){
            
        },
        finish = function(){
            
        },
        sequence = function(){
            
        },
            
        composeCubicBezier = function(param){
            return ['cubic-bezier(' ,  param.join(', ') , ')'].join('');
        }
        
        
        if(typeof(props)==='string'){
            //we have command here, not props input
            (props==='back')    && back();
            (props==='pause')   && pause();
            (props==='resume')  && resume();
            (props==='finish')  && finish();
            
        } else {

            var transitionStr = '',
            i=0,
            // transition to properties    
            trToProps = {};
            for(var prop in props){
                
                if(typeof(props[prop][2])==='undefined')
                    var ease = 'ease';
                else var ease = props[prop][2];                
                if(typeof(props[prop][1])==='undefined')
                    var duration = '400';
                else var duration = props[prop][1];
                
                (typeof(ease)==='object') && (ease = composeCubicBezier(ease))
                

                transitionStr += prop + ' ' + duration + 'ms ' + ease + ', ';
                trToProps[prop] = props[prop][0];
                i++;
                //save state for back function
                (typeof(this.data('tansition_fn_data'))!=='object') && this.data('tansition_fn_data', {});

                this.data('tansition_fn_data')[prop] = this.css(prop);

            }


            //finally set transition property
            this.css('transition', transitionStr.slice(0, - 2))
            .css(trToProps).on('bsTransitionEnd', function(){
                if(--i === 0){
                    //only calling transitionend for ONE property - the one with longest duration
                    if(callback)
                    callback.call(self,self);
                }
            });            
        }
        
        

        return this;
    }    
    
   
    
    
  
  
})(jQuery);