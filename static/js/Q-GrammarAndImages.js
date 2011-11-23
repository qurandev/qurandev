var GRAMMAR_MAX_WORDS_TO_PROCESS_LIMIT = 150; //this is max words shown per page. for grammar.
var GRAMMAR_PAGING_INCREMENT = 25;
var DISPLAY_IMAGES_ENABLED = false; //true;
var DISPLAY_IMAGES_LOCAL   = false;
var OPTION1 = false, OPTION2 = false, OPTION3 = false, OPTION4 = false, OPTION5 = false, OPTION6 = false, OPTION7 = false, OPTION8 = false, OPTION9 = false, OPTION0 = false;

function grammar(ref, isPaging){
	var url = 	'./data/corpus_grmr.txt';
	var start, end, ayahEndings, surano, versno, j, wordlinenoindex;
	var imgurl, lnkurl, html, header='';
	var table = '<table class="noarr" border=1><tr><td>#</td> <td>ref</td> <td>POS</td><td>Status</td> <td>PRON</td> <td>SP</td> <td>full POS</td> <td>person..</td> <td>prfxs..</td>';
	var paging = false, pagingHtml = '', pagingRef;
	try{
		OPTION3 = OPTION4 = OPTION5 = OPTION6 = OPTION7 = OPTION8 = OPTION0 = true;
		if(!grammarArr){
			getGrammarData(url, ref);
			return;
		} //wait for grammar data to be preloaded. then it will callback this method.
		surano = 1; // [-1,4,4,2,3,4,3,9]surano = 114; // [-1,4,2,2,4,5,3] //surano = 103;  // [-1, 1, 4, 9]
		//OPTIONS
		if(typeof(_cache['options.grammar.DISPLAY_IMAGES_ENABLED']) != 'undefined'){ //its a fresh request. see if in cache...
			DISPLAY_IMAGES_ENABLED = _cache['options.grammar.DISPLAY_IMAGES_ENABLED'];
			DISPLAY_IMAGES_LOCAL = _cache['options.grammar.DISPLAY_IMAGES_LOCAL'];
			OPTION3 = _cache['options.grammar.OPTION3']; OPTION4 = _cache['options.grammar.OPTION4']; OPTION5 = _cache['options.grammar.OPTION5'];
			OPTION6 = _cache['options.grammar.OPTION6']; OPTION7 = _cache['options.grammar.OPTION7']; OPTION8 = _cache['options.grammar.OPTION8'];
			OPTION9 = _cache['options.grammar.OPTION9']; OPTION0 = _cache['options.grammar.OPTION0']; 
		}
		else{
			_cache['options.grammar.DISPLAY_IMAGES_ENABLED'] = DISPLAY_IMAGES_ENABLED;
			_cache['options.grammar.DISPLAY_IMAGES_LOCAL'] = DISPLAY_IMAGES_LOCAL;
			_cache['options.grammar.OPTION3'] = OPTION3; _cache['options.grammar.OPTION4'] = OPTION4; _cache['options.grammar.OPTION5'] = OPTION5;
			_cache['options.grammar.OPTION6'] = OPTION6; _cache['options.grammar.OPTION7'] = OPTION7; _cache['options.grammar.OPTION8'] = OPTION8;
			_cache['options.grammar.OPTION9'] = OPTION9; _cache['options.grammar.OPTION0'] = OPTION0;
		}
		options = '<div class="options">' 
					+ '<input type=checkbox onclick="_cache[\'options.grammar.DISPLAY_IMAGES_ENABLED\'] = this.checked;grammar();" id=DISPLAY_IMAGES_ENABLED ' + (DISPLAY_IMAGES_ENABLED?'checked':'') +' >Images</input>&nbsp; \n'
					+ '<input type=checkbox onclick="option3(this)" id=OPTION3 ' + (OPTION3 ? 'checked':'') + ' >Highlight all</input>&nbsp; \n'
					+ '<input type=checkbox onclick="option4(this, new Array(\'NOM\') )" id=OPTION4 ' + (OPTION4 ? 'checked':'') + ' ><span class=NOM>Raff</span></input>&nbsp; \n'
					+ '<input type=checkbox onclick="option4(this, new Array(\'ACC\') )" id=OPTION5 ' + (OPTION5 ? 'checked':'') + ' ><span class=ACC>Nasb</span></input>&nbsp; \n'
					+ '<input type=checkbox onclick="option4(this, new Array(\'GEN\') )" id=OPTION6 ' + (OPTION6 ? 'checked':'') + ' ><span class=GEN>Jarr</span></input>&nbsp; \n'
					+ '<input type=checkbox onclick="option4(this, new Array(\'V\', \'V\') )" id=OPTION7 ' + (OPTION7 ? 'checked':'') + ' ><span class=V>Verb</span></input>&nbsp; \n'
					+ '<input type=checkbox onclick="option4(this, new Array(\'N\', \'N\') )" id=OPTION8 ' + (OPTION8 ? 'checked':'') + ' ><span class=N>Noun</span></input>&nbsp; \n'
					+ '<input type=checkbox onclick="option4(this, new Array(\'P\') )" id=OPTION0 ' + (OPTION0 ? 'checked':'') + ' ><span class=P>Prep.</span></input>&nbsp; \n'
					+ '<input type=checkbox onclick="option9(this)" id=OPTION9 ' + (OPTION9 ? 'checked':'') + ' >table</input>&nbsp; \n'
					+ '<input type=checkbox onclick="_cache[\'options.grammar.DISPLAY_IMAGES_LOCAL\']=this.checked;grammar();" id=DISPLAY_IMAGES_LOCAL ' + (DISPLAY_IMAGES_LOCAL?'checked':'') + ' >local</input>&nbsp; \n'
				+ '</div>';

		if(!DISPLAY_IMAGES_LOCAL)
			imgurl = 'http://corpus.quran.com/wordimage?id={0}';
		else
			imgurl = 'pics/id={0}.png';
		lnkurl = '#sura?{0}';
			
		if(!ref){
			ref = $('#edit').val();
			if(parseInt( ref.replace(/,/g,"") ) ){
				if(location.hash != '#grammar?' + ref ){
					location.hash = '#grammar?' + ref;
					return;
				}//else continue with execcution
			}
		}
		ref = ref + ''; //just incase its an int
		if(!ref || !parseInt( ref.replace(/,/g,"") ) ){
			return; //not ref sura
		}
		if( parseInt( ref.split(',')[0] ) != 'undefined' ){
			surano = parseInt( ref.split(',')[0] );
		}
		if(ref.split(',').length > 1 && parseInt(ref.split(',')[1]) != 'undefined' ){
			versno = parseInt(ref.split(',')[1] );
		}
		ref = ref.split(',')[0]; //get surano only
		pagingRef = ref;
		if(isPaging && _cache['GRAMMAR_STARTVERSE_' + ref]){//debugger;
			paging = true;
			versno = _cache['GRAMMAR_STARTVERSE_' + ref]; window.status = 'grammar continue from verse ' + versno;
		}
		start     = linesIndexes[ surano ];
		end 	  = linesIndexes[ surano + 1 ]; 
		ayahEndings = verseEndings[surano];
		verseCount  = verseCounts[surano ]; //debugger;
		if(versno){
			wordlinenoindex = mapRefToWordLineno(surano + ',' + versno +',1');
			start = /*linesIndexes[ surano ] - 1 +*/ wordlinenoindex; //move forward that many lines
			var maxToken = verseEndings[ surano ][ versno ];
			if(!paging)
				end = start + maxToken; //need count of tokens in surano,versno
		}
		else versno = 1;
		html = '<div class=enar>' +table;
		imghtml = '<div class=ar>' + versno + ': '; 
		var zWordsProcessed=0; //debugger;
		for(i=start, j=versno, count=1; (zWordsProcessed <= GRAMMAR_MAX_WORDS_TO_PROCESS_LIMIT) && (i<end); ++i, ++count, ++zWordsProcessed){
			if( (count-1) == ayahEndings[j] ){
				imghtml += "<div class='linebreak'>&nbsp;</div>"; 
				count = 1; j++;
				//Lets check if we can display the whole next line or not? ie will it exceed the max words, then we stop.
				if(j+1 < ayahEndings.length){
					if((ayahEndings[j] + zWordsProcessed) > GRAMMAR_MAX_WORDS_TO_PROCESS_LIMIT){
						paging = true;
						_cache['GRAMMAR_STARTVERSE_' + pagingRef] = ++versno; if(console && console.log) console.log('grammar - exceeded words limit. set next verse ' + versno); 
						break;
					}
				}
				if(i != end-1){ html+= (j) + ": "; imghtml+= (j) + ": ";}
			}
			versno = j; tokenno = count;
			ref = surano +','+versno+','+tokenno;
			ref2 = '<a href="#sura?'+ref +'">' + ref + '</a>';
			arabic   = token(ref);
			wordlinenoindex = i - 1; 
			classes = grammarArr[wordlinenoindex].split('|').join(' '); 
			html += '<tr><td>' + i + '</td><td>' + ref2;
			html += '</td><td>' + grammarArr[wordlinenoindex].split('|').join('&nbsp;</td><td>') + '</td></tr>'; //N|GEN||||M| bi+
			if(!DISPLAY_IMAGES_ENABLED) imageurl = ' width="' + guessWidth(arabic.length) + '" '; 
			else  imageurl = ' src="' + imgurl.replace('{0}', i) + '" ';
			linkurl  = lnkurl.replace('{0}', ref ); //_data[key].ref );
			//classes = ''; classes += grammarArr[i-1].split('|')[0] + ' '; //POS //classes += grammarArr[i-1].split('|')[5] + ' '; //person
			//classes += grammarArr[i-1].split('|')[1] + ' '; //Raff, nasb, Jarr == NOM, ACC, GEN
			//classes += grammarArr[i-1].split('|')[2] + ' '; //PRON			//classes += grammarArr[i-1].split('|')[3] ? 'SP ' : ' '; //SP
			imghtml += '<span class="aword"><a id="A' + i + '" href="' + linkurl + '">' + '<img id="img' + i + '" ' +imageurl + ' alt="' + arabic + '" title="' + arabic + ' - ' + arabic.length + '" class="' + classes + '" />' + '</a></span>\n';
		} html += '</table></div>';		imghtml += '</div>';
		//////////////
	
		header = suraHeader(surano);
		if(paging){
			var pagingHtml = '   &nbsp;&nbsp; <a href=javascript:grammar(null,true)>Next</a> &nbsp;&nbsp;  '; //Go to verse: <input type="text" id="verse" onclick="this.select()" size="3"  />';
			pagingHtml = '<a href=javascript:grammarFirst()>|<<</a> &nbsp; <a href=javascript:grammarPrev()><<</a>' + pagingHtml;
			pagingHtml += '<a href=javascript:grammarNext()>>></a> &nbsp; <a href=javascript:grammarLast()>>>|</a>';
			imghtml += pagingHtml; 
			options += pagingHtml;
		}
		if(!_z)
			_z = newStage('grammar("' + ref + '")'); //_cache[''].show();
		_z.html(header + options + imghtml + '<div id=tabledisplay class=tabledisplay style="display:' + (OPTION9?'block':'none') + '"><br><br>' + html + '</div>');

		if(OPTION3 ){ //if its checked, then blindly turn all everything.
			var classArray = ['P', 'PP', 'V', 'V', 'N', 'N', 'PN', 'ACC', 'NOM', 'GEN'];
			var obj = document.getElementById('OPTION3');	
			if(obj)
				option4( obj, classArray ); 
			else debugger;
		}
		else{ //else need to see for each one, which ones are exactly enabled.
			if(! OPTION4 )		option4(document.getElementById('OPTION4'), new Array('NOM') );
			if(! OPTION5 )		option4(document.getElementById('OPTION5'), new Array('ACC') );
			if(! OPTION6 )		option4(document.getElementById('OPTION6'), new Array('GEN') );
			if(! OPTION7 )		option4(document.getElementById('OPTION7'), new Array('V', 'V') );
			if(! OPTION8 )		option4(document.getElementById('OPTION8'), new Array('N', 'N') );
			if(! OPTION0 )		option4(document.getElementById('OPTION0'), new Array('P') );
		}
	}
	catch(exp){
		debugger;
	}
}



function option3(obj){//This turns on or off highlighting of gramamr terms. default on.
	if(!obj.checked )		$('#OPTION4, #OPTION5, #OPTION6, #OPTION7, #OPTION8, #OPTION0').removeAttr('checked');
	else if(obj.checked)	$('#OPTION4, #OPTION5, #OPTION6, #OPTION7, #OPTION8, #OPTION0').attr('checked', 'true' );
	_cache['options.grammar.OPTION0'] = _cache['options.grammar.OPTION4'] = _cache['options.grammar.OPTION5'] = 
	_cache['options.grammar.OPTION6'] = _cache['options.grammar.OPTION7'] = _cache['options.grammar.OPTION8'] = obj.checked;

	var classArray = ['P', 'PP', 'V', 'V', 'N', 'N', 'PN', 'ACC', 'NOM', 'GEN'];
	option4(obj, classArray);	
	_cache['options.grammar.OPTION3']=obj.checked;
}

function option4(obj, classArray){
	var c1, c2, k; //debugger;
	_cache['options.grammar.' + obj.id ]=obj.checked;

	if(obj.id != 'OPTION3'){ //If Hightlight all is enabled, make sure disable it. in cache also.
		$('#OPTION3').removeAttr('checked');
		_cache['options.grammar.OPTION3'] = false;
	}
	if(!obj.checked){ //remove styles/*		$('.P').addClass('Poff').removeClass('P');		$('.PP').addClass('PPoff').removeClass('PP');*/
		for(k=0; k<classArray.length; ++k){ 
			c1 = classArray[k];
			c2 = c1+'off';
			$('.' + c1).addClass(c2).removeClass(c1);
		}
	}
	else{
		for(k=0; k<classArray.length; ++k){ 
			c2 = classArray[k];
			c1 = c2+'off';
			$('.' + c1).addClass(c2).removeClass(c1);
		}
	}
}

function option9(obj){ //This guy shows or hides the table. default its hidden.
	window.status = 'option9 - ' + obj.checked;
	_cache['options.grammar.OPTION9']=obj.checked;
	if(obj.checked){
		$('.tabledisplay').css('display', 'block');
		$('.tabledisplay').css('border', '3px solid red');	
		//$('.NOM, .GEN, .ACC').attr('class', 'noclass');
	}
	else{
		$('.tabledisplay').css('display', 'none');	
	}
}

var WIDTH_FACTOR = 12;
function guessWidth(length){
	return length * WIDTH_FACTOR;
	var width = 100;
	if(length <= 2)				width = 25;
	else if(length <= 4)		width = 38;
	else if(length <= 6)		width = 46;
	else if(length <= 9)		width = 85;
	else if(length <= 12)		width = 120;
	else if(length <= 16)		width = 120;
	else if(length <= 20)		width = 140;
	else						width = 180;
	return width;
}

function images(ref){
		html = '';
		start     = linesIndexes[ surano ];
		end 	  = linesIndexes[ surano + 1 ]; 
		ayahEndings = verseEndings[surano];
		verseCount  = verseCounts[surano ]; //debugger;
		for(i=start, j=1, count=1; i<end; ++i, ++count){
			if( (count-1) == ayahEndings[j] ){
				html += "<br/>";
				if(i != end-1) html+= (1+j) + ": "; 
				count = 1; j++;
			}
			html += '<a id="A' + i + '">' + '<img id="img' + i + '" />' + '</a>\n';
		} html += '</div>';
		if(!_z)
			_z = newStage('getImages("' + ref + '")'); //_cache[''].show();
		_z.html(html);

		//PROPERTIES AVAILABLE:   .ref	.word.arabic	.prefix  .POS  .PRON  .extra   .word.LEM   .word.ROOT   .word.info
		var key = -1;
		var wordgrammar, partOfSpeech, imageurl, linkurl;
		var ref, arabic, prefix, POS, PRON, extra, LEM, ROOT, info;
		for(i=start; i<end; ++i){
			key = i;
			ref   = nullcheck( _data[key].ref );
			wordgrammar = nullcheck(_data[ key ].extra);
			partOfSpeech = nullcheck( _data[ key ].POS );
			info   = nullcheck( _data[key].word.info );
			arabic   = nullcheck( _data[key].word.arabic );
			LEM   = nullcheck( _data[key].word.LEM );
			ROOT   = nullcheck( _data[key].word.ROOT );
			PRON   = nullcheck( _data[key].PRON );
			prefix   = nullcheck( _data[key].prefix );

			imageurl = imgurl.replace('{0}', i);
			linkurl  = lnkurl.replace('{0}', _data[key].ref );

			$("#img" + i).attr("src", imageurl );
			$("#img" + i).attr("alt", arabic );
			$("#A" + i).attr("href", linkurl );
			$("#A" + i).attr("title", arabic + ' || ' + info + ' || '+ LEM +' | '+ ROOT +' | ');
			if(wordgrammar.indexOf('GEN') != -1){
				$("#img" + i).addClass( 'jarr' );
			}
			else if(wordgrammar.indexOf('ACC') != -1){
				$("#img" + i).addClass( 'nasb' );
			}
			else if(wordgrammar.indexOf('NOM') != -1){
				$("#img" + i).addClass( 'raff' );
			}
			else{
				//$("#img" + i).addClass( 'regularword' );
			}
			$("#img" + i).addClass( partOfSpeech );
			$("#img" + i).addClass( PRON );
			//$("#img" + i).addClass( info );		
		}

		if(_data){
			html = _z.html();
			for(i=start; i<end; ++i){
				html += i + '--> ' + val(_data[i].extra) + '<br/>';
			}
			_z.html( html );
			_cache[ "getImages()" ] = _z;
		}else{ alert('no grammar data loaded'); }
}


function grammarFirst(){
	var ref, versno = -1, surano;
	ref = $('#edit').val();
	if(ref && _cache['GRAMMAR_STARTVERSE_' + ref]){//debugger;
		_cache['GRAMMAR_STARTVERSE_' + ref] = 1;
	}
	grammar(null,true);
	_cache['GRAMMAR_STARTVERSE_' + ref] = 1;
}


function grammarLast(){
	var ref, versno = -1, surano;
	ref = $('#edit').val();
	if(ref && _cache['GRAMMAR_STARTVERSE_' + ref]){//debugger;
		surano = parseInt( ref.split(',')[0] );
		versno = verseCounts[ surano ];
		_cache['GRAMMAR_STARTVERSE_' + ref] = versno;
	}
	grammar(null,true);
}

function grammarPrev(){
	var ref, paging=false, versno = -1, surano;
	ref = $('#edit').val();
	if(ref && _cache['GRAMMAR_STARTVERSE_' + ref]){//debugger;
		surano = parseInt( ref.split(',')[0] );
		paging = true;
		versno = _cache['GRAMMAR_STARTVERSE_' + ref]; window.status = 'grammar continue from verse ' + versno;
		versno -= GRAMMAR_PAGING_INCREMENT; 
		if(versno <= 0) versno = 1;
		if(versno > verseCounts[ surano ]) versno = verseCounts[ surano ];
		_cache['GRAMMAR_STARTVERSE_' + ref] = versno;
	}
	grammar(null,true);
}


function grammarNext(){
	var ref, paging=false, versno = -1, surano;
	ref = $('#edit').val();
	if(ref && _cache['GRAMMAR_STARTVERSE_' + ref]){//debugger;
		surano = parseInt( ref.split(',')[0] );
		paging = true;
		versno = _cache['GRAMMAR_STARTVERSE_' + ref]; window.status = 'grammar continue from verse ' + versno;
		versno += GRAMMAR_PAGING_INCREMENT; 
		if(versno <= 0) versno = 1;
		if(versno > verseCounts[ surano ]) versno = verseCounts[ surano ];
		_cache['GRAMMAR_STARTVERSE_' + ref] = versno;
	}	
	grammar(null,true);
}