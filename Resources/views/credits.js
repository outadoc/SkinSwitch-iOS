var win = Ti.UI.currentWindow;
Ti.include('/includes/lib/json.i18n.js');

var scrollView = Ti.UI.createScrollView({
	height: Ti.UI.FILL,
	width: Ti.UI.FILL,
	layout: 'vertical',
	contentHeight: 'auto'
});

win.add(scrollView);

var img_logo = Ti.UI.createImageView({
	image: '/img/icon-large.png',
	top: 10
});

scrollView.add(img_logo);

var lbl_app = Ti.UI.createLabel({
	text: Ti.App.getName() + ' v' + Ti.App.getVersion(),
	top: 0,
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
});

scrollView.add(lbl_app);

var lbl_credits = Ti.UI.createLabel({
	text: '\u2713 ' + I('credits.developer') 	+ '\nBaptiste Candellier (outadoc) for outa[dev]\n\n' + 
		  '\u2713 ' + I('credits.platform') 	+ '\nAppcelerator Titanium\n\n' + 
		  '\u2713 ' + I('credits.modules') 		+ '\nKeychain module by ClearlyInnovative\n\n' + 
		  '\u2713 ' + I('credits.translators') 	+ '\nSvante Bengtson (Swedish, English)\nAntonin Langlinay (German)\nAubiet (Italian)\nAzaret (Spanish)\nGeoffrey Frogeye (German, English)\nPriinceOverkill (Dutch, Norwegian)\nNicolas Dimov (German)\nSilentXeno (Norwegian)\nxxElbarto88xx (German, English)\nArium_2 (English)\nBastienDuke (English)\nMatthew Laskowsky (Polish)\nВиктор Якушев (Russian)\nJoão Victor Marques Andreotti (Portuguese)\niRewiewer (Romanian)\nJun1292 (Chinese Traditional)\n\n' + 
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
	top: 15,
	height: Ti.UI.SIZE,
	textAlign: 'center'
});

scrollView.add(lbl_credits);

var img_outadev = Ti.UI.createImageView({
	image: '/img/outadev.png',
	top: 20,
	bottom: 20,
	height: Ti.UI.SIZE
});

img_outadev.addEventListener('click', function(e) {
	Ti.Platform.openURL('http://dev.outadoc.fr');
});

scrollView.add(img_outadev);
