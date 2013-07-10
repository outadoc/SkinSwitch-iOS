Ti.include('/includes/lib/json.i18n.js');

var Database = require('/includes/db'),
	Utils = require('/includes/utils'),
	Ui = require('/includes/ui'),
	Network = require('/includes/network'),

win = Ti.UI.currentWindow,
loadingWin = Utils.createLoadingWindow(),

adLoaded = true,

skinsShowcase = Ti.UI.createScrollView({
	contentWidth: Ti.UI.FILL,
  	contentHeight: Ti.UI.SIZE,
  	verticalBounce: true,
  	showVerticalScrollIndicator: true
});

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

		if(adLoaded) {
			skinsShowcase.setBottom(50);
		}
		
		skinsShowcase.add(Ui.getSkinsShowcaseView(Database.getSkins(), win));
		
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
	if(Utils.isiPad()) {
		var info_win = Ti.UI.createWindow({
			url: 'add_process/info.js',
			title: I('addProcess.skinInfo.title'),
			backgroundImage: Utils.getBGImage(),
			barColor: Utils.getNavColor(),
			backgroundRepeat: true,
			masterGroup: win.masterGroup
		});

		info_win.addEventListener('close', function() {
			updateSkinsList();
			info_win = null;
		});
		
		Utils.closeiPadSkinDetails(win);
		win.masterGroup.open(info_win);
	} else {
		var win_add = Ti.UI.createWindow({
			url: 'add_process/info.js',
			title: I('addProcess.skinInfo.title'),
			backgroundImage: Utils.getBGImage(),
			barColor: Utils.getNavColor(),
			backgroundRepeat: true
		}),
	
		container = Ti.UI.createWindow({
			navBarHidden: true
		}),
	
		navGroup = Ti.UI.iPhone.createNavigationGroup({
			window: win_add
		});
	
		container.add(navGroup);
		
		container.addEventListener('close', function() {
			updateSkinsList();
			
			container = null;
			navGroup = null;
			win_add = null;
		});
	
		win_add.navGroup = navGroup;
		win_add.container = container;
	
		container.open({
			modal: true
		});
	}
});

var b_settings = Ti.UI.createButton({
	image: '/img/gear.png'
});

b_settings.addEventListener('click', function() {
	if(Utils.isiPad()) {
		var win_settings = Ti.UI.createWindow({
			title: I('settings.title'),
			backgroundImage: Utils.getBGImage(),
			barColor: Utils.getNavColor(),
			backgroundRepeat: true,
			layout: 'vertical',
			url: 'settings.js',
			masterGroup: win.masterGroup
		});

		win_settings.addEventListener('close', function() {
			updateSkinsList();
			win_settings = null;
		});
		
		Utils.closeiPadSkinDetails(win);
		win.masterGroup.open(win_settings);
	} else {
		var win_settings = Ti.UI.createWindow({
			title: I('settings.title'),
			barColor: Utils.getNavColor(),
			backgroundImage: Utils.getBGImage(),
			backgroundRepeat: true,
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
			updateSkinsList();
			
			container = null;
			navGroup = null;
			win_settings = null;
		});
	
		win_settings.navGroup = navGroup;
		win_settings.container = container;
	
		container.open({
			modal: true
		});
	}
});

win.setLeftNavButton(b_settings);
win.setRightNavButton(b_add);

updateSkinsList();

if(!Utils.isiPad()) {
	var adView = Ti.UI.iOS.createAdView({
		adSize: Ti.UI.iOS.AD_SIZE_PORTRAIT,
		height: Ti.UI.SIZE,
		width: Ti.UI.FILL,
		bottom: 0
	});
	
	adView.addEventListener('load', function(e) {
		adLoaded = true;
		
		if(skinsShowcase != null) {
			skinsShowcase.animate({
				bottom: 50,
				duration: 200
			});
		}
	});
	
	adView.addEventListener('error', function(e) {
		adLoaded = false;
		
		if(skinsShowcase != null) {
			skinsShowcase.animate({
				bottom: 0,
				duration: 200
			});
		}
	});
	
	win.add(adView);
}