

var searchTransOld = function(word, regexp){ var count=0, tcount=0, tHits=false, hits=[], hits2=[], tbl='', tbl2='';
	for (var i = 0; i < qTransArr.length; i++) {
		if (oMatch = qTransArr[i].match(regexp)) { ++count; ++tcount; tHits = true;
			var position = oMatch[0].indexOf( word ); var wordsArr = oMatch[0].split(' ');
			for(n=1; n<=wordsArr.length; ++n){ position = -1; //within the sentence, which word is exact match??
				if(wordsArr[n-1] && wordsArr[n-1].indexOf( word ) != -1 ){
					position = n; break;
				}
			}ref = mapLinenoToRef(i); ref = (position == -1 ? ref : (ref+':'+position)); hits2.push( ref );
			var qObj = suraInfo(mapRefToSurano(mapLinenoToRef(i))), surainfo = (!qObj)? '' : (qObj[4] + ' ' + qObj[5]);
			tbl2 += '<TR><TD>' + decorateAya(ref, 'GoRef(this)') + '<BR/>' + surainfo + '</TD>' + 
					'<TD>'+ '<span class="arabic big">' + EnToAr( onGetBuck(i) ) + '</span><br/>' +
							'<span class="label">T</span><span class=trans>' + onGetTrans(i) + '</span><br/>' + 
							'<span class="label">B</span><span class=bare>'+qBareArr[i] + '</span><br/>' +
					'</TD></TR>\n';
		}
	}return hits2;
}



/*
(function(c) {
    c.fn.fadehints = function(h, i) {
        var e = 0,
            a = c(this),
            f = a.offset(),
            b = c("<input>").css("position", "absolute").css("left", f.left).css("top", f.top).css("background-color", "transparent").css("color", "gray").css("border", 0).css("padding", 2).css("font-size", a.css("font-size")).css("font-family", a.css("font-family"));
        f = a.parent();
        var j = c("<div>").append(a.detach(), b),
            g = function() {
                e >= h.length && (e = 0);
                b.hide().val(h[e]).fadeIn(1E3);
                e++;
            };
        a.bind("focus keydown", function(a) {
            a.bubbles != null && (window.clearInterval(d), b.hide());
        });
        b.bind("click focus", function() {
            window.clearInterval(d);
            a.focus();
            c(this).hide();
        });
        a.click(function() {
            b.hide();
            window.clearInterval(d);
        });
        a.blur(function() {
            window.clearInterval(d);
            a.val() === "" && a[0] !== document.activeElement && (b.is(":visible") || g(), d = window.setInterval(g, i));
        });
        f.append(j);
        g(!0);
        var d = window.setInterval(g, i);
        return a;
    }
})(jQuery);
*/



var testSearch = function(_keyword, _keyword2){ var COST = profile('START');
  if(typeof(_keyword) == NULL){_log('no search keyword. error.'); return;}
  if(typeof(_keyword2) == NULL) _keyword2 = _keyword;

  word = _keyword;
  regexp = new RegExp(".*(?:" + escapeForRegex(word) + ").*", "g");
  results['buck'] = search2(word, regexp, qBuck); COST=profile('searchBuck');
  UI_displaySearchHits(title='buck', word, results[title], COST);

  word = _keyword; word=BuckToBare(word);
  regexp = new RegExp(".*(?:" + escapeForRegex(word) + ").*", "g");
  results['newsearch-raw'] = search2(word, regexp, qBare); COST=profile('search2');
  UI_displaySearchHits(title='newsearch-raw', word, results[title], COST);

  word = _keyword; word=BuckToBare(word);
  regexp = new RegExp(".*(?:" + escapeForRegex(word) + ").*", "g");
  results['oldsearch'] = search1(word, regexp); COST=profile('search1');
  UI_displaySearchHits(title='oldsearch', word, results[title], COST);

  word = _keyword2; //'marriage';
  regexp = new RegExp(".*(?:" + word + ").*", "gi");
  results['t-new'] = searchTrans(word, regexp); COST=profile('searchTrans-new');
  UI_displaySearchHits(title='t-new', word, results[title],COST);

  word = _keyword2; //'marriage';
  regexp = new RegExp(".*(?:" + word + ").*", "gi");
  results['t-old'] = searchTransOld(word, regexp); COST = profile('qTrans');
  UI_displaySearchHits(title='t-old', word, results[title], COST);
  
  _log(results);
}


var _keyword='mrym', _keyword2 = 'marriage'; //profile();  
//testSearch(_keyword, _keyword2);

