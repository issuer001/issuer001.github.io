
// DO NOT MODIFY BELOW
var g_bIE = false;
var g_bMobile = false;
var g_nWindowHeight = 0;
var g_nWindowWidth = 0;
var g_bEnableAccordion = true;

var __nativeST__ = window.setTimeout, __nativeSI__ = window.setInterval;
window.setTimeout = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
  var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
  return __nativeST__(vCallback instanceof Function ? function () {
    vCallback.apply(oThis, aArgs);
  } : vCallback, nDelay);
};
 
window.setInterval = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
  var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
  return __nativeSI__(vCallback instanceof Function ? function () {
    vCallback.apply(oThis, aArgs);
  } : vCallback, nDelay);
};

if(CLASSID==''||CLASSID==undefined)  {
	var CLASSID = new String(window.location);
	CLASSID = CLASSID.substr(CLASSID.lastIndexOf('/')+1);
	//if(CLASSID.indexOf('?')>0) {
		//CLASSID = CLASSID.substr(0, CLASSID.indexOf('?'));
	//}
	if(CLASSID.indexOf('#')>0) {
		CLASSID = CLASSID.substr(0, CLASSID.indexOf('#'));
	}
}
if(CLASSID=='') CLASSID = 'index.html';


function getCookie(Name){
	var re=new RegExp(Name+"=[^;]+", "i"); //construct RE to search for target name/value pair
	if (document.cookie.match(re)) //if cookie found
		return document.cookie.match(re)[0].split("=")[1]; //return its value
	return '';
}

function setCookie(name, value){
	document.cookie = name + "=" + value + "; path=/";
}
var ddaccordion={

	contentclassname:{}, //object to store corresponding contentclass name based on headerclass

	expandone:function(headerclass, selected){ //PUBLIC function to expand a particular header
		this.toggleone(headerclass, selected, "expand");
	},

	collapseone:function(headerclass, selected){ //PUBLIC function to collapse a particular header
		this.toggleone(headerclass, selected, "collapse");
	},

	expandall:function(headerclass){ //PUBLIC function to expand all headers based on their shared CSS classname
		var $=jQuery;
		var $headers=$('.'+headerclass);
		$('.'+this.contentclassname[headerclass]+':hidden').each(function(){
			$headers.eq(parseInt($(this).attr('contentindex'))).trigger("evt_accordion");
		});
	},

	collapseall:function(headerclass){ //PUBLIC function to collapse all headers based on their shared CSS classname
		var $=jQuery;
		var $headers=$('.'+headerclass);
		$('.'+this.contentclassname[headerclass]+':visible').each(function(){
			$headers.eq(parseInt($(this).attr('contentindex'))).trigger("evt_accordion");
		});
	},

	toggleone:function(headerclass, selected, optstate){ //PUBLIC function to expand/ collapse a particular header
		var $=jQuery;
		var $targetHeader=$('.'+headerclass).eq(selected);
		var $subcontent=$('.'+this.contentclassname[headerclass]).eq(selected);
		if (typeof optstate=="undefined" || optstate=="expand" && $subcontent.is(":hidden") || optstate=="collapse" && $subcontent.is(":visible"))
			$targetHeader.trigger("evt_accordion");
	},

	expandit:function($targetHeader, $targetContent, config, useractivated){
		$targetHeader.css({
			'border-bottom': 'none',
			'margin-bottom': '0'
		});
		if($targetContent.height()>0)
			$targetContent.slideDown(config.animatespeed, function(){config.onopenclose($targetHeader.get(0), parseInt($targetHeader.attr('headerindex')), $targetContent.css('display'), useractivated); });
		else
			config.onopenclose();
		this.transformHeader($targetHeader, config, "expand");
	},

	collapseit:function($targetHeader, $targetContent, config, isuseractivated){
		if(!g_bEnableAccordion) return;
		
		$targetContent.slideUp(config.animatespeed, function(){config.onopenclose($targetHeader.get(0), parseInt($targetHeader.attr('headerindex')), $targetContent.css('display'), isuseractivated)});
		this.transformHeader($targetHeader, config, "collapse");
	},

	transformHeader:function($targetHeader, config, state){
		$targetHeader.addClass((state=="expand")? config.cssclass.expand : config.cssclass.collapse) //alternate btw "expand" and "collapse" CSS classes
		.removeClass((state=="expand")? config.cssclass.collapse : config.cssclass.expand);
		var objImg = $targetHeader.find('img:first');
		if(objImg.html()!=null&&typeof(objImg.attr('rollover'))!="undefined") {
			objImg.unbind();
			if(state=='expand') {
				if(objImg.attr('rolloverperm')!=undefined) {
					objImg.hover(function () {
							$(this).attr('src', $(this).attr('rollover'));
						},
						function () {
							$(this).attr('src', $(this).attr('rolloverperm'));
						}
					);
				} else {
					objImg.attr('src', objImg.attr('rollover'));
				}
			} else {
				objImg.attr('src', objImg.attr('norollover'));
				objImg.hover(function () {
						$(this).attr('src', $(this).attr('rollover'));
					},
					function () {
						$(this).attr('src', $(this).attr('norollover'));
					}
				);
			}
		}
		if (config.htmlsetting.location=='src'){ //Change header image (assuming header is an image)?
			$targetHeader=($targetHeader.is("img"))? $targetHeader : $targetHeader.find('img').eq(0); //Set target to either header itself, or first image within header
			$targetHeader.attr('src', (state=="expand")? config.htmlsetting.expand : config.htmlsetting.collapse); //change header image
		}
		else if (config.htmlsetting.location=="prefix") //if change "prefix" HTML, locate dynamically added ".accordprefix" span tag and change it
			$targetHeader.find('.accordprefix').html((state=="expand")? config.htmlsetting.expand : config.htmlsetting.collapse);
		else if (config.htmlsetting.location=="suffix")
			$targetHeader.find('.accordsuffix').html((state=="expand")? config.htmlsetting.expand : config.htmlsetting.collapse);
	},

	urlparamselect:function(headerclass){
		var result=window.location.search.match(new RegExp(headerclass+"=((\\d+)(,(\\d+))*)", "i")); //check for "?headerclass=2,3,4" in URL
		if (result!=null)
			result=RegExp.$1.split(',');
		return result; //returns null, [index], or [index1,index2,etc], where index are the desired selected header indices
	},

	init:function(config){
		ddaccordion.urlparamselect(config.headerclass);
		var persistedheaders=getCookie(config.headerclass);
		ddaccordion.contentclassname[config.headerclass]=config.contentclass; //remember contentclass name based on headerclass
		config.cssclass={collapse: config.toggleclass[0], expand: config.toggleclass[1]}; //store expand and contract CSS classes as object properties
		config.revealtype=/^(click)|(mouseover)$/i.test(config.revealtype)? config.revealtype.replace(/mouseover/i, "mouseenter") : "click";
		config.htmlsetting={location: config.togglehtml[0], collapse: config.togglehtml[1], expand: config.togglehtml[2]}; //store HTML settings as object properties
		config.oninit=(typeof config.oninit=="undefined")? function(){} : config.oninit; //attach custom "oninit" event handler
		config.onopenclose=(typeof config.onopenclose=="undefined")? function(){} : config.onopenclose; //attach custom "onopenclose" event handler
		var lastexpanded={}; //object to hold reference to last expanded header and content (jquery objects)

		var $subcontents=$('.'+config["contentclass"]);
		if(window.location.toString().indexOf('http://')===0) {
			CLASSID = window.location.toString();
			var arrTmp = CLASSID.split('/');
			if(arrTmp.length>3) {
				CLASSID = '';
				for(var i=3;i<arrTmp.length;i++) {
					CLASSID += '/'+arrTmp[i];
				}
			}
			
		}
		if(CLASSID==''||CLASSID==undefined)  {
			if(window.location.hash!='') {
				CLASSID = new String(window.location.hash);
				CLASSID = CLASSID.substr(1);
			}
		}
		var szClassID2 = CLASSID.substr(0, CLASSID.lastIndexOf('.'));
		var szClassID3 = szClassID2.substr(0, szClassID2.lastIndexOf('-'));
		// CICAK: setup accordion header
		$('.'+config["headerclass"]).each(function(index){
			var $subcontent=$subcontents.eq(index);
			var szCri = '';
			$subcontent.find("a").each(function() {
				if(szCri!='') return;
				var szTmp = $(this).attr('href');
				szTmp = szTmp.replace('../', '');
				szTmp = szTmp.substring(0, szTmp.lastIndexOf('.'));
				if(CLASSID.indexOf(szTmp)!=-1) szCri = "a[href='"+$(this).attr('href')+"']";
			});
			// set mouseover effect
			try {
				var objAccImg = $(this).find('img');
				var szHeaderHREF = objAccImg.parent().attr('href');
				szHeaderHREF = szHeaderHREF.replace('../', '');
				if(CLASSID.indexOf(szHeaderHREF)!=-1) {
					if(objAccImg.attr('rolloverperm')==undefined)
						objAccImg.attr('src', objAccImg.attr('rollover'));
					else
						objAccImg.attr('src', objAccImg.attr('rolloverperm'));
				}
				if(objAccImg) {
					if(szCri!='') {
						objAccImg.attr('norollover', objAccImg.attr('src'));
						objAccImg.attr('src', objAccImg.attr('rollover'));
					} else {
						objAccImg.attr('norollover', objAccImg.attr('src'));
						objAccImg.hover(function () {
								$(this).attr('src', $(this).attr('rollover'));
							},
							function () {
								$(this).attr('src', $(this).attr('norollover'));
							}
						);
					}
				}
			}catch(e) { }
			if(szCri=='') return;
			
			var objA = $subcontent.find(szCri+':eq(0)');
			objA.addClass('selected');
			objA = $subcontent.find(szCri+':eq(0) img');
			if(objA.html()!=null) {
				objA.unbind();
				objA.attr('norollover', objA.attr('src'));
				objA.attr('src', objA.attr('rolloverperm'));
			}
			config.defaultexpanded = [index];
			// mark desktop nav
			var objA = $(this).next().find('a:first');
			$("nav.desktop a[href='"+objA.attr('href')+"']").each(function() {
				$(this).addClass('selected');
			});
			
			//ddaccordion.expandit($(this), $subcontent, config, true) //Last Boolean value sets 'isuseractivated' parameter

		});
		var bFound = false;
		// mark non expandable headers
		$('.'+config["headerclass2"]).each(function(index){
			if(bFound) return;
			var objAccImg = $(this).find('img');
			if(false&&objAccImg.html()!=null) {
				var szHeaderHREF = objAccImg.parent().attr('href');
				szHeaderHREF = szHeaderHREF.replace('../', '');
				if(CLASSID.indexOf(szHeaderHREF)!=-1) {
					if(objAccImg.attr('rolloverperm')==undefined)
						objAccImg.attr('src', objAccImg.attr('rollover'));
					else
						objAccImg.attr('src', objAccImg.attr('rolloverperm'));
				}
				objAccImg.attr('norollover', objAccImg.attr('src'));
				objAccImg.hover(function () {
						$(this).attr('src', $(this).attr('rollover'));
					},
					function () {
						$(this).attr('src', $(this).attr('norollover'));
					}
				);
			} else {
				var szHeaderHREF = $(this).attr('href');
				szHeaderHREF = szHeaderHREF.replace('../', '');
				if(CLASSID.indexOf(szHeaderHREF)!=-1) {
					$(this).addClass( config.toggleclass[1] );
					bFound = true;
				}
			}
		});
		var expandedindices=ddaccordion.urlparamselect(config.headerclass) || ((config.persiststate && persistedheaders!=null)? persistedheaders : config.defaultexpanded);
		if (typeof expandedindices=='string') //test for string value (exception is config.defaultexpanded, which is an array)
			expandedindices=expandedindices.replace(/c/ig, '').split(','); //transform string value to an array (ie: "c1,c2,c3" becomes [1,2,3]
		if (expandedindices.length==1 && expandedindices[0]=="-1") //check for expandedindices value of [-1], indicating persistence is on and no content expanded
			expandedindices=[];
		if (config["collapseprev"] && expandedindices.length>1) //only allow one content open?
			expandedindices=[expandedindices.pop()]; //return last array element as an array (for sake of jQuery.inArray())
		if (config["onemustopen"] && expandedindices.length==0) //if at least one content should be open at all times and none are, open 1st header
			expandedindices=[0];
		$('.'+config["headerclass"]).each(function(index){ //loop through all headers
			if (/(prefix)|(suffix)/i.test(config.htmlsetting.location) && $(this).html()!=""){ //add a SPAN element to header depending on user setting and if header is a container tag
				$('<span class="accordprefix"></span>').prependTo(this);
				$('<span class="accordsuffix"></span>').appendTo(this);
			}
			$(this).attr('headerindex', index+'h'); //store position of this header relative to its peers
			$subcontents.eq(index).attr('contentindex', index+'c'); //store position of this content relative to its peers
			var $subcontent=$subcontents.eq(index);
			var needle=(typeof expandedindices[0]=="number")? index : index+''; //check for data type within expandedindices array- index should match that type
			if (jQuery.inArray(needle, expandedindices)!=-1){ //check for headers that should be expanded automatically (convert index to string first)
				if (config.animatedefault==false)
					$subcontent.show();
				ddaccordion.expandit($(this), $subcontent, config, false); //Last Boolean value sets 'isuseractivated' parameter
				lastexpanded={$header:$(this), $content:$subcontent};
			}  //end check
			else{
				$subcontent.hide();
				config.onopenclose($(this).get(0), parseInt($(this).attr('headerindex')), $subcontent.css('display'), false); //Last Boolean value sets 'isuseractivated' parameter
				ddaccordion.transformHeader($(this), config, "collapse");
			}
		});
		$('.'+config["headerclass"]).bind("evt_accordion", function(){ //assign custom event handler that expands/ contacts a header
				var $subcontent=$subcontents.eq(parseInt($(this).attr('headerindex'))); //get subcontent that should be expanded/collapsed
				if ($subcontent.css('display')=="none"){
				
					// CICAK minor adjustments
					//$(this).css('min-height', 'initial');

					ddaccordion.expandit($(this), $subcontent, config, true); //Last Boolean value sets 'isuseractivated' parameter
					if (config["collapseprev"] && lastexpanded.$header && $(this).get(0)!=lastexpanded.$header.get(0)){ //collapse previous content?
						ddaccordion.collapseit(lastexpanded.$header, lastexpanded.$content, config, true); //Last Boolean value sets 'isuseractivated' parameter
					}
					lastexpanded={$header:$(this), $content:$subcontent};
				}
				else if (!config["onemustopen"] || config["onemustopen"] && lastexpanded.$header && $(this).get(0)!=lastexpanded.$header.get(0)){
					ddaccordion.collapseit($(this), $subcontent, config, true); //Last Boolean value sets 'isuseractivated' parameter
				}
 		});
		$('.'+config["headerclass"]).bind(config.revealtype, function(){
			if (config.revealtype=="mouseenter"){
				clearTimeout(config.revealdelay);
				var headerindex=parseInt($(this).attr("headerindex"));
				config.revealdelay=setTimeout(function(){ddaccordion.expandone(config["headerclass"], headerindex)}, config.mouseoverdelay || 0);
			}
			else{
				$(this).trigger("evt_accordion");
				return false; //cancel default click behavior
			}
		});
		$('.'+config["headerclass"]).bind("mouseleave", function(){
			clearTimeout(config.revealdelay);
		});
		config.oninit($('.'+config["headerclass"]).get(), expandedindices);
		$(window).bind('unload', function(){ //clean up and persist on page unload
			$('.'+config["headerclass"]).unbind();
			var expandedindices=[];
			$('.'+config["contentclass"]+":visible").each(function(index){ //get indices of expanded headers
				expandedindices.push($(this).attr('contentindex'));
			});
			if (config.persiststate==true){ //persist state?
				expandedindices=(expandedindices.length==0)? '-1c' : expandedindices; //No contents expanded, indicate that with dummy '-1c' value?
				setCookie(config.headerclass, expandedindices);
			}
		});
	}
}

function accordionMinus(objThis) {
	if(objThis.hasClass('acc-label')) {
		objThis.removeClass('opened');
		return;
	}
	objThis.removeClass('minus').addClass('plus').addClass('plus_anim');
	objThis.css({
		'cursor': 'pointer',
		'-webkit-touch-callout': 'none',
    '-webkit-user-select': 'none',
    '-khtml-user-select': 'none',
    '-moz-user-select': 'none',
    '-ms-user-select': 'none',
    'user-select': 'none'
	});
}

function accordionPlus(objThis) {
	if(objThis.hasClass('acc-label')) {
		objThis.addClass('opened');
		return;
	}
	objThis.removeClass('plus').addClass('minus').removeClass('plus_anim');
}

/*!
 * hoverIntent v1.8.0 // 2014.06.29 // jQuery v1.9.1+
 * http://cherne.net/brian/resources/jquery.hoverIntent.html
 *
 * You may use hoverIntent under the terms of the MIT license. Basically that
 * means you are free to use hoverIntent as long as this header is left intact.
 * Copyright 2007, 2014 Brian Cherne
 */
(function($){$.fn.hoverIntent=function(handlerIn,handlerOut,selector){var cfg={interval:100,sensitivity:6,timeout:0};if(typeof handlerIn==="object"){cfg=$.extend(cfg,handlerIn)}else{if($.isFunction(handlerOut)){cfg=$.extend(cfg,{over:handlerIn,out:handlerOut,selector:selector})}else{cfg=$.extend(cfg,{over:handlerIn,out:handlerIn,selector:handlerOut})}}var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if(Math.sqrt((pX-cX)*(pX-cX)+(pY-cY)*(pY-cY))<cfg.sensitivity){$(ob).off("mousemove.hoverIntent",track);ob.hoverIntent_s=true;return cfg.over.apply(ob,[ev])}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=false;return cfg.out.apply(ob,[ev])};var handleHover=function(e){var ev=$.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t)}if(e.type==="mouseenter"){pX=ev.pageX;pY=ev.pageY;$(ob).on("mousemove.hoverIntent",track);if(!ob.hoverIntent_s){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}}else{$(ob).off("mousemove.hoverIntent",track);if(ob.hoverIntent_s){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob)},cfg.timeout)}}};return this.on({"mouseenter.hoverIntent":handleHover,"mouseleave.hoverIntent":handleHover},cfg.selector)}})(jQuery);
/*
	FlexNav.js 1.3.3

	Created by Jason Weaver http://jasonweaver.name
	Released under http://unlicense.org/

//
*/
(function() {
  var $;

  $ = jQuery;

  $.fn.flexNav = function(options) {
    var $nav, $top_nav_items, breakpoint, count, nav_percent, nav_width, resetMenu, resizer, settings, showMenu, toggle_selector, touch_selector;
    settings = $.extend({
      'animationSpeed': 250,
      'transitionOpacity': true,
      'buttonSelector': '.menu-button',
      'hoverIntent': true,
      'hoverIntentTimeout': 150,
      'calcItemWidths': false,
      'hover': true
    }, options);
    $nav = $(this);
    $nav.addClass('with-js');
    if (settings.transitionOpacity === true) {
      $nav.addClass('opacity');
    }
    $nav.find("li").each(function() {
      if ($(this).has("ul").length) {
        return $(this).addClass("item-with-ul").find("ul").hide();
      }
    });
    if (settings.calcItemWidths === true) {
      $top_nav_items = $nav.find('>li');
      count = $top_nav_items.length;
      nav_width = 100 / count;
      nav_percent = nav_width + "%";
    }
    if ($nav.data('breakpoint')) {
      breakpoint = $nav.data('breakpoint');
    }
    showMenu = function() {
      if ($nav.hasClass('lg-screen') === true && settings.hover === true) {
      	$(this).find('>a:first').addClass('selected');
        if (settings.transitionOpacity === true) {
          return $(this).find('>ul').addClass('flexnav-show').stop(true, true).animate({
            height: ["toggle", "swing"],
            opacity: "toggle"
          }, settings.animationSpeed);
        } else {
          return $(this).find('>ul').addClass('flexnav-show').stop(true, true).animate({
            height: ["toggle", "swing"]
          }, settings.animationSpeed);
        }
      }
    };
    resetMenu = function() {
    	if ($nav.hasClass('lg-screen') === true && $(this).find('>ul').hasClass('flexnav-show') === true && settings.hover === true) {
      	$(this).find('>a:first').removeClass('selected');
        if (settings.transitionOpacity === true) {
          return $(this).find('>ul').removeClass('flexnav-show').stop(true, true).animate({
            height: ["toggle", "swing"],
            opacity: "toggle"
          }, settings.animationSpeed);
        } else {
          return $(this).find('>ul').removeClass('flexnav-show').stop(true, true).animate({
            height: ["toggle", "swing"]
          }, settings.animationSpeed);
        }
      }
    };
    resizer = function() {
      var selector;
      if ($(window).width() <= breakpoint) {
        $nav.removeClass("lg-screen").addClass("sm-screen");
        if (settings.calcItemWidths === true) {
          $top_nav_items.css('width', '100%');
        }
        selector = settings['buttonSelector'] + ', ' + settings['buttonSelector'] + ' .touch-button';
        $(selector).removeClass('active');
        return $('.one-page li a').on('click', function() {
          return $nav.removeClass('flexnav-show');
        });
      } else if ($(window).width() > breakpoint) {
        $nav.removeClass("sm-screen").addClass("lg-screen");
        if (settings.calcItemWidths === true) {
          $top_nav_items.css('width', nav_percent);
        }
        $nav.removeClass('flexnav-show').find('.item-with-ul').on();
        $('.item-with-ul').find('ul').removeClass('flexnav-show');
        resetMenu();
        //if (settings.hoverIntent === true) {
          return $('.item-with-ul').hoverIntent({
            over: showMenu,
            out: resetMenu,
            timeout: settings.hoverIntentTimeout
          });
        //} else if (settings.hoverIntent === false) {
          //return $('.item-with-ul').on('mouseenter', showMenu).on('mouseleave', resetMenu );
        //}
      }
    };
    $(settings['buttonSelector']).data('navEl', $nav);
    touch_selector = '.item-with-ul, ' + settings['buttonSelector'];
    //$(touch_selector).append('<span class="touch-button"><i class="navicon">&#9660;</i></span>');
    toggle_selector = settings['buttonSelector'] + ', ' + settings['buttonSelector'] + ' .touch-button';
    $(toggle_selector).on('click', function(e) {
      var $btnParent, $thisNav, bs;
      $(toggle_selector).toggleClass('active');
      e.preventDefault();
      e.stopPropagation();
      bs = settings['buttonSelector'];
      $btnParent = $(this).is(bs) ? $(this) : $(this).parent(bs);
      $thisNav = $btnParent.data('navEl');
      return $thisNav.toggleClass('flexnav-show');
    });
    $('.touch-button').on('click', function(e) {
      var $sub, $touchButton;
      $sub = $(this).parent('.item-with-ul').find('>ul');
      $touchButton = $(this).parent('.item-with-ul').find('>span.touch-button');
      if ($nav.hasClass('lg-screen') === true) {
        $(this).parent('.item-with-ul').siblings().find('ul.flexnav-show').removeClass('flexnav-show').hide();
      }
      if ($sub.hasClass('flexnav-show') === true) {
        $sub.removeClass('flexnav-show').slideUp(settings.animationSpeed);
        return $touchButton.removeClass('active');
      } else if ($sub.hasClass('flexnav-show') === false) {
        $sub.addClass('flexnav-show').slideDown(settings.animationSpeed);
        return $touchButton.addClass('active');
      }
    });
    if(false)
    $nav.find('.item-with-ul *').focus(function() {
      $(this).parent('.item-with-ul').parent().find(".open").not(this).removeClass("open").hide();
      return $(this).parent('.item-with-ul').find('>ul').addClass("open").show();
    });
    resizer();
    return $(window).on('resize', resizer);
  };

}).call(this);


// Restive start
$(document).ready(function() {
	
	g_bIE = (navigator.appName == 'Microsoft Internet Explorer') || ((navigator.appName == 'Netscape') && (new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) != null));
	// test for mobile
	var a=navigator.userAgent||navigator.vendor||window.opera;
	if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) {
		g_bMobile = true;
	}
	
	// restive
	$('body').restive({
		// classes will be added to the body tag with their respective classes. You can rename classes to fit the breakpoint pixels defined in "breakpoints"
		// view css classes to check
		// there is an example using .container-fluid class where it will change the background color
		// resize the window to check the results
		breakpoints: [ '480', '768', '970', '1200','1440'],
		classes: ['w480', 'w768', 'w970', 'w1200', 'w1440'],
		turbo_classes: 'is_pc=desktop',
		force_dip: true,
		onResize: function(){
			adjWindow();
		},
		onRotate: function() {
			adjWindow();
		}
	});
	$('.fouc').removeClass('fouc');
	
	initWindow();
	
});
$(window).load(function() {
	
	adjWindow();
});

// restive end

function initWindow() {
	
	// mobile menu
	var szEvent=(g_bMobile)?'touchstart':'mousedown';
	szEvent = 'click';
	$('.menu-button').data('menustate', 0).off().on(szEvent, function() {
		if($('.menu-button').data('menustate')==0) {
			//clearTimeout(g_intervalMM);
			//g_intervalMM = setTimeout(function() {
				$('body').css('overflow-y', 'hidden');
				$('.popup-menu').css('overflow-y', 'scroll');
				$('.popup-menu').scrollTop(0);
			//}, 800);
			$(document).off('touchmove');
			$(".mobilemenu").addClass("popup-menu-shown");
			$(".mobilemenu .menu-button").addClass("closed-state");
			$(".popup-menu").removeClass("hidden");
			//$('.logo').fadeOut();
			$(this).data('menustate', 1);
			//setTimeout(function() {
				//$('body').css('overflow', 'hidden');
				//$('.menu-button').css('position', 'fixed');
			//}, 100);
		} else {
			$(document).on('touchmove', function (e) { e.preventDefault(); });
			//$('.logo').fadeIn();
			hideMenu();
		}
	});
	$('nav.mobile a').on(szEvent, function(e) {
		hideMenu();
	});
	
	
	// accordion
	try {
		ddaccordion.init({
			headerclass: "lv1", //Shared CSS class name of headers group
			headerclass2: "lv0", //non expandable header
			contentclass: "expand", //Shared CSS class name of contents group
			revealtype: "click", //Reveal content when user clicks or onmouseover the header? Valid value: "click" or "mouseover
			mouseoverdelay: 200, //if revealtype="mouseover", set delay in milliseconds before header expands onMouseover
			collapseprev: true, //Collapse previous content (so only one open at any time)? true/false
			defaultexpanded: [], //index of content(s) open by default [index1, index2, etc] [] denotes no content
			onemustopen: false, //Specify whether at least one header should be open always (so never all headers closed)
			animatedefault: false, //Should contents open by default be animated into view?
			persiststate: false, //persist state of opened contents within browser session?
			toggleclass: ["", "perm"], //Two CSS classes to be applied to the header when it's collapsed and expanded, respectively ["class1", "class2"]
			togglehtml: ["", "", ""], //Additional HTML added to the header when it's collapsed and expanded, respectively  ["position", "html1", "html2"] (see docs)
			animatespeed: "fast", //speed of animation: integer in milliseconds (ie: 200), or keywords "fast", "normal", or "slow"
			oninit:function(headers, expandedindices){ //custom code to run when headers have initalized

			},
			onopenclose:function(header, index, state, isuseractivated){ //custom code to run whenever a header is opened or closed
				if(state=='none') {
					accordionMinus($(header));
				} else {
					if(g_bEnableAccordion)
						accordionPlus($(header));
				}
			}
		});
		ddaccordion.collapseall('lv1');
		$('.expand').css('display', 'none');
	} catch(e){};
	
	$(".flexnav").flexNav({ 'animationSpeed' : 'fast' });
	
	try {
		$('.fbox-if').fancybox({
			type: 'iframe',
			padding : 10,
			fitToView: true,
			closeBtn: true,
			helpers:  {
				overlay : {
					closeClick : true,
					speedOut   : 200,
					showEarly  : true,
					css        : {
						'background' : 'rgba(0, 0, 0, 0.7)'
					},
					locked     : false
				},
				thumbs : false,
				buttons: false,
			}
		});
		$(".fbox-pic").fancybox({
      padding : 0,
      closeBtn: false,
      helpers:  {
	      thumbs : {
		      width: 100,
		      height: 100
	      },
	      buttons: {}
	    }
	  });
		
	}catch(e){};
}


function adjWindow() {
	
	g_nWindowHeight = $(window).height();
	g_nWindowWidth = $(window).width();

	// move anything when window resizes	

}
function hideMenu()
{
	$('.popup-menu').css('overflow-y', 'hidden');
	$('html, body').css('overflow-y', 'visible');
	
	$(".mobilemenu").removeClass("popup-menu-shown");
	$(".mobilemenu .menu-button").removeClass("closed-state");
	$(".popup-menu").addClass("hidden");
	$('.menu-button').data('menustate', 0);
	$(document).off('touchmove');

}