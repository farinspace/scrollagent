if ('undefined' != typeof jQuery) {
	(function($, window) {
		var id = 0;

		function applyFunction(callback, _this, args) {
			if ('function' == typeof callback) {
				callback.apply(_this, args);
			}
		}

		$.scrollagent = function(settings) {
			settings.tick = function(){
					//console.log('tick');
			};
			$('body').scrollagent(settings);
		}

		$.fn.scrollagent = function(settings) {
			if ('destroy' == settings) {
				//console.log('destroy');
				return this.each(function(){
					var el = $(this);
					// bug
					$($.fn.scrollagent.options.container).off( 'scroll.scrollagent-' + el.data('scrollagentId') );
				});
			}
			settings = $.extend({}, $.fn.scrollagent.options, settings);
			return this.each(function(){
				id++;
				var el = $(this), container = $(settings.container), inside = false, last_trigger = {top:0,left:0};
				el.data('scrollagentId', id);
				var scrollTick = function() {

					var trigger = {};

					var offset = el.offset();



					// todo: perhaps move tick event else where
					// todo: perhaps try to get scrollTop and scrollLeft only once per tick, no matter how many elements are bound
					if (settings.vertical) {
						var v = 0;
						if(typeof settings.triggerOffsetTop == 'string' && settings.triggerOffsetTop.indexOf('%') > -1) {
							//console.log(Math.round(container.height() * (parseInt(settings.triggerOffsetTop)/100)));
							trigger.top = container.scrollTop() + Math.round(container.height() * (parseInt(settings.triggerOffsetTop)/100));
						} else {
							trigger.top = container.scrollTop() + settings.triggerOffsetTop
						}
						//trigger.top = container.scrollTop() + settings.triggerOffsetTop; // y
						offset.top = offset.top + settings.offsetTop;
						offset.bottom = offset.top + el.outerHeight() + settings.offsetBottom;
					}

					if (settings.horizontal) {
						trigger.left = container.scrollLeft() + settings.triggerOffsetLeft; // x
						offset.left = offset.left + settings.offsetLeft;
						offset.right = offset.left + el.outerWidth() + settings.offsetRight;
					}

					// todo: integrate this through out the code
					settings.runtime.element = el;
					settings.runtime.trigger = trigger;
					settings.runtime.elementOffset = offset;

					applyFunction(settings.tick, el[0], [settings]);
					if (settings.vertical) {
						if (trigger.top >= offset.top && trigger.top <= offset.bottom) {
							if ( ! inside ) {
								if (trigger.top >= last_trigger.top) {
									applyFunction(settings.enterTop, el[0], [settings]);
								} else {
									applyFunction(settings.enterBottom, el[0], [settings]);
								}
								applyFunction(settings.enter, el[0], [settings]);
								inside = true;
							}
						} else {
							if (inside) {
								if (trigger.top > offset.bottom) {
									applyFunction(settings.leaveBottom, el[0], [settings]);
								} else {
									applyFunction(settings.leaveTop, el[0], [settings]);
								}
								applyFunction(settings.leave, el[0], [settings]);
								inside = false;
							}
						}
					}
					if (settings.horizontal) {
						// todo: horizontal checks
					}
					last_trigger = trigger;
				}
				container.on('scroll.scrollagent-' + id, scrollTick );
				scrollTick();
			});
		};
		$.fn.scrollagent.options = {
			runtime:{}, // reserved, available inside callback
			container: window, // scroll container
			vertical: true, // vertical scroll checks
			horizontal: false, // horizontal scroll checks
			// offset from trigger coordinates
			triggerOffsetTop:0,
			triggerOffsetLeft:0,
			// offset from the element coordinates
			offsetTop:0,
			offsetRight:0,
			offsetBottom:0,
			offsetLeft:0,
			// callbacks
			tick: null,
			enter: null,
			leave: null,
			// callbacks (vertical only)
			enterTop: null,
			enterBottom: null,
			leaveTop: null,
			leaveBottom: null,
			// callbacks (horizontal only)
			enterLeft: null,
			enterRight: null,
			leaveLeft: null,
			leaveRight: null
		};
	})(jQuery, window);
}