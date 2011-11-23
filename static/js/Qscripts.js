$(document).ready(function(){
	$('#edit').unbind('keydown');
	$('#edit').keydown( function(e){ onKeyDown(e, this.id);	});
	$('#edit').select();
	$('#edit').focus(); 
	$('.bbq-default').load('notes.html'); 
});

var PAGING_MAX_VERSES_PER_PAGE = 50;
String.prototype.beginsWith = function(t, i) { if (i==false) { return (t == this.substring(0, t.length)); } else { return (t.toLowerCase() == this.substring(0, t.length).toLowerCase()); } }
String.prototype.endsWith = function(t, i) { if (i==false) { return (t == this.substring(this.length - t.length)); } else { return (t.toLowerCase() == this.substring(this.length - t.length).toLowerCase()); } }
String.prototype.beginsWith = function(str){	return (this.match("^"+str)==str)	};
//String.prototype.contains = function(str){	var t = "ۚۖۛۗۙ";};


function sura(ref, nodisplay, isPaging){
	var retValue;// = getArabics(ref);
	retValue = line(ref, nodisplay, isPaging);
	if(!nodisplay){ //then display
		if(!_z)
			_z = newStage('sura('+ ref + ')'); 
		$(_z).html( '<div>' + retValue + '</div>' );
	}
}

function trans(ref){
	var retValue = getTrans(ref);
}


function verse(ref){ //must be like 2,4
	if(!ref || ref.split(',').length!=2) return '-err-';
	if(!arabicsArr) init(true); //do a synchronous call
	suraNo = ref.split(',')[0]; versNo = ref.split(',')[1]; //tokenNo = ref.split(',')[2];
	lineno = mapRefToLineno(ref, suraNo, versNo);
	line = arabicsArr[ lineno ];//	window.status = line;
	return line;
}

function token(ref){ //must be like 1,2,3. Can be like 1,2,3:5. for now ignoring the :5.
	if(!ref || ref.split(',').length!=3) return '-err-';
	if(!arabicsArr) init(true); //do a synchronous call
	var suraNo, versNo, tokenNo, lineno, line, word;
	var temparr, linearr, tokencount, wordno;
	if(ref.indexOf(':')!=-1) ref=ref.split(':')[0];
	suraNo = ref.split(',')[0]; versNo = ref.split(',')[1]; tokenNo = ref.split(',')[2];	
	lineno = mapRefToLineno(ref, suraNo, versNo, tokenNo);
	line = arabicsArr[ lineno ];
	//Handle the first verses which have basmallah added in
	if(versNo == 1 && suraNo != 1){ 
		if(line.indexOf('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ') != -1 ||
		   line.indexOf('بِّسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ') != -1   ){//debugger; //'bsm Allh AlrHmAn AlrHym'))
			temparr = line.split(' '); 
			temparr[0] = temparr[1] = temparr[2] = temparr[3] = '';
			line = temparr.join( ' ' ).trim();
		}
	}
	linearr = line.split(' ');
	for(tokencount=0, wordno=0; tokencount<linearr.length;){
		++tokencount; ++wordno;
		if(linearr[tokencount-1].length == 1){ --wordno; continue; }//its a stoppage word
		if(wordno == tokenNo)
			return linearr[tokencount-1];
	}//Else do below
	word = line.split(' ')[parseInt(tokenNo)-1];//	window.status = word;
	return word;
}

function bare(ref, callInit){
	if(!ref || !ref.split(',').length>=2) return '-err-';
	var suraNo, versNo, tokenNo, lineno, line, word;
	lineno = mapRefToLineno(ref);
	if(!searchArr) 
		if(callInit)
			initSearch(true); //synchronous call
		else return '';
	line = searchArr[ lineno ];
	if(ref.split(',').length >= 3){
		tokenNo = parseInt( ref.split(',')[2] );
		return word = line.split(' ')[tokenNo-1];
	}
	return line;	//From the bare text file, get word at lineno
}

function buck(ref, callInit){
	if(!ref || !ref.split(',').length>=2) return '-err-';
	var suraNo, versNo, tokenNo, lineno, line, word;
	lineno = mapRefToLineno(ref);
	if(!searchArr2 || !searchArr) 
		if(callInit)
			initSearch(true, true); //synchronous call. loadbuck also.
		else return '';
	line = searchArr2[ lineno ];
	if(ref.split(',').length >= 3){
		tokenNo = parseInt( ref.split(',')[2] );
		return word = line.split(' ')[tokenNo-1];
	}
	return line;	//From the bare text file, get word at lineno
}

function mapRefToWordLineno(ref){ //this for the corpus gramma r word file
	refarr = ref.split(','); //since its like 1,1,1
	key = refarr[0] +'|'+ refarr[1]; //ex: for 2:255:17
	offset = -1 + parseInt( refarr[2] ); //so for 1,1,1: 1,1 gives 1 and then offset is (-1+1) = 0
	lineno = offset + pos1[ key ];
	return lineno;
}

function mapRefToLineno(ref, suraNo, versNo){
	lineno = -1;
	if(!ref) return -1;
	if(!suraNo) suraNo = ref.split(',')[0]; 
	if(!versNo) versNo = ref.split(',')[1];
	startline = QuranData.Sura[ suraNo ][0];
	lineoffset = parseInt( versNo ) - 1;
	return (startline + lineoffset);
}

//Ex: 4,6,12-15 shud highlight the words from 12-15
function line(ref, nodisplay, isPaging){
	var startline = -1, endline = -1, lineoffset = -1;
	var suraNo, versCount, versNo, tokenNo, wordsToHighlight = 1, highlighting = false;
	var options = '<div class=options><a href="javascript:sura(null,null,true);">Next</a></div>';
	var stopverse = '<span class="stopverse"><img src="static/verse-end.png"/></span>';
	if(!transArr || !arabicsArr){	//alert('not initialized yet');
		init(true); //syncrhonous initialization 
	}
	if(!ref){
		if(isPaging && _cache[ 'sura.ref' ]){		//Might be paging going on
			ref = _cache[ 'sura.ref' ];
		}
		else{			debugger;
			if(location.href.indexOf( '?')  != -1){
				ref = location.href.substring( location.href.indexOf('?') + 1);
			}
		}
	}
	if(ref){
		ref = ref + ''; //convert to string, just incase param passed is int
		if(ref.indexOf(':') != -1){
			endTokenNo = ref.split(':')[1]; ref = ref.split(':')[0]; startTokenNo = ref.split(',')[2]; 
			wordsToHighlight = 1 + parseInt(endTokenNo) - parseInt(startTokenNo); 
		}
		var refArr = ref.split(',');
		suraNo  = refArr[0]; 
		startline = QuranData.Sura[ suraNo ][0];
		if(refArr.length >= 2){
			versNo = refArr[1]; if(refArr.length >= 3) tokenNo = refArr[2];
			lineoffset = parseInt( refArr[1] );
			if(lineoffset > QuranData.Sura[ suraNo ][1])
				lineoffset = QuranData.Sura[ suraNo ][1];
			startline = startline + lineoffset - 1; endline = startline;
			refArr[1] = lineoffset; ref = refArr.join(',');
			versNo = startline - QuranData.Sura[ suraNo ][0] + 1;
		}
		else
		if(refArr.length == 1){
			if(_cache['sura.endline.' + suraNo ]){//ie paging is going on here...
				startline = _cache['sura.endline.' + suraNo ];
			}
			versNo = startline - QuranData.Sura[ suraNo ][0] + 1;
			var versesCount;
			versesCount = QuranData.Sura[ suraNo ][1];
			lineoffset = versesCount - versNo + 1; //the remaining lines
			if(lineoffset > PAGING_MAX_VERSES_PER_PAGE){ //sura has more than 100 verses
				lineoffset = PAGING_MAX_VERSES_PER_PAGE; //todo: paging.  only show first 100 verses
				isPaging = true;
				_cache[ 'sura.ref' ] = ref;
				_cache[ 'sura.endline.' + suraNo ] = startline + lineoffset; //for next time
			}else _cache[ 'sura.endline.' + suraNo ] = null;
			endline   = startline + lineoffset - 1;
			if(endline-QuranData.Sura[ suraNo ][0] > versesCount) debugger;
			if(endline <= startline) debugger; //cant happen
		}
		retValue = ''; 
		var header = suraHeader(suraNo);
		
		for(i=parseInt(startline); i<=parseInt(endline); ++i){
			arabic = arabicsArr[ i ];
			if(versNo == 1 && suraNo != 1){ 
				if(arabic.indexOf('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ') != -1 ||
				   arabic.indexOf('بِّسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ') != -1   ){//debugger; //'bsm Allh AlrHmAn AlrHym'))
					temparr = arabic.split(' '); 
					temparr[0] = temparr[1] = temparr[2] = temparr[3] = '';
					arabic = temparr.join( ' ' ).trim();
				}
			}
			temp = arabic.split(' '); tempstr = ''; //debugger;
			for(linecount=0, wordno=0; linecount < temp.length; ){
				++linecount; ++wordno;
				if(temp[linecount-1].length == 1){ //it might be a stoppage letter. increment wordno
					--wordno; //go on to next word. linecount index remains same.
					tempstr += '<span class=stop><b>' + temp[linecount-1] + '</b></span>  ';
					if(refArr.length != 1) tempstr += '<br>';
					continue;
				}
				if(tokenNo && ( (wordno == tokenNo) || (highlighting && wordsToHighlight > 0) ) ){//debugger;
					temp[linecount-1] = '<span class=searchword>' + temp[linecount-1] + '</span>';
					highlighting = true; wordsToHighlight--;
				}
				ref = suraNo +','+ versNo +','+ wordno;
				translitword = bare(ref, false);
				buckwalter = buck(ref, false);
				href = (translitword == '') ? ref : translitword;
				if(nodisplay)//then we do not linkify
					tempstr += temp[linecount-1] + ' ';
				else
					tempstr += '<a href=#search?' + href + ' title="'+ ref + '  -  ' + translitword + '  -  ' + buckwalter + '">' + temp[linecount-1] + '</a> '; 
			}
			arabic = tempstr;
			retValue += '<div class=arabics>' + versNo +':&nbsp;'  + arabic + stopverse +'</div>';
			if(transArr){
				translation = transArr[ i ];
				if(refArr.length != 1)
					translation = translation.replace(/\./g,".<br>");  //.replace(/,/g,"")
				retValue += '<div class=trans>' + translation + '</div><br>'; 
			}
			++versNo;
		}
	}
	if(nodisplay || !isPaging) options = '';
	return header + options + '<br>' + retValue + options;
}


function repeats(){
	header = 'Repeated words in verses: ';
	retValue = '';
	//for(i=0; i<repetitionEndings.length; ++i){
	//	retValue += '<br>' + '<a href="#sura?' + repetitionEndings[i] + '">' + repetitionEndings[i] + '</a>';
	//}
	retValue = formatToTable(repetitionsEndings);//, new Array());
	if(!_z)
		_z = newStage('repeats()'); 
	$(_z).html( '<div>' + header + retValue + '</div>' );
}


function suraHeader(suraNo){
	var header = "<div class='header'>Sura " + suraNo + ": <p class=arrr>"+ QuranData.Sura[suraNo][4] +'</p>'+ "&nbsp;-&nbsp;"+ 
		QuranData.Sura[suraNo][5] +"&nbsp;-&nbsp;"+  QuranData.Sura[suraNo][6] +"&nbsp;-&nbsp;"+  QuranData.Sura[suraNo][7] +"</div>";
	return header;
}

function doDisplay( suraNo, type, retValue, ref ){
	if(type == 'sura'){
		if(retValue){		//window.status = (ref +' | '+ location.href +' | '+ arabicsArr.length) +'| '+ retValue;
			suraNo = parseInt(suraNo);
			if(typeof(suraNo)!= 'undefined' && typeof(suraNo) == 'number'){
				var header = "<div class='header'>Sura " + suraNo + ": <p class=arrr>"+ QuranData.Sura[suraNo][4] +'</p>'+ "&nbsp;-&nbsp;"+ 
							QuranData.Sura[suraNo][5] +"&nbsp;-&nbsp;"+  QuranData.Sura[suraNo][6] +"&nbsp;-&nbsp;"+  QuranData.Sura[suraNo][7] +"</div>";
				retValue = "<div class='arabics'>" + retValue + '</div>';
				if(!_z)
					_z = newStage('sura('+ suraNo + ')'); 
				$(_z).html( '<div>' + header + retValue + '</div>' );		//_cache['getArabics()'] = _z;
			}else{ debugger; }
		}	
	}
	else
	if(type == 'trans'){
		if(retValue){		//window.status = (ref +' | '+ location.href +' | '+ transArr.length) +'| '+ retValue;
			suraNo = parseInt(suraNo);
			if(typeof(suraNo)!= 'undefined' && typeof(suraNo) == 'number'){
				var header = "<div class='header'>Sura " + suraNo + ": <p class=arrr>"+ QuranData.Sura[suraNo][4] +'</p>'+ "&nbsp;-&nbsp;"+ 
							QuranData.Sura[suraNo][5] +"&nbsp;-&nbsp;"+  QuranData.Sura[suraNo][6] +"&nbsp;-&nbsp;"+  QuranData.Sura[suraNo][7] +"</div>";
				retValue = "<div class='trans'>" + retValue + '</div>';
				if(!_z)
					_z = newStage('trans('+ suraNo + ')'); 
				$(_z).html( '<div>' + header + retValue + '</div>' );		//_cache['getArabics()'] = _z;
			}else{ debugger; }
		}
	}
}





function wordnoToRef(wordno){
	var ref = ''; 
	var line = parseInt( wordno );
	if( !line || typeof(line) != 'number'){
		debugger; return;
	}
	var pos;
	for(k=0; k<verseIndexes.length-1;++k){
		if(verseIndexes[k+1] > (line+1) ){ //BUGFIX for boundry case when search result is first line of Sura. Test for last line too!
			pos = k; break;
		}
	}
	ref = pos +','+ (line - verseIndexes[pos] +2);
	return ref;
}

//RESULT: 'AmnwA@ Allh fyh AHsntm hyhAt bT$tm syyp slAmA dkA SfA
//		  628,2 912,12 1342,14 2035,1 2708,0 3061,1 4311,1 5004,2 6013,4 6014,3
//		  4,136,3 6,124,13 9,108,15 17,7,2 23,36,1 26,130,2 42,40,2 56,26,3 89,21,5 89,22,4
function linenoToRef(lineno){
	var ref = ''; 
	var line = parseInt( lineno );
	if( typeof(line) == 'undefined' || typeof(line) != 'number'){
		debugger; return;
	}
	if(line==0) return '1,1';
	var pos;
	for(k=0; k<verseIndexes.length-1;++k){
		if(verseIndexes[k+1] > (line+1) ){//BUGFIX for boundry case when search result is first line of Sura. Test for last line too!
			pos = k; break;
		}
	}
	ref = pos +','+ (line - verseIndexes[pos] +2);
	return ref;
}

