var Utils = require('/includes/utils');
var Database = require('/includes/db');

Ti.UI.setBackgroundColor('#000');

try {
	//if the skins db exists
	if(Ti.Filesystem.getFile(Ti.Filesystem.applicationSupportDirectory, '../Private Documents/' + Database.getDbName() + '.sql').exists()) {
		//make a backup while it's here
		Database.backupDatabase();
		//continue to start the application
		startApp();
	} else {
		//else, if the skins db doesn't exist
		//check if there is a backup of it
		if(Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, Database.getDbName() + '.sql.bck').exists()) {
			//if there is, ask the user if he wants to restore it
			Database.askForDatabaseRestore(function() {
				startApp();
			});
		} else {
			//if there's no backup (typically when we start the app for the first time), just start
			startApp();
		}
	}
} catch(e) {
	//if we catch any error, check if there's a backup and ask the user if he wants to restore it
	if(Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, Database.getDbName() + '.sql.bck').exists()) {
		Database.askForDatabaseRestore(function() {
			startApp();
		});
	} else {
		//if there's nothing we can do, just act like nothing happened
		startApp();
	}
}

function startApp() {
	Database.initializeDatabase();

	if(Utils.isiPhone()) {
		var mainWin = Ti.UI.createWindow({
			url: 'views/main_iphone.js',
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
	} else if(Utils.isiPad()) {
		Ti.include('/includes/lib/json.i18n.js');

		var detailWin = Ti.UI.createWindow({
			title: I('main.skinDetails.title'),
			barColor: Utils.getNavColor(),
			backgroundGradient: {
				colors: ['c6c6c6', 'e4e4e4']
			}
		});

		var initialInfoView = getInitialInfoView();
		var content = initialInfoView;
		detailWin.add(content);

		var iad = Ti.UI.iOS.createAdView({
			height: Ti.UI.SIZE,
			width: Ti.UI.FIT,
			bottom: 0
		});

		detailWin.add(iad);

		var masterWin = Ti.UI.createWindow({
			url: 'views/main_ipad.js',
			backgroundImage: Utils.getBGImage(),
			barColor: Utils.getNavColor(),
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
				title: I('main.addSkin'),
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
					url: 'views/add_process/info.js',
					title: I('addProcess.skinInfo.title'),
					backgroundImage: Utils.getBGImage(),
					barColor: Utils.getNavColor(),
					backgroundRepeat: true,
					masterGroup: splitWin.masterView
				});

				info_win.addEventListener('close', function(e) {
					b_add.setEnabled(true);
				});

				b_add.setEnabled(false);
				splitWin.masterView.open(info_win);
			});

			view.add(b_add);

			var b_settings = Ti.UI.createButton({
				title: I('main.editSettings'),
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
					barColor: Utils.getNavColor(),
					url: 'views/settings.js',
					masterGroup: splitWin.masterView
				});

				win_settings.addEventListener('close', function(e) {
					b_settings.setEnabled(true);
				});

				b_settings.setEnabled(false);
				splitWin.masterView.open(win_settings);
			});

			view.add(b_settings);

			return view;
		}

	}
}