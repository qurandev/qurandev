var BOOKMARKS = {

"NAMES": {
 "Allah, Muhammad":								"Allah;   muHamad;   AHmd;",
 "Revealed books":								"qur'An;   zbwr;   injyl;",
 "Allah loves.. doesnt love.":			"Allahu yuHibu;   Allahu lA yuHibu;",
 "Allahs names...":						"AlrHmAn AlrHym; lgfAr;   AlqAhr;   AlwhAb;   AlrzAq;   AlftAH AlElym",
 "Allahs names2...":		"Almlk Alqdws AlslAm Almwmn Almhymn AlEzyz AljbAr Almtkbr;   AlxAlq AlbAry AlmSwr"
},

"PROPHETS": {
 "Adam, Ibrahim, Nuh, Musa, Sulayman": "Adam;   AbrAhym;   nuwH;   muwsa;   sulymAn;",
 "Maryam, Isaa, Yusuf, Dawud, Ismail": "maryam;   Eysa;   yuwsuf;   dAw,d;   AsmAEyl; ",
 "Shoaib, Lut, Yaqub, AlAsbat, Ayub":  "$Eyb;  lwT;  yEqwb;  AlAsbAT;  Aywb;",  
 "Yunus, Alyasi, Alqarnyn, Ishaq, Haroon":	"ywns;   AlysE;  Alqrnyn;   wAsHAq;   hArwn;",
 "Some villians in qur'an": 					 "firEwn;  hAmAn;  qArwn;   yAjwj wmAjwj;",
 "TBD nations/places/foods etc": 					"TBD"
},

"UNIQUE PHRASES": {
 "zumar (group)":								"zmr",
 "fussilat (clearly explained)":				"fSlt",
 "Sarrafnaa (diversified (the signs..))":				"SrfnA",
 "hawaa (desires, passsions)":					"hwA",
 "ridaa (approval/pleasure of)":				"rDAt",
 "dahar (time)":								"dhr",
 "'legends of the former peoples'":				"AsATyr AlAwlyn",
 "Character (Khuluq, etc) TBD":						"xlq; TBD"
 },

"": null,
 
"NOTABLE VERSES": {
 "Ayat-ul-Kursi":								"2:255",
 "Fabi ayyi aala i rabbuku maatukazzibaan?":	"fbAY 'AlA' rbkmA tk*bAn",
 "Yassarnal quran":								"yasarnA Alqur'An",
 "Fahal min mudakkir":							"fahal min mudakir",
 "In shaa Allah...":							"An $A' Allh",
 "Fadam damaa":									"fadamdama",
 "Lahwal hadith (amusement of speech)":				"lahwa AlHadyv"
 },
 
"MIRACLES": {
 "Rahym-ul-Ghufur vs Ghafur-ul-Rahym":			"AlrHym Algfwr;      Algfwr AlrHym;",
 "warabbuka fakabbir (Palindrome verse)":		"warabuka fkbr",
 "Yasbahoon (planets orbiting palindrome)": "wkl fY flk ysbHwn",  //<a href=http://linguisticmiracle.com/floating.html>info</a> 
 "Succinct synopsis of mans life":				"57:20"
},

"MISC": {
 "Rabbanaa... (Duas)":							"rbnA;    wrbnA;    brbnA",
 "Some muslim names": 							 "Zfr;   lArjumank;   $Eyb;   DyA;",
 "Siraat vs Sabiyl":							"AlSrAT;  AlSrAT Almstqym;  sabiyl;",
 "Jannah vs Jahannum":							"janat;   jahanum;",
 "Ajar (reward)":								"Ajar"
}
};


	var URL_TEMPLATE = 'http://audio.allahsquran.com/vbv/arabic/$1/$2.mp3', 
		    TEMPLATE = '&nbsp;&nbsp;&nbsp;<object width="290" height="24" id="audioplayer1" type="application/x-shockwave-flash" data="static/audio/player.swf">\n <param name="movie" value="static/audio/player.swf" >\n'+
			'<param name="FlashVars" value="playerID=1&amp;bg=0xf8f8f8&amp;'+
				'leftbg=0xeeeeee&amp;lefticon=0x666666&amp;rightbg=0xEDF4CA&amp;'+
				'rightbghover=0x9BA948&amp;righticon=0x798732&amp;righticonhover=0xFFFFFF&amp;'+
				'text=0x666666&amp;slider=0x666666&amp;track=0xFFFFFF&amp;border=0x666666&amp;'+
				'loader=0xEDF4CA&amp;soundFile=$URL" >\n' +
			'<param value="high" name="quality">\n  <param value="false" name="menu">\n  <param value="transparent" name="wmode">\n </object>\n\n';
	var RECITORS = [
		'mishary_al-afasi',
		'abdul-basit_murattal',
		'abdul-basit_mujawwad',
		'khalil_al-husari_murattal',
		'khalil_al-husari_mujawwad'
	], RECITORS2 = [
		'mishary', 'basit murattal', 'basit', 'husari murattal', 'husari'
	];

	var getQuranPlayer = function(ref, RECITOR){
		if(!ref || ref=='') return;
		var num='', URL='', tmp='', str='<span class=label>Play:</span>&nbsp; ', surano = mapRefToSurano(ref), versno = mapRefToVersno(ref); //num in format 114001
		if(surano <10) num += '00'+surano;
		else if(surano<100) num += '0'+surano;
		else num += surano;
		if(versno <10) num += '00'+versno;
		else if(versno<100) num += '0'+versno;
		else num += versno;
		if(typeof(RECITORS) != NULL && RECITORS)
			for(key in RECITORS){
				RECITOR = RECITORS[key]; URL = URL_TEMPLATE.replace(/\$1/i, RECITOR).replace(/\$2/i, num); 
				tmp = (UI_isIphone() || key!=RECITORS.length-1 ) ? '&nbsp;&nbsp;' : TEMPLATE.replace(/\$URL/i, URL);	
				str += A(URL, RECITORS2[key], '_audio') + tmp;
			}
		return str; 
	}

//on click bookmark...
var b = function(obj, category){ var key = obj.text, value;
	if(BOOKMARKS)
		_log( key+' bookmark clicked\n'+ (value = BOOKMARKS[category][ key ]) );
	if(value){
		searchSet( value ); searchGo(); 
	}else{ $('#status').html('<span class=error>There was an error in this bookmark. Sorry for the inconvenience.['+key+', '+value+']</span>');}
	return false;
}

		var _prefixData = function(DATA){           //profile('PREFIX-start');
		  if(!DATA) return;
		   var ARRAY = DATA.split('\n'), SEP='|'; //TODO: split using a regex, to account for /r/n
		   for(var n=0; n<ARRAY.length; ++n){
			 ARRAY[n] = mapLinenoToRef(n, SEP) + '|' + ARRAY[n];
		   } /*console.log( ARRAY );*/              profile('PREFIX-end');
		   return ARRAY.join('\n');
		}

		var isRef = function(word){
			if( parseInt( word.replace(/[,:\- ]/g,"") ) )
				return true;
			else return false;
		}
		

// "t":"بِسْمِ [h:1[ٱ]للَّهِ [h:2[ٱ][l[ل]رَّحْمَ[n[ـٰ]نِ [h:3[ٱ][l[ل]رَّح[p[ِي]مِ"},
// "t":"بِسْمِ <span class="ham_wasl" title="Hamzat Wasl" alt=":1" >ٱ</span>للَّهِ <span class="ham_wasl" title="Hamzat Wasl" alt=":2" >ٱ</span><span class="slnt" title="Lam Shamsiyyah" alt="" >ل</span>رَّحْمَ<span class="madda_normal" title="Normal Prolongation: 2 Vowels" alt="" >ـٰ</span>نِ <span class="ham_wasl" title="Hamzat Wasl" alt=":3" >ٱ</span><span class="slnt" title="Lam Shamsiyyah" alt="" >ل</span>رَّح<span class="madda_permissible" title="Permissible Prolongation: 2, 4, 6 Vowels" alt="" >ِي</span>مِ"},"
function parse_tajweed(text) { 
	return text.replace(/\[h/g, "<span class=\"ham_wasl\" title=\"Hamzat Wasl\" alt=\"")
			   .replace(/\[s/g, "<span class=\"slnt\" title=\"Silent\" alt=\"")
			   .replace(/\[l/g, "<span class=\"slnt\" title=\"Lam Shamsiyyah\" alt=\"")
			   .replace(/\[n/g, "<span class=\"madda_normal\" title=\"Normal Prolongation: 2 Vowels\" alt=\"")
			   .replace(/\[p/g, "<span class=\"madda_permissible\" title=\"Permissible Prolongation: 2, 4, 6 Vowels\" alt=\"")
			   .replace(/\[m/g, "<span class=\"madda_necessary\" title=\"Necessary Prolongation: 6 Vowels\" alt=\"")
			   .replace(/\[q/g, "<span class=\"qlq\" title=\"Qalqalah\" alt=\"")
			   .replace(/\[o/g, "<span class=\"madda_obligatory\" title=\"Obligatory Prolongation: 4-5 Vowels\" alt=\"")
			   .replace(/\[c/g, "<span class=\"ikhf_shfw\" title=\"Ikhfa' Shafawi - With Meem\" alt=\"")
			   .replace(/\[f/g, "<span class=\"ikhf\" title=\"Ikhfa'\" alt=\"")
			   .replace(/\[w/g, "<span class=\"idghm_shfw\" title=\"Idgham Shafawi - With Meem\" alt=\"")
			   .replace(/\[i/g, "<span class=\"iqlb\" title=\"Iqlab\" alt=\"")
			   .replace(/\[a/g, "<span class=\"idgh_ghn\" title=\"Idgham - With Ghunnah\" alt=\"")
			   .replace(/\[u/g, "<span class=\"idgh_w_ghn\" title=\"Idgham - Without Ghunnah\" alt=\"")
			   .replace(/\[d/g, "<span class=\"idgh_mus\" title=\"Idgham - Mutajanisayn\" alt=\"")
			   .replace(/\[b/g, "<span class=\"idgh_mus\" title=\"Idgham - Mutaqaribayn\" alt=\"")
			   .replace(/\[g/g, "<span class=\"ghn\" title=\"Ghunnah: 2 Vowels\" alt=\"")
			   .replace(/\[/g, "\" >")
			   .replace(/\]/g, "</span>");
}	

function activate_tooltips(selector){
	var tooltip_timer=false;
	$(selector).each(function(){$(this).attr('tip',$(this).attr('title')).removeAttr('title');
			 }).hover(function(e){var $el=$(this);tooltip_timer=setTimeout(function(){$('#tooltip #tiptext').html($el.attr('tip')?$el.attr('tip'):$el.attr('title'));
			 var offset=$el.offset();var top=offset.top-40;var left=offset.left+parseInt($el.width()/2)-20;$('#tooltip').css({top:top,left:left});
			 var w=13;var x=left+$('#tooltip').width()-$(window).width()+17;
		if(x>0){$('#tooltip').css('left',left-x);w+=x;}
	$('#tooltip .b .s').css('width',w);$('#tooltip .b .c').css('width',1).css('width',$('#tooltip').width()-w-24);$('#tooltip').fadeIn(500);},500);},function(){clearTimeout(tooltip_timer);$('#tooltip').hide();});
}

var fnMapWordToRoots = function(word){ var ROOTS = '', ch = '&zwnj;'; //'\200C'; //&#8204; '&zwnj;';  \200E &lrm;
	if(!word) return ROOTS;
	ROOTS = word.trim().split('').join(ch);
	return ROOTS;
}

function mapRefToRef(ref, SEP){ //just ensure its full-form. not just the sura name.
	if(typeof(SEP) == NULL || !SEP) SEP=':';
	if(!parseInt(ref) ){ return null; debugger;}
	if(ref.indexOf(',') != -1 && SEP != ',') return ref.replace(/\,/g, SEP);
	else
	if(ref.indexOf('.') != -1 && SEP != '.') return ref.replace(/\./g, SEP);
	else
	if(ref.indexOf(SEP) == -1) return ref+SEP+'1';
	return ref;
}
function mapLinenoToRef(lineno, SEP){
	if(typeof(SEP) == NULL || !SEP) SEP=':';
	var ref = ''; 
	var line = parseInt( lineno );
	if( typeof(line) == 'undefined' || typeof(line) != 'number'){
		debugger; return -1;
	}
	if(line==0){ if(!SEP) return '1:1';
				 else return '1'+SEP+'1'; };
	var pos;
	for(k=0; k<verseIndexes.length-1;++k){
		if(verseIndexes[k+1] > (line+1) ){//BUGFIX for boundry case when search result is first line of Sura. Test for last line too!
			pos = k; break;
		}
	}
	ref = pos +SEP+ (line - verseIndexes[pos] +2);
	return ref;
}


var mapRefToLineno = function(ref, suraNo, versNo){
	if(!ref) return -1;
	var lineno = -1, startline=-1, maxVerses=-1;
	var SEP = ':';
	if(ref.indexOf(',') != -1) SEP = ',';
	else if(ref.indexOf(':') != -1) SEP = ':';
	else{ suraNo=ref; versNo=1;}
	if(!suraNo) suraNo = ref.split(SEP)[0]; 
	if(!versNo) versNo = ref.split(SEP)[1];
	suraNo = parseInt(suraNo); versNo = parseInt(versNo);
	if(suraNo != NaN && versNo != NaN && typeof(suraNo) == 'number' && typeof(versNo) == 'number') {
		if(QuranData && QuranData.Sura && QuranData.Sura[ suraNo ]){
			startline = QuranData.Sura[ suraNo ][0];
			maxVerses = QuranData.Sura[ suraNo ][1];
			if(versNo <=0 || versNo > maxVerses) return -1; //invalid verse number
			lineoffset = versNo - 1;
			return (startline + lineoffset);
		}
	}else debugger;
	return -1;  //there was some error
}

var mapRefToSurano = function(ref, suraNo, versNo){
	if(!ref) return -1;
	var lineno = -1;
	var SEP = ':';
	if(ref.indexOf(',') != -1) SEP = ',';
	else if(ref.indexOf(':') != -1) SEP = ':';
	else{ suraNo=ref; versNo=1;}
	if(!suraNo) suraNo = ref.split(SEP)[0]; 
	if(!versNo) versNo = ref.split(SEP)[1];
	suraNo = parseInt(suraNo); versNo = parseInt(versNo);
	if(suraNo != NaN && versNo != NaN && typeof(suraNo) == 'number' && typeof(versNo) == 'number') {
		return suraNo;
	}else debugger;
	return -1;  //there was some error
}

var mapRefToVersno = function(ref, suraNo, versNo){
	if(!ref) return -1;
	var lineno = -1;
	var SEP = ':';
	if(ref.indexOf(',') != -1) SEP = ',';
	else if(ref.indexOf(':') != -1) SEP = ':';
	else{ suraNo=ref; versNo=1;}
	if(!suraNo) suraNo = ref.split(SEP)[0]; 
	if(!versNo) versNo = ref.split(SEP)[1];
	suraNo = parseInt(suraNo); versNo = parseInt(versNo);
	if(suraNo != NaN && versNo != NaN && typeof(suraNo) == 'number' && typeof(versNo) == 'number') {
		return versNo;
	}else debugger;
	return -1;  //there was some error
}

var mapRefToWordno = function(ref, suraNo, versNo, wordNo){
	if(!ref) return -1;
	var lineno = -1;
	var SEP = ':';
	if(ref.indexOf(',') != -1) SEP = ',';
	else if(ref.indexOf(':') != -1) SEP = ':';
	else{ suraNo=ref; versNo=1; wordNo=1; }
	if(ref.split(SEP).length <= 2) return -1; //dont have wordNo
	if(!suraNo) suraNo = ref.split(SEP)[0]; 
	if(!versNo) versNo = ref.split(SEP)[1];
	if(!wordNo) wordNo = ref.split(SEP)[2];
	suraNo = parseInt(suraNo); versNo = parseInt(versNo); wordNo = parseInt(wordNo);
	if(suraNo != NaN && versNo != NaN && typeof(suraNo) == 'number' && typeof(versNo) == 'number' && 
	   wordNo != NaN && typeof(wordNo) == 'number' ) {
		return wordNo;
	}else debugger;
	return -1;  //there was some error
}

var suraInfo = function(suraNo){
	if(!suraNo) return;
	suraNo = parseInt(suraNo);
	if(suraNo != NaN && typeof(suraNo) == 'number') {
		if(QuranData && QuranData.Sura && QuranData.Sura[ suraNo ]){
			var qObj = QuranData.Sura[ suraNo ];//var text = qObj[4] +' - '+ qObj[5] +' - '+ qObj[6] +' - '+ qObj[7] +'  '+ qObj[1] +' '+ qObj[2] +' '+ qObj[3];
			return qObj;
		}
	}else debugger;	
}

var BuckToBare = function(str){ if(!str) return;
	str = str.replace(/[{`><]/g, 'A').replace(/[\&]/g, 'w').replace(/[}]/g, 'y').replace( /[\FNK#aeiou~\^]/g, '');
	return str;
}


var EnToAr = function(word){
	if(!word) return null;
	initializeMapper();
	var ar = '', l, letter, found=false;
	try{
		var wordArr = word.split(''); //split into letters.	//lookup from english to arabic letter. and return it.
		for(l=0; l<wordArr.length; ++l){
			letter = wordArr[l]; found = false;
			for(n=1; n<_buckArr.length; ++n){
				if(letter == _buckArr[n]){
					ar += _charsArr[n]; found=true;
					break;
				}
			}
			if(!found)  ar += ''; //letter; //' ??'+letter+'?? ';
		}
	}catch(ex){
		debugger;
		ar = '-err: ' + ex + ex.message + ex.lineno;
	}
	return ar;
}

var ArToEn = function(word){
	if(!word) return null;
	initializeMapper();
	var ar = '', l, letter, found=false;
	try{
		var wordArr = word.split(''); //split into letters.	//lookup from english to arabic letter. and return it.
		for(l=0; l<wordArr.length; ++l){
			letter = wordArr[l]; found = false;
			for(n=1; n<_charsArr.length; ++n){
				if(letter == _charsArr[n]){
					ar += _buckArr[n]; found=true;
					break;
				}
			}
			if(!found){  ar += ''; 
						 if(_bMAPPER_DEBUG){ 
							if(typeof(UNKNOWNS) == NULL) UNKNOWNS={}; 
							else{
								if(!UNKNOWNS[letter]){ UNKNOWNS[letter] = 1; _log('No mapping found:\t' + letter + '');  }
								else UNKNOWNS[letter] = 1+UNKNOWNS[letter];
							}								
						}
			}
		}
	}catch(ex){
		debugger;
		ar = '-err: ' + ex + ex.message + ex.lineno;
	}
	return ar;
}

var _charsArr, _buckArr, bInitialized = false;
var initializeMapper = function(){
	if(bInitialized) return;
	var qBare = null, qBuck = null;		
	var stopletters = "ۚۖۛۗۙ";
	var chars='آ ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي';
	var buck = 'A A b t v j H x d * r z s $ S D T Z E g f q k l m n h w y';
	var buckArr, charsArr;
	var ext = new Array();
	var map = { };
	charsArr = chars.split(' ');
	buckArr  = buck.split(' ');
	//mISSING CHARACTERS:		// أ إ ئ ء ة ؤ
	charsArr.push( 'ى' ); buckArr.push( 'Y' );
	charsArr.push( 'أ' ); buckArr.push( '>' );
	charsArr.push( 'إ' ); buckArr.push( '<' );	//charsArr.push( ' ' ); buckArr.push( ' ' ); //charsArr.push( '' ); buckArr.push( '' );
	charsArr.push( 'ئ' ); buckArr.push( '}' );
	charsArr.push( 'ء' ); buckArr.push( 'X' ); //buckArr.push( '\'' );
	//charsArr.push( 'ة' ); buckArr.push( 'P' );
	charsArr.push( 'ؤ' ); buckArr.push( '&' );
	//missing characters for harakath.
	charsArr.push( '\u0652' ); buckArr.push( 'o' );
	charsArr.push( '\u064e' ); buckArr.push( 'a' );
	charsArr.push( '\u0650' ); buckArr.push( 'i' );
	charsArr.push( '\u064f' ); buckArr.push( 'u' );
	charsArr.push( '\u064b' ); buckArr.push( 'F' );
	charsArr.push( '\u064d' ); buckArr.push( 'K' );
	charsArr.push( '\u064c' ); buckArr.push( 'N' );
	charsArr.push( '\u0626' ); buckArr.push( '}' );
	charsArr.push( '\u0640' ); buckArr.push( '_' );
	charsArr.push( '\u0651' ); buckArr.push( '~' );
	charsArr.push( '\u0653' ); buckArr.push( '^' );
	charsArr.push( '\u0654' ); buckArr.push( '#' );
	charsArr.push( '\u0671' ); buckArr.push( '{' );
	charsArr.push( '\u0670' ); buckArr.push( '`' );
	charsArr.push( '\u06e5' ); buckArr.push( ',' );
	charsArr.push( '\u06e6' ); buckArr.push( '.' );
	charsArr.push( 'ة' ); buckArr.push( 'p' );
	charsArr.push( '\u06df' ); buckArr.push( '@' );
	charsArr.push( '\u06e2' ); buckArr.push( '[' );
	charsArr.push( '\u06ed' ); buckArr.push( ']' );
	charsArr.push( '\u0621' ); buckArr.push( '\'' );
	charsArr.push( '\u06DC' ); buckArr.push( ':' );
	charsArr.push( '\u06E0' ); buckArr.push( '\"' );
	charsArr.push( ' ' ); buckArr.push( ' ' );
	charsArr.push( ';' ); buckArr.push( ';' );
	charsArr.push( '\n' ); buckArr.push( '\n' );
	
	charsArr.push( 'ع' ); buckArr.push( '3' ); //ayn //support for arabi/chat letters
	charsArr.push( 'ء' ); buckArr.push( '2' ); //hamza
	charsArr.push( 'ح' ); buckArr.push( '7' ); //HAA
	charsArr.push( 'خ' ); buckArr.push( '5' ); //KHAA
	charsArr.push( 'ص' ); buckArr.push( '9' ); //Saad
	charsArr.push( 'ط' ); buckArr.push( '6' ); //Thaw

	charsArr.push( charsArr[2] ); buckArr.push( 'B' ); //Support for Capital letters
	charsArr.push( charsArr[4] ); buckArr.push( 'V' );
	charsArr.push( charsArr[5] ); buckArr.push( 'J' );
	charsArr.push( charsArr[10] ); buckArr.push( 'R' );
	charsArr.push( charsArr[19] ); buckArr.push( 'G' );
	charsArr.push( charsArr[21] ); buckArr.push( 'Q' );
	charsArr.push( charsArr[23] ); buckArr.push( 'L' );
	charsArr.push( charsArr[24] ); buckArr.push( 'M' );
	charsArr.push( charsArr[27] ); buckArr.push( 'W' );
	charsArr.push( 'ة' ); buckArr.push( 'P' );
	
	//For IndoPak script extra letters
	charsArr.push( 'ی' ); buckArr.push( 'y' );
	charsArr.push( 'ۃ' ); buckArr.push( 'p' );
	charsArr.push( 'ہ' ); buckArr.push( 'h' );
	charsArr.push( 'ی' ); buckArr.push( 'Y' );
	charsArr.push( 'ک' ); buckArr.push( 'k' );
	charsArr.push( 'ۤ ' ); buckArr.push( '?' );
	charsArr.push( 'ۤۚ ' ); buckArr.push( '?' );
	charsArr.push( 'ۡ ' ); buckArr.push( '?' );
	charsArr.push( 'ۚ ' ); buckArr.push( '?' );
	charsArr.push( 'ۤ ' ); buckArr.push( '?' );

	_charsArr = charsArr; _buckArr = buckArr;
	bInitialized = true;
}		

var changeSurah = function(val){ 
	_log(val); if(! (val = parseInt(val) ) ) return;
	$('#search').val( val ); $('#Go').click();
}