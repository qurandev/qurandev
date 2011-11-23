



 //http://audio.allahsquran.com/vbv/arabic/ verse by verse  //http://download.quranicaudio.com/quran/ full suras
/*
khalil_al-husari_mujawwad
khalil_al-husari_murattal
mishary_al-afasi
abdul-basit_mujawwad
abdul-basit_murattal
*/ //	  http://download.quranicaudio.com/quran/tawfeeq_bin_saeed-as-sawaaigh/002.mp3" name="FlashVars">\


		    <input id=bBuck type=checkbox title="Misc: Arabic indopak script, Buck, Arabic no tashkeel etc" zchecked />m <small><a target=_corpus href=http://corpus.quran.com/java/buckwalter.jsp>?</a><a target=_arabic3 href=http://www.noorehidayat.org/index.php?p=alquran>!</a></small>


		<span id=optionsouter style="visibility: hidden; zfloat:right; zposition: absolute; zright: 10;" class=znotice> <span id=options> Options: </span>
		 <span id=optionsinner zstyle="display: none">
		   <input id=bArabic type=checkbox checked />Arabic 
		   <input id=bTrans type=checkbox checked />Trans 
		   <input id=bWord2Word type=checkbox zchecked  />Word2Word 
		   <input id=bTajweed type=checkbox />Tajweed 
		  </span>
		</span>

		
				<!--<form action="#" method="post" id="search">
				<input type="text" value="Search" id="keyword">
				<a class="notready" id="submit" href="#">Submit</a>
			</form>-->



		/*if(ref== -1) transMode=true;
				else{	arrMode = ('' != ArToEn(word).trim()); //check if keyword in arabic
						engMode = ('' != EnToAr(word).trim() ); //check if keyword in english (bare)
				}if(arrMode){arabicWord = word; buckWord=ArToEn(word); bareWord = BuckToBare(buckWord); arabicWord2=EnToAr(bareWord); }
				else if(engMode){ arabicWord = EnToAr(word); buckWord=word; bareWord = BuckToBare(buckWord); arabicWord2=EnToAr(bareWord); }
				if(transMode && SEARCHTOKEN){
					keywords[ SEARCHTOKEN ] = 1;
				}*/

				
			/*try{//Does this have the word position also? If so get that word and also highlight that one.
				if(!HITS) HITS = [];
				for(key in keywords){
					if( (ref=HITS[key]) && ref != -1 && (index = mapRefToWordno(ref)) && index != -1){
						var lineno = mapRefToLineno(ref); //Now get the arabic and buck from lineno.
						var buck = onGetBuck(lineno);
						var arabic = onGetArabic(lineno);
						buckWord = buck.split(' ')[-1+index];
						arabicWord = arabic.split(' ')[-1+index];
						if(arabicWord) keywords[ arabicWord ] = (isNaN(keywords[ arabicWord ]) ? 1 : keywords[ arabicWord ] + 1); 
						if(arabicWord2) keywords[ arabicWord2 ] = (isNaN(keywords[ arabicWord2 ]) ? 1 : keywords[ arabicWord2 ] + 1); 
						if(buckWord) keywords[ buckWord ] = (isNaN(keywords[ buckWord ]) ? 1 : keywords[ buckWord ] + 1); 
						if(bareWord) keywords[ bareWord ] = (isNaN(keywords[ bareWord ]) ? 1 : keywords[ bareWord ] + 1); 
					}
				}
			}catch(err){ var msg = handleError(err, 'highlighting keywords failed.'); }
			*/


/*
var myLinks = document.getElementsByTagName('a');
for(var i = 0; i < myLinks.length; i++){
   myLinks[i].addEventListener('touchstart', function(){this.className = "hover";}, false);
   myLinks[i].addEventListener('touchend', function(){this.className = "";}, false);
}

Once you added the code above to your document, you can start css styling:  a:hover, a.hover {
}
*/


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

		var WORD2WORD_PATTERN_START = '<table width="100%" cellspacing="0" cellpadding="0" border="0" class="aya-W last"><tbody><tr>';
		var WORD2WORD_PATTERN_TD = '<td width="$3" align="$9" class="ww"><div onclick="pl($4)" style="width:$2px"><span class="a">$0</span><span class="e">$1</span></div></td>';
//<td width="153" align="center" class="ww"><div onclick="pl(2)" style="width:86px"><span class="a">???????</span><span class="e">(of) Allah,</span></div></td>
//<td width="212" align="center" class="ww"><div onclick="pl(3)" style="width:145px"><span class="a">?????????????</span><span class="e">the Most Gracious,</span></div></td>
//<td width="159" align="center" class="ww"><div onclick="pl(4)" style="width:140px"><span class="a">??????????</span><span class="e">the Most Merciful.</span></div></td>
//<td valign="middle" class="n"><span class="aya_num">?<strong>?</strong>?</span></td>
var WORD2WORD_PATTERN_END = '</tr></tbody></table>';


/*
								     '<span id=optionsouter style="float:right; position: absolute; right: 10;" class=notice> <span id=options> Options: </span>',
								     '<span id=optionsinner style="display: none">',
									   '<input id=bGrammar type=checkbox text=grammar/>Grammar ',
									   '<input id=bTrans type=checkbox checked text=grammar/>Trans ',
									   '<input id=bArabic2 type=checkbox text=grammar/>Arabic2 ',
									   '<input id=bBuck type=checkbox zchecked text=grammar/>Buck ',
									   '<input id=bWord2Word type=checkbox zchecked text=Word2Word />Word2Word ',
									   '<input id=bTajweed type=checkbox />Tajweed ',
									  '</span>',
								   '</span>',
*/


			var mainform = [
								'<div id=mainform class=notice>',
									'<span>Search:</span> <input id=search class="keyboardInput" type=textfield width=8 value="Enter keyword"  />', space3, 
									'<span id=status>&nbsp;</span>', space,
									'<span>Reference #:</span> <input id=ref type=textfield width=8 value="ex: 1:6"  />', space2,
									'<span>Line #:</span> <input id=lineno type=textfield width=8 value="ex: 290, 2051"  />', space2,
									'<span id=surainfo style="float: right" class="success">&nbsp;</span>', space2,
								'</div>',
								'<div class=clear>&nbsp;</div>'
							];
						
						
			$('#textfield1, #textfield2, #textfield3, #textfield4, #trans, #grammar').change( onChangeRef ); 
			//$('#search').change( onSearch ); 
			//$('#search').focus( function(){ if($('#search').val() == EMPTYTEXT ) $('#search').select();  } ); 
			//$('#search').blur( function(){ if($('#search').val() == '' ) $('#search').val(EMPTYTEXT);  } ); 

			//			$('#search').fadehints( [ "1:1", "mrym", "covenant", "????" ], 3000 );
//			$('#ref').fadehints( [ "1:7", "17:24" ], 3000 );



var search1 = function(word, regexp){ var count=0, hits=[], tbl='';
  for (var i = 0; i < qBareArr.length; i++) {
    if (oMatch = qBareArr[i].match(regexp)) { ++count; lineno=i;
      var position = oMatch[0].indexOf( word ); var wordsArr = oMatch[0].split(' ');
      for(n=1; n<=wordsArr.length; ++n){ position = -1; //within the sentence, which word is exact match??
        if(wordsArr[n-1] && wordsArr[n-1].indexOf( word ) != -1 ){
        position = n; break;
      }
      }ref = mapLinenoToRef(i); ref = (position == -1 ? ref : (ref+':'+position)); hits.push( ref );
      var qObj = suraInfo(mapRefToSurano(mapLinenoToRef(i))), surainfo = (!qObj)? '' : (qObj[4] + ' ' + qObj[5]);
      tbl += '<TR><TD>' + decorateAya(ref, 'GoRef(this)') + '<BR/>' + surainfo + '</TD>' +
           '<TD>'+ '<span class="arabic big">' + EnToAr( onGetBuck(i) ) + '</span><br/>' +
           '<span class="label">T</span><span class=trans>' + onGetTrans(i) + '</span><br/>' +
          // '<span class="label">B</span><span class=bare>'+qBareArr[i] + '</span><br/>' +
           '</TD></TR>\n';
    }
  }return tbl; //hits;
}