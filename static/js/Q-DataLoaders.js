/****************************************************************
		initialize dataloading for: search and arabic+translations
*****************************************************************/
function initSearch(synchronous, loadbuck){
	var _searchurl = './data/qBare.txt';
	var _searchurl2 = './data/qBuck.txt';
	if(searchArr && searchArr2) return;
	if(_cache[ _searchurl ]){
		searchArr = _cache[ _searchurl ];
	}
	else
	if(synchronous){
		xmlhttp = new XMLHttpRequest();	
		xmlhttp.open("GET", _searchurl, false); //synchronous call
		xmlhttp.send(); 
		if(xmlhttp.responseText){
			responseText = xmlhttp.responseText;
			searchArr = responseText.split('\n');
			_cache[ _searchurl ] = searchArr; responseText = ''; window.status = 'Synchronous: loaded search 100% done.';
		}
	}
	if(!loadbuck) return; //all done
	if(_cache[ _searchurl2 ]){
		searchArr2 = _cache[ _searchurl2 ];
	}
	else
	if(synchronous){
		xmlhttp = new XMLHttpRequest();	
		xmlhttp.open("GET", _searchurl2, false); //synchronous call
		xmlhttp.send(); 
		if(xmlhttp.responseText){
			responseText2 = xmlhttp.responseText;
			searchArr2 = responseText2.split('\n');
			_cache[ _searchurl2 ] = searchArr2; responseText2 = ''; window.status = 'Synchronous: loaded BUCK search 100% done.';
		}
	}	
}


var initialized = false, skipArabicsLoad=false, skipTransLoad=false; //initializes arabicsArr, transArr, XXXXXsearchArr
function init(synchronous){
	if(initialized) return;
	if(transArr && arabicsArr) return initialized = true;
	if(skipArabicsLoad && skipTransLoad) return; //its either loaded or in progress. nothing to do.
	url2 = ARABICSDATAFILES[ ARABICS_INDEX ];
	url3 = TRANSLATIONSDATAFILES[ TRANSLATION_INDEX ];
	//url4 = './data/qBare.txt';
	if(arabicsArr)		skipArabicsLoad = true;
	if(transArr)		skipTransLoad   = true;
	if(synchronous || skipArabicsLoad || skipTransLoad){
		if(!skipArabicsLoad){
			xmlhttp = new XMLHttpRequest();	
			xmlhttp.open("GET", url2, false); //synchronous call
			xmlhttp.send(); 
			if(xmlhttp.responseText){
				responseText = xmlhttp.responseText;
				arabicsArr = responseText.split('\n');
				_cache[ url2 ] = arabicsArr; responseText = ''; window.status = 'Synchronous: init 50% done.';
			}
		}
		if(!skipTransLoad){
			skipTransLoad = true; //mark it so its not repeatedly being downloaded
			jQuery.get(url3, function(dict3) { 
				transArr = dict3.split('\n'); 
				_cache[ url3 ] = transArr; dict3 = '';
				window.status = 'Synchronous: init all done.'; initialized = true;
			});
		}
	}
	else{
		window.status = 'asynchronous init started...';
		jQuery.get(url2, function(dict2) { arabicsArr = dict2.split('\n'); _cache[ url2 ] = arabicsArr; dict2 = '';
			jQuery.get(url3, function(dict3) { transArr = dict3.split('\n'); _cache[ url3 ] = transArr; dict3 = '';
				//jQuery.get(url4, function(dict4) { searchArr = dict4.split('\n'); _cache[ url4 ] = searchArr; dict4 = '';
					window.status = 'inited'; initialized = true;
				//});
			});
		});
	}
}


/****************************************************************
		SEARCH related stuff
*****************************************************************/
var searchArr, searchArr2; //first is for bare. second for buckwlter transliteration.
var _searchurl = './data/qBare.txt';
function getSearchData(url, word){
	if(!url)
		url = _searchurl; //ARABICSDATAFILES[ ARABICS_INDEX ];
	if(!_cache[ url ]){
		var data = '';
		jQuery.get(url, function(data) {
			searchArr = data.split('\n');
			_cache[ url ] = searchArr; data = '';
			search(word);
		});
	}
	else{
		searchArr = _cache[ url ];
	}
}

/****************************************************************
		NEW GRAMMAR related stuff
*****************************************************************/
var grammarArr;
var _grammarurl = './data/corpus_grmr.txt';
function getGrammarData(url, ref){
	if(!url)
		url = _grammarurl; //ARABICSDATAFILES[ ARABICS_INDEX ];
	if(!_cache[ url ]){
		var data = '';
		jQuery.get(url, function(data) {
			grammarArr = data.split('\n');
			_cache[ url ] = grammarArr; data = '';
			grammar(ref);
		});
	}
	else{
		grammarArr = _cache[ url ];
	}
}

/****************************************************************
		ARABIC related stuff
*****************************************************************/
var arabicsArr;
var _arabicsurl;
function getArabicsData(url){
	if(!url)
		url = ARABICSDATAFILES[ ARABICS_INDEX ];
	_arabicsurl = url;
	if(!_cache[ url ]){
		var arabics = '';
		jQuery.get(url, function(arabics) {
			arabicsArr = arabics.split('\n');
			_cache[ url ] = arabicsArr; arabics = '';
			getArabics();
		});
	}
	else{
		arabicsArr = _cache[ url ];
	}
}


var _staticCounter2 = 0;
function getArabicsNext(){
	_staticCounter2++;
	if( !ARABICSDATAFILES[_staticCounter2] ){
		_staticCounter2 = 0;
	}
	if(ARABICSDATAFILES[_staticCounter2]){
		getArabicsData( ARABICSDATAFILES[_staticCounter2] );		//_staticCounter2 %= ARABICSDATAFILES.length;
	}
	else debugger;
	window.status = _staticCounter2 + ' arabic';
}

function getArabics(ref){
	var _ref = '1,1', retValue, multiline = false;
	var startline = -1, endline = -1, lineoffset = -1;
	var suraNo, versCount;
	if(!arabicsArr){
		getArabicsData();
		return;
	}
	if(!ref){
		if(location.href.indexOf( '?')  != -1){
			ref = location.href.substring( location.href.indexOf('?') + 1);
		}
	}
	if(ref){
		var refArr = ref.split(',');
		suraNo  = refArr[0]; 
		startline = QuranData.Sura[ suraNo ][0];
		if(refArr.length >= 2){
			lineoffset = parseInt( refArr[1] ) - 1;
			startline = startline + lineoffset; endline = startline;
		}
		else
		if(refArr.length == 1){
			lineoffset = QuranData.Sura[ suraNo ][1] - 1;
			endline   = startline + lineoffset;
		}
		retValue = ''; 
		for(i=parseInt(startline); i<=parseInt(endline); ++i){
			retValue += arabicsArr[i] +'<br/>';
		}		
	}
	doDisplay( suraNo, 'sura', retValue, ref );
}



/****************************************************************
		Translation related stuff
*****************************************************************/
var transArr;
var _transurl;
function getTransData(url){
	if(!url)
		url = TRANSLATIONSDATAFILES[ TRANSLATION_INDEX ];
	_transurl = url;
	if(!_cache[ url ]){
		var trans = '';
		jQuery.get(url, function(trans) {
			transArr = trans.split('\n');
			_cache[ url ] = transArr; trans = '';
			getTrans();
		});
	}
	else{
		transArr = _cache[ url ];
	}
}


var _staticCounter = 0;
function getTransNext(){
	try{
		_staticCounter++;
		if( !TRANSLATIONSDATAFILES[_staticCounter] ){
			_staticCounter = 0;
		}
		if(TRANSLATIONSDATAFILES[_staticCounter]){
			getTransData( TRANSLATIONSDATAFILES[_staticCounter] );		//_staticCounter %= TRANSLATIONSDATAFILES.length;
		}
		else
			debugger;
		getArabicsNext();
		window.status = _staticCounter + ' translation: ' + TRANSLATIONSDATAFILES[_staticCounter] + '; ' 
						+ _staticCounter2 + ' arabics: ' + ARABICSSDATAFILES[_staticCounter2];
	}catch(exp){
		;
	}
}

function getTrans(ref){
	var _ref = '1,1', retValue, multiline = false;
	var startline = -1, endline = -1, lineoffset = -1;
	var suraNo, versCount;
	if(!transArr){
		getTransData();
		return;
	}
	if(!ref){
		if(location.href.indexOf( '?')  != -1){
			ref = location.href.substring( location.href.indexOf('?') + 1);
		}
	}
	if(ref){
		ref = ref + '';
		var refArr = ref.split(',');
		suraNo  = refArr[0]; 
		startline = QuranData.Sura[ suraNo ][0];
		if(refArr.length >= 2){
			lineoffset = parseInt( refArr[1] ) - 1;
			startline = startline + lineoffset; endline = startline;
		}
		else
		if(refArr.length == 1){
			lineoffset = QuranData.Sura[ suraNo ][1] - 1;
			endline   = startline + lineoffset;
		}
		retValue = ''; 
		for(i=parseInt(startline); i<=parseInt(endline); ++i){
			retValue += transArr[i] +'<br/>';
		}		
	}
	doDisplay( suraNo, 'trans', retValue, ref );
}
