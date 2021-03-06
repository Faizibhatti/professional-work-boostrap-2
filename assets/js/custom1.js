var Components = Components || {};
Components.$events = $({}), Components.utils = {}, Components.utils.breakpoints = {
		mobileMax: 639,
		tabletMin: 640,
		tabletMax: 960,
		desktopMin: 961,
		contentMax: 1550,
		layoutMax: 1920
	}, Components.utils.smoothScrollTop = function ($element, duration, offset, onlyUp) {
		duration = "number" == typeof duration ? duration : 500, offset = offset || 0, onlyUp = onlyUp || !1;
		var elementTop = $element.offset().top,
			pageTop = $(window).scrollTop(),
			scroll = !onlyUp;
		onlyUp && pageTop > elementTop && (scroll = !0), scroll && $("body, html").animate({
			scrollTop: elementTop - offset
		}, duration)
	}, Components.utils.getUrlParams = function () {
		var urlParams = Components.utils.parseUrlParams;
		return urlParams.cache || (urlParams.cache = urlParams())
	}, Components.utils.parseUrlParams = function () {
		for (var match, result = {}, pl = /\+/g, search = /([^&=]+)=?([^&]*)/g, decode = function (s) {
				return decodeURIComponent(s.replace(pl, " "))
			}, query = window.location.search.substring(1); null !== (match = search.exec(query));) result[decode(match[1])] = decode(match[2]);
		return result
	}, Components.utils.breakpoint = function (layout) {
		if ("function" != typeof window.matchMedia) return !1;
		switch (layout) {
			case "mobile":
				return matchMedia("(max-width: " + Components.utils.breakpoints.mobileMax + "px)").matches;
			case "tablet":
				return matchMedia("(min-width:" + Components.utils.breakpoints.tabletMin + "px) and (max-width: " + Components.utils.breakpoints.tabletMax + "px)").matches;
			case "desktop":
				return matchMedia("(min-width: " + Components.utils.breakpoints.desktopMin + "px)").matches;
			default:
				return !1
		}
	}, Components.utils.getBreakpoint = function () {
		var isTablet;
		return "function" != typeof window.matchMedia ? "desktop" : (isTablet = matchMedia("(min-width:" + Components.utils.breakpoints.tabletMin + "px) and (max-width: " + Components.utils.breakpoints.tabletMax + "px)").matches, matchMedia("(min-width: " + Components.utils.breakpoints.desktopMin + "px)").matches ? "desktop" : isTablet ? "tablet" : "mobile")
	}, Components.utils.getElementViewPortCenter = function ($element) {
		var scrollTop = $(window).scrollTop(),
			scrollBot = scrollTop + $(window).height(),
			elHeight = $element.outerHeight(),
			elTop = $element.offset().top,
			elBottom = elTop + elHeight,
			elTopOffset = elTop < scrollTop ? scrollTop - elTop : 0,
			elBottomOffset = elBottom > scrollBot ? scrollBot - elTop : elHeight;
		return 0 === elTopOffset && elBottomOffset === elHeight ? "50%" : Math.round(elTopOffset + (elBottomOffset - elTopOffset) / 2) + "px"
	}, Components.utils.animationDuration = function (distance, speed) {
		return distance / (speed = speed || 1e3) * 1e3
	},
	function ($) {
		function Plugin(element, settings) {
			this._name = pluginName, this._defaults = defaults, this.$element = $(element), _.defaults(settings, defaults), this.settings = settings, this.settings.openClasses = "is-open open", this.settings.openSelector = ".is-open, .open", this.init()
		}
		var pluginName = "accordion",
			defaults = {
				animation: {
					duration: 450,
					easing: "easeInOutQuart"
				}
			};
		Plugin.prototype.openAccordion = function ($item) {
			var $otherItems = this.$element.find(this.settings.itemSelector).not($item);
			this.hideItems($otherItems), $item.is(this.settings.openSelector) ? this.hideItem($item) : this.showItem($item), this.$element.trigger("accordion:after")
		}, Plugin.prototype.showItem = function ($item) {
			$item.addClass(this.settings.openClasses), $item.find(this.settings.contentSelector).slideDown(this.settings.animation)
		}, Plugin.prototype.hideItem = function ($item) {
			$item.removeClass(this.settings.openClasses), $item.find(this.settings.contentSelector).slideUp(this.settings.animation)
		}, Plugin.prototype.hideItems = function ($items) {
			var _this = this;
			$items.each(function (index, item) {
				$(item).is(_this.settings.openSelector) && _this.hideItem($(item))
			})
		}, Plugin.prototype.init = function () {
			var _this = this,
				$items = this.$element.find(_this.settings.itemSelector),
				hash = window.location.hash;
			if ($items.not(_this.settings.openSelector).find(_this.settings.contentSelector).hide(), this.$element.find(_this.settings.headerSelector).on("click.accordion", function (e) {
					_this.openAccordion($(this).closest(_this.settings.itemSelector)), e.preventDefault()
				}), $(hash).length && _this.$element.find($(hash)).length) {
				var $item = $(hash).is(_this.settings.itemSelector) ? $(hash) : $(hash).closest(_this.settings.itemSelector);
				_this.openAccordion($item)
			}
		}, $.fn[pluginName] = function (settings) {
			return this.each(function () {
				var plugin;
				$.data(this, "plugin_" + pluginName) || (plugin = new Plugin(this, settings), $.data(this, "plugin_" + pluginName, plugin), this.accordion = plugin)
			})
		}
	}(jQuery),
	function ($) {
		function Plugin(element, options) {
			this._name = pluginName, this._defaults = defaults, this.element = $(element), this.options = $.extend({}, defaults, options), this._placeholder = this.element.find(this.options.placeholderSelector), this._editLink = this.element.find(this.options.editSelector), this._field = this.element.find(this.options.fieldSelector), this.init()
		}
		var pluginName = "autoSuggest",
			defaults = {
				placeholderSelector: ".auto-suggest__placeholder",
				editSelector: ".auto-suggest__edit-link",
				fieldSelector: ".auto-suggest__field",
				suggestingClass: "is-suggesting"
			};
		Plugin.prototype.setSuggestion = function (value) {
			var valueText = this._field.find('option[value="' + value + '"]').text();
			if (this._field.is("select")) {
				if (!valueText) return !1;
				this._placeholder.text(valueText)
			} else this._placeholder.text(value);
			this._field.val(value), this.element.addClass(this.options.suggestingClass)
		}, Plugin.prototype.init = function () {
			var _this = this;
			_this._field.val() && "_none" !== _this._field.val() && _this.setSuggestion(_this._field.val()), _this._editLink.on("click.autoSuggest", function (e) {
				_this.element.removeClass(_this.options.suggestingClass), e.preventDefault()
			})
		}, $.fn[pluginName] = function (options) {
			return this.each(function () {
				var plugin = new Plugin(this, options);
				$.data(this, "plugin_" + pluginName, plugin), this.autoSuggest = plugin
			})
		}
	}(jQuery),
	function ($) {
		function Plugin(element, options) {
			this._name = pluginName, this._defaults = defaults, this.element = $(element), this.options = $.extend({}, defaults, options), this.init(), this.autoReveal()
		}
		var pluginName = "contentFlyout",
			defaults = {
				animation: {
					duration: 1e3,
					easing: "easeInOutQuart"
				},
				scroll: !0,
				stayOnTop: !1
			};
		Plugin.prototype.showContent = function (trigger, settings) {
			var data = $(trigger).length ? $(trigger).data() : {},
				$target = data.flyoutTarget ? $("#" + data.flyoutTarget) : this.element,
				$parent = $target.offsetParent(),
				$slideout = $parent.find(this.options.slideout),
				href = $(trigger).length ? $(trigger).attr("href") : "",
				parentPadding = $parent.outerHeight() - $parent.height(),
				offset = $(".sticky-wrapper").outerHeight(!0),
				distance = Math.round($target.outerWidth() / $parent.width() * 100),
				defaultSettings = {
					scroll: this.options.scroll,
					scrollDown: data.flyoutScrollDown,
					animation: this.options.animation
				};
			settings = $.extend({}, defaultSettings, settings), $target.data("flyoutState", "open"), $parent.is("body, html") || $parent.animate({
				height: $target.outerHeight(!0) - parentPadding
			}, settings.animation), (this.options.stayOnTop ? $target : $target.add($slideout)).animate({
				marginLeft: "-=" + distance + "%"
			}, settings.animation), $target.add($slideout).addClass("is-open"), settings.scroll && Components.utils.smoothScrollTop($parent, settings.animation.duration, offset, !settings.scrollDown), 0 === href.indexOf("#") && href.length > 1 && history.replaceState && history.replaceState(void 0, void 0, href)
		}, Plugin.prototype.hideContent = function (trigger) {
			var data = $(trigger).length ? $(trigger).data() : {},
				$target = data.flyoutTarget ? $("#" + data.flyoutTarget) : this.element,
				$parent = $target.offsetParent(),
				$slideout = $parent.find(this.options.slideout),
				slideoutHeight = $slideout.outerHeight(!0),
				distance = Math.round($target.outerWidth() / $parent.width() * 100);
			$target.data("flyoutState", "closed"), $parent.is("body, html") || $parent.animate({
				height: slideoutHeight
			}, this.options.animation), (this.options.stayOnTop ? $target : $target.add($slideout)).animate({
				marginLeft: "+=" + distance + "%"
			}, this.options.animation), $target.add($slideout).removeClass("is-open"), setTimeout(function () {
				$parent.css("height", "inherit")
			}, this.options.animation.duration + 1), 0 === window.location.hash.indexOf("#") && history.replaceState && history.replaceState(void 0, void 0, window.location.pathname)
		}, Plugin.prototype.autoReveal = function () {
			var $trigger, hash = window.location.hash;
			"#form" !== hash && hash.length > 1 && this.element.is(hash) && ($trigger = $(hash).data("flyoutTrigger"), setTimeout(function () {
				window.scrollTo(0, 0)
			}, 1), this.showContent($trigger, {
				animation: {
					duration: 0
				},
				scroll: !0,
				scrollDown: !0
			}))
		}, Plugin.prototype.init = function () {
			var _this = this,
				$triggers = $();
			_this.options.triggers.each(function (index, el) {
				var $trigger = $(this),
					targetId = $trigger.data("flyoutTarget"),
					$target = $("#" + targetId);
				_this.element.is($target) && ($triggers = $triggers.add($trigger), $target.data("flyoutTrigger", $trigger), $trigger.attr("href").length <= 1 && $trigger.attr("href", "#" + targetId))
			}), $triggers.length && _this.element.length && (_this.element.data("flyoutState", "closed"), _this.element.each(function (index, el) {
				$(this).show(), $(this).offsetParent().is("body, html") ? $(this).offsetParent().css("overflow-x", "hidden") : $(this).offsetParent().css("overflow", "hidden")
			}), $triggers.on("click.flyout", function (e) {
				var trigger = this,
					$target = $("#" + $(trigger).data("flyoutTarget")),
					state = $target.data("flyoutState");
				_this.options.animation.duration = Components.utils.animationDuration($target.outerWidth(), 1500), "closed" === state && setTimeout(function () {
					_this.showContent(trigger)
				}, 1), e.preventDefault()
			}), _this.options.closeLinks.on("click.flyout", function (e) {
				var $parent = $(this).closest(_this.element),
					state = $parent.data("flyoutState");
				_this.element.is($parent) && "open" === state && _this.hideContent($parent.data("flyoutTrigger")), e.preventDefault()
			}))
		}, $.fn[pluginName] = function (options) {
			return this.each(function () {
				var plugin = new Plugin(this, options);
				$.data(this, "plugin_" + pluginName, plugin), this.contentFlyout = plugin
			})
		}
	}(jQuery),
	function ($) {
		function Plugin(element, options) {
			this._name = pluginName, this._defaults = defaults, this.element = $(element), this.options = $.extend({}, defaults, options), this.init(), this.autoReveal()
		}

		function resolveBrightcove() {
			"function" == typeof window.bc && window.bc.VERSION && requestBrightcove.resolve(window.bc)
		}
		var pluginName = "contentReveal",
			requestBrightcove = $.Deferred(),
			defaults = {
				animation: {
					duration: 1e3,
					easing: "easeInOutQuart"
				},
				closeLink: !0
			};
		Plugin.prototype.showContent = function (trigger, settings) {
			var $scrollTarget, videoElement, player, $trigger = $(trigger).length ? $(trigger) : this.element.data("reveal-trigger"),
				href = $trigger.attr("href"),
				data = $trigger.data(),
				$target = $("#" + data.revealTarget),
				$curtain = $("#" + data.revealCurtain),
				scrollOffset = $(".sticky-wrapper .stuck").outerHeight(!0),
				defaultSettings = {
					animation: this.options.animation,
					scrollBehavior: data.revealScroll,
					hideText: data.revealHideText,
					media: data.revealMedia,
					expandToggle: data.revealExpandToggle
				};
			if (settings = $.extend({}, defaultSettings, settings), $target.add($trigger).data("revealState", "open").addClass("is-open"), settings.hideText && $trigger.text(settings.hideText), $curtain.slideHeight("up", settings.animation), $target.slideHeight("down", settings.animation), "video" === settings.media && (videoElement = $target.find(".video-js")[0], requestBrightcove.then(function () {
					(player = Plugin.getBrightcovePlayer(videoElement)).ready(function () {
						player.play()
					})
				})), settings.scrollBehavior) {
				switch (settings.scrollBehavior) {
					case "trigger":
						$scrollTarget = $trigger;
						break;
					case "target":
						$scrollTarget = $target;
						break;
					default:
						$scrollTarget = $("#" + settings.scrollBehavior)
				}
				Components.utils.smoothScrollTop($scrollTarget, settings.animation.duration, scrollOffset, !1)
			} else $curtain.length && Components.utils.smoothScrollTop($curtain, settings.animation.duration, scrollOffset, !0);
			settings.expandToggle && $trigger.addClass("link--collapse").removeClass("link--expand"), 0 === href.indexOf("#") && href.length > 1 && history.replaceState && history.replaceState(void 0, void 0, href)
		}, Plugin.prototype.hideContent = function (trigger) {
			var $trigger = $(trigger).length ? $(trigger) : this.element.data("reveal-trigger"),
				data = $trigger.data(),
				$target = $("#" + data.revealTarget),
				$curtain = $("#" + data.revealCurtain),
				showText = data.revealShowText,
				media = data.revealMedia,
				expandToggle = data.revealExpandToggle;
			void 0 !== showText && $trigger.text(showText), $target.slideHeight("up", this.options.animation), $curtain.slideHeight("down", this.options.animation), setTimeout(function () {
				$target.add($trigger).data("revealState", "closed").removeClass("is-open")
			}, this.options.animation.duration), "video" === media && videojs($target.find(".video-js")[0]).pause(), expandToggle && $trigger.addClass("link--expand").removeClass("link--collapse"), 0 === window.location.hash.indexOf("#") && history.replaceState && history.replaceState(void 0, void 0, window.location.pathname)
		}, Plugin.prototype.autoReveal = function () {
			var $trigger, hash = window.location.hash;
			hash.length > 1 && this.element.is(hash) && ($trigger = $(hash).data("revealTrigger"), this.showContent($trigger, {
				animation: {
					duration: 0
				},
				scrollBehavior: "target"
			}))
		}, Plugin.prototype.init = function () {
			var _this = this,
				$triggers = $();
			_this.options.triggers.each(function () {
				var $trigger = $(this),
					targetId = $trigger.data("revealTarget"),
					$target = $("#" + targetId);
				_this.element.is($target) && ($triggers = $triggers.add($trigger), $target.data("revealTrigger", $trigger), $target.data("revealState", "closed"), $trigger.attr("href").length <= 1 && $trigger.attr("href", "#" + targetId))
			}), $triggers.length && _this.element.length && (_this.element.data("revealState", "closed"), _this.options.closeLink && _this.element.prepend($('<a href="#" class="reveal__close" href="#"><i class="icon icon--close-window-style2"></i></a>')), $triggers.each(function () {
				var $trigger = $(this),
					$target = $("#" + $trigger.data("revealTarget")),
					showText = $trigger.text();
				$target.data("revealTrigger", $trigger), $trigger.hasClass("link--expand") && $trigger.data("revealExpandToggle", !0), void 0 !== $trigger.data("revealHideText") && $triggers.data("revealShowText", showText), _this.options.closeLink && !1 === $trigger.data("revealCloseLink") && $target.find(".reveal__close").remove()
			}), $triggers.on("click.reveal", function (e) {
				var state = _this.element.data("revealState");
				"closed" === state ? _this.showContent(this) : "open" == state && _this.hideContent(this), e.preventDefault()
			}), $(".reveal__close").on("click.reveal", function (e) {
				var $parent = $(this).closest(_this.element),
					state = $parent.data("revealState");
				_this.element.is($parent) && "open" === state && _this.hideContent($parent.data("revealTrigger")), e.preventDefault()
			}))
		}, Plugin.getBrightcovePlayer = function (videoElement) {
			var $video = $(videoElement),
				data = $(videoElement).data();
			return data.revealAccount && data.revealPlayer && data.revealVideoId && !data.revealInitialized && ($video.attr({
				"data-account": data.revealAccount,
				"data-player": data.revealPlayer,
				"data-video-id": data.revealVideoId
			}), bc(videoElement), data.revealInitialized = !0), videojs(videoElement)
		}, $.fn[pluginName] = function (options) {
			return this.each(function () {
				var plugin = new Plugin(this, options);
				$.data(this, "plugin_" + pluginName, plugin), this.contentReveal = plugin
			})
		}, resolveBrightcove(), $(document).one("brightcove:loaded", resolveBrightcove)
	}(jQuery),
	function ($) {
		function Plugin(element, options) {
			var $element = $(element);
			this._name = pluginName, this._defaults = defaults, this._element = $element, this.options = $.extend(!0, defaults, options), this.init()
		}
		var pluginName = "dynamicSelectFilters",
			defaults = {
				container: !1,
				groupHeading: "",
				onCreateSelectCallback: null
			};
		Plugin.prototype.init = function () {
			var _options = this.options,
				$radioGroups = this._element,
				$selectContainer = $radioGroups.find(_options.container);
			$radioGroups.length && ($selectContainer.length || ($radioGroups.eq(0).before('<div class="dynamic-select-container"></div>'), $selectContainer = $radioGroups.eq(0).prev(".dynamic-select-container")), $radioGroups.each(function () {
				var $this = $(this),
					groupHeading = $this.find(_options.groupHeading),
					$input = $this.find('input[type="radio"]'),
					$select = ($this.find("label"), $("<select>")),
					selectOptions = "";
				$input.length && (groupHeading.length && (selectOptions = '<option class="select-placeholder" disabled selected>' + groupHeading.text().trim().replace(/\:$/, "") + "</option>"), $input.each(function () {
					var $this = $(this),
						$label = $this.next("label"),
						triggerElement = "#" + $this.attr("id").trim(),
						isSelected = $this.is(":checked") ? "selected" : "";
					selectOptions += '<option value="' + triggerElement + '" ' + isSelected + ">" + $label.text() + "</option>", $this.on("change.dynamicfilter", function () {
						$select.find('option[value="' + triggerElement + '"]').prop("selected", !0)
					})
				}), $select.html(selectOptions).on("change.dynamicfilter", function () {
					$($(this).val()).prop("checked", !0).trigger("change")
				}).appendTo($selectContainer), "function" == typeof _options.onCreateSelectCallback && _options.onCreateSelectCallback.call($select))
			}))
		}, $.fn[pluginName] = function (options) {
			return this.each(function () {
				$.data(this, "plugin_" + pluginName) || $.data(this, "plugin_" + pluginName, new Plugin(this, options))
			})
		}
	}(jQuery),
	function ($) {
		function Plugin(element, options) {
			var $element = $(element);
			this._name = pluginName, this._defaults = defaults, this._element = $element, this.options = $.extend(!0, defaults, options), this._wrapper = $element, this._input = this._findInput($element), this._label = this._findLabel($element), this.init()
		}
		var pluginName = "floatLabel",
			defaults = {
				wrapperInitClass: "has-float-label",
				labelSelector: !1,
				activeClass: "is-active",
				emptyClass: "is-empty",
				focusClass: "has-focus",
				badSupportClass: "is-msie"
			},
			hasBadPlaceholderSupport = Boolean(window.navigator.userAgent.match(/(MSIE |Trident\/)/));
		Plugin.prototype._findInput = function ($el) {
			var $textInputs = $el.find("input, textarea").not('[type="checkbox"], [type="radio"]');
			return $textInputs.length ? $textInputs : $el.find("select")
		}, Plugin.prototype._findLabel = function (el) {
			return this.options.labelSelector ? $(el).find(this.options.labelSelector) : $(el).find("label")
		}, Plugin.prototype._checkValue = function () {
			var isEmpty = "" === this._input.val() || "_none" === this._input.val();
			this._input.toggleClass(this.options.emptyClass, isEmpty), this._label.toggleClass(this.options.activeClass, !isEmpty), this._label.add(this._input).toggleClass(this.options.badSupportClass, hasBadPlaceholderSupport)
		}, Plugin.prototype._onKeyUp = function () {
			this._checkValue()
		}, Plugin.prototype._onFocus = function () {
			this._label.addClass(this.options.focusClass), this._onKeyUp()
		}, Plugin.prototype._onBlur = function () {
			this._label.removeClass(this.options.focusClass), this._onKeyUp()
		}, Plugin.prototype.init = function () {
			this._element.addClass(this.options.wrapperInitClass), this._checkValue(), this._input.off("keyup.floatLabels change.floatLabels").on("keyup.floatLabels change.floatLabels", $.proxy(this._onKeyUp, this)), this._input.off("blur.floatLabels").on("blur.floatLabels", $.proxy(this._onBlur, this)), this._input.off("focus.floatLabels").on("focus.floatLabels", $.proxy(this._onFocus, this))
		}, $.fn[pluginName] = function (options) {
			return this.each(function () {
				$.data(this, "plugin_" + pluginName, new Plugin(this, options))
			})
		}
	}(jQuery),
	function ($) {
		$.fn.slideHeight = function (direction, options) {
			var $el = $(this);
			if (options = options || {
					duration: 400,
					easing: "swing"
				}, "down" === direction) {
				var $elClone = $el.clone().find(":checked").removeAttr("name").end().css({
						height: "auto"
					}).appendTo($el.parent()),
					elHeight = $elClone.outerHeight(!0);
				$elClone.remove(), $el.animate({
					height: elHeight
				}, options.duration, options.easing, function () {
					$el.css({
						height: "auto",
						overflow: "inherit"
					})
				})
			}
			return "up" === direction && ($el.css("overflow", "hidden"), $el.animate({
				height: 0
			}, options)), this
		}
	}(jQuery),
	function ($) {
		function Plugin(element, options) {
			this._name = pluginName, this._defaults = defaults, this.element = $(element), this.options = $.extend({}, defaults, options), this.options.tabLinks = this.element.find(this.options.tabLinks).add(this.element.find(this.options.triggers)), this.options.contents = this.element.find(this.options.contents), this.init(), window.location.hash.length && this.autoReveal()
		}
		var pluginName = "tabs",
			defaults = {
				animation: {
					duration: 1e3,
					easing: "easeInOutQuart"
				}
			};
		Plugin.prototype.showTab = function ($link, settings) {
			var $scrollTarget, $parent, parentPadding, flyoutHeight, heightChange, $content = $("#" + $link.data("tab-content")),
				previousContentHeight = this.options.contents.filter(".is-active").outerHeight(!0),
				$flyoutContainer = $content.closest(".flyout__content"),
				href = $link.attr("href"),
				$contentClone = $content.clone().show().css({
					height: "auto"
				}).appendTo($content.parent()),
				contentHeight = $contentClone.outerHeight(!0),
				scrollOffset = $(".sticky-wrapper .stuck").outerHeight(!0),
				defaultSettings = {
					animation: {
						duration: isNaN(this.element.data("tabs-duration")) ? this.options.animation.duration : this.element.data("tabs-duration"),
						easing: this.options.animation.easing
					},
					scrollBehavior: this.element.data("tabs-scroll")
				};
			if (settings = $.extend({}, defaultSettings, settings), $contentClone.remove(), $link.hasClass("is-active") || (this.options.tabLinks.add(this.element.find(this.options.contents)).removeClass("is-active"), $link.add($content).addClass("is-active"), $flyoutContainer.length || settings.animation.complete || (settings.animation.complete = function () {
					$(this).css({
						height: "auto"
					})
				}), $content.height(previousContentHeight).animate({
					height: contentHeight
				}, settings.animation), $flyoutContainer.length && (parentPadding = ($parent = $flyoutContainer.offsetParent()).outerHeight() - $parent.height(), flyoutHeight = $flyoutContainer.outerHeight(!0), heightChange = contentHeight - previousContentHeight, $parent.animate({
					height: flyoutHeight - parentPadding + heightChange
				}, settings.animation))), settings.scrollBehavior) {
				switch (settings.scrollBehavior) {
					case "wrapper":
						$scrollTarget = this.element;
						break;
					case "content":
						$scrollTarget = $content;
						break;
					default:
						$scrollTarget = $("#" + settings.scrollBehavior)
				}
				Components.utils.smoothScrollTop($scrollTarget, settings.animation.duration, scrollOffset, !1)
			}
			0 === href.indexOf("#") && href.length > 1 && history.replaceState && history.replaceState(void 0, void 0, href), this.element.trigger(pluginName + ".showTab")
		}, Plugin.prototype.autoReveal = function () {
			var $flyoutContainer, $flyoutTrigger, hash = window.location.hash,
				$tabLink = this.options.tabLinks.filter("[href=" + hash + "]"),
				scroll = "wrapper";
			$tabLink.length && this.element.find($tabLink).length && (scroll = !($flyoutContainer = $tabLink.closest(".flyout__content")).length && "wrapper", this.showTab($tabLink, {
				animation: {
					duration: 100
				},
				scrollBehavior: scroll
			}), $flyoutContainer.length && !$flyoutContainer.hasClass("is-open") && ($flyoutTrigger = $flyoutContainer.data("flyout-trigger"), $flyoutContainer[0].contentFlyout.showContent($flyoutTrigger, {
				animation: {
					duration: 0
				},
				scroll: !0,
				scrollDown: !0
			})))
		}, Plugin.prototype.init = function () {
			var _this = this,
				$flyoutContainer = _this.element.closest(".flyout__content");
			_this.options.tabLinks.length && _this.options.contents.length && (_this.options.tabLinks.on("click.tabs", function (e) {
				_this.showTab($(this)), e.preventDefault()
			}), _this.options.tabLinks.each(function (index, el) {
				var tabId = $(el).data("tab-content"),
					fragment = "#" + tabId;
				$flyoutContainer.length && (fragment = "#" + $flyoutContainer.attr("id") + "-" + tabId), 0 === $(el).attr("href").indexOf("#") && $(el).attr("href", fragment)
			}), _this.options.triggers && _this.options.triggers.on("click.tabs-trigger", function (e) {
				var $link = _this.options.tabLinks.filter('[data-tab-content="' + $(this).data("tab-content") + '"]'),
					$content = $("#" + $(this).data("tab-content"));
				$link.length && (_this.options.tabLinks.add(_this.options.contents).removeClass("is-active"), $link.add($content).addClass("is-active")), history.replaceState && history.replaceState(void 0, void 0, $link.attr("href")), e.preventDefault()
			}))
		}, $.fn[pluginName] = function (options) {
			return this.each(function () {
				var plugin = new Plugin(this, options);
				$.data(this, "plugin_" + pluginName, plugin), this.tabs = plugin
			})
		}
	}(jQuery),
	function ($) {
		$(document).ready(function () {
			$(".auto-suggest").autoSuggest()
		})
	}(jQuery),
	function ($) {
		$(document).on("ready components:reattach", function (e, context) {
			$(".fancy-filters").off("click.fancy-filters").on("click.fancy-filters", ".fancy-filters__clear", function (e) {
				return $(e.delegateTarget).find("input:checked").prop("checked", !1).change(), !1
			})
		})
	}(jQuery),
	function ($) {
		$(document).ready(function () {
			var $formWrapper = $(".flyout-form"),
				$triggers = $('a[href*="#form"], .flyout-form__trigger'),
				$closeLink = $formWrapper.find(".flyout-form__close"),
				$pageWrapper = $("body");
			$formWrapper.length && $triggers.length && ($pageWrapper.append($formWrapper), $closeLink.length || ($closeLinkWrapper = $('<div class="flyout-form__close-wrapper">'), $closeLink = $('<a href="#" class="flyout-form__close link link--close">Close</a>'), $closeLinkWrapper.prepend($closeLink), $formWrapper.prepend($closeLinkWrapper)), $triggers.data("flyoutTarget", "form"), $formWrapper.contentFlyout({
				triggers: $triggers,
				slideout: $pageWrapper,
				stayOnTop: !0,
				closeLinks: $closeLink,
				scroll: !1
			}), $pageWrapper.on("click.flyout", function (e) {
				$(this).hasClass("is-open") && ($formWrapper[0].contentFlyout.hideContent(), e.preventDefault())
			}), $formWrapper.on("click.flyout", function (e) {
				e.stopPropagation()
			}), "#form" === window.location.hash && $formWrapper[0].contentFlyout.showContent(), $(document).keyup(function (e) {
				27 == e.keyCode && $formWrapper.hasClass("is-open") && $formWrapper[0].contentFlyout.hideContent()
			}), "iOS" === $.ua.os.name && $formWrapper.find("input, textarea, select").blur(function () {
				setTimeout(function () {
					$formWrapper.hide().show(0)
				}, 500)
			}), $triggers.on("click.flyout", function (e) {
				$(e.currentTarget).is($triggers) && $formWrapper.find("input:visible").first().focus()
			}))
		})
	}(jQuery), (Components = Components || {}).form = {}, Components.form.initFloatLabels = function ($elements) {
		$elements.find("input, select, textarea").not('[type="checkbox"], [type="radio"]').closest(".form-field").floatLabel({
			labelSelector: ".form-field__label"
		})
	}, $(document).ready(function () {
		Components.form.initFloatLabels($(".has-float-label"))
	}), $(document).on("initFloatLabels", function (e) {
		Components.form.initFloatLabels($(e.target))
	}),
	function ($) {
		$(document).ready(function () {
			function isReveal() {
				return $form.hasClass("form-compact--reveal")
			}

			function revealForm() {
				var ctaText = $cta.val() || $cta.text();
				$form.hasClass("is-open") || ($form.toggleClass("is-open"), $cta.text(ctaText)), $form.find("input:visible").first().focus()
			}
			var $form = $(".form-compact"),
				$cta = $form.find("button.form__button.cta"),
				$triggers = $('a[href*="#form"]');
			$form.length && $cta.length && ("#form" === window.location.hash && (isReveal() && revealForm(), $form.find("input:visible").first().focus()), $cta.click(function (e) {
				return isReveal() && !$form.hasClass("is-open") ? (revealForm(), !1) : ($(this.form).find('input[type="submit"]').click(), !1)
			}), $triggers.on("click", function (e) {
				revealForm()
			}))
		})
	}(jQuery),
	function ($) {
		$(document).ready(function () {
			$(".responsive-filter").dynamicSelectFilters({
				container: ".responsive-filter__select",
				groupHeading: ".responsive-filter__heading",
				onCreateSelectCallback: function () {
					this.wrap('<div class="form__select"></div>')
				}
			})
		})
	}(jQuery),
	function ($) {
		$(document).ready(function () {
			var $gifs = $(".gif-player");
			$gifs.length && $gifs.each(function (index, el) {
				var $gif = $(this);
				$gif.data("static-src", $gif.attr("src"));
				new Waypoint.Inview({
					element: $gif[0],
					entered: function (direction) {
						$gif.attr("src", $gif.data("gif-src"))
					},
					exited: function (direction) {
						$gif.attr("src", $gif.data("static-src"))
					}
				})
			})
		})
	}(jQuery), (Components = Components || {}).thumbnail = {},
	function (component, $) {
		var i = -1;
		component.colors = ["dark-blue", "teal", "light-blue", "light-orange", "red", "yellow"], component.ready = function ($) {
			component.colors = _.shuffle(component.colors), $(".thumbnail--color").not('[class*="thumbnail--color-"]').each(function () {
				$(this).addClass("thumbnail--color-" + component.pickUniqueColor())
			})
		}, component.pickUniqueColor = function () {
			return (++i < 0 || i === component.colors.length) && (i = 0), component.colors[i]
		}
	}(Components.thumbnail, jQuery), jQuery(Components.thumbnail.ready), (Components = Components || {}).AccordionGrid = function (element, options) {
		this.defaultOptions = {
			itemSelector: ".accordion-grid__item",
			teaserSelector: ".accordion-grid__teaser",
			detailSelector: ".accordion-grid__detail",
			closeClass: "accordion-grid__close",
			animation: {
				duration: 750,
				easing: "easeInOutQuart"
			}
		}, this.$element = $(element), this.options = $.extend({}, this.defaultOptions, options), this.init()
	},
	function (AccordionGrid, $) {
		AccordionGrid.jQueryPluginName = "tabAccordionGrid", AccordionGrid.instances = [], AccordionGrid.ready = function () {
			$(".accordion-grid").tabAccordionGrid()
		}, AccordionGrid.prototype.init = function () {
			var debouncedTeaserClickHandler, _this = this,
				$accordionGrid = this.$element,
				$details = $accordionGrid.find(this.options.detailSelector),
				$closeLink = $('<a href="#" class="' + this.options.closeClass + '"><i class="icon icon--close-window-style2"></a>');
			$details.not($details.has("." + this.options.closeClass)).prepend($closeLink), debouncedTeaserClickHandler = _.debounce(function () {
				var $item = $(this).closest(_this.options.itemSelector);
				_this.toggleItem($item)
			}, _this.options.animation.duration, !0), $accordionGrid.off("click.accordion-grid-teaser").on("click.accordion-grid-teaser", this.options.teaserSelector, debouncedTeaserClickHandler), $accordionGrid.off("click.accordion-grid-close").on("click.accordion-grid-close", "." + _this.options.closeClass, function (e) {
				var $item = $(this).closest(_this.options.itemSelector);
				_this.closeItem($item), e.preventDefault()
			}), this.hashOpen(), AccordionGrid.instances.push($accordionGrid)
		}, AccordionGrid.prototype.toggleItem = function ($item) {
			$item.hasClass("is-expanded") ? this.closeItem($item) : this.openItem($item)
		}, AccordionGrid.prototype.openItem = function ($item, settings) {
			var id = $item.attr("id"),
				defaultSettings = {
					animation: this.options.animation
				};
			settings = $.extend({}, defaultSettings, settings), this.closeItems(), $item.addClass("is-expanded"), $item.find(this.options.detailSelector).slideHeight("down", settings.animation), id.length > 1 && history.replaceState && history.replaceState(void 0, void 0, "#" + id)
		}, AccordionGrid.prototype.closeItem = function ($item) {
			var hash = window.location.hash;
			$item.hasClass("is-expanded") && ($item.removeClass("is-expanded"), $item.find(this.options.detailSelector).slideHeight("up", this.options.animation)), hash.length > 1 && $item.is(hash) && history.replaceState && history.replaceState(void 0, void 0, window.location.pathname)
		}, AccordionGrid.prototype.closeItems = function () {
			var _this = this,
				$openItems = this.$element.find(this.options.itemSelector).filter(".is-expanded");
			return $openItems.each(function () {
				_this.closeItem($(this))
			}), $openItems
		}, AccordionGrid.prototype.hashOpen = function () {
			var hash = window.location.hash;
			hash.length > 1 && this.$element.find(hash).length && this.openItem($(hash), {
				animation: {
					duration: 0
				}
			})
		}, $.fn[AccordionGrid.jQueryPluginName] = function (options) {
			return this.each(function () {
				var plugin = new AccordionGrid(this, options);
				$.data(this, "plugin_" + AccordionGrid.jQueryPluginName, plugin), this.AccordionGrid = plugin, $(this).trigger("initialized")
			})
		}, $(AccordionGrid.ready), $(document).on("components:reattach", AccordionGrid.ready)
	}(Components.AccordionGrid, jQuery),
	function ($) {
		$(document).ready(function () {
			$(".accordion").each(function () {
				$(this).accordion({
					itemSelector: ".accordion__item",
					headerSelector: ".accordion__title-wrapper",
					contentSelector: ".accordion__content-wrapper"
				})
			})
		})
	}(jQuery),
	function ($) {
		function setup() {}
		$(document).ready(function () {
			var $triggers = $(".context-switcher__trigger"),
				$lists = $(".context-switcher__list"),
				animation = {
					duration: 500,
					easing: "easeInOutQuart"
				};
			$triggers.length && $lists.length && (setup(), $triggers.on("click.contextSwitcher", function (e) {
				var $trigger = $(this),
					$list = $trigger.closest(".context-switcher").find(".context-switcher__list");
				$trigger.hasClass("open") ? ($list.slideUp(animation), $trigger.removeClass("open")) : ($list.slideDown(animation), $trigger.addClass("open")), e.preventDefault()
			}), $lists.find("a").on("click.contextSwitcher", function (e) {
				var $option = $(this),
					$list = $option.closest(".context-switcher__list"),
					$trigger = $option.closest(".context-switcher").find(".context-switcher__trigger");
				$trigger.text($option.text()), $list.slideUp(animation), $trigger.removeClass("open"), $option.parent().addClass("selected").siblings().removeClass("selected"), e.preventDefault()
			}))
		})
	}(jQuery),
	function ($) {
		$(document).ready(function () {
			$(".flyout__content").contentFlyout({
				triggers: $(".flyout__trigger"),
				slideout: $(".flyout__slideout"),
				closeLinks: $(".flyout__close-link")
			})
		})
	}(jQuery),
	function ($) {
		$(document).ready(function () {
			$(".global-notification .global-notification__close").click(function (e) {
				e.preventDefault(), $(".global-notification").slideUp()
			})
		})
	}(jQuery),
	function ($) {
		$(document).ready(function () {
			var $heroSlideShow = $(".hero-slideshow");
			$heroSlideShow.length && $heroSlideShow.slick({
				dots: !0,
				arrows: !0,
				speed: 650,
				easing: "easeInOutQuart",
				slide: ".hero-slideshow__slide",
				autoplay: !0,
				autoplaySpeed: 8e3,
				responsive: [{
					breakpoint: 639,
					settings: {
						adaptiveHeight: !0
					}
				}]
			})
		})
	}(jQuery), (Components = Components || {}).loadingOverlay = {},
	function (component, $) {
		component.show = function ($element, message, modifier) {
			var $overlay = $('<div class="loading-overlay"><div class="loader"><div class="loader__animation"></div><div class="loader__message">' + (message = message || "Loading...") + "</div></div></div>"),
				offsetY = Components.utils.getElementViewPortCenter($element);
			modifier && $overlay.addClass(modifier), $overlay.find(".loader").css("top", offsetY), $overlay.prependTo($element)
		}, component.hide = function ($element, delay) {
			delay = delay || 0, setTimeout(function () {
				$element.find(".loading-overlay").remove()
			}, delay)
		}
	}(Components.loadingOverlay, jQuery), (Components = Components || {}).modalMessage = {},
	function (component, $) {
		component.modifiers = {
			loading: "modal-message--loading"
		}, component.ready = function () {
			$(".modal-message, .modal-message__close").click(function (e) {
				e.target === this && ($(".modal-message").removeClass("is-open"), e.preventDefault())
			})
		}, component.show = function (message, type) {
			var $modalMessage = $(".modal-message");
			$modalMessage.length || ($modalMessage = $('<div class="modal-message"><div class="modal-message__dialog"><div class="modal-message__icon"></div><div class="modal-message__content"></div><a href="#" class="modal-message__close"></a></div></div>'), $("body").append($modalMessage));
			for (var key in component.modifiers) type === key ? $modalMessage.addClass(component.modifiers[key]) : $modalMessage.removeClass(component.modifiers[key]);
			message && component.update(message), $modalMessage.hasClass("is-open") || $modalMessage.addClass("is-open")
		}, component.update = function (message) {
			$(".modal-message__content").html(message)
		}, component.close = function () {
			$(".modal-message").removeClass("is-open")
		}, $(component.ready)
	}(Components.modalMessage, jQuery),
	function ($) {
		$.fn.moveProgressBar = function (progress) {
			var $progress = $(this).find(".progress"),
				progress = progress || parseInt($progress.data("progress")) || 0,
				treshold = [5, 50, 100],
				modifier = "";
			for (var i in treshold)
				if (progress <= treshold[i]) {
					modifier = "progress--" + treshold[i];
					break
				}
			progress = progress > 100 ? 100 : progress, $progress.removeClass(function (index, css) {
				return (css.match(/(^|\s)progress--\S+/g) || []).join(" ")
			}).css({
				width: progress + "%"
			}).addClass(modifier)
		}
	}(jQuery),
	function ($) {
		$(document).ready(function () {
			$(".reveal__content").contentReveal({
				triggers: $(".reveal__trigger")
			})
		})
	}(jQuery),
	function ($) {
		$(document).ready(function () {
			var defaultSettings = {
					scale: 1,
					distance: 0,
					duration: 1200,
					easing: "cubic-bezier(0.77, 0, 0.175, 1)"
				},
				origins = ["left", "right", "top", "bottom"];
			window.scrollReveal = ScrollReveal(defaultSettings);
			for (var i = 0; i < origins.length; i++) scrollReveal.reveal(".scroll-reveal--" + origins[i], {
				origin: origins[i],
				distance: "200px"
			}), $(".scroll-reveal--" + origins[i]).parents(".section").css("overflow-x", "hidden");
			$(".scroll-reveal__sequence-container").each(function () {
				var sequenceDelay = $(this).data("sequence-delay") || 0,
					sequenceInterval = $(this).data("sequence-interval") || 100;
				$(this).find(".scroll-reveal--sequenced").each(function () {
					scrollReveal.reveal(this, {
						delay: sequenceDelay
					}), sequenceDelay += sequenceInterval
				})
			}), $(".scroll-reveal").each(function () {
				scrollReveal.reveal(this, $(this).data())
			})
		})
	}(jQuery),
	function ($) {
		$.fn.sonarPulse = function (options) {
			var padding, displayCount, $el = $(this),
				defaults = {
					sonarSelector: ".sonar-indicator",
					$sonarElement: $('<div class="sonar-indicator"></div>'),
					timeout: 5e3,
					offset: 5,
					top: "0",
					right: "0",
					bottom: "0",
					left: "0",
					limitDisplayCount: 0,
					limitDisplayId: null
				};
			if (options && options.offset && (padding = parseInt($el.css("padding-left").replace("px", "")), options.left = padding / 2 - options.offset + "px"), options = $.extend({}, defaults, options), window.localStorage && "function" == typeof localStorage.getItem && "function" == typeof localStorage.setItem && options.limitDisplayId && options.limitDisplayCount > 0) {
				if ((displayCount = localStorage.getItem("sonarPulseCount_" + options.limitDisplayId) || 0) >= options.limitDisplayCount) return;
				localStorage.setItem("sonarPulseCount_" + options.limitDisplayId, ++displayCount), $el.trigger("sonar:activate")
			}
			options.$sonarElement.css({
				top: options.top,
				right: options.right,
				bottom: options.bottom,
				left: options.left
			}), $el.remove(options.sonarSelector).prepend(options.$sonarElement), options.timeout > 0 && setTimeout(function () {
				$el.find(options.sonarSelector).remove(), $el.trigger("sonar:deactivate")
			}, options.timeout)
		}, $(function () {
			$(".sonar-pulse").each(function () {
				var $el = $(this);
				$el.sonarPulse($el.data("sonarOptions") || {})
			})
		})
	}(jQuery),
	function ($) {
		function stickIt(el) {
			new Waypoint.Sticky({
				element: el
			})
		}
		$(document).ready(function () {
			$(".sticky").each(function (i) {
				stickIt(this)
			}), window.matchMedia && !$(".lt-ie9").length ? (Components.utils.breakpoint("desktop") && $(".sticky--desktop").each(function (i) {
				stickIt(this)
			}), Components.utils.breakpoint("tablet") && $(".sticky--tablet").each(function (i) {
				stickIt(this)
			}), Components.utils.breakpoint("mobile") && $(".sticky--mobile").each(function (i) {
				stickIt(this)
			})) : $(".sticky--desktop").each(function (i) {
				stickIt(this)
			})
		})
	}(jQuery),
	function ($) {
		$(document).ready(function () {
			$(".tabs__wrapper").each(function () {
				var $this = $(this),
					$triggers = $this.find(".tabs__tab-trigger"),
					$flyoutTriggers = $this.closest(".flyout__content").siblings(".flyout__slideout").find(".tabs__tab-trigger");
				$this.tabs({
					tabLinks: $this.find(".tabs__tab-link"),
					contents: $this.find(".tabs__tab-content"),
					triggers: $triggers.add($flyoutTriggers)
				})
			})
		})
	}(jQuery), (Components = Components || {}).cardWall = {
		isMasonryActive: !0
	},
	function (component, $) {
		component.ready = function ($) {
			"function" == typeof $.fn.masonry && $(".card-wall").length && $(window).on("resize", component.resizeHandler)
		}, component.resizeHandler = _.debounce(function () {
			$(".card-wall .card").each(function () {
				$(this).height("auto"), $(this).height(Math.ceil($(this).height()))
			}), component.checkBreakpoint()
		}, 100), component.checkBreakpoint = function () {
			var $cardWall = $(".card-wall"),
				masonryConfig = $cardWall.data("masonry");
			Components.utils.breakpoint("mobile") ? component.isMasonryActive && ($cardWall.masonry("destroy"), component.isMasonryActive = !1) : component.isMasonryActive ? $cardWall.masonry() : ($cardWall.removeData("masonry"), $cardWall.masonry(masonryConfig), component.isMasonryActive = !0)
		}
	}(Components.cardWall, jQuery), jQuery(Components.cardWall.ready),
	function ($) {
		$(document).on("ready components:reattach", function (e, context) {
			$(".table-list--clickable-row tbody tr").off("click.tableList").on("click.tableList", function (e) {
				var $tlink = $(this).find(".table-list__link a"),
					loc = $tlink.attr("href"),
					target = $tlink.attr("target");
				e.preventDefault(), target || (target = "_self"), window.open(loc, target)
			})
		})
	}(jQuery),
	function ($) {
		Components.$events.on("brightcoveLoaded", function () {
			$(".video-js").each(function (index, element) {
				var $video = $(element),
					videoId = $video.attr("data-video-id"),
					$videoChaptersPlaceholder = $('[data-chapters-for="' + videoId + '"]');
				$videoChaptersPlaceholder.length && videojs(element).on("hyViewerLoaded", function () {
					function placeVideoChapters() {
						$video.find(".popcorn-contents-label").clone().appendTo($videoChaptersPlaceholder).replaceWith(function () {
							return $("<div>", {
								class: "video-chapters__chapter",
								text: this.innerText
							})
						})
					}
					var viewer = this.hapyakViewer;
					viewer.getData("annotationsLoaded") ? placeVideoChapters() : viewer.addEventListener("data", function checkAnnotationsLoaded(data) {
						data && data.annotationsLoaded && (placeVideoChapters(), viewer.removeEventListener("data", checkAnnotationsLoaded))
					})
				})
			})
		})
	}(jQuery), (Components = Components || {}).DropdownNav = function (element, options) {
		this.defaultOptions = {}, this.$element = $(element), this.options = $.extend({}, this.defaultOptions, options), this.init()
	},
	function (DropdownNav, $) {
		DropdownNav.jQueryPluginName = "tabDropdownNav", DropdownNav.instances = [], DropdownNav.ready = function () {
			$(".dropdown-nav").tabDropdownNav(), $(document).on("touchstart.dropdownNav", function (e) {
				DropdownNav.closeAll()
			}).on("keydown.dropdownNav", function (e) {
				27 === e.keyCode && DropdownNav.closeAll()
			})
		}, DropdownNav.prototype.init = function () {
			var $dropdownNav = this.$element;
			$dropdownNav.find(".dropdown-nav__body").on("touchstart.dropdownNav", function (e) {
				e.stopPropagation()
			}), $dropdownNav.find(".dropdown-nav__toggle").on("touchstart.dropdownNav", function (e) {
				e.stopPropagation(), $dropdownNav.toggleClass("is-open")
			}), $dropdownNav.hover(function () {
				$dropdownNav.doTimeout("open", 200, function () {
					$dropdownNav.addClass("is-open")
				})
			}, function () {
				$dropdownNav.doTimeout("open", 200, function () {
					$dropdownNav.removeClass("is-open")
				})
			}), DropdownNav.instances.push($dropdownNav)
		}, DropdownNav.prototype.open = function () {
			this.$element.addClass("is-open")
		}, DropdownNav.prototype.close = function () {
			this.$element.removeClass("is-open")
		}, DropdownNav.closeAll = function () {
			$.each(DropdownNav.instances, function (index, $dropdownNav) {
				$dropdownNav.removeClass("is-open")
			})
		}, $.fn[DropdownNav.jQueryPluginName] = function (options) {
			return this.each(function () {
				var plugin = new DropdownNav(this, options);
				$.data(this, "plugin_" + DropdownNav.jQueryPluginName, plugin), this.DropdownNav = plugin, $(this).trigger("initialized")
			})
		}, $(DropdownNav.ready)
	}(Components.DropdownNav, jQuery),
	function ($) {
		window.tabAjaxMegaMenu = function (data) {
			var commands = {
				insert: function (response) {
					$(response.selector)[response.method](response.data)
				}
			};
			for (var i in data) data[i].command && commands[data[i].command] && commands[data[i].command](data[i]);
			$(document).trigger("tabAjaxMegaMenu:ready"), "function" == typeof $.fn.tabDropdownNav && $(".dropdown-nav").tabDropdownNav()
		}
	}(jQuery),
	function ($) {
		$(document).one("tabAjaxMegaMenu:ready", function () {
			function closeDrawerMobile($drawer) {
				$drawer.add($mobileWrapper).animate({
					marginLeft: "+=100%"
				}, animation), setTimeout(function () {
					$drawersWrapper.removeClass("is-open"), $drawer.hide().removeClass("mobile-open")
				}, animation.duration)
			}

			function sizing() {
				Components.utils.breakpoint("tablet") || Components.utils.breakpoint("mobile") ? (mobileHeightAdjust(), setTimeout(function () {
					$mobileWrapper.addClass("is-mobile")
				}, animation.duration)) : ($hamburger.removeClass("hamburger--open"), $hamburger.parent().removeClass("open"), $mobileWrapper.removeAttr("style").removeClass("is-mobile is-open"), $drawers.removeAttr("style").removeClass("open"))
			}

			function mobileHeightAdjust() {
				var drawerHeight = $(window).outerHeight(!0) - $globalNav.outerHeight(!0);
				$mobileWrapper.add($drawers).each(function (index, el) {
					var $wrapper = $(el),
						origHeight = $wrapper.data("orig-height");
					isNaN(origHeight) && (origHeight = $wrapper.height(), $wrapper.data("orig-height", origHeight)), origHeight < drawerHeight && $wrapper.height(drawerHeight)
				})
			}
			var $globalNav = $(".global-nav__top"),
				$expandableLinks = $globalNav.find("[data-drawer-id]"),
				$drawersWrapper = $(".global-nav__drawers"),
				$drawers = $(".global-nav__drawer"),
				$hamburger = $globalNav.find(".hamburger"),
				$mobileWrapper = $globalNav.find(".global-nav__mobile-wrapper"),
				$mobileDrawerClose = $(".global-nav__drawer-close"),
				animation = {
					duration: 500,
					easing: "easeInOutQuart"
				};
			sizing(), $(window).on("resize orientationchange", _.debounce(sizing, 100)), $expandableLinks.each(function () {
				var $link = $(this).not(".dropdown-nav__toggle"),
					$drawer = $drawers.filter("#" + $link.data("drawer-id")),
					$both = $link.add($drawer);
				$both.hover(function () {
					$both.doTimeout("open", 200, function () {
						$both.addClass("is-open")
					})
				}, function () {
					$both.doTimeout("open", 200, function () {
						$both.removeClass("is-open")
					})
				}), $link.on("touchstart.global-nav", function (e) {
					Components.utils.breakpoint("desktop") && ($link.hasClass("is-open") || (e.preventDefault(), e.stopPropagation()), $expandableLinks.add($drawers).removeClass("is-open"), $both.addClass("is-open"))
				})
			}), $(document).on("touchstart.global-nav", function () {
				$expandableLinks.add($drawers).removeClass("is-open")
			}), $drawers.on("touchstart.global-nav click.global-nav", function (e) {
				e.stopPropagation()
			}), $expandableLinks.on("click.global-nav", function (e) {
				var $link = $(this),
					$drawer = $("#" + $link.data("drawer-id"));
				(Components.utils.breakpoint("tablet") || Components.utils.breakpoint("mobile")) && ($drawersWrapper.addClass("is-open"), $drawer.show().addClass("mobile-open"), $drawer.add($mobileWrapper).animate({
					marginLeft: "-=100%"
				}, animation), e.preventDefault())
			}), $mobileDrawerClose.on("click.global-nav", function (e) {
				closeDrawerMobile($(this).closest(".global-nav__drawer")), e.preventDefault()
			}), $hamburger.on("click.global-nav", function (e) {
				var $openDrawer = $drawers.filter(".mobile-open");
				$openDrawer.length && ($drawersWrapper.removeClass("is-open"), setTimeout(function () {
					$openDrawer.css("margin-left", "100%").hide().removeClass("mobile-open"), $mobileWrapper.css("margin-left", "0%")
				}, 500)), $mobileWrapper.toggleClass("is-open"), $hamburger.parent().toggleClass("open"), e.preventDefault()
			})
		})
	}(jQuery),
	function ($) {
		$(document).ready(function () {
			var $globalNav = $(".global-nav"),
				globalNavData = $globalNav.data(),
				$searchWrapper = $(".global-nav__search"),
				$closeSearch = $(".global-nav__search-close"),
				animation = {
					duration: 500,
					easing: "easeInOutQuart"
				};
			globalNavData && globalNavData.wwwSearch && $searchWrapper.find('input[type="search"]').on("submit-search.globalSearch", function () {
				window.location = "https://www.tableau.com/search/" + globalNavData.wwwSearch + "/" + encodeURIComponent($(this).val())
			}).on("keydown.globalSearch", function (e) {
				13 === e.keyCode && $(this).trigger("submit-search")
			}), $globalNav.on("click", ".global-nav__search-toggle", function (e) {
				e.stopPropagation(), e.stopImmediatePropagation(), e.preventDefault(), $searchWrapper.fadeIn(animation), $(this).parents(".global-nav__top").addClass("global-nav--search-shown"), $searchWrapper.find('input[form="coveo-dummy-form"], input[type="search"]').focus()
			}), $closeSearch.on("click", function (e) {
				e.stopPropagation(), e.preventDefault(), $searchWrapper.parents(".global-nav__top").removeClass("global-nav--search-shown"), $searchWrapper.fadeOut(animation)
			})
		})
	}(jQuery),
	function ($) {
		$(document).ready(function () {
			var $hamburger = $(".hamburger");
			$hamburger.length && $hamburger.on("click.hamburger", function (e) {
				$(this).toggleClass("hamburger--open"), e.preventDefault()
			})
		})
	}(jQuery),
	function ($) {
		$(document).ready(function () {
			var $nav = $(".section-nav"),
				$title = $nav.find(".section-nav__title, .block__title"),
				$menu = $nav.find(".section-nav__menu, .menu-block-wrapper > ul.menu"),
				animation = {
					duration: 500,
					easing: "easeInOutQuart"
				};
			$nav.length && ($title.on("click", function (e) {
				(Components.utils.breakpoint("tablet") || Components.utils.breakpoint("mobile")) && ($nav.toggleClass("is-open"), $menu.slideToggle(animation), e.preventDefault())
			}), $nav.on("click", function (e) {
				e.target === this && (Components.utils.breakpoint("tablet") || Components.utils.breakpoint("mobile")) && ($nav.toggleClass("is-open"), $menu.slideToggle(animation), e.preventDefault())
			}).end().find("a").on("click", function (e) {
				$(this).attr("href") || !Components.utils.breakpoint("tablet") && !Components.utils.breakpoint("mobile") || (e.preventDefault(), $nav.removeClass("is-open"), $menu.slideUp(animation))
			}), Components.utils.breakpoint("desktop") || new Waypoint.Sticky({
				element: $nav
			}))
		})
	}(jQuery),
	function ($) {
		$(document).ready(function () {
			function mobileScroll() {
				var width = $linksWrapper[0].offsetWidth,
					scrollWidth = $linksWrapper[0].scrollWidth;
				width < scrollWidth ? ($links.addClass("fade-right"), $linksWrapper.scroll(function () {
					var scrollPos = $linksWrapper.scrollLeft();
					$links.addClass("fade-right fade-left"), scrollPos === scrollWidth - width && $links.removeClass("fade-right"), 0 === scrollPos && $links.removeClass("fade-left")
				})) : $links.removeClass("fade-left fade-right")
			}
			var $subnav = $(".subnav"),
				$links = $subnav.find(".subnav__links"),
				$linksWrapper = $links.find(".subnav__links-wrapper"),
				$anchors = $(".anchor-link");
			$links.length && $anchors.length && ($anchors.waypoint({
				handler: function (direction) {
					var id = this.element.id;
					"down" === direction ? $links.find('a[href="#' + id + '"]').parent().addClass("is-active").siblings().removeClass("is-active") : "up" === direction && $links.find('a[href="#' + id + '"]').parent().prev().addClass("is-active").siblings().removeClass("is-active")
				},
				offset: $subnav.outerHeight(!0)
			}), $linksWrapper.length && (mobileScroll(), $(window).on("resize orientationchange", _.debounce(mobileScroll, 100))), $links.find("a").not(".subnav__cta a").click(function (e) {
				var element = $(this).attr("href"),
					offset = $subnav.outerHeight(!0) - 1;
				$subnav.find(".sticky-wrapper").length && (offset = $subnav.find(".sticky-wrapper").outerHeight(!0) - 1), Components.utils.smoothScrollTop($(element), 500, offset), e.preventDefault()
			}))
		})
	}(jQuery), (Components = Components || {}).topicNav = {}, Components.topicNav.init = function ($) {
		var $tabLinks = $(".topic-nav__tabs a"),
			$revealToggle = $(".topic-nav__toggle");
		$(".topic-nav").tabs({
			tabLinks: $tabLinks,
			contents: $(".topic-nav__drawer")
		}), $(".topic-nav__drawers").contentReveal({
			triggers: $revealToggle,
			closeLink: !1
		}), $revealToggle.on("click.topic-nav", function (e) {
			var $parentNav = $(this).closest(".topic-nav"),
				$drawersContainer = $(this).closest(".topic-nav").find(".topic-nav__drawers");
			"open" === $drawersContainer.data("revealState") ? ($parentNav.find(".topic-nav__tabs a").eq(0).trigger("click").addClass("is-active"), setTimeout(function () {
				$drawersContainer.addClass("is-open")
			}, 1e3)) : ($parentNav.find(".topic-nav__tabs a").removeClass("is-active"), $drawersContainer.removeClass("is-open"))
		}), $tabLinks.on("click.topic-nav", function (e) {
			var $toggle = $(this).closest(".topic-nav").find(".topic-nav__toggle"),
				$drawersContainer = $(this).closest(".topic-nav").find(".topic-nav__drawers");
			"closed" === $drawersContainer.data("revealState") && ($toggle.trigger("click.reveal"), setTimeout(function () {
				$drawersContainer.addClass("is-open")
			}, 1e3))
		}), $tabLinks.add($revealToggle).each(function (index, el) {
			0 === $(el).attr("href").indexOf("#") && $(el).attr("href", "#")
		}), Components.topicNav.setActiveTab(Components.utils.getUrlParams().topic)
	}, Components.topicNav.setActiveTab = function (topic) {
		var $matchingContent = $('[data-tab-content="' + topic + '"]');
		return $matchingContent.click(), $matchingContent.length > 0
	}, $(document).ready(Components.topicNav.init),
	function ($) {
		$(document).ready(function () {
			var $banner = $(".news-banner"),
				$placeholder = $banner.clone(),
				id = $banner.attr("id"),
				$closeLink = $banner.find(".news-banner__close a"),
				animation = {
					duration: 500,
					easing: "easeInOutQuart"
				};
			$.cookie("news-banner-" + id) && "#banner" !== window.location.hash || ($banner.addClass("is-active"), $placeholder.addClass("news-banner__clone"), $banner.after($placeholder), $placeholder.delay(500).slideDown(animation)), $closeLink.click(function (e) {
				$placeholder.slideUp($.extend(animation, {
					complete: function () {
						$banner.add($placeholder).removeClass("is-active")
					}
				})), $.cookie("news-banner-" + id, 1, {
					expires: 14
				}), e.preventDefault()
			})
		})
	}(jQuery), (Components = Components || {}).contentSearch = {},
	function (component, $) {
		component.ready = function ($) {
			$(".content-search").not(".contextual-search").each(function () {
				component.initialize($(this))
			})
		}, component.initialize = function ($search) {
			$search.find(".content-search__input").off("keydown.contentSearch").on("keydown.contentSearch", $.proxy(Components.contentSearch.keydownHandler, $search)), $search.find(".content-search__reset").off("click.contentSearch").on("click.contentSearch", function () {
				var resetEvent = $.Event("contentSearch:reset");
				$search.trigger(resetEvent), resetEvent.isDefaultPrevented() || component.resetForm($search)
			})
		}, component.resetForm = function ($search) {
			$search.find(".content-search__input").val("")
		}, component.submitForm = function ($search) {
			"" !== $search.find(".content-search__input").val() && $search.find(".content-search__submit").click()
		}, component.keydownHandler = function (event) {
			var $search = $(this[0]),
				submitEvent = $.Event("contentSearch:submit");
			switch (event.which) {
				case 13:
					$search.trigger(submitEvent), submitEvent.isDefaultPrevented() || ($search.find(".content-search__input").prop("readonly", !0).off("keyup keydown blur"), Components.contentSearch.submitForm($search)), event.preventDefault()
			}
		}
	}(Components.contentSearch, jQuery), jQuery(Components.contentSearch.ready), (Components = Components || {}).contextualSearch = {}, Components.contextualSearch.ready = function ($) {
		$(".contextual-search").each(function () {
			var $this = $(this),
				search = {
					selectionIndex: -1,
					element: this
				};
			$this.keydown($.proxy(Components.contextualSearch.keydownHandler, search)), $this.find(".contextual-search__ui").click(function (event) {
				event.stopPropagation()
			}), $(document).click(function () {
				$(search.element).removeClass("is-open")
			}), $this.find(".content-search__reset").click(function () {
				$(search.element).removeClass("is-open")
			})
		})
	}, Components.contextualSearch.keydownHandler = function (event) {
		if ($(this.element).hasClass("is-open")) switch (event.which) {
			case 38:
				Components.contextualSearch.select.call(this, -1);
				break;
			case 40:
				Components.contextualSearch.select.call(this, 1);
				break;
			case 27:
				$(this.element).removeClass("is-open");
				break;
			case 13:
				event.preventDefault(), Components.contextualSearch.select(0), this.selectionIndex >= 0 && this.$rows.get(this.selectionIndex).click()
		}
	}, Components.contextualSearch.select = function (direction) {
		this.$rows = $(this.element).find(".contextual-search__results-row"), this.selectionIndex += direction, this.selectionIndex = Math.max(this.selectionIndex, 0), this.selectionIndex = Math.min(this.selectionIndex, this.$rows.length - 1), this.$rows.removeClass("is-selected").eq(this.selectionIndex).addClass("is-selected")
	}, jQuery(Components.contextualSearch.ready), (Components = Components || {}).searchFacet = {
		collapsedClass: "coveo-facet-collapsed"
	},
	function (component, $) {
		component.ready = function ($) {
			$(document).on("click.searchFacet", function (e) {
				component.closeAll()
			}).on("keydown", function (e) {
				27 === e.keyCode && component.closeAll()
			}), $(".search-facet").on("click.searchFacet", ".search-facet__header, .coveo-facet-header", function (e) {
				var element = e.delegateTarget,
					isCollapsed = $(element).hasClass(component.collapsedClass);
				component.closeAll({
					$except: $(element)
				}), element.CoveoFacet ? isCollapsed ? element.CoveoFacet.expand() : element.CoveoFacet.collapse() : $(element).toggleClass(component.collapsedClass)
			}), $(".search-facet").on("click.searchFacet", function (e) {
				e.stopPropagation()
			})
		}, component.closeAll = function (options) {
			var $closeFacets = $(".search-facet");
			options && options.$except && ($closeFacets = $closeFacets.not(options.$except)), $closeFacets.each(function () {
				this.CoveoFacet ? this.CoveoFacet.collapse() : $(this).addClass(component.collapsedClass)
			})
		}
	}(Components.searchFacet, jQuery), jQuery(Components.searchFacet.ready),
	function ($) {
		$(document).ready(function () {
			var $searches = $('.search-highlight input[type="search"]');
			$searches.length && $searches.each(function (index, el) {
				var $search = $(el),
					$content = $("#" + $search.data("content")),
					highlightClass = $search.data("highlight-class") + " search-highlight__match",
					$contentItems = $content.find("li");
				$search.on("change paste keyup search", function (e) {
					var term = $(this).val().toLowerCase();
					$contentItems.each(function (index, item) {
						var text = $(item).text().toLowerCase();
						$(item).removeClass(highlightClass), term.length > 0 && text.indexOf(term) > -1 && $(item).addClass(highlightClass)
					})
				})
			})
		})
	}(jQuery);;