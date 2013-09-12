var Utils = require('/includes/utils'),
	Database = require('/includes/db');

Ti.UI.setBackgroundColor(Utils.getNavColor());

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

	if(Utils.isiPad()) {
		Ti.include('/includes/lib/json.i18n.js');
		
		var detailWin = Ti.UI.createWindow({
			title: I('main.skinDetails.title'),
			barColor: Utils.getNavColor(),
			backgroundColor: '#eeeeee',
			translucent: false
		}),

		initialInfoView = getInitialInfoView(),
		content = initialInfoView;

		var masterWin = Ti.UI.createWindow({
			url: 'views/main.js',
			backgroundImage: Utils.getListBackgroundImage(),
			barColor: Utils.getNavColor(),
			title: I('main.skinList'),
			detailWin: detailWin,
			detailContent: content,
			initialInfoView: initialInfoView,
			extendEdges:[Ti.UI.EXTEND_EDGE_TOP],
			top: (Utils.getMajorOsVersion() >= 7) ? 15 : undefined
		}),

		splitWin = Ti.UI.iPad.createSplitWindow({
			detailView: Ti.UI.iPhone.createNavigationGroup({
				window: detailWin,
				tintColor: Utils.getBarTintColor()
			}),
			masterView: Ti.UI.iPhone.createNavigationGroup({
				window: masterWin,
				tintColor: Utils.getBarTintColor()
			}),
			showMasterInPortrait: true
		}),
		
		adView = Ti.UI.iOS.createAdView({
			height: Ti.UI.SIZE,
			width: Ti.UI.FILL,
			bottom: 0
		});
		
		adView.hide();
		
		adView.addEventListener('load', function(e) {
			var anim = {
				bottom: 65,
				duration: 200
			};
			
			adView.show();
			detailWin.animate(anim);
			masterWin.animate(anim);
		});
		
		adView.addEventListener('error', function(e) {
			var anim = {
				bottom: 0,
				duration: 200
			};
			
			adView.hide();
			detailWin.animate(anim);
			masterWin.animate(anim);
		});
	
		detailWin.add(content);
		splitWin.add(adView);

		splitWin.open();

		masterWin.masterGroup = splitWin.masterView;
		masterWin.detailGroup = splitWin.detailView;

		detailWin.masterGroup = splitWin.masterView;
		detailWin.detailGroup = splitWin.detailView;

		function getInitialInfoView() {
			var view = Ti.UI.createView({
				height: Ti.UI.SIZE,
				width: Ti.UI.FILL
			}),

			lbl_noskin = Ti.UI.createLabel({
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
	} else {
		var mainWin = Ti.UI.createWindow({
			url: 'views/main.js',
			tabBarHidden: true,
			title: Ti.App.getName(),
			backgroundImage: Utils.getListBackgroundImage(),
			barColor: Utils.getNavColor(),
			extendEdges:[Ti.UI.EXTEND_EDGE_TOP],
			top: (Utils.getMajorOsVersion() >= 7) ? 15 : undefined,
			statusBarStyle: (Utils.getMajorOsVersion() < 7) ? Ti.UI.iPhone.StatusBar.DEFAULT : undefined
		}),

		container = Ti.UI.iOS.createNavigationWindow({
			window: mainWin,
			tintColor: Utils.getBarTintColor()
		});

		container.open();
	}
}