Ti.include('/includes/lib/json.i18n.js');

var Database = require('/includes/db'),
	Utils = require('/includes/utils'),
	Ui = require('/includes/ui'),
	Network = require('/includes/network'),

win = Ti.UI.currentWindow,
loadingWin = Ui.createLoadingWindow(),

adLoaded = false,

searchBar = Ti.UI.createSearchBar({
	top: 0,
	width: Ti.UI.FILL,
	barColor: Utils.getNavColor(),
	hintText: 'Search in your skins...',
	showCancel: true
}),

skinsShowcase = Ti.UI.createScrollView({
	contentWidth: Ti.UI.FILL,
  	contentHeight: Ti.UI.SIZE,
  	verticalBounce: true,
  	showVerticalScrollIndicator: true
});

win.add(searchBar);
win.add(skinsShowcase);
loadingWin.open();

function updateSkinsList() {
	loadingWin.open();
	
	skinsShowcase.animate({
		opacity: 0,
		duration: 100,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
	}, function() {
		var view = skinsShowcase.children[0];
		
		if(view != null) {
			skinsShowcase.remove(view);
			view = null;
		}

		if(adLoaded && !Utils.isiPad()) {
			skinsShowcase.setBottom(50);
		}
		
		skinsShowcase.add(Ui.createSkinsShowcaseView(Database.getSkins((searchBar.value != null) ? searchBar.value : ''), win));
		
		skinsShowcase.animate({
			opacity: 1,
			duration: 100,
			curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
		});
		
		loadingWin.close();
	});
}

var b_add = Ti.UI.createButton({
	systemButton: Ti.UI.iPhone.SystemButton.ADD
});

b_add.addEventListener('click', function(e) {
	if(!e.source.isShowingPrompt) {
		Database.beginSkinAdditionProcess(e.source);
	}
});

var b_settings = Ti.UI.createButton({
	image: '/img/gear.png'
});

b_settings.addEventListener('click', function() {
	var win_settings = Ti.UI.createWindow({
		title: I('settings.title'),
		barColor: Utils.getNavColor(),
		backgroundImage: Utils.getModalBackgroundImage(),
		url: 'settings.js',
		layout: 'vertical'
	}),

	container = Ti.UI.createWindow({
		navBarHidden: true
	}),
	
	navGroup = Ti.UI.iPhone.createNavigationGroup({
		window: win_settings
	});

	container.add(navGroup);
	
	container.addEventListener('close', function() {			
		container = null;
		navGroup = null;
		win_settings = null;
	});

	win_settings.navGroup = navGroup;
	win_settings.container = container;

	container.open({
		modal: true,
		modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
	});
});

win.setLeftNavButton(b_settings);
win.setRightNavButton(b_add);

updateSkinsList();

searchBar.addEventListener('return', function(e) {
	updateSkinsList();
});

searchBar.addEventListener('cancel', function(e) {
	e.source.value = '';
	updateSkinsList();
	e.source.blur();
});

searchBar.addEventListener('change', function(e) {
	if(e.source.value == '') {
		updateSkinsList();
	}
});

if(!Utils.isiPad()) {
	var adView = Ti.UI.iOS.createAdView({
		adSize: Ti.UI.iOS.AD_SIZE_PORTRAIT,
		height: Ti.UI.SIZE,
		width: Ti.UI.FILL,
		bottom: 0
	});
	
	adView.hide();
	
	adView.addEventListener('load', function(e) {
		adLoaded = true;
		adView.show();
		
		if(skinsShowcase != null) {
			skinsShowcase.animate({
				bottom: 50,
				duration: 200
			});
		}
	});
	
	adView.addEventListener('error', function(e) {
		adLoaded = false;
		adView.hide();
		
		if(skinsShowcase != null) {
			skinsShowcase.animate({
				bottom: 0,
				duration: 200
			});
		}
	});
	
	win.add(adView);
}