var Utils = require('/includes/utils');
var Database = require('/includes/db');

try {
	//if the skins db exists
	if(Database.getDatabaseFile().exists()) {
		//make a backup while it's here
		Database.backupDatabase();
		//continue to start the application
		startApp();
	} else {
		//else, if the skins db doesn't exist
		//check if there is a backup of it
		if(Database.getDatabaseBackupFile().exists()) {
			//if there is, ask the user if he wants to restore it
			Database.askForDatabaseRestore('the database is missing', function() {
				startApp();
			});
		} else {
			//if there's no backup (typically when we start the app for the first time), just start
			startApp();
		}
	}
} catch(e) {
	//if we catch any error, check if there's a backup and ask the user if he wants to restore it
	if(Database.getDatabaseBackupFile().exists()) {
		Database.askForDatabaseRestore(e, function() {
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
			url: 'views/main.js',
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
			backgroundColor: '#eeeeee'
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
			url: 'views/main.js',
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
				width: Ti.UI.FILL
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

			return view;
		}

	}
}