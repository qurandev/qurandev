var stripVowels = true;
var caseInsensitive = false;
var SEARCH_MAXRESULTS = 100;
var DISPLAY_ALL = false;
var SEARCH_MATCH_EXACT = false;
var multiword = false; //searchArr declared elsewhere in data loading


function search(word){
	var keyword='', _arr, _results = new Array(), _translits = new Array();
	var options = '';
	var editfield = '#edit';
	var wordsToHighlight = 1, endTokenNo = -1, matched=false, _tempIndex;
	
	if(!searchArr){
		getSearchData();
		return;
	}//debugger;
	if(typeof( $(editfield).val() ) == 'string' ){
		keyword = $(editfield).val();
		if(word) keyword = word;
		//if(location.href.indexOf( '?')  != -1) word = location.href.substring( location.href.indexOf('?') + 1);

		//word maybe ref to the token to search for. Handle that case here.
		if(parseInt( $('#edit').val().replace(/,/g,"") )){ //its a ref, get the token
			keyword = bare( keyword, true ); //i.e. do synchronous load,if data not already avbl.
		}
		
		if(stripVowels)		//strip vowels out.
			keyword = keyword.replace(/[aeiou]/g, "");
			//keyword = keyword.replace('e', '').replace('a', '').replace('u', '').replace('i', '').replace('e', '').replace('a', '').replace('u', '').replace('i', '').replace('e', '').replace('a', '').replace('u', '').replace('i', '');
		if(caseInsensitive)//ignore case
			keyword = keyword.toLowerCase(); //but then sentence has to be ignore case too!
		if(keyword.indexOf(' ') != -1){
			multiword = true; wordsToHighlight = keyword.split(' ').length;
		}
		window.status = 'searching: ' + keyword;		//print final keyword to statys bar
		_arr = searchArr;

		if(typeof(_cache['options.search.DISPLAY_ALL']) != 'undefined'){
			DISPLAY_ALL = _cache['options.search.DISPLAY_ALL'];
		}
		if(typeof(_cache['options.search.SEARCH_MATCH_EXACT']) != 'undefined'){
			SEARCH_MATCH_EXACT = _cache['options.search.SEARCH_MATCH_EXACT'];
		}		
		
		_keywords = keyword.split(';'); //debugger;
		for(s=0; s<_keywords.length; ++s){
			if(!_keywords[s] || _keywords[s]==''){
				continue;
			}
			for(i=0; i<_arr.length && (DISPLAY_ALL || _results.length < SEARCH_MAXRESULTS); ++i){
				matched=false;
				if(caseInsensitive)
					_arr[i] = _arr[i].toLowerCase();
				_tempIndex=_arr[i].indexOf( _keywords[s] );
				if(_tempIndex != -1 ){ 
					if(!SEARCH_MATCH_EXACT){
						matched = true;
					}
					else{//look for exact word
						var _lineArr = _arr[i].split(_keywords[s]);
						if(_lineArr.length >= 2){
							var letterbef, letteraft;
							if(_lineArr[0] == "") letterbef = ' '; //boundary cases... its at beginining or ending of sentence.
							else letterbef = _lineArr[0].split('')[ _lineArr[0].length - 1 ];
							if(_lineArr[1] == "") letteraft = ' ';
							else letteraft = _lineArr[1].split('')[ 0 ];
							if(letterbef == ' ' && letteraft == ' ')
								matched=true;
						}else debugger;
					}
				}
				if(matched){
					ref = linenoToRef( i );
					counter = _arr[i].indexOf( _keywords[s] );
					tokenno = _arr[i].substring(0,counter).split(' ').length;
					ref = ref +','+ tokenno;
					if(multiword)
						ref = ref +':' + (parseInt(tokenno) + wordsToHighlight - 1);
					_results.push( ref ); 
					translit = _arr[i].split(' ')[tokenno -1];
					_translits.push( translit );//debugger;//i ); 
				}
			}
		}			//debugger;
		
		options = '<div class="options">' + '<input type=checkbox onclick="_cache[\'options.search.SEARCH_MATCH_EXACT\'] = this.checked;search();" id=SEARCH_MATCH_EXACT ' + (SEARCH_MATCH_EXACT?'checked':'') +' >Exact match</input>&nbsp; \n';
		if(_results.length >= SEARCH_MAXRESULTS )	options += '<input type=checkbox onclick="_cache[\'options.search.DISPLAY_ALL\'] = this.checked;search();" id=DISPLAY_ALL ' + (DISPLAY_ALL?'checked':'') +' >Display all</input>&nbsp; \n';
		options += '</div>';

		html = formatToTable(_results, _translits, _arr);
		if(_results.length > 0)
			html = showUniqueResults(_results, _translits) +'<br>'+ html;
		html = options + html;
		if(!_z)
			_z = newStage('search("' + keyword +'")'); //_cache[''].show();
		_z.html(html);
	}
}


function formatToTable(_results, _translits, _arr){
	var html = '', translit = '', arrword='', lineno='', _line = '';
	var table = '<table class="noarr" border=1><tr><td>#</td> <td>lineno</td> <td>ref</td> <td>translit</td> <td>arabic</td> <td>line</td>'; // <td>POS</td><td>Status</td> <td>PRON</td> <td>SP</td> <td>full POS</td> <td>person..</td> <td>prfxs..</td>';
	table = '<table class="noarr" border=1><tr><td>#</td> <td>ref</td> <td>verse</td>'; // <td>POS</td><td>Status</td> <td>PRON</td> <td>SP</td> <td>full POS</td> <td>person..</td> <td>prfxs..</td>';
	if(_results.length > 0){
		for(t=0; t<_results.length; ++t){
			ref = _results[ t ]; 
			if(_translits && _translits.length >= t)
				translit = "<br>" + _translits[ t ]; //<label id='t" + t + "' class='arr'/><br>";
			arr = line(ref,true); 
			arrword = token(ref);
			arrword = '<br><div class=arrr>'+arrword+'</div>';
			ref2 = '<a href="#sura?'+ref +'">' + ref.split(':')[0] + '</a>';
			lineno = -2 + parseInt(verseIndexes[ _results[ t ].split(',')[0] ]) + parseInt(_results[ t ].split(',')[1]);
			if(_arr) _line = _arr[ lineno ];
			lineno = '<!-- ' + lineno + ' -->';
			_line2 = '<!-- ' + _line + ' -->';
			table += '<tr><td>'+(t+1)+'</td><td>'+ ref2 + translit + arrword + lineno + '</td><td>' + arr + _line2 +'</td></tr>';
		}
		table += '</table>';
		header = _results.length + ' Results.';
		html = '<div class=enar>' + table;
		html += '</div';
	}
	else{
		header = '- no results found -'; //returned for [' + keyword + '] -';
		html = '';
	}
	return header + '<br>'+ html;
}


function showUniqueResults(results, translits){
	var newHtml = '', htmlContent = '';
	var uniques = '';
	var key1, key2, key3, key4, k, ref, arabic, translit, key, uniquesArr, headers;
	var versesCol = { };
	var arabicCol = { };
	var tempcache = { };
	try{
		for(k=0; k<results.length; ++k){
			if(!results[k] || results[k] == "") continue;
			ref = results[k]; 		 if(ref) ref = ref.trim();
			arabic = token( ref ); 	 if(arabic) arabic=arabic.trim();
			translit = translits[k]; if(translit) translit=translit.trim();
			key = translit; //arabic;
			if(tempcache[ key ]){
				versesCol[ key ] += "<a href=#sura?" + ref + ">" + ref + "</a>&nbsp;&nbsp;  ";
			}
			else{			//ref key3 = results[k].trim(); //translit key2 = translits[k].trim(); //arabic	key1 = token( results[k] );
				tempcache[ key ] = arabic; 
				uniques += key +"; ";
				versesCol[ key ] = "<a href=#sura?" + ref + ">" + ref + "</a>&nbsp;&nbsp;  ";
				arabicCol[ key ] = arabic;
			}
		}
		uniquesArr = uniques.split("; ");
		for(l=0; l<uniquesArr.length;++l){
			key2 = uniquesArr[ l ];
			key3 = versesCol[ key2 ];
			key1 = arabicCol[ key2 ];
			if(typeof(key1) != 'undefined')
				newHtml += "<tr><td>" + (l+1) + "</td><td class=arr>" + key1 + "</td><td>" + key2 + "</td><td>" + key3 + "</td></tr>";
		}
		headers = (-1+uniquesArr.length) + ' unique Results. ' + (results.length) + ' results found.';
		if(results.length >= SEARCH_MAXRESULTS) 
			headers += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b> - Max results exceeded. </b> Try making search more specific. -';
		htmlContent = headers + "<br><br><div class='artable'><table border=1><tr><td>#</td><td>Arabic</td><td>Translit</td><td>Verses list</td></tr>\n" + newHtml + "</table></div>";
	}catch(ex){
		htmlContent = '-error showing unique results. ' + ex.message +' - '+ ex.name +' - '+ ex.lineNumber + ' -<br>';// +' - '+ ex.stack + '--> -';
		debugger;
	}
	return htmlContent;
}

//no longer used. this fetches thru AJAX calls back to server.
function fetchArabicTokensThroughAJAXCalls(results, translits){
	var newhtml = '';
	var arrp = results; //.split("\n");
	var arrt = translits; //.split("\n");
	var ajaxCallsCount = 0, ajaxReturnCalls = 0, uniques = '';
	var ajaxurl;
	var key1, key2, key3;
	var versesCol = { };
	var arabicCol = { };

	try{
		for(k=0; k<arrp.length; ++k){
			if(arrp[k].trim() == "") continue;
			ajaxurl = "sura?" + arrp[k]; key3 = arrp[k].trim();
			var responseText, unicode;   key2 = arrt[k].trim();
			if(_cache[ arrt[k].trim() ]){
				responseText = _cache[ key2 ];
				var key4  = key3;
				if(key3.lastIndexOf(',') != -1 && key3.lastIndexOf(',') != 0)
					key4 = key3.substring(0, key3.lastIndexOf(','));
				versesCol[ key2 ] += "<a href=#sura?" + key3 + ">" + key3 + "</a>&nbsp;&nbsp;  ";
			}
			else
			if(_cache["#" + ajaxurl]){
				responseText = _cache["#" + ajaxurl];
			}
			else{
				xmlhttp = new XMLHttpRequest();	
				xmlhttp.open("GET", "sura?" + arrp[k], false);
				xmlhttp.send(); ajaxCallsCount++;
				if(xmlhttp.responseText){
					responseText = xmlhttp.responseText;
					key1 = responseText.split("\n")[0];
					_cache[ key2 ] = responseText; uniques += key2 +"; ";
					var key4 = key3;
					if(key3.lastIndexOf(',') != -1 && key3.lastIndexOf(',') != 0)
						key4 = key3.substring(0, key3.lastIndexOf(','));
					versesCol[ key2 ] = "<a href=#sura?" + key3 + ">" + key3 + "</a>&nbsp;&nbsp;  ";
					arabicCol[ key2 ] = key1;
				}
			}
			unicode = responseText.split("\n")[0];		
			key1 = unicode.trim();
			document.getElementById('t'+k).innerHTML = unicode;
		}
		window.status = "ajaxCallsCount: " + (ajaxCallsCount) + ". " + uniques;
	}catch(ex){
		debugger;
	}
	//return;
	var uniquesArr = uniques.split("; ");
	var newHtml = '';
	for(l=0; l<uniquesArr.length;++l){
		key2 = uniquesArr[ l ];
		key3 = versesCol[ key2 ];
		key1 = arabicCol[ key2 ];
		if(typeof(key1) != 'undefined')
			newHtml += "<tr><td>" + (l+1) + "</td><td class=arr>" + key1 + "</td><td>" + key2 + "</td><td>" + key3 + "</td></tr>";
	}
	headers = (-1+uniquesArr.length) + ' unique Results.';
	htmlContent = headers + "<br><br><div class='artable'><table border=1><tr><td>#</td><td>Arabic</td><td>Translit</td><td>Verses list</td></tr>\n" + newHtml + "</table></div>";
	return htmlContent;
}
