/****************************************************************
jquery/bbq stuff: supports browser back btn, navigation support, caching etc.
*****************************************************************/
var _cache = { };
var _z;
var _url;
$(function(){  
  // Keep a mapping of url-to-container for caching purposes.
  var cache = {
    // If url is '' (no fragment), display this div's content.
    '': $('.bbq-default')
  };
  _cache = cache;
  
  // Bind an event to window.onhashchange that, when the history state changes,
  // gets the url from the hash and displays either our cached content or fetches
  // new content to be displayed.
  $(window).bind( 'hashchange', function(e) {//    debugger;
    // Get the hash (fragment) as a string, with any leading # removed. Note that
    // in jQuery 1.4, you should use e.fragment instead of $.param.fragment().
    var url = e.fragment; //$.param.fragment();
	url = unescape(url);
	_url = url;

    // Remove .bbq-current class from any previously "current" link(s).
    $( 'a.bbq-current' ).removeClass( 'bbq-current' );
    
    // Hide any visible ajax content.
    $( '.bbq-content' ).children( ':visible' ).hide();
    
    // Add .bbq-current class to "current" nav link(s), only if url isn't empty.
    url && $( 'a[href="#' + url + '"]' ).addClass( 'bbq-current' );

	//pre-render steps. COSMETIC.
	if(url.indexOf('?') != -1 ){ //if a query string passed, //if a sura or search put in URL directly, enter in textbox too for easy editing.
		$('#edit').focus(); $('#edit').val( url.substring( url.indexOf('?') + 1) ); 
	}
	///	Supported URLs:
	///		Jsura?1,1   Jsearch?mrym  		 --> J prefixed calls are Java calls (need local Java program to be running). Not used usually.
	///      sura?1,1	 search?mrym xyz?abc --> anything not J is converted like so: sura('1,1'); search('mrym'); xyz('abc'). Then eval as a function.
	///      foobar()    foobar('xyz')		 --> anything having a () or a begining '(' and a closing ')' is straight evaluated as a function.
	if(!url.beginsWith('J') && !url.beginsWith('j') && url != ''){
		var functionToEval = '';//Non java functions. so process it.
		if(url.indexOf('()') != -1 || url.indexOf('%28%29') != -1 ){ //its a function. execute it.
			functionToEval = url;
		}
		else if(url.indexOf('(') != -1 || url.indexOf('%28') != -1 || url.indexOf(')') != -1 || url.indexOf('%29') != -1 ){ //its a function. execute it.
			functionToEval = url;
		}
		else{ //its in form foo?bar. convert to foo('bar') or just foo() if no parameters.
			if(url.indexOf('?') != -1){
				functionToEval = url.split('?')[0] + '("' + url.split('?')[1] + '")';
			}
			else{//no query params function.
				functionToEval = url + '()';
			}
		}//TODO: how handle caching????  also: ensure this is a valid function, before executing.
		window.status = 'executing: ' + (functionToEval);
		_z = content = newStage( url ); 		///$('#edit').blur(); //else the navigation is messed up.
		//content.slideUp( function(){
			try{
				eval( '(' + functionToEval + ')' );
				window.status = 'Done. url: ' + url +'; Executed: ' + (functionToEval);
			}
			catch(exp){ 
				_z = content = newStage( 'ERROR' + url );
				window.status = 'ERROR executing: ' + exp.message; //debugger;
				content.html('Error while executing function: ' + '(' + functionToEval + ') ' + '<br><br>' 
							 + exp.name + '<br>Details:<br><i><small><b>' + exp.message + "<br/>"
							 + ' line number: ' + exp.lineNumber  
							 + '<br> file: <a href="' + exp.fileName + '">' + exp.fileName + '</a><br>' 
							 + '<!--' + exp.stack + '--><br></b></small></i>');
			}
			content.show();
			content.slideDown();
		//});
	}//else java function. leave url as it is. no eval, its web server call.
	else{
		if ( cache[ url ] ) {
		  // Since the element is already in the cache, it doesn't need to be
		  // created, so instead of creating it again, let's just show it!
		  cache[ url ].show();
		} 
		else {
		  // Show "loading" content while AJAX content loads.
		  $( '.bbq-loading' ).show();
		  
		  // Create container for this url's content and store a reference to it in
		  // the cache.
		  cache[ url ] = $( '<div class="bbq-item"/>' )
			
			// Append the content container to the parent container.
			.appendTo( '.bbq-content' )
			
			// Load external content via AJAX. Note that in order to keep this
			// example streamlined, only the content in .infobox is shown. You'll
			// want to change this based on your needs.
			.slideUp( function(){
				var content = cache[url]; _z = content;		  
				content.load( url, function(){
				  // Content loaded, hide "loading" content.
				  $( '.bbq-loading' ).hide();
				  content.slideDown();
				});
			});
		}
	}
	//if(url.indexOf('sura?') != -1 ){
		//content.addClass( 'ar' );//				$('#edit').val( url.substring( url.indexOf('?') + 1) ); $('#edit').focus();
		//getArabics();
		//getTrans();
	//}
  })
  
  // Since the event is only triggered when the hash changes, we need to trigger
  // the event now, to handle the hash the page may have loaded with.
  $(window).trigger( 'hashchange' );
  
});

//Creates and returns new div
function newStage( url ){
	return _cache[ url ] = $( '<div class="bbq-item"/>' )        
        // Append the content container to the parent container.
        .appendTo( '.bbq-content' ).show();
}

function formatExp(exp, compactMessage){
	return formatException(exp, compactMessage);
}
function formatException(exp, compactMessage){
	var str = '';
	if(typeof(compactMessage)!= 'undefined' && compactMessage){
		str = exp.name +' '+ exp.message +' '+ exp.lineNumber +' '+ exp.fileName;
	}
	else{
		str = exp.name + '<br>Details:<br><i><small><b>' + exp.message + "<br/>"
					 + ' line number: ' + exp.lineNumber  
					 + '<br> file: <a href="' + exp.fileName + '">' + exp.fileName + '</a><br>' 
					 + '<!--' + exp.stack + '--><br></b></small></i>';		
	}
	return str;
}

/*
function onClick(){
	var href, content;
	try{
		var href = ( $(this)[0].href );
		var content = $("#content");
		content.slideUp( function(){
			content.load( href,
				function(){
					if(href.indexOf('sura') != -1 ){ //|| href.indexOf('search') != -1){
						content.html( '<div class="ar">' + content.html() + '</div>' );
					}
					$("a").unbind( "click" );
					$("a").click( onClick );
					content.slideDown();
				}
			);
		});
	}catch(ex){
		debugger;//alert('ERROR: ' + ex);
	}
	return false;
}*/