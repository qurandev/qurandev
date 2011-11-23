/**********

Unicode Hex Value Lookup
version 1.0
last revision: 02.23.2006
steve@slayeroffice.com

Should you modify or improve upon this code,
please let me know so that I can update the version
hosted at slayeroffice.

Please leave this notice intact.

**********/

window.onload = init;
var d = document;
function init() {
	d.getElementById("ok_btn").onclick = function() {
		fieldValue = d.getElementById("character").value;
		if(fieldValue.search(/[^0-9]/g) == -1) {
			nCode = fieldValue;
		} else {
			nCode = fieldValue.charCodeAt(0);
		}
		
		d.getElementById("CharRep").value = String.fromCharCode(nCode);
		d.getElementById("UnicodeEntity").value = so_asciiToUniHex(parseInt(nCode));
		d.getElementById("HTMLEntity").value = "&#" + nCode +";"
		
	}
}

function so_asciiToUniHex(asciiCode) {
	un = asciiCode.toString(16);
	while(un.length<4) un = "0" + un;
	return "\\u" + un;
}