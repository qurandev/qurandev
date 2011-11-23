/****************************************************************
		Suras Navigation
*****************************************************************/
function onKeyDown(e, id){ 
		if(e.keyCode == 13){			window.status = "Enter hit";
			if(id == 'edit')
				$('#btn').click(); 
		}
		else
		if( parseInt( $('#edit').val().replace(/,/g,"") ) )
			if(!e.ctrlKey && !e.shiftKey)
				return;
		if(e.ctrlKey){
			if(e.keyCode == 37) prev(); //ctrl left
			else if(e.keyCode == 39) next(); //ctrl right
			else if(e.keyCode == 38) nextsura(); //ctrl up 
			else if(e.keyCode == 40) prevsura(); //ctrl down		
		}
		else
		if(e.shiftKey){
			if(e.keyCode == 37) rrev(); //shift left
			else if(e.keyCode == 39) ffwd(); //shift right				
			else if(e.keyCode == 38) jumpToBeginOrEnd(false); //shift up
			else if(e.keyCode == 40) jumpToBeginOrEnd(true); //shift down		
		}
		if(e.keyCode == 37 && e.keyCode == 38 && e.keyCode == 39 && e.keyCode == 40)
			if(location.href.split("?").length >= 1)
				$('#edit').val( location.href.split("?")[1] );
		window.status = e.keyCode;
}

function getHashMethod(_txt){
	var txt, newurl;
	try{
		if(_txt) txt = _txt;
		else txt = $('#edit').val(); 
		if(txt == '') return; 
		txt += ''; //since it cud be int.
		if(txt){window.status = txt;
			if(parseInt( txt.replace(/,/g,"") )){ //its a ref...
				if(location.hash.indexOf('?')!= -1){//theres a method already
					newurl = location.hash.substring( 1, 1+location.hash.indexOf('?'));
					if(newurl.indexOf('search?') != -1) //If while doing search, we entered a sura ref - dont take it as a search here.
						newurl = 'sura?' + txt;
					else
						newurl = newurl + txt;
				}
				else
					newurl = "sura?" + txt;
			}
			else
				newurl = "search?" + txt;
		}
	}catch(exp){
		debugger;
		newurl = formatExp(exp, true); //'-error- ' + exp.message + exp.lineNumber;
	}
	return '' + newurl;
}

function Go(obj){// debugger;
	var txt, newurl;
	if(obj.id == 'btn')
		txt = $('#edit').val(); 
	if(txt == '') return; window.status = txt;
	if(txt){
		newurl = getHashMethod(txt);
		if(!newurl){
			if(txt.indexOf('()') != -1 || txt.indexOf('%28%29') != -1 ){ //its a function. execute it.
				newurl = txt;
			}
			else if(txt.indexOf('(') != -1 || txt.indexOf('%28') != -1 || txt.indexOf(')') != -1 || txt.indexOf('%29') != -1 ){ //its a function. execute it.
				newurl = txt;
			}
			else if(txt.indexOf('?') != -1){
				newurl = txt.split('?')[0] + '("' + txt.split('?')[1] + '")';
			}//else maybe check if a function exists by that name. or a JS can be found w that name? else use it for search.
			else if(parseInt(txt.replace(/,/g, "") )){//its a sura ref
				newurl = 'sura?' + txt;
			}
			else
				newurl = "search?" + txt;
		}
		if(newurl)
			location.href = '#' + newurl;
	}
}

function next(){
	calladjust(+1);
}
function prev(){
	calladjust(-1);
}
function ffwd(){
	calladjust(+10, true);
}
function rrev(){
	calladjust(-10, true);
}
function nextsura(){
	calladjust(+1,false,true);
}
function prevsura(){
	calladjust(-1,false,true);
}

function jumpToBeginOrEnd(toBegin){
	var url=location.href;
	var suraNo, versNo, tokenNo;
	var newurl, newparams;
	if(url.indexOf('sura')!=-1){
		var ref = location.href.split("?")[1];
		var refArr = ref.split(",");
		if(refArr.length >= 2){
			tokenNo = parseInt( refArr[2] );
		}
		if(refArr.length >= 1){
			versNo = parseInt( refArr[1] );
		}
		if(refArr.length >= 0){
			suraNo = parseInt( refArr[0] );
		}
		versNo = (toBegin ? 1 : verseCounts[ suraNo ] );
		newparams = adjust(0, suraNo, versNo, tokenNo);
		$('#edit').val( newparams ); $('#edit').focus();
		newurl = getHashMethod(newparams);
		if(!newurl) newurl = "sura?" + newparams;
		window.status = location.href = "#" + newurl;
	}
}

function calladjust(offset, capped, suraonly){
	var url=location.href;
	var suraNo, versNo, tokenNo;
	var newurl, newparams;
	var text = $('#edit').val();
	//if(url.indexOf('sura')!=-1){
	//	if( location.href.split("?")
	//	var ref = location.href.split("?")[1];
	//}	
	if(text){
		var refArr = text.split(",");
		if(refArr.length >= 2){
			tokenNo = parseInt( refArr[2] );
		}
		if(refArr.length >= 1){
			versNo = parseInt( refArr[1] );
		}
		if(refArr.length >= 0){
			suraNo = parseInt( refArr[0] );
		}
		newparams = adjust(offset, suraNo, versNo, tokenNo, capped, suraonly);
		$('#edit').val( newparams ); $('#edit').focus();
		newurl = getHashMethod(newparams);
		if(!newurl) newurl = "sura?" + newparams;
		window.status = location.href = "#" + newurl;
	}
}

function adjust(offset, suraNo, versNo, tokenNo, capped, suraonly){
	if(suraonly){
		suraNo += offset;
		if(suraNo <= 0) suraNo = 114;
		if(suraNo > 114) suraNo = 1;
		if(versNo) suraNo += ','+1; //versNo;
		if(tokenNo) suraNo += ','+1; //tokenNo;
		return suraNo;
	}
	else
	if(tokenNo){
		tokenNo += offset; 
		//for surano,versNo - get the max? min is 1. if go past that, decr/incr verses and ensure its valid.
		maxToken = verseEndings[ suraNo ][ versNo ];
		if(tokenNo > maxToken){
			tokenNo = 1; 
			versNo += offset;
			if(versNo <= 0){
				if(capped){
					versNo = 1; token=1;
				}
				else{
					suraNo += offset;
					if(suraNo <= 0) suraNo = 114;
					if(suraNo > 114) suraNo = 1;
					versNo = verseCounts[ suraNo ];
				}
			}
			if(verseCounts[suraNo] < versNo){
				if(capped)
					versNo = verseCounts[suraNo];
				else{
					versNo = 1; 
					suraNo += offset;
					if(suraNo <= 0) suraNo = 114;
					if(suraNo > 114) suraNo = 1;
				}
			}			
		}
		if(tokenNo <= 0){
			versNo += offset;
			if(versNo <= 0){
				if(capped){
					versNo = 1; token=1;
				}
				else{
					suraNo += offset;
					if(suraNo <= 0) suraNo = 114;
					if(suraNo > 114) suraNo = 1;
					versNo = verseCounts[ suraNo ];
				}
			}
			if(verseCounts[suraNo] < versNo){
				if(capped)
					versNo = verseCounts[suraNo];
				else{
					versNo = 1; 
					suraNo += offset;
					if(suraNo <= 0) suraNo = 114;
					if(suraNo > 114) suraNo = 1;
				}
			}			
			maxToken = verseEndings[ suraNo ][ versNo ];
			tokenNo = maxToken;
		}
		return suraNo +','+ versNo +','+ tokenNo;
	}
	else
	if(versNo){
		versNo += offset;
		if(versNo <= 0){
			if(capped){
				versNo = 1; token=1;
			}
			else{
				suraNo += offset;
				if(suraNo <= 0) suraNo = 114;
				if(suraNo > 114) suraNo = 1;
				versNo = verseCounts[ suraNo ];
			}
		}
		if(verseCounts[suraNo] < versNo){
			if(capped)
				versNo = verseCounts[suraNo];
			else{
				versNo = 1; 
				suraNo += offset;
				if(suraNo <= 0) suraNo = 114;
				if(suraNo > 114) suraNo = 1;
			}
		}
		return suraNo +','+ versNo;
	}
	else
	if(suraNo){
		suraNo += offset;
		if(suraNo <= 0) suraNo = 114;
		if(suraNo > 114) suraNo = 1;
		return suraNo;
	}
}
