var Utils = require('/includes/utils');
Ti.UI.setBackgroundColor('#000');

var db = Ti.Database.open('skins');
db.execute('CREATE TABLE IF NOT EXISTS skins (id VARCHAR(16) PRIMARY KEY, name VARCHAR(16) NOT NULL, description TEXT NOT NULL, timestamp VARCHAR(16) NOT NULL)');
db.file.setRemoteBackup(true);
db.close();

if(Ti.Platform.getOsname() === 'iphone') {
	var mainWin = Ti.UI.createWindow({
		url: 'views_iphone/main.js',
		tabBarHidden: true,
		title: Ti.App.getName(),
		backgroundImage: Utils.getBGImage(),
		barColor: Utils.getNavColor()
	});

	var navGroup = Ti.UI.iPhone.createNavigationGroup({
		window: mainWin
	});

	var container = Ti.UI.createWindow({
		navBarHidden: true
	});

	container.add(navGroup);
	container.open({
		modal: false
	});
} else if(Ti.Platform.getOsname() === 'ipad') {
	Ti.include('/includes/lib/json.i18n.js');

	var detailWin = Ti.UI.createWindow({
		title: I('main.skinDetails.title'),
		backgroundGradient: {
			colors: ['c6c6c6', 'e4e4e4']
		}
	});

	var initialInfoView = getInitialInfoView();
	var content = initialInfoView;
	detailWin.add(content);

	var iad = Ti.UI.iOS.createAdView({
		adSize: Ti.UI.iOS.AD_SIZE_PORTRAIT,
		height: Ti.UI.SIZE,
		width: Ti.UI.FIT,
		bottom: 0
	});

	detailWin.add(iad);

	var masterWin = Ti.UI.createWindow({
		url: 'views_ipad/main.js',
		backgroundImage: Utils.getBGImage(),
		backgroundRepeat: true,
		title: I('main.skinList'),
		detailWin: detailWin,
		detailContent: content,
		initialInfoView: initialInfoView
	});

	var splitWin = Ti.UI.iPad.createSplitWindow({
		detailView: Ti.UI.iPhone.createNavigationGroup({
			window: detailWin
		}),
		masterView: Ti.UI.iPhone.createNavigationGroup({
			window: masterWin
		}),
		showMasterInPortrait: true
	});

	splitWin.open();

	masterWin.masterGroup = splitWin.masterView;
	masterWin.detailGroup = splitWin.detailView;

	detailWin.masterGroup = splitWin.masterView;
	detailWin.detailGroup = splitWin.detailView;

	function getInitialInfoView() {
		var view = Ti.UI.createView({
			height: Ti.UI.SIZE,
			width: Ti.UI.FILL,
			layout: 'vertical'
		});

		var lbl_noskin = Ti.UI.createLabel({
			text: I('main.noSelectedSkin'),
			width: Ti.UI.FILL,
			textAlign: 'center',
			left: view.size.width / 2 - this.width,
			height: Ti.UI.SIZE,
			font: {
				fontSize: 30
			},
			color: 'gray'
		});

		view.add(lbl_noskin);

		var b_add = Ti.UI.createButton({
			title: 'Ajouter un skin',
			font: {
				fontSize: 23
			},
			backgroundImage: '/img/button.png',
			width: Ti.UI.FILL,
			height: 50,
			left: '8%',
			right: '8%',
			top: 40
		});

		b_add.addEventListener('click', function() {
			var info_win = Ti.UI.createWindow({
				url: 'views_ipad/add_process/info.js',
				title: I('addProcess.skinInfo.title'),
				backgroundImage: Utils.getBGImage(),
				backgroundRepeat: true,
				masterGroup: splitWin.masterView
			});

			splitWin.masterView.open(info_win);
		});

		view.add(b_add);

		var b_settings = Ti.UI.createButton({
			title: 'Modifier les réglages',
			font: {
				fontSize: 23
			},
			backgroundImage: '/img/button.png',
			width: Ti.UI.FILL,
			height: 50,
			left: '8%',
			right: '8%',
			top: 10
		});

		b_settings.addEventListener('click', function() {
			var win_settings = Ti.UI.createWindow({
				title: I('settings.title'),
				backgroundImage: Utils.getBGImage(),
				backgroundRepeat: true,
				url: 'views_ipad/settings.js',
				masterGroup: splitWin.masterView
			});

			splitWin.masterView.open(win_settings);
		});

		view.add(b_settings);

		return view;
	}

}
