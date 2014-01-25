Ti.include('/includes/lib/json.i18n.js');

var win = Ti.UI.currentWindow,

scrollView = Ti.UI.createScrollView({
	height: Ti.UI.FILL,
	width: Ti.UI.FILL,
	layout: 'vertical',
	contentHeight: 'auto'
}),

img_logo = Ti.UI.createImageView({
	image: '/img/icon-large.png',
	top: 20,
	width: 130
}),

lbl_app = Ti.UI.createLabel({
	text: Ti.App.getName() + ' v' + Ti.App.getVersion(),
	top: 5,
	color: '#F8F8F8',
	font: {
		fontSize: 20,
		fontWeight: 'bold'
	},
	shadowColor: 'black',
	shadowOffset: {
		x: 0,
		y: 1
	}
}),

lbl_credits = Ti.UI.createLabel({
	text: '\u2713 ' + I('credits.developer') 	+ '\nBaptiste Candellier (outadoc)\nfor outa[dev]\n\n' + 
		  '\u2713 ' + I('credits.platform') 	+ '\nAppcelerator Titanium\n\n' + 
		  '\u2713 ' + I('credits.modules') 		+ '\nKeychain module by ClearlyInnovative\n\n' + 
		  '\u2713 ' + I('credits.translators') 	+ '\nSvante Bengtson (Swedish, English)\nAntonin Langlinay (German)\nAubiet (Italian)\nAzaret (Spanish)\nGeoffrey Frogeye (German, English)\nPriinceOverkill (Dutch, Norwegian)\nNicolas Dimov (German)\nSilentXeno (Norwegian)\nxxElbarto88xx (German, English)\nArium_2 (English)\nBastienDuke (English)\nMatthew Laskowsky (Polish)\nВиктор Якушев (Russian)\nJoão Victor Marques Andreotti (Portuguese)\niRewiewer (Romanian)\nJun1292 (Chinese Traditional)\nPyttar (Spanish, Catalan)\nNaopee-7070 (Japanese)\nWombosvideo (German)\nAlliageOregon (German)\nJasperboy12 (Dutch)\nFirePhoenix (Swedish)\nLuuc (Dutch)\nIdoDaVinci (German)\nDeanAyalon (Hebrew)\nNivgov (Hebrew)\nfoxSay (Hebrew)\ntulkinrb (Hebrew)\nlysenyse (Danish, German)\nJappoFlappo (Dutch)\nZForever (Italian)\nJona Ramo de la Rosa (German)\nahmedwalid05 (Arabic)\nKakka Meikäläinen (Finnish)\nGerdtinus Netten (Dutch)\nSimon Jungherz (German)\nErlpil (Norwegian)\njmbargueno (Spanish)\nKevinDaBaws (Spanish)\ntomtom60 (Spanish)\nEleazar "MtrElee3" (Spanish)\n\n' + 
		  '\u2665 ' + I('credits.thanks') 		+ '\nElarcis, Antoine\xA0Cognard, EphysPotato, Ramikaze, Alexia\xa0Legros',
	font: {
		fontSize: 16
	},
	color: 'white',
	shadowColor: 'black',
	shadowOffset: {
		x: 0,
		y: 1
	},
	width: 280,
	top: 30,
	height: Ti.UI.SIZE,
	textAlign: 'center'
}),

lbl_skinmanager_intro = Ti.UI.createLabel({
	text: 'This app uses',
	color: 'white',
	top: 30
}),

lbl_skinmanager = Ti.UI.createLabel({
	text: 'Skin Manager',
	color: 'white',
	top: 0,
	font: {
		fontSize: 20,
		fontFamily: 'Minecraftia'
	}
}),

img_outadev = Ti.UI.createImageView({
	image: '/img/outadev.png',
	top: 30,
	bottom: 20,
	height: Ti.UI.SIZE
});

lbl_skinmanager.addEventListener('click', function(e) {
	Ti.Platform.openURL('http://skinmanager.fr.nf/');
});

img_outadev.addEventListener('click', function(e) {
	Ti.Platform.openURL('http://dev.outadoc.fr');
});

win.add(scrollView);

scrollView.add(img_logo);
scrollView.add(lbl_app);
scrollView.add(lbl_credits);
scrollView.add(lbl_skinmanager_intro);
scrollView.add(lbl_skinmanager);

scrollView.add(img_outadev);
