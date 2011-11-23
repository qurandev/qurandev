/*
yamli.com
http://www.comp.leeds.ac.uk/cgi-bin/scmss/arabic_roots.py
http://en.wikipedia.org/wiki/Buckwalter_transliteration
http://corpus.quran.com/java/buckwalter.jsp
http://www.copypastecode.com/#tdomf_form1
YAMLI for iphone

<!-- YAMLI CODE START -->
<script type="text/javascript" src="http://api.yamli.com/js/yamli_api.js"></script>
<script type="text/javascript">
  if (typeof(Yamli) == "object" && Yamli.init( { uiLanguage: "en" , startMode: "onOrUserDefault" } ))
  {
    Yamli.yamlify( "", { settingsPlacement: "bottomLeft" } );
  }
</script>
<!-- YAMLI CODE END -->

Arabic alphabet 	ﺍ 	ﺏ 	ﺕ 	ﺙ 	ﺝ 	ﺡ 	ﺥ 	ﺩ 	ﺫ 	ﺭ 	ﺯ 	ﺱ 	ﺵ 	ﺹ 	ﺽ 	ﻁ 	ﻅ 	ﻉ 	ﻍ 	ﻑ 	ﻕ 	ﻙ 	ﻝ 	ﻡ 	ﻥ 	هـ 	ﻭ 	ﻱ
DIN 31635 	ā 	b 	t 	ṯ 	ǧ 	ḥ 	ḫ 	d 	ḏ 	r 	z 	s 	š 	ṣ 	ḍ 	ṭ 	ẓ 	ʿ 	ġ 	f 	q 	k 	l 	m 	n 	h 	w/ū 	y/ī
Buckwalter 	A 	b 	t 	v 	j 	H 	x 	d 	* 	r 	z 	s 	$ 	S 	D 	T 	Z 	E 	g 	f 	q 	k 	l 	m 	n 	h 	w 	y

Arabic alphabet 	ﺍ 	ﺏ 	ﺕ 	ﺙ 	ﺝ 	ﺡ 	ﺥ 	ﺩ 	ﺫ 	ﺭ 	ﺯ 	ﺱ 	ﺵ 	ﺹ 	ﺽ 	ﻁ 	ﻅ 	ﻉ 	ﻍ 	ﻑ 	ﻕ 	ﻙ 	ﻝ 	ﻡ 	ﻥ 	هـ 	ﻭ 	ﻱ
Buckwalter 	A 	b 	t 	v 	j 	H 	x 	d 	* 	r 	z 	s 	$ 	S 	D 	T 	Z 	E 	g 	f 	q 	k 	l 	m 	n 	h 	w 	y

Arabic alphabet 	ﺍ 	ﺏ 	ﺕ 	ﺙ 	ﺝ 	ﺡ 	ﺥ 	ﺩ 	ﺫ 	ﺭ 	ﺯ 	ﺱ 	ﺵ 	ﺹ 	ﺽ 	ﻁ 	ﻅ 	ﻉ 	ﻍ 	ﻑ 	ﻕ 	ﻙ 	ﻝ 	ﻡ 	ﻥ 	هـ 	ﻭ 	ﻱ
Buckwalter 	A 	b 	t 	v 	j 	H 	x 	d 	* 	r 	z 	s 	$ 	S 	D 	T 	Z 	E 	g 	f 	q 	k 	l 	m 	n 	h 	w 	y

Arabic alphabet 'ﺍ ﺏ ﺕ ﺙ ﺝ ﺡ ﺥ ﺩ ﺫ ﺭ ﺯ ﺱ ﺵ ﺹ ﺽ ﻁ ﻅ ﻉ ﻍ ﻑ ﻕ ﻙ ﻝ ﻡ ﻥ هـ ﻭ ﻱ'
Buckwalter 'A b t v j H x d * r z s $ S D T Z E g f q k l m n h w y'
*/


var arabic = 'ﺍ ﺏ ﺕ ﺙ ﺝ ﺡ ﺥ ﺩ ﺫ ﺭ ﺯ ﺱ ﺵ ﺹ ﺽ ﻁ ﻅ ﻉ ﻍ ﻑ ﻕ ﻙ ﻝ ﻡ ﻥ هـ ﻭ ﻱ';
var buck = 'A b t v j H x d * r z s $ S D T Z E g f q k l m n h w y';
var arabicArr = arabic.split(' ');
var buckArr   = buck.split(' ');

