//if (typeof (QDEV) == 'undefined')
//    Type.registerNamespace('QDEV');
//QDEV.REVISION = '.015';

	var NULL = 'undefined';
	var handleError = function(ex, msg){
		if(typeof(msg) == NULL || !msg) msg='';
		var errMessage = formatError(ex,msg);
		_log(errMessage); if(_bON_ERROR_DEBUG){if(console && console.trace) console.trace(ex);debugger;}
		errMessage = '<div class=error>' + errMessage + '</div>';
		return errMessage;
	}
	
	var formatError = function(ex,msg){
		var errMessage = '<BR><b>-ERROR: ' + msg + ' - ' + ex.message +' - '+ ex.name +' - '+ ex.fileName +':'+ ex.lineNumber + ' -\n<br>-\n' + ex.stack + '</b>\n -';		
		var vDebug = "\n\n<BR><BR>\n\n";
		try{
			for (var prop in ex){  
			   vDebug += "property: "+ prop+ " value: ["+ ex[prop]+ "]<BR>\n"; 
			}
		}catch(err){ vDebug='-No addl details-'; }
		vDebug += "\n<BR>\n<BR>\ntoString(): " + " value: [" + ex.toString() + "]";
		errMessage += '<BR>' + vDebug;
		return errMessage;
	}

	var isArabic = function(word){ var arabic = ArToEn(word).trim();
		return ('' != arabic && word.trim().length == arabic.length );
	}
	var isEnglish = function(word){ var eng = EnToAr(word).trim();
		return ('' != eng && word.trim().length == eng.length );
	}
	
	var escape = function(input){ if(!input) return; return input.replace(/\</g, '&lt;').replace(/\>/g, '&gt;'); }
	var br = function(input){ if(!input) return; return '<span class="E GRMR">'+input.replace(/\n/g, '<br/>') + '</span>'; }
	var hotlinkify = function(input){ if(!input) return; return '<span class=hotlink>' + input + '</span>'; }
	var A = function(href, title, target){ if(!href) return; if(typeof(title)==NULL || !title) title=href; if(typeof(target)==NULL || !target) target=href; return '<a href="'+ href +'" target="'+ target + '" >'+title+'</a>';}

	var onResize = function(){
		//var attr = 'height'; attr = 'width';
		//$('#content1:first').css( 'width', (-25 + window.innerWidth/1.25) ).css( 'height', (-25 + window.innerHeight/1.2) );
		//$('#content2:first').css( 'width', (-25 + window.innerWidth/5) ).css( 'height', (-25 + window.innerHeight/1.2) );
	}
	//$(window).resize( onResize //function(){$('#header').append('resized '+ window.innerHeight +' '+ window.innerWidth + '. '); //alert('resized');
	//); onResize();

		
	var escapeForRegex = function(regex){
		if(!regex) return;
		return regex.replace(/\'/g, '\\\'').replace(/\[/g, '\\\[').replace(/\*/g, '\\\*').replace(/\$/g, '\\\$').replace(/\@/g, '\\\@').replace(/\+/g, '\\\+');
	}
	var _log = function(obj){
	  try{
			if(obj && typeof(console) != NULL && console) 
				console.log(obj);
	  }catch(e){}
	}

	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, '');
	}

	//PROFILING STUFF GOES HERE
	if( typeof(_start) == NULL || typeof(_stLen) == NULL || typeof(_stLen2) == NULL || typeof(_call) == NULL){
	  var _start = new Date().getTime(), _stLen = document.documentElement.innerHTML.length, _stLen2 = $('*').length, _call=1;
	}
	var profile = function(FUNCTION_NAME, addCost, returnRaw){  var timecost=-1, sizecost=-1, elemscost=-1, cost='';
	  timecost = (new Date().getTime() - _start);
	  if(typeof(addCost) != NULL && parseInt(addCost) ) timecost += parseInt(addCost);
	  sizecost = (document.documentElement.innerHTML.length - _stLen);
	  elemscost = ($('*').length - _stLen2);
	  cost = timecost +' ms;';
	  if(sizecost > 1000) cost += parseInt(sizecost/1000) + ' kb;';
	  if(elemscost > 10) cost   += elemscost + ' elems;';
	  cost = '<span class="label profile">' + cost + '</span>';
	  
	  _start = new Date().getTime(); _stLen = document.documentElement.innerHTML.length; _stLen2 = $('*').length;
	  cost += ' ('+ parseInt(_stLen/1000) +' kb, '+ _stLen2 +'#)';
	  if(_bON_ERROR_DEBUG) _log( FUNCTION_NAME +'- '+ cost ); 
	  if(typeof(returnRaw) != NULL && returnRaw) return timecost; 
	  else return cost;
	}

		
		

	var UI_isIphone = function(){
		return ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)));
	}

	var UI_iphone_updateOrientation = function(){
		var contentType = "show_";
		switch(window.orientation){
			case 0:
			contentType += "normal";
			break;

			case -90:
			contentType += "right";
			break;

			case 90:
			contentType += "left";
			break;

			case 180:
			contentType += "flipped";
			break;
		}
		$('body').append( contentType );
		//document.getElementById("page_wrapper").setAttribute("class", contentType);
	}














/* Learn Quran */
var REVISION = 62;
var LANGUAGE_NON = 0;
var LANGUAGE_ENGLISH = 1;
var LANGUAGE_PERSIAN = 2;
var LANGUAGE_FRENCH = 3;
var LANGUAGE_CHINESE = 4;
var LANGUAGE_URDU = 5;
var languages = [];
languages[LANGUAGE_ENGLISH] = {
    name: 'English',
    short: 'en',
    arabic_numbers: false,
    audio: 'http://audio.allahsquran.com/vbv/english/walk/'
};
languages[LANGUAGE_PERSIAN] = {
    name: 'Persian',
    short: 'fa',
    arabic_numbers: true,
    audio: 'http://audio.allahsquran.com/vbv/persian/hidayatfar/'
};
languages[LANGUAGE_FRENCH] = {
    name: 'French',
    short: 'fr',
    arabic_numbers: false,
    audio: 'http://audio.allahsquran.com/vbv/french/leclerc/'
};
languages[LANGUAGE_CHINESE] = {
    name: 'Chinese',
    short: 'cz',
    arabic_numbers: false,
    audio: 'http://audio.allahsquran.com/vbv/chinese/'
};
languages[LANGUAGE_URDU] = {
    name: 'Urdu',
    short: 'ur',
    arabic_numbers: true,
    audio: 'http://audio.allahsquran.com/vbv/urdu/khan/'
};

function serialize(obj) {
    var returnVal;
    if (obj != undefined) {
        switch (obj.constructor) {
        case Array:
            var vArr = "[";
            for (var i = 0; i < obj.length; i++) {
                if (i > 0) vArr += ",";
                vArr += serialize(obj[i]);
            }
            vArr += "]";
            return vArr;
        case String:
            returnVal = '"' + escape(obj) + '"';
            return returnVal;
        case Number:
            returnVal = isFinite(obj) ? obj.toString() : null;
            return returnVal;
        case Date:
            returnVal = "#" + obj + "#";
            return returnVal;
        default:
            if (typeof obj == "object") {
                var vobj = [];
                for (attr in obj) {
                    if (typeof obj[attr] != "function") {
                        vobj.push('"' + attr + '":' + serialize(obj[attr]));
                    }
                }
                if (vobj.length > 0) return "{" + vobj.join(",") + "}";
                else return "{}";
            } else {
                return obj.toString();
            }
        }
    }
    return null;
}

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

function setData(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (e) { var msg = handleError(e, 'Local storage exceeded. Flushing old contents to make space.');
        //if (e == QUOTA_EXCEEDED_ERR) 
		{
            localStorage.clear();
            try {
                localStorage.setItem(key, value);
            } catch (e) {
				msg = handleError(e, 'ERROR when flushing out Local storage contents. See console for more info.'); alert(msg);
			}
        }
    }
}
function getDataOnly(key) {
    var value = localStorage.getItem(key); return value;
}
function getData(key, url, func, errorFunc, dataType, dontcache) {
    var value = localStorage.getItem(key);
    if (value != null) {
        func(value);
    } else {
        $.ajax({
            type: "get",
            url: url,
//			dataType: dataType,
            cache: true,
            success: function (data, textStatus, jqXHR) {
                if(typeof(dontcache) == NULL || !dontcache) setData(key, data);
                func(data, textStatus, jqXHR);
            },
			error: function(jqXHR, textStatus, errorThrown){
				errorFunc(jqXHR, textStatus, errorThrown);
			}
        });
    }
}

function put_options_to_screen() {
	//$('a#a').toggleClass('active', stat.display.mode.a);
	$('a#g').toggleClass('active', stat.display.mode.g);
	$('a#e').toggleClass('active', stat.display.mode.e);
	$('a#w').toggleClass('active', stat.display.mode.w);
	$('a#t').toggleClass('active', stat.display.mode.t);
	$('a#m').toggleClass('active', stat.display.mode.m);
	return;
	
    $('#display_arabic').checkBox('changeCheckStatus', stat.display.mode.a);
    $('#display_english').checkBox('changeCheckStatus', stat.display.mode.e);
    $('#display_word').checkBox('changeCheckStatus', stat.display.mode.w);
    $('#display_tajweed').checkBox('changeCheckStatus', stat.display.mode.t);
    $('#Language-0 ul a[href="#' + stat.display.languages[0] + '"]').trigger('click');
    $('#Language-1 ul a[href="#' + stat.display.languages[1] + '"]').trigger('click');
    $('#Language-2 ul a[href="#' + stat.display.languages[2] + '"]').trigger('click');
    $('#Language-1').toggle(stat.display.languages[1] > 0);
    $('#Language-2').toggle(stat.display.languages[2] > 0);
    $('#add-language-0').toggle(stat.display.languages[1] == 0);
    $('#add-language-1').toggle((stat.display.languages[1] != 0) && (stat.display.languages[2] == 0));
    $('#remove-language-0').toggle(stat.display.languages[1] != 0);
    $('#arabic_mode_continuous').checkBox('changeCheckStatus', stat.display.arabic_mode.continuous);
    $('#arabic_mode_verse').checkBox('changeCheckStatus', stat.display.arabic_mode.verses_per_line);
    $('#english_mode_continuous').checkBox('changeCheckStatus', stat.display.english_mode.continuous);
    $('#english_mode_verse').checkBox('changeCheckStatus', stat.display.english_mode.verses_per_line);
    $('#Container_ArabicFont ul a[href="#' + stat.display.font + '"]').trigger('click');
    $('#download_font').attr('rel', stat.display.font);
    $('#Container_Reciter ul a[href="#' + stat.playback.reciter + '"]').trigger('click');
    $('#play_english').checkBox('changeCheckStatus', stat.playback.english);
    $('#repeat_count').val(stat.playback.repeat.verse);
    $('#repeat_chapters_count').val(stat.playback.repeat.chapter);
    $('#autoplay_verse').checkBox('changeCheckStatus', stat.playback.autoplay.verse);
    $('#autoplay_chapter').checkBox('changeCheckStatus', stat.playback.autoplay.chapter);
    $('#waitmode_continuous').checkBox('changeCheckStatus', stat.playback.wait.continuous);
    $('#waitmode_verse').checkBox('changeCheckStatus', stat.playback.wait.duration_of_verses);
    $('#waitmode_period').checkBox('changeCheckStatus', stat.playback.wait.wait);
    $('#wait_period').val(stat.playback.wait.wait_period);
}

function set_status_from_screen() {
    stat.display.mode.a = $('#display_arabic').attr('checked');
    stat.display.mode.e = $('#display_english').attr('checked');
    stat.display.mode.w = $('#display_word').attr('checked');
    stat.display.mode.t = $('#display_tajweed').attr('checked');
    stat.display.languages[0] = parseInt($('#L0').val());
    stat.display.languages[1] = parseInt($('#L1').val());
    stat.display.languages[2] = parseInt($('#L2').val());
    stat.display.arabic_mode.continuous = $('#arabic_mode_continuous').attr('checked');
    stat.display.arabic_mode.verses_per_line = $('#arabic_mode_verse').attr('checked');
    stat.display.english_mode.continuous = $('#english_mode_continuous').attr('checked');
    stat.display.english_mode.verses_per_line = $('#english_mode_verse').attr('checked');
    stat.display.font = $('#ArabicFont').val();
    if ((stat.display.font != "arial") && (!fontface(stat.display.font))) stat.display.font = "arial";
    stat.playback.reciter = $('#Reciter').val();
    stat.playback.english = $('#play_english').attr('checked');
    stat.playback.repeat.verse = parseInt($('#repeat_count').val());
    if (!stat.playback.repeat.verse) stat.playback.repeat.verse = 1;
    stat.playback.repeat.chapter = parseInt($('#repeat_chapters_count').val());
    if (!stat.playback.repeat.chapter) stat.playback.repeat.chapter = 1;
    stat.playback.autoplay.verse = $('#autoplay_verse').attr('checked');
    stat.playback.autoplay.chapter = $('#autoplay_chapter').attr('checked');
    stat.playback.wait.continuous = $('#waitmode_continuous').attr('checked');
    stat.playback.wait.duration_of_verses = $('#waitmode_verse').attr('checked');
    stat.playback.wait.wait = $('#waitmode_period').attr('checked');
    stat.playback.wait.wait_period = parseInt($('#wait_period').val());
}

var stat_defaults = {
    sura: 1,
    tafsir: {
        visible: false,
        page: 1
    },
    display: {
        mode: {
			g: false,
            e: true,
            w: false,
            t: false,
			m: false,
            a: true
        },
        font: "pdms",
        arabic_mode: {
            continuous: true,
            verses_per_line: false
        },
        english_mode: {
            continuous: true,
            verses_per_line: false
        },
        languages: [LANGUAGE_ENGLISH, LANGUAGE_NON, LANGUAGE_NON]
    },
    playback: {
        reciter: "abdullah_basfar",
        english: false,
        repeat: {
            verse: 1,
            chapter: 1
        },
        autoplay: {
            verse: true,
            chapter: false
        },
        wait: {
            continuous: true,
            duration_of_verses: false,
            wait: false,
            wait_period: 0
        }
    }
};
var stat = stat_defaults;
var lastclick = '';

function set_default_status() {
    stat.sura = 1;
    stat.tafsir.visible = false;
    stat.tafsir.page = 1;
}

function fix_status() {
    if (typeof (stat.display) == 'undefined') stat.display = stat_defaults.display;
    if (typeof (stat.display.mode) == 'undefined') stat.display.mode = stat_defaults.display.mode;
    if (typeof (stat.display.font) == 'undefined') stat.display.font = stat_defaults.display.font;
    if (typeof (stat.display.arabic_mode) == 'undefined') stat.display.arabic_mode = stat_defaults.display.arabic_mode;
    if (typeof (stat.display.arabic_mode.continuous) == 'undefined') stat.display.arabic_mode.continuous = stat_defaults.display.arabic_mode.continuous;
    if (typeof (stat.display.arabic_mode.verses_per_line) == 'undefined') stat.display.arabic_mode.verses_per_line = stat_defaults.display.arabic_mode.verses_per_line;
    if (typeof (stat.display.english_mode) == 'undefined') stat.display.english_mode = stat_defaults.display.english_mode;
    if (typeof (stat.display.english_mode.continuous) == 'undefined') stat.display.english_mode.continuous = stat_defaults.display.english_mode.continuous;
    if (typeof (stat.display.english_mode.verses_per_line) == 'undefined') stat.display.english_mode.verses_per_line = stat_defaults.display.english_mode.verses_per_line;
    if (typeof (stat.display.languages) == 'undefined') stat.display.languages = stat_defaults.display.languages;
    if (typeof (stat.playback) == 'undefined') stat.playback = stat_defaults.playback;
    if (typeof (stat.playback.reciter) == 'undefined') stat.playback.reciter = stat_defaults.playback.reciter;
    if (typeof (stat.playback.english) == 'undefined') stat.playback.english = stat_defaults.playback.english;
    if (typeof (stat.playback.repeat) == 'undefined') stat.playback.repeat = stat_defaults.playback.repeat;
    if (typeof (stat.playback.repeat.verse) == 'undefined') stat.playback.repeat.verse = stat_defaults.playback.repeat.verse;
    if (typeof (stat.playback.repeat.chapter) == 'undefined') stat.playback.repeat.chapter = stat_defaults.playback.repeat.chapter;
    if (typeof (stat.playback.autoplay) == 'undefined') stat.playback.autoplay = stat_defaults.playback.autoplay;
    if (typeof (stat.playback.autoplay.verse) == 'undefined') stat.playback.autoplay.verse = stat_defaults.playback.autoplay.verse;
    if (typeof (stat.playback.autoplay.chapter) == 'undefined') stat.playback.autoplay.chapter = stat_defaults.playback.autoplay.chapter;
    if (typeof (stat.playback.wait) == 'undefined') stat.playback.wait = stat_defaults.playback.wait;
    if (typeof (stat.playback.wait.continuous) == 'undefined') stat.playback.wait.continuous = stat_defaults.playback.wait.continuous;
    if (typeof (stat.playback.wait.duration_of_verses) == 'undefined') stat.playback.wait.duration_of_verses = stat_defaults.playback.wait.duration_of_verses;
    if (typeof (stat.playback.wait.wait) == 'undefined') stat.playback.wait.wait = stat_defaults.playback.wait.wait;
    if (typeof (stat.playback.wait.wait_period) == 'undefined') stat.playback.wait.wait_period = stat_defaults.playback.wait.wait_period;
}

function status_to_hash(params) {
    params = typeof (params) != 'undefined' ? params : 'sdqwetp';
    var hash = '';
    if (params.indexOf('s') != -1) {
        hash += 's' + stat.sura;
    }
    if (params.indexOf('d') != -1) {
        var display_mode = 0;
        if (stat.display.mode.a) display_mode += 1;
        if (stat.display.mode.e) display_mode += 2;
        if (stat.display.mode.w) display_mode += 4;
        if (stat.display.mode.t) display_mode += 8;
        hash += 'd' + display_mode;
    }
    if (params.indexOf('q') != -1) hash += 'q' + stat.display.languages[0];
    if ((params.indexOf('w') != -1) && (parseInt(stat.display.languages[1]) > 0)) hash += 'w' + stat.display.languages[1];
    if ((params.indexOf('e') != -1) && (parseInt(stat.display.languages[2]) > 0)) hash += 'e' + stat.display.languages[2];
    if (params.indexOf('t') != -1) {
        hash += 't' + (stat.tafsir.visible ? 1 : 0);
    }
    if (params.indexOf('p') != -1) {
        hash += 'p' + stat.tafsir.page;
    }
    return hash;
}


function set_status_from_hash(hash) {
    hash = hash.replace(/^.*#/, '');
    var args = new Array();
    var regexp = /([a-z])(\d+)/g;
    var match = regexp.exec(hash);
    while (match != null) {
        args[match[1]] = match[2];
        match = regexp.exec(hash);
    }
    stat.sura = args['s'];
    var display_mode = args['d'];
    stat.display.mode.a = ((display_mode > 0) && ((display_mode % 2) == 1));
    display_mode = parseInt(display_mode / 2);
    stat.display.mode.e = ((display_mode > 0) && ((display_mode % 2) == 1));
    display_mode = parseInt(display_mode / 2);
    stat.display.mode.w = ((display_mode > 0) && ((display_mode % 2) == 1));
    display_mode = parseInt(display_mode / 2);
    stat.display.mode.t = ((display_mode > 0) && ((display_mode % 2) == 1));
    stat.display.languages[0] = args['q'];
    stat.display.languages[1] = (args['w'] !== undefined) ? args['w'] : LANGUAGE_NON;
    stat.display.languages[2] = (args['e'] !== undefined) ? args['e'] : LANGUAGE_NON;
    stat.tafsir.visible = (parseInt(args['t']) > 0);
    stat.tafsir.page = parseInt(args['p']);
}

function load_status_from_cookie() {
    var cookie_value = readCookie('status');
    if (cookie_value) stat = $.parseJSON(cookie_value);
}

function save_status_to_cookie() {
    createCookie('status', serialize(stat), 365);
}

function start_process() {
    pfstart = new Date().getTime();
}

function end_process(aya_no) {
    player_new_sura(aya_no);
    var pfend = new Date().getTime();
    var time = pfend - pfstart;
}
String.prototype.toArabic = function (a) {
    return this.replace(/\d+/g, function (digit) {
        var digitArr = [],
            pDigitArr = [];
        for (var i = 0, len = digit.length; i < len; i++) {
            digitArr.push(digit.charCodeAt(i));
        }
        for (var j = 0, leng = digitArr.length; j < leng; j++) {
            pDigitArr.push(String.fromCharCode(digitArr[j] + (( !! a && a == true) ? 1584 : 1728)));
        }
        return pDigitArr.join('');
    });
};





	var ltrChars = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF'+'\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF';
	var rtlChars            = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC';
	var ltrDirCheckRe       = new RegExp('^[^'+rtlChars+']*['+ltrChars+']');
	var rtlDirCheckRe       = new RegExp('^[^'+ltrChars+']*['+rtlChars+']');
	function isRtlText(text) {
		return rtlDirCheckRe.test(text);
	};
	function isLtrText(text) {
		return ltrDirCheckRe.test(text);
	};

	function check(e) {
		checkDirection( document.getElementById('search') );
	};
	function checkDirection(elem) {
		var text = elem.value;                 
		elem.dir = isRtlText(text) ? 'rtl' : (isLtrText(text) ? 'ltr' : '');    
	};
	
	
/* 
 * EnablePlaceholder jQuery plugin.
 * https://github.com/marioizquierdo/enablePlaceholder
 * version 1.0.1 (May 11 2011)
 * 
 * Copyright (c) 2011 Mario Izquierdo
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 */
(function($){$.support.placeholder=('placeholder'in document.createElement('input'));var defaults={"withPlaceholderClass":"placeholder"};$.fn.enablePlaceholder=function(options){if(!$.support.placeholder){var settings=$.extend({},defaults,options);var showPlaceholder=function(input,placeholder){return input.val(placeholder).addClass(settings["withPlaceholderClass"]).data('hasPlaceholder',true);};var clearPlaceholder=function(input,placeholder){if(input.data('hasPlaceholder')){return input.val("").removeClass(settings["withPlaceholderClass"]).data('hasPlaceholder',false);};};return this.each(function(){var input=$(this);var placeholder=input.attr("placeholder");if(placeholder!=""){if(input.val()==""||input.val()==placeholder){showPlaceholder(input,placeholder);}
input.bind('focus keydown paste',function(){clearPlaceholder(input,placeholder);});input.bind('blur',function(){if(input.val()==""){showPlaceholder(input,input.attr("placeholder"));}});input.parents('form').first().submit(function(){clearPlaceholder(input,placeholder);return true;});}});};};})(jQuery)


