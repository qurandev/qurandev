		var DEV = false;
		var _bON_ERROR_DEBUG = false;
		var _bMAPPER_DEBUG = true;
		var _bYAMLI_ENABLED = false;
		var _bPROFILE_ALL = false;
		var _bPROFILE_SEARCH = false;
		var _bPROFILE_SETTINGS = false;
		var _nMAX_SEARCH_RESULTS_IN_PAGE = 5;
		var qBare = null, qBuck = null, qTrans = null, qTransLit = null, qGrammar = null, qArabic3 = null;
		var qBareArr = null, qBuckArr = null, qTransArr = null, qTransLitArr = null, qGrammarArr = null, qArabic3Arr = null;
		var _MAX = 50;
		var _nHIGHLIGHT_TIMEOUT = 2000; //2 seconds delay
		var WAIT = '<img src=static/ajax-loader.gif  />';
		var NULL = 'undefined';
		var WORD2WORD_PATTERN_START = '<table width="100%" cellspacing="0" cellpadding="0" border="0" class="aya-W last"><tbody><tr>';
		var WORD2WORD_PATTERN_TD = '<td width="$3" align="$9" class="ww"><div onclick="pl($4)" style="width:$2px"><span class="a">$0</span><span class="e">$1</span></div></td>';
		var WORD2WORD_PATTERN_END = '</tr></tbody></table>';
		var _sUI_SEARCH_PLACEHOLDER = '';

		var searchSelect = function(){ $('#search').select(); }
		var searchSet = function( newval ){
			$('#search').val( newval ); 
			if(newval != _sUI_SEARCH_PLACEHOLDER) onKey(); //update the keyb suggest in arabic. and make the check for direction.
		}
		var searchGet = function( ){
			return $('#search').val();
		}
		var searchGo = function(){
			$('#Go').click();
		}
		
		var refGet = function(){
			return $('#ref').val();
		}
		var refSet = function( newval ){
			$('#ref').val(newval);
		}
		
		var onKey = function(e){
			check(e);
			var word = searchGet(), arabic;
			if(word == '') $('#suggest').html('').hide();
			if(!word || isRef(word) || isArabic(word) || word == 'Search...') return;
			if( !(arabic = EnToAr(word) ) ) return;
			var status = '<span class=biggerArabic>' + arabic + '</span>';
			$('#suggest').html( status ).show();
			$('#suggest').width(   $('#suggest span').width()   );
		}


		
		var onSearch = function(){ var ref=-1, results;
			try{
				if(qBuck == null || !qBuck){ var msg='Error: Data still being loaded. Please retry after a little while.'; $('#status').html(msg); return; }
				if(qBare == null)		qBare = BuckToBare(qBuck);
				if(qBareArr == null)	qBareArr = qBare.split(/\r?\n/);
				var word = searchGet(); if(!word || !word.trim() ){ searchSet(_sUI_SEARCH_PLACEHOLDER); return;} //dont search on empty strings
				if(word == _sUI_SEARCH_PLACEHOLDER){ searchSet(''); return};
				if( isRef( word ) ){ //this input is a verse reference probably. change the ref value and return
					refSet( word ); 
					onChangeRef(); return;
				}else{
					UI_block_search();
					var searchwords; 
					if(word && word.indexOf(';') != -1) searchwords = word.split(';'); else searchwords = [ word ];
					for(key in searchwords){ word = searchwords[key]; if(searchwords.length>1) word=word.trim();
						if(word) results = onSearchNew( word );
					}
					UI_delay_doSearchHighlight(ref, word, results);
					UI_unblock_search(results);
				}
			}catch(err){ var errMsg = handleError(err, 'searching in arabic, translation failed'); $('#status').html( errMsg ); }
		}
		
		var onSearchNew = function(_keyword){ var results = {}, title='', COST = profile('START',0,true), arrMode=false, engMode=false, transMode=false;
		  var keyword1, keyword2, keyword3, keyword4, keyword5,  word=_keyword;
		  if(typeof(_keyword) == NULL){_log('no search keyword. error.'); return;}
  		  arrMode = isArabic(word); //check if keyword in arabic
		  engMode = isEnglish(word); //check if keyword in english (bare)
		  if(arrMode){ 	keyword2 = ArToEn(word); /*Buck*/ }
		  else if(engMode){keyword2 = word; }
		  keyword1 = BuckToBare( keyword2 ); /*Bare*/
		  keyword3 = _keyword; /*For Translation*/
		  keyword4 = EnToAr(keyword2); keyword5 = EnToAr(keyword1); //arabic of Buck & Bare, respectively.
		  results.SEARCHWORD = _keyword; results.completed = false;
		  if(!arrMode && !engMode) transMode=true;

		  if(arrMode || engMode){ transMode = true;
			title='arabic';
			regexp = new RegExp(".*(?:" + escapeForRegex(word=keyword1) + ").*", "g");
			results[title] = search2(word, regexp, qBare); COST=profile(title,0,true); results[title+'COST'] = COST;
			UI_displaySearchHits(title, word, results, COST);
		  }

		  if(transMode && _keyword.length < 3) transMode=false;
		  if(transMode){
			title='translation';
			regexp = new RegExp(".*(?:" + escapeForRegex(word=keyword3) + ").*", "gi");
			results[title] = searchTrans(word, regexp); COST=profile(title,0,true); results[title+'COST'] = COST;
			UI_displaySearchHits(title, word, results,COST);
		  }
		  
		  if(arrMode || engMode){
			title = 'arabicBuckTranslit';
			regexp = new RegExp(".*(?:" + escapeForRegex(word=keyword2) + ").*", "g");
			results[title] = search2(word, regexp, qBuck); COST=profile(title,0,true); results[title+'COST'] = COST;
			UI_displaySearchHits(title, word, results, COST);
		  }

		  if(transMode){
			title='transliteration';
			regexp = new RegExp(".*(?:" + escapeForRegex(word=keyword3) + ").*", "gi");
			results[title] = searchTransLit(word, regexp); COST=profile(title,0,true); results[title+'COST'] = COST;
			UI_displaySearchHits(title, word, results,COST);
		  }

		  if(_keyword.indexOf(' ')!=-1){ //has spaces
			if(!results.keywords) results.keywords={};
			var individualWords = _keyword.split(' '), tmp;
			for(key in individualWords){
				if( tmp = individualWords[key]){ tmp = tmp.trim();
					results.keywords[tmp] = 1; var buck, bare;
					if(arrMode) buck=ArToEn(tmp);
					else if(engMode) buck=tmp;
					if(buck){ results.keywords[ EnToAr(buck) ] = results.keywords[ bare = BuckToBare(buck) ] = results.keywords[ ArToEn(bare) ] = 1; }
				}
			}
		  }
		  results.completed = true;
		  if(!results.keywords) results.keywords = {};
		  results.keywords[keyword1] = results.keywords[keyword2] = results.keywords[keyword3] = results.keywords[keyword4] = results.keywords[keyword5] = 1;
		  if(_bPROFILE_SEARCH) _log(results);
		  return results;
		}



		var qBare2, qBuck2, RESET=false;
		var search2 = function(word, regexp, DATA){ var results;
		  if(qBare == null)		qBare = BuckToBare(qBuck);
		  if(qBareArr == null)	qBareArr = qBare.split(/\r?\n/);
		  if(!qBare2 || RESET){ qBare2 = _prefixData( qBare ); RESET=false;}
		  if(!qBuck2 || RESET){ qBuck2 = _prefixData( qBuck ); RESET=false;}
		  if(DATA == qBuck) results = qBuck2.match(regexp);
		  else if(DATA == qBare) results = qBare2.match(regexp);
		  if(!results){if(_bPROFILE_SEARCH) _log('no hits');}else{ if(_bPROFILE_SEARCH) _log(results.length + ' hits');}
		  return results;
		}


		var searchTrans = function(word, regexp){ var results;
		  if(!qTrans){ debugger;}
		  results = qTrans.match(regexp);
		  if(!results){if(_bPROFILE_SEARCH) _log('no hits'); }else{ if(_bPROFILE_SEARCH) _log(results.length + ' hits') };
		  return results;
		}
		
		var searchTransLit = function(word, regexp){ var results;
		  if(!qTransLit){ debugger; return;}
		  results = qTransLit.match(regexp);
		  if(!results){if(_bPROFILE_SEARCH) _log('no hits');}else{ if(_bPROFILE_SEARCH) _log(results.length + ' hits') };
		  return results;
		}

		var	UI_delay_doSearchHighlight = function(ref, SEARCHTOKEN, RESULTS){
			setTimeout( function(){ 
							doSearchHighlight( ref, SEARCHTOKEN, RESULTS);
						}, _nHIGHLIGHT_TIMEOUT);
		}
		
		var doSearchHighlight = function(ref, SEARCHTOKEN, RESULTS){ profile('');
			if(ref == -1 && SEARCHTOKEN == "") return;
			var keywords, obj;
			if(typeof(RESULTS) == NULL || !RESULTS) keywords = stat.keywords;
			else keywords = RESULTS.keywords;
			if(!keywords) keywords = { }			
			if(typeof(SEARCHTOKEN) != NULL && SEARCHTOKEN && !isRef(SEARCHTOKEN) ){
				if(SEARCHTOKEN.length >= 3) keywords[ SEARCHTOKEN ] = 1;
			}
			if(keywords){
				obj = $('body');
				obj.removeHighlight();
				for(key in keywords)
					if(key) obj.highlight( key );
			}
			stat.keywords = keywords;
			if(_bPROFILE_ALL || _bPROFILE_SEARCH)
				_log(profile('doSearchHighlight: ') + keywords + ' ' + ref + ' '+ SEARCHTOKEN +' '+ '; All: ' + $('.highlight').length + '; n: '+ $('.highlight > .highlight').length + '; '+ $('.highlight > .highlight > .highlight').length + '; '+ $('.highlight > .highlight > .highlight > .highlight').length + '; '+ $('.highlight > .highlight > .highlight > .highlight > .highlight').length );
			if( $('.highlight > .highlight').length > 0) debugger; //This is an error condition; shouldnt hilite 2x.
		}

		var GoRef = function(obj){
			var ref = $(obj).text();
			refSet(ref); onChangeRef();
		}

		
		
		var onChangeRef = function(){
			var ref = refGet();
			if(!ref) return;
			var lineno = mapRefToLineno(ref);
			var surano = mapRefToSurano(ref);
			if(ref != -1 && lineno != -1){
				try{
					ref = mapRefToRef(ref, ':');
					var qObj = suraInfo(surano);
					if(qObj){var text = '<span class=big>' + qObj[4] + '</span>'  +' - '+ qObj[5] +' - '+ qObj[6] +' - '+ qObj[7] +' - '+ qObj[1];// +' - '+ qObj[2] +' - '+ qObj[3];
						$('#surainfo').html(text);
					}
					$('#status').html('');
					var trans, arrline='';
					lineno = parseInt(lineno);
					if(qBuck == null)
						{onBuckInit(); return;} //var arr = qBuck.split('\n');
					var line = onGetBuck(lineno) /*arr[ lineno ]*/, trans, grammar, ref;
					
					$('#textArabic').html( hotlinkify(arrline = EnToAr(line) ) ); //arabic
					$('#textBuck').html( hotlinkify( escape(line) ) ); //buck
					$('#textBare').html( hotlinkify( BuckToBare(line) ) ); //bare
					$('#textArabic2').html( hotlinkify( EnToAr( BuckToBare(line) ) ) ); //arabic no tashkeel
					$('#trans').html( trans = (onGetTrans(lineno) +'<BR/>'+ '<span class=small><span class=label title=Transliteration>Translit: </span>'+onGetTransLit(lineno) +'</span>') );
					$('#verse').slideDown('slow');		
					$('#verse > .ayahBoxHeader > a').html( ref );
					$('#verse > .ayahBoxHeader > a').attr('href', '#');
					$('#quranPlayer').html(getQuranPlayer(ref))
					processGrammar(ref);
					processWordToWord(surano);
					processArabic3(lineno);
					UI_delay_doSearchHighlight(); 
				}catch(err){ var msg = handleError(err, 'changing reference failed.'); 	
					$('#status').html(msg).slideDown('slow');		
				}
			}else{ 
				if(lineno == -1){ //ref & lineno both -1
					var msg = '<br><span class=error>Invalid Sura/Verse reference specified. Please reenter. Ex: 2:255, 55, 68:3:2 etc.</span>'; 	
					$('#status').html(msg).slideDown('slow');}
			}
		}
		
		
		var onGetArabic = function(lineno){
			var buck = onGetBuck(lineno);
			return EnToAr(buck);
		}
		var onGetBuck = function(lineno){
			if(qBuck == null){ return window.status = 'Warning: Buck still not loaded'; return;}
			if(qBuckArr == null) qBuckArr = qBuck.split(/\r?\n/);
			return qBuckArr[lineno];
		}
		
		var onGetTrans = function(lineno){
			if(qTrans == null){
				return window.status = 'Warning: trans still not loaded'; return;}
			if(qTransArr == null)
				qTransArr = qTrans.split(/\r?\n/);
			return qTransArr[lineno];
		}		
		var onGetTransLit = function(lineno){ var response = '';
			if(qTransLit == null){
				return window.status = 'Warning: transliteration still not loaded'; return;}
			if(qTransLitArr == null)
				qTransLitArr = qTransLit.split(/\r?\n/); //ideally we dont want this html-stripped version.
			response = qTransLitArr[lineno];
			return response;
		}

		var processArabic3 = function(lineno){ 
			if(typeof(lineno)==NULL || !lineno) lineno = mapRefToLineno( refGet() );
			if(!lineno || lineno == -1) return; var response = '';
			if(!qArabic3Arr){
				fnUI_paint( '#textArabic3', WAIT );
				onArabic3Init(); return;
			}
			response = qArabic3Arr[lineno];
			fnUI_paint( '#textArabic3', hotlinkify(response) );
			return response;
		}

		var oArabic3; //IndoPakScript;
		var onArabic3Init = function(lineno){var dataType, dontcache=true, bM = stat.display.mode.m;
			$('#textArabic3').toggle( bM ); 
			var key = "ARABIC3", url = 'data/NOOREHIDAYAT.ar.quran-indopak.txt';
			var success= function(data, textStatus, jqXHR){	
					qArabic3 = /*_prefixData*/(data);
					qArabic3Arr = qArabic3.split(/\r?\n/); data=null; delete data; 
					processArabic3(lineno); },
				error= function(jqXHR, textStatus, errorThrown){ debugger; };
			if(bM && !qArabic3Arr)
				oArabic3 = getData(key, url, success, error, dataType, dontcache);
		}
		
		var fnUI_paint = function(selector, content){
			$(selector).html( content );
		}
		
		var processGrammar = function(ref){ var grammar, pattern, arr;//in format 2:255
			var bG = stat.display.mode.g;
			$('#grammar').toggle( bG );	if( !bG ) return;
			if(!ref) ref = refGet(); if(!ref || !isRef(ref) ) return;
			if(!qGrammar){
				$('#grammar').html(WAIT);
				onGrammarInit();window.status = 'Warning: Grammar still not loaded'; return;
			}
			try{ // /\(1:6.*\).*/g;
				pattern = new RegExp( "\\(" + mapRefToRef(ref) + ":.*\\).*(?:\r?\n)", "mg");
				arr = qGrammar.match( pattern );
				if(arr){grammar = arr.length +' parts\n'+ arr.join('');				}
				else{ grammar = '-no matches found in grammar for ref ' + ref +' -';
				$('#grammar').html( grammar ); grammar = null; delete grammar;}
			}catch(err){ var errMsg = handleError(err, 'get Grammar failed'); $('#grammar').html( errMsg ); }

			try{
				if( grammar != null ){ 
					var arrline = $('#textArabic').text();
					var text='<span class=A>', decoded = processGrammarLine(ref); //this is semicolon separated data
					var arrlineArray = arrline.split(' '), grammarArray = decoded.RESP.split(';'), rootArray = EnToAr(decoded.ROOT).split(';');
					for(n=0; n<arrlineArray.length; ++n){
					   text += '<span class="' + grammarArray[n] +'" title="' + fnMapWordToRoots(rootArray[n]) + '" >' + arrlineArray[n] + '</span> ';
					}text += '</span>';
					$('#grammar').html( text + '<div dir=ltr>'+ decoded.RESP +'<BR><span class=E>'+  (decoded.ROOT) +'</span><BR>' + '<a href=javascript:void() onclick="$(this).next(\'span\').toggle();">Details</a>&nbsp;&nbsp;<span style="display: none;" class=grmr>'+ br(escape(grammar)) +'</span></div>' ); //else dont change any text
				}
			}catch(err){ var errMsg = handleError(err, 'process Grammar failed2'); $('#grammar').html( errMsg ); }
			return grammar;
		}

		var onGrammarInit = function(){ 
			var key="GRAMMAR", url = 'data/quranic-corpus-morphology-0.4.txt';
			if(oGrammar == null)
			oGrammar = $.ajax({ url: url,
				success: function(data, textStatus, jqXHR){	qGrammar = data; data = null; processGrammar(); },
				error: function(jqXHR, textStatus, errorThrown){ var errMsg = handleError(errorThrown, 'get Grammar failed'); $('#grammar').html( errMsg ); debugger; }
			});
			//var	success= function(data, textStatus, jqXHR){	qGrammar = data; data = null; onChangeRef(); },
			//	error= function(jqXHR, textStatus, errorThrown){ debugger; };
			//if(oGrammar == null)
			//	oGrammar = getData(key, url, success, error);
		}
		
		var oBuck, oTrans, oGrammar;
		$('document').ready(function(){
			initializeUI();			
			onBuckInit();
			onTransInit();
			onGrammarInit();
			processWordToWord();
			//if(document && document.lastModified) $('#status').html( '<small>'+'Site last updated: <b>' + document.lastModified +'</b></small>' );
			_sUI_SEARCH_PLACEHOLDER = searchGet();
			$('#suggest').hide();
			$('#suggest').click( function(){ var suggestion = $('#suggest').text(); searchSet(suggestion); searchGo(); } );
		});
		
		function getRefLocation(){ var location = {};
			var ref = refGet();
			var lineno = mapRefToLineno(ref); var surano = mapRefToSurano(ref); var versno = mapRefToVersno(ref);
			location.ref = ref; location.lineno = lineno; location.surano = surano; location.versno = versno; 
			return location;
		}
		function setRefLocation(location){
			if(!location || !location.ref) return;
			refSet( location.ref ); onChangeRef();
		}
		function left(){ var loc = getRefLocation(); --loc.lineno; 
			loc.ref = mapLinenoToRef(loc.lineno); setRefLocation(loc);
		}
		function right(){var loc = getRefLocation(); ++loc.lineno; 
			loc.ref = mapLinenoToRef(loc.lineno); setRefLocation(loc);
		}
		function up(){var loc = getRefLocation(); ++loc.surano; 
			loc.ref=loc.surano + ':1';  setRefLocation(loc);
		}
		function down(){var loc = getRefLocation(); --loc.surano; 
			loc.ref=loc.surano + ':1';  setRefLocation(loc);
		}
		function onRefKeyDown(e, id){
			var ref = refGet();
			var lineno = mapRefToLineno(ref);
			var surano = mapRefToSurano(ref);
			var versno = mapRefToVersno(ref);
			if(e.keyCode == 13){			window.status = "Enter hit";  //if(id == 'edit')	$('#btn').click(); 
			}
			else
			if( parseInt( refGet().replace(/,/g,"") ) )
				if(!e.ctrlKey && !e.shiftKey)
					return;
			if(e.ctrlKey){
				if(e.keyCode == 37) left(); //prev(); //ctrl left
				else if(e.keyCode == 39) right(); //next(); //ctrl right
				else if(e.keyCode == 38){ up(); //nextsura(); //ctrl up 
				}
				else if(e.keyCode == 40){  down(); //prevsura(); //ctrl down
				}
			}
			else
			if(e.shiftKey){
				if(e.keyCode == 37) rrev(); //shift left
				else if(e.keyCode == 39) ffwd(); //shift right				
				else if(e.keyCode == 38) jumpToBeginOrEnd(false); //shift up
				else if(e.keyCode == 40) jumpToBeginOrEnd(true); //shift down		
			}else window.status = e.keyCode;
	}

	
	var n_GRAMMAR_MAX_WORDS_INFO = 250;

	var processGrammarLine = function(REF){ REF = mapRefToRef(REF); //i.e. if its sura 6, make it 6:1
		if(!REF)return; var RESP='', results={}, ROOT='';
		var pattern4 = new RegExp("(?:ROOT\:)([^\|\n]*)");
		var pattern3 = new RegExp("[ ]ADJ|PRON|PN|V|N|P[ ]");; //("[ ][ADJ|CONJ|DEM|DET|EXP|INTG|LOC|NEG|PRON|PN|REL|REM|RES|V|N|P][ ]");
		var pattern2 = new RegExp( "(NOM|GEN|ACC)$", "mg"); //pluck out raff/jarr/nasb info
		for(i=1; i < n_GRAMMAR_MAX_WORDS_INFO; ++i){ ref = REF +':'+ i; if(i==n_GRAMMAR_MAX_WORDS_INFO-1) debugger;
		  pattern = new RegExp( "\\(" + ref + ":.*\\).*(?:\r?\n)", "mg"); //Get all the grammar info for ONE word, at a time.
		  var arr = qGrammar.match( pattern ), arr2, arr3;
		  if(!arr) break;
		  var grammar = arr.join('');
		  arr = grammar.match( pattern2 );
		  arr2 = grammar.match( pattern3 );
		  arr3 = grammar.match( pattern4 );
		  if(!arr && !arr2 && !arr3){ RESP += '; '; ROOT += '; '; }
		  else{
			if(arr)RESP += arr.join(' ');
			if(arr2)RESP += ' ' +arr2.join(' '); RESP += '; ';
			if(arr3) ROOT += arr3[1] /*.join(' ')*/; ROOT += '; ';
		  }
		} RESP+='';
		results['RESP']=RESP; results['ROOT']=ROOT;
		return results;
	}
	
	var oWord2Word;
	var onWordToWordInit = function(surano){ 
		var key="W2W_"+surano, url = 'data/js/ayas-s' + surano + 'd15q1.js', dataType='json', dontcache=true;
		var	success= function(data, textStatus, jqXHR){
			processWordToWord(surano, data); $('#placeholder').data(''+surano, data);
		},
		error= function(jqXHR, textStatus, errorThrown){ 
			var status = textStatus + ' - '+ jqXHR.status +' - '+ jqXHR.statusText +' -- '+ errorThrown; 
			if(jqXHR.status == 404) status = 'Data not available offline. Sorry. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Details: ' + status; 
			status = '<span class="normal">' + status + '</span>'; 
			fnUI_paint('#word2word', status); fnUI_paint('#tajweed', status);
			if(_bON_ERROR_DEBUG)debugger; 
		};oWord2Word = $.ajax({ url: url, dataType: dataType, success: success, error: error });
		//oWord2Word = getData(key, url, success, error, dataType, dontcache);
		return;
	}
	
	var processWordToWord = function(Zsurano, _DATA){ var surano, versno;
		var response = '', response2 = '', bW=true, bT = true;
		var ref = refGet(); if(!surano) surano = mapRefToSurano(ref); if(!versno) versno = mapRefToVersno(ref); if(surano == -1) return;
		$('#word2word').toggle( bW = stat.display.mode.w ); 
		$('#tajweed').toggle( bT = stat.display.mode.t ); 
		if( !bW && !bT ) return;
		if(bW) $('#word2word').html( WAIT );
		if(bT) $('#tajweed').html( WAIT );
		if(!_DATA){ _DATA = $('#placeholder').data(''+surano);
		}
		if(!_DATA){
			onWordToWordInit(surano); return;			
		}//i.e. if !DATA		

		try{ var PLAIN=true;
			for(i=0; i<_DATA.length; ++i){
				if(versno != (i+1) ) continue;
				for(k=0; k<_DATA[i]["w"].length; ++k){var line = WORD2WORD_PATTERN_START, line2='';
					for(j=0; j<_DATA[i]["w"][k].length; ++j){ 
						var d0, d1, d2, d3, d4; d0 = _DATA[i]["w"][k][j][0]; d1 = _DATA[i]["w"][k][j][1]; d2 = _DATA[i]["w"][k][j][2];
						d3 = _DATA[i]["w"][k][j][3]; d4 = _DATA[i]["w"][k][j][4];
						line += WORD2WORD_PATTERN_TD.replace(/\$0/, d0).replace(/\$1/, d1).replace(/\$2/, d2).replace(/\$3/, d3).replace(/\$4/, d4).replace(/\$9/, j!=0?'center':'right');
						var width1, width2; //width1 = _DATA[i]["w"][k][j][2]; width2 = _DATA[i]["w"][k][j][3]; 
						line2 += ( '<span class=wordpair style="width: ' + width2 + ';"><span class="a2 bigger">' + _DATA[i]["w"][k][j][0] + '</span><span class=e2>&lrm;' + _DATA[i]["w"][k][j][1] ) + '&lrm;</span></span>';
					}line += WORD2WORD_PATTERN_END; 
					response += ( PLAIN ? line2 : line1 ) + '<br/>\n'; 
				}
				//assert( _DATA[i]["t"].length == 1);
				var data = _DATA[i]["t"];
				var parsedTajweedData = parse_tajweed(data);
				response2 = '<span class=tjwd-hideAnnotations><!--\n' + data +'\n-->'+ parsedTajweedData + 
							'<BR><span class=small><b>KEY: </b><span class=ikhf>Ikhfa</span>&nbsp;&nbsp; <span class=idgh_ghn>Idhgam</span>&nbsp;&nbsp;  \
						<span class=ghn>Ghunna</span>&nbsp;&nbsp;  \
						<span class=iqlb>Iqlab</span>&nbsp;&nbsp;  \
						<span class=qlq>Qalqala</span>&nbsp;&nbsp;  \
						<span class=madda_permissible>Madda</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>  ' + '<a href=javascript:void() onclick="$(this).parent(\'span\').toggleClass(\'tjwd\');" dir=ltr class="normal ltr">Details</a>' +
							'</span>'; 
				//activate_tooltips(/*'.aya-T*/ 'span[title]'); 
				break;
			}
		}catch(err){ handleError(err, 'Error in word2word processing'); }
		if(bW) if( $('#word2word' ).length == 0){
			response = '<div id=word2word class="error word2word" >' + response + '</div>';
			$('#verse').append(response);
		}else $('#word2word').html( response );		//$('#content1').val( response );
		if(bT) if( $('#tajweed' ).length == 0){
			response2 = '<div id=tajweed class="tajweed info" >' + response2 + '</div>';
			$('#verse').append(response2);
		}else $('#tajweed').html( response2 );
		return response;
	}

		
		
		
		
		var EMPTYTEXT = '-Enter keyword-';
		var initializeUI = function(){
			var placeholder = $('#placeholder');
			var space   = ('<span style="margin-left: 30px;">&nbsp;</span>');
			var space2   = ('<span style="margin-left: 15px;">&nbsp;</span>');
			var space3   = ('<span style="margin-left: 5px;">&nbsp;</span>');
			var fields = [
							   '<div id=verse class=info success>',
								   '&nbsp;<span class=label onclick=left();>&lArr;</span>&nbsp;', 
								   '&nbsp;<span class=label onclick=right();>&rArr;</span>&nbsp;', //'&nbsp;&nbsp;&nbsp;&nbsp;',
								   decorateAyaLarge(''), 
								   '&nbsp;&nbsp;&nbsp;&nbsp;', 
								   '<span id=surainfo style="Zfloat: right" class="clear success Zmobile_hidden">&nbsp;</span>',
								   '&nbsp;<span class=label onclick=up();>&uArr;</span>&nbsp;', 
								   '&nbsp;<span class=label onclick=down();>&dArr;</span>&nbsp;',
//								   '<div class="aSpinnerHoriz"></div>', //'<div class="aSpinner"></div>',
								   '<span style="float: right" id="close1"><a href="javascript:void()" onClick="$(\'#verse\').slideUp();"><img style="width: 25px; height: 25px" src=static/images/close_btn.png /></a></span>',
								   '<span style="float: right" id="quranPlayer"></span>',
								   

 								   '<div id=textArabic class="rtl bigger clear"></div>',
								   '<div id=textArabic3 class="rtl bigger noorfont clear"></div>',
								   '<div id=textArabic2 style="display: none;" class="rtl bigger clear"></div>',
								   
								   
								   '<span class=label title=Translation>Trans:</span><span id=trans class="trans big" /><BR>',
								   '<span class=label title="Bare transliteration">Bare:</span><span id=textBare class=small /><BR>',
								   '<span class=label title="Buck transliteration">Buck:</span><span id=textBuck class=small /><BR>',

								   
								   '<div id=word2word class="success word2word" ><span class=label>word2word:</span></div>',
								   '<div id=tajweed   class="success tajweed" ><span class=label>Tajweed:</span></div>',
								   '<div id=grammar   class="notice grammar rtl" ><span class=label>Grammar:</span></div>',
								   
							   '</div>', '<div class=clear>&nbsp;</div>',
						 ];
			$(fields.join(' ') ).insertBefore(placeholder);
			UI_initSettings();
			UI_initBookmarks();
			$('#verse').hide();

			//$('#search').change( onChange ); $('#search').focus( onFocus ); $('#search').blur( onBlur );			
			$('#search').keyup( onKey );
			$("input[placeholder], textarea[placeholder]").enablePlaceholder();
			$('#Go').click( onSearch );
			$('#ref').change( onChangeRef );
			$('#ref').focus( function(){ this.select() } ); 
			
			//$('#bGrammar').click( onGrammarInit );
			$('#bBuck').click( onBuckInit );
			$('#content').scroll( function(){//$('#header').append('scroll. ');
			});			
			$('#debug').hide();
			$('#options').click( function(){ $('#optionsinner').toggle();
			});
			initVKB();
			
			$('#ref').unbind('keydown');
			$('#ref').keydown( function(e){ onRefKeyDown(e, this.id);	});
			$('#search').select();
			$('#search').focus(); 
			
			UI_initLiveQueries();
			UI_initIphone();
		}

		var initVKB = function(){ //refer to http://www.greywyvern.com/code/javascript/keyboard
			this.VKI_kt = '\u0627\u0644\u0639\u0631\u0628\u064a\u0629'; //"العربية"; this.VKI_deadkeysOn = false; 	//this.VKI_numberPadOn = true;
			this.VKI_showVersion = false; //this.VKI_imageURI = ''; //
			this.VKI_imageURI = 'static/js/VKB/keyboard2.gif'; //keyboard.png'; //this.VKI_clickless = 1000; //delay of 1 sec, on mouseover
			this.VKI_size = 5; //9px, 11px (default), 13px, 16px and 20px; corresponding to the sizes 1 to 5 respectively. 
			this.VKI_sizeAdj = false; //To disable the appearance of this dropdown control, set the value of this.VKI_sizeAdj to false. 
			//this.VKI_langAdapt = 'ar'; $('#search').addClass('keyboardInput'); $('#search').attr('lang', 'ar'); VKI_attach( $('#search') );
			/*setTimeout( function(){
							$('.keyboardInputInitiator').click( function(){ $('#search').addClass('arabic'); });
							}, 5000); */
		}
		
		var onBuckInit = function(){ var bM = stat.display.mode.m;
			$('#textBuck').toggle( bM ); 
			$('#textBuck').prev('span.label').toggle( bM ); $('#textBuck').next('br').toggle( bM );
			$('#textArabic2').toggle( bM && DEV ); //actually bArabic2
			$('#textArabic2').prev('span.label').toggle( bM && DEV); $('#textArabic2').next('br').toggle( bM && DEV);
			$('#textArabic3').toggle( bM );
			///Always initialized///if( !bM )	return;
			var key="BUCK", url = 'data/qBuck.txt';
			var success = function(data, textStatus, jqXHR){	qBuck = data; data = null; }
			var error = function(jqXHR, textStatus, errorThrown){ debugger; }			
			if(oBuck == null)
				oBuck = getData(key, url, success, error);
			if(bM) processArabic3();
		}

		var onArabic2Init = function(){ var bM = stat.display.mode.m;
			$('#textArabic2').toggle( bM ); //actually bArabic2
			$('#textArabic2').prev('span.label').toggle( bM ); $('#textArabic2').next('br').toggle( bM );
		}

		var onTransInit = function(){ var bE = false; //bA = false,  
			bE = stat.display.mode.e; //bA = stat.display.mode.a; 
			$('#trans').toggle( bE ); $('#trans').prev('span.label').toggle( bE );
			if( !bE ) return;
			var key="TRANS", url = 'data/TANZIL.en.sahih.txt', url2 = 'data/TANZIL.en.transliteration.txt', url3 = 'data/TANZIL.ur.maududi.txt';
			var success= function(data, textStatus, jqXHR){	qTrans = data; data = null; qTransArr = qTrans.split(/\r?\n/); },
				error= function(jqXHR, textStatus, errorThrown){ debugger; };
			if(oTrans == null)
				oTrans = getData(key, url, success, error);
			onTranslitInit();
		}
		
		var oTransLit;
		var onTranslitInit = function(){var dataType, dontcache=true;
			var key = "TRANSLIT", url = 'data/TANZIL.en.transliteration.txt';
			var success= function(data, textStatus, jqXHR){	
					qTransLit = $('<div />').html( data ).text(); //strip out html tags from the transliteration
					qTransLitArr = data.split(/\r?\n/); data=null; delete data; }, //temporarily we overwrite the trans data
				error= function(jqXHR, textStatus, errorThrown){ debugger; };
			if(!oTransLit)
				oTransLit = getData(key, url, success, error, dataType, dontcache);
		}
				

//var _bYAMLI_ENABLED = false;
var toggleYamli = function(){ _bYAMLI_ENABLED = !_bYAMLI_ENABLED;
	var id='search'; 
	if(_bYAMLI_ENABLED) {Yamli.yamlify(id, {settingsPlacement: "bottomLeft"}); $('#'+id).focus().select(); } 
	else {  Yamli.deyamlify(id);}
}

var decorateAyaLarge = function(ref, onclick){ ref= mapRefToRef(ref);
	return '<span class="ayahBoxHeader"><a href="#" class="ayahBoxNumLarge" onclick=' + onclick+'>'+ref+'</a></span>';
}
var decorateAyaSmall = function(ref, onclick){ ref=mapRefToRef(ref);
	return '<span class="ayahBoxHeader"><a href="#" class="ayahBoxNumSmall" onclick=' + onclick+'>'+ref+'</a></span>';
}
var decorateAya = function(ref, onclick){ ref=mapRefToRef(ref);
	return '<div class="ayahBoxHeader"><a href="#" class="ayahBoxNum" onclick=' + onclick+'>'+ref+'</a></div>';
										//' <div class="ayahBoxHeaderLinks">',
									//'	<a href="#0" class="action_toTop"><span></span>to top</a>',
									//' </div>',
}



	var UI_PAGER_TEMPLATE = '<span id=$title_prev class=label><b>&lArr;</b></span>&nbsp;<span id=$title_next class=label><b>&rArr;</b></span> ';

var UI_displaySearchHits = function(title, word, results, rawCOST /*hits*/){ var COST, MAX; COST = profile('UIstart');
	if(!results) return;
	if(typeof(rawCOST)!=NULL && parseInt(rawCOST) ) rawCOST = parseInt(rawCOST); else rawCOST=0;
	if(typeof(results.completed)==NULL || !results.completed) UI_displayStatus(title, word, results, COST, MAX); //only the first time
	var SEARCHWORD=results.SEARCHWORD, hits, index, endindex=-1; hits = results[title]; index = results['index']; if(!index) index = results.index = 0;
	if(!hits) return; if(!MAX) MAX=_nMAX_SEARCH_RESULTS_IN_PAGE;
	endindex = index + MAX; if(endindex > hits.length) endindex=hits.length;
	if(hits.length == 0){ $('#'+fnUI_MAP_DIV( SEARCHWORD+title )).remove(); return; }
	var div='', divtitle, divOuter = '<div class=zsuccess id="' + fnUI_MAP_DIV(SEARCHWORD+title) + '">';
	var UI_PAGER = UI_PAGER_TEMPLATE.replace(/\$title/g, fnUI_MAP_DIV( SEARCHWORD+title ));
	if(index > hits.length || index < 0 || endindex > hits.length || endindex < 0){ 
		index=0; endindex= ((hits.length < MAX)?hits.length : MAX); if(_bON_ERROR_DEBUG) debugger; 
	}
	if(MAX && hits.length > MAX) div = UI_PAGER + 'Displaying ' + (1+index) +'-'+ (endindex) + ' of ' + '<b><span class=label>' + hits.length + '</span> hits' + div;
	else{ index=0; endindex = hits.length; }
	div+= '<table>'; for(var k=index; k<endindex; ++k){
		div += UI_formatSearchHit( hits[k], title ); //hits[k] + '<br/>';
	} div += '</table>';
	var divOuterEnd = '<BR/></div>'; divtitle = '<h3 class=head><a href="#">' +hits.length + ' results in '+ title 
	 +'   for <span class=label>(' + word + ')</span>'
	 + '<span style="float: right;">COST: ' + '<span id=' + fnUI_MAP_DIV(SEARCHWORD+title) + '_COST>' + '</span>'
	 + '</a></h3>';
	if( hits.length > 0 && $('#'+fnUI_MAP_DIV( SEARCHWORD )).length == 0)
		$('<div class=frame><HR><H2 class=head> Results for '+ UI_decorateHeader(SEARCHWORD, title) +'</H2>' + '<div id='+ fnUI_MAP_DIV(SEARCHWORD) +' class="searchResultsContainer accordion zinfo"></div></div>').insertAfter('#placeholder');
	if( $('#'+fnUI_MAP_DIV( SEARCHWORD+title )).length == 0)
		if( $('#'+fnUI_MAP_DIV( SEARCHWORD )).length > 0)
			$(divtitle + divOuter + div + divOuterEnd).appendTo( '#'+fnUI_MAP_DIV( SEARCHWORD ) );
		else{ $(divtitle + divOuter + div + divOuterEnd).insertAfter('#placeholder'); debugger;}
	else $('#'+fnUI_MAP_DIV( SEARCHWORD+title )).html( div );
	results[title + 'Ttlcost'] = COST = profile('UI', rawCOST);
	$('#'+fnUI_MAP_DIV( SEARCHWORD+title )+'_COST').html( COST );
	if(index==0 && title && $('#'+fnUI_MAP_DIV( SEARCHWORD+title )) && $('#'+fnUI_MAP_DIV( SEARCHWORD+title )).data && $('#'+fnUI_MAP_DIV( SEARCHWORD+title )).data('word', word) ) $('#'+fnUI_MAP_DIV( SEARCHWORD+title )).data('word', word).data('title', title).data('results', results).data('index', index);
	$('#'+fnUI_MAP_DIV( SEARCHWORD+title )+'_prev').click( function(){ //_log(title + word); _log( results);
		//var index = $('#'+title).data('index'); if(!index) index=0;
		index -= MAX; if(index<0)index=0; results.index = index; 
		UI_displaySearchHits(title, word, results);
		UI_delay_doSearchHighlight(-1, word, results);
	});
	$('#'+fnUI_MAP_DIV( SEARCHWORD+title )+'_next').click( function(){ //_log(title + word); _log( results);
		//var index = $('#'+title).data('index'); if(!index) index=0;
		index += MAX; if(index>= (results[title]).length)index=0; results.index = index; 
		UI_displaySearchHits(title, word, results); 
		UI_delay_doSearchHighlight(-1, word, results);
	});
}

var UI_decorateHeader = function(SEARCHWORD, title){
	var response = '"', altword; 	//if(isEnglish( SEARCHWORD ) )  //translation
	if( title == 'arabic' || title == 'arabicBuckTranslit') altword = EnToAr( SEARCHWORD ); 
	if(altword) response += '<span class=big>'+altword+'</span>" (<small>'+SEARCHWORD+'</small>)';
	else response += SEARCHWORD + '"';	
	return response;
}

var nUI_MAP_DIV_NUMBER = 1, oUI_DIVS_MAP = {};
var fnUI_MAP_DIV = function(title){ var divno = -1;
	divno = oUI_DIVS_MAP[ title ];
	if( !divno ){ divno = oUI_DIVS_MAP[ title ] = ++nUI_MAP_DIV_NUMBER;
	}
	return 'div'+divno;
}
var UI_displayStatus = function(title, word, results, COST, MAX){
	var STATUS = $('#status').html(), hits;
	if(!results) STATUS='- no hits for ' + word +'-';
	else{ hits = results[title]; 
		if(hits && hits.length>0){
			STATUS+='('+ hits.length +' hits in '+title+') ';	}
	}
	$('#status').html( STATUS );
}

var WAIT_SEARCH = '<img id=WAIT_SEARCH src="static/ajax-loader.gif">';
var COLLECTIONS = [ 'arabic', 'translation', 'arabicBuckTranslit' ];
var UI_block_search = function(){
	$('#verse').slideUp();
	$('#status').html( '<BR>'+WAIT_SEARCH );
	$('.frame').remove();	
	stat.keywords = {};
//$('.searchResultsContainer').prev('H2.head').remove();$('.searchResultsContainer').remove();
	var title = '';
	for(key in COLLECTIONS){
		title = COLLECTIONS[key]; //console.log( $('#'+title).data('index') );
		$('#'+title).data('index',0);
		$('#'+title).remove();
	}
}

var UI_unblock_search = function(results){
	var STATUS = '';
	STATUS = $('#status').html();
	if( !results || 
	  ( (!results.arabic || results.arabic.length == 0) && 
		(!results.translation || results.translation.length == 0) && 
		(!results.arabicBuckTranslit || results.arabicBuckTranslit.length == 0)  
	  ) )
		STATUS = '-no results returned-';
	$('#status').html( STATUS);
	$('#WAIT_SEARCH').remove();
	var icons = {
			header: "ui-icon-circle-arrow-e",
			headerSelected: "ui-icon-circle-arrow-s"
		};
	$( ".accordion" )
		.accordion({ icons: icons, collapsible: true, event: 'click', autoHeight: false, fillSpace: false }); //mouseover hoverintent
}

var SIMPLE_FORMAT = true;
var UI_formatSearchHit = function(hit, title){ 
	try{
		var oclass = '';
		if(!hit) return; var ref, lineno, bare, trans, aya='', Ar, arr= hit.split('|');
		if(SIMPLE_FORMAT || !arr){ 
			if(arr && arr.length == 3){ ref=arr[0]+':'+arr[1]; 
				trans= arr[2]; Ar='';
				aya = decorateAyaSmall(ref, 'GoRef(this)');
				//hit= escape(trans); //if show bare/buck.
				if( title == 'arabic' || title == 'arabicBuckTranslit'){ hit = EnToAr(trans); oclass='big rtl'}//gives arabic2 or arabic
			}else{if(_bON_ERROR_DEBUG) debugger;}
			return '<TR><TD>&lrm;' +aya+ '&lrm;&nbsp; &rlm;\n<span class="' + oclass+'">' +'<span class=hotlink>'+ hit + '</span></span></TD></TR>';
		}
		if(arr.length == 3){ ref=arr[0]+':'+ arr[1];   trans=arr[2]; Ar='';}
		else if(arr.length == 2){ ref  = arr[0]; bare = arr[1]; lineno = mapRefToLineno(ref); trans = onGetTrans( lineno ) ;}
		Ar = EnToAr( onGetBuck( lineno ) );/*EnToAr(bare)*/;
		aya = decorateAya(ref, 'GoRef(this)');
		if(Ar) Ar = '<span class="arabic big">' + Ar + '</span><br/>';
		trans = '<span class="label">T</span><span class="trans">' + trans + '</span><br/>';
		var qObj = suraInfo(mapRefToSurano( ref )), surainfo = (!qObj)? '' : (qObj[4] + ' ' + qObj[5]);
		return '<TR><TD>'+ aya+'<br/>'+ surainfo + '</TD><TD>'+ Ar + trans+ '</TD></TR>\n';
	}catch(err){
		var msg = handleError(err, 'UI_formatSearchHit error');
		return '<TR><TD><span class=error>'+msg+'</span></TD></TR>';
	}
}


var UI_formatWord2Word = function(elementText, element){ if(!elementText) return; var response = '';
	var words = ( escape(elementText) ).split(" ");
	var text = words.join("</span> <span class=w2w>");
	response = ("<span class=w2w>" + text + "</span>");
	
	if(element) $(element).html( response );
	else $('body').append( response );	
}

var UI_initIphone = function(){
	if(!UI_isIphone()) return;//	else alert( 'UI_isIphone '+ UI_isIphone() );
	//Hide the toolbar etc.
	window.addEventListener('load', function() {
		setTimeout(scrollTo, 0, 0, 1);
	}, false);
	
	//orientation
	window.onload = function initialLoad() {
		UI_iphone_updateOrientation();
	}

	var selector = 'a';
	$(selector).livequery( 'touchstart', function(){this.className = "hover";} );
	$(selector).livequery( 'touchend', function(){this.className = "";} );
	//Once you added the code above to your document, you can start css styling:  a:hover, a.hover {
};




var UI_initLiveQueries = function(){ var selector = '';
	selector = '.hotlink';
	$(selector).livequery( function(){
		UI_formatWord2Word( $(this).text(), this );
		window.status = 'NEW element added: ' + selector;// + $(this).text() + this; 
		$(this).removeClass( 'hotlink' ).addClass( 'hotlinked' );
	} );
	selector = '.hotlinked';
	//$(selector).livequery( function(){
		//_log('hotlinked');//doSearchHighlight();
	//} );
	selector = 'span.w2w';
	$(selector).livequery( 'click', function (){
		$(this).css("background-color","Chartreuse"); 
		searchSet( $(this).text() ); //searchGo();
	} );

}

var UI_initSettings = function(){
	try{
		load_status_from_cookie();
		put_options_to_screen();
		
		$('#displaymode a').each(function () {
			$(this).attr('title', $(this).text());
		}).click( fnUI_onclick_settings );
	}catch(err){_log('error restoring settings from cookie: '+ err); //console.trace(err);
		stat = stat_defaults; set_default_status();
		put_options_to_screen();
	}
    fix_status();	//put_options_to_screen();
	save_status_to_cookie();
}

//this is called whenever our Display mode/settings buttons are clicked...
var fnUI_onclick_settings = function(){
	var button = $(this).attr('id');
	var displaymode = new Object;
	for (var mode in stat.display.mode) displaymode[mode] = stat.display.mode[mode];
	displaymode[button] = !displaymode[button];
	//if ((button == 'a') && (displaymode['a']) && (displaymode['t'])) displaymode['t'] = false;
	//if ((button == 't') && (displaymode['t']) && (displaymode['a'])) displaymode['a'] = false;
	if (displaymode['g'] || displaymode['e'] || displaymode['w'] || displaymode['t'] || displaymode['m']) {//atleast 1 selected
		if(_bPROFILE_SETTINGS) _log(button + ' clicked. settings new: ' + serialize(displaymode) +';  old: ' + serialize(stat.display.mode) );
		stat.display.mode = displaymode;
		save_status_to_cookie();
		UI_refresh_settings(); ///refresh_screen(500);	//put_options_to_screen();
		if(button == 'g') processGrammar();
		if(button == 'e') onTransInit();
		if(button == 'w') processWordToWord();
		if(button == 't') processWordToWord(); //onGrammarInit(); onBuckInit();
		if(button == 'm'){ /* processArabic3();*/ onBuckInit(); }
	}
	return false;
}

var UI_refresh_settings = function(){
	for (var mode in stat.display.mode) {
		$('#displaymode a#' + mode).toggleClass('active', stat.display.mode[mode]);
	}
}
var UI_initBookmarks = function(){
	var LI = '<li><a href="#" onclick="b(this, \'$title\')">$1</a></li>';
	var DIV = '<div class="column"><h3>$title</h3><ul>', DIVEND='</ul></div>';
	var LINE_BREAK = '<BR style="clear: left" /><BR/>';
	var str='', list='';
	for(key in BOOKMARKS){ list = '';
	   if(key.trim() == ''){ str += LINE_BREAK; continue;}
	   for(key2 in BOOKMARKS[key] )
		 list += LI.replace(/\$1/, key2 ) + '\n';
	   str += (DIV+ list).replace(/\$title/g, key)  +DIVEND + '\n\n\n\n';
	}//	console.log( str );
	document.getElementById('megamenu1').innerHTML = str;	//$('#megamenu1').html( str );
	if(jkmegamenu) jkmegamenu.definemenu("megaanchor", "megamenu1", "click"); //mouseover|click jkmegamenu.definemenu("anchorid", "menuid", "mouseover|click")
}

var ap_stopAll = function(var1, var2, var3, var4, var5, var6){
	var AUDIOREPEAT = true;
	if(AUDIOREPEAT){
		_log('ap_stopAll called. Pause any other videos that might be playing.');
	}
}