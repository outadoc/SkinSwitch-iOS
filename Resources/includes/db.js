(function() {

	exports.getSkins = function(searchPattern) {
		var skins = [],
			db = exports.getDatabaseHandle(),
			skinsFromDB,
			orderBy = Ti.App.Properties.getString('orderBy', 'name'),
			request = 'SELECT * FROM skins WHERE upper(name) LIKE upper(?)';
			
		searchPattern = '%' + searchPattern + '%';
		
		if(orderBy == 'date') {
			request += ' ORDER BY timestamp';
		} else {
			request += ' ORDER BY name';
		}
		
		skinsFromDB = db.execute(request, [searchPattern]);

		while(skinsFromDB.isValidRow()) {
			skins.push({
				id: skinsFromDB.fieldByName('id'),
				desc: skinsFromDB.fieldByName('description'),
				time: parseInt(skinsFromDB.fieldByName('timestamp')),
				name: skinsFromDB.fieldByName('name')
			});
			
			skinsFromDB.next();
		}
		
		skinsFromDB.close();
		db.close();
		return skins;
	};

	exports.getSkinCount = function() {
		var rows = [],
			db = exports.getDatabaseHandle(),
			rowCount = db.execute('SELECT * FROM skins').getRowCount();
		
		db.close();
		return rowCount;
	};
	
	exports.deleteSkin = function(skinData) {
		var confirm = Ti.UI.createAlertDialog({
			title: I('main.skinDelete.title'),
			message: I('main.skinDelete.message', skinData.name),
			buttonNames: [I('main.skinDelete.okay'), I('main.skinDelete.cancel')],
			cancel: 1
		});

		confirm.show();

		confirm.addEventListener('click', function(e) {
			if(e.index == 0) {
				var db = exports.getDatabaseHandle();
				db.execute('DELETE FROM skins WHERE id=?', skinData.id);
				db.close();
			
				Ti.Filesystem.getFile(Utils.getSkinsDir() + skinData.id).deleteDirectory(true);
				updateSkinsList();
			}
		});
	};

	exports.getDatabaseHandle = function() {
		return Ti.Database.open(exports.getDatabaseName());
	};
	
	exports.getDatabaseName = function() {
		return 'skins';
	};
	
	exports.getDatabaseFile = function() {
		return Ti.Filesystem.getFile(Ti.Filesystem.applicationSupportDirectory, '../Private Documents/' + exports.getDatabaseName() + '.sql');
	};
	
	exports.getDatabaseBackupFile = function() {
		return Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, exports.getDatabaseName() + '.sql.bck');
	};

	exports.backupDatabase = function() {
		try {
			var db = exports.getDatabaseFile(),
				backup = exports.getDatabaseBackupFile();

			if(backup != null) {
				backup.deleteFile();
			}

			backup.write(db.read());
		} catch(e) {
			Ti.API.info('Error making a backup of the database: ' + e);
		}
	};

	exports.restoreDatabase = function() {
		try {
			var db = exports.getDatabaseFile(),
				backup = exports.getDatabaseBackupFile();

			if(backup != null) {
				db.deleteFile();
				db.write(backup.read());
			}
		} catch(e) {
			Ti.API.info('Error restoring a backup of the database: ' + e);
		}
	};

	exports.initializeDatabase = function() {
		var db = exports.getDatabaseHandle();
		db.execute('CREATE TABLE IF NOT EXISTS skins (id VARCHAR(16) PRIMARY KEY, name VARCHAR(16) NOT NULL, description TEXT NOT NULL, timestamp VARCHAR(16) NOT NULL)');
		db.file.setRemoteBackup(Ti.App.Properties.getBool('syncToCloud', true));
		db.close();
	};

	exports.askForDatabaseRestore = function(reason, successCallback) {
		var backupTime = new Date(exports.getDatabaseBackupFile().modificationTimestamp()),
		alert_restore = Ti.UI.createAlertDialog({
			title: I('restoreDatabase.title'),
			message: I('restoreDatabase.message', reason, backupTime.toUTCString()),
			buttonNames: [I('restoreDatabase.no'), I('restoreDatabase.yes')],
			cancel: 0
		});

		alert_restore.addEventListener('click', function(e) {
			if(e.index == 1) {
				exports.restoreDatabase();
			}
			successCallback();
		});

		alert_restore.show();
	};
	
	exports.beginSkinAdditionProcess = function(button) {
		if(button === undefined) button = {};
		
		//if we're adding a new skin to the database, ask for more info
		var optionDialog = Ti.UI.createOptionDialog({
			title: I('addProcess.skinInfo.method.title'),
			options: [I('addProcess.skinInfo.method.search'), I('addProcess.skinInfo.method.pseudo'), I('addProcess.skinInfo.method.url'), I('addProcess.skinInfo.method.cancel')],
			cancel: 3
		});
		
		button.isShowingPrompt = true;
		
		optionDialog.addEventListener('click', function(e) {
			button.isShowingPrompt = false;
			
			if(e.index == 0 || e.index == 1 || e.index == 2) {				
				var win_next = Ti.UI.createWindow({
					backgroundImage: Utils.getModalBackgroundImage(),
					barColor: Utils.getNavColor(),
					translucent: false
				});
				
				if(e.index == 0) {
					win_next.setUrl('add_process/search.js');
				} else if(e.index == 1) {
					win_next.setTitle(I('addProcess.skinInfo.method.pseudo'));
					win_next.setUrl('add_process/url_select.js');
					win_next.from = 'username';
				} else if(e.index == 2) {
					win_next.setTitle(I('addProcess.skinInfo.method.url'));
					win_next.setUrl('add_process/url_select.js');
					win_next.from = 'url';
				} 
				
				container = Ti.UI.createWindow({
					navBarHidden: true
				}),
			
				navGroup = Ti.UI.iPhone.createNavigationGroup({
					window: win_next,
					tintColor: Utils.getBarTintColor()
				});
			
				container.add(navGroup);
				
				container.addEventListener('close', function() {
					updateSkinsList();
					
					container = null;
					navGroup = null;
				});
			
				win_next.navGroup = navGroup;
				win_next.container = container;
			
				container.open({
					modal: true,
					modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
				});
			}			
		});

		optionDialog.show({
			animated: true,
			view: button
		});
	};
	
})();
