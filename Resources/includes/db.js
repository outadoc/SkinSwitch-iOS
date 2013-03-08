(function() {

	Ti.include('/includes/lib/json.i18n.js');
	
	var Network = require('/includes/network');
	var Ui = require('/includes/ui');

	exports.getSkins = function() {
		var rows = [];
		var db = Ti.Database.open(exports.getDbName());
		var skinList = db.execute('SELECT * FROM skins ORDER BY name');

		while(skinList.isValidRow()) {
			var row = Ti.UI.createTableViewRow({
				skinData: {
					id: skinList.fieldByName('id'),
					desc: skinList.fieldByName('description'),
					time: parseInt(skinList.fieldByName('timestamp')),
					name: skinList.fieldByName('name')
				},
				title: skinList.fieldByName('name'),
				editable: true,
				isPlaceholder: false,
				selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.GRAY,
				height: 55,
				leftImage: '/img/blank.png',
				isExpanded: false
			});

			if(Utils.isiPhone()) {
				var b_wear = Ti.UI.createButton({
					style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
					image: '/img/upload.png',
					right: 10,
					width: 30,
					height: 30
				});

				b_wear.addEventListener('click', function(e) {
					Network.uploadSkin(e.source.parent.skinData.id, e.source.parent.skinData.name);
				});

				row.add(b_wear);
			} else if(Utils.isiPad()) {
				row.hasChild = true;
			}

			var img_skin = Ti.UI.createImageView({
				image: Ti.Filesystem.getFile(Utils.getSkinsDir() + skinList.fieldByName('id') + '/front.png').read().imageAsCropped({
					height: 42,
					width: 42,
					x: 21,
					y: 0
				}),
				height: 28,
				width: 28,
				left: 12
			});

			row.add(img_skin);

			rows.push(row);
			skinList.next();
		}
		skinList.close();

		if(rows.length == 0) {
			rows.push(Ui.getEmptyRow());
		}

		db.close();
		return rows;
	}

	exports.getSkinCount = function() {
		var rows = [];
		var db = Ti.Database.open(exports.getDbName());
		var rowCount = db.execute('SELECT * FROM skins').getRowCount();
		db.close();
		return rowCount;
	}

	exports.getDbName = function() {
		return 'skins';
	}
	
	exports.getDatabaseFile = function() {
		return Ti.Filesystem.getFile(Ti.Filesystem.applicationSupportDirectory, '../Private Documents/' + exports.getDbName() + '.sql');
	}
	
	exports.getDatabaseBackupFile = function() {
		return Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, exports.getDbName() + '.sql.bck');
	}

	exports.backupDatabase = function() {
		try {
			var db = exports.getDatabaseFile();
			var backup = exports.getDatabaseBackupFile();

			if(backup != null) {
				backup.deleteFile();
			}

			backup.write(db.read());
		} catch(e) {
			Ti.API.info('Error making a backup of the database: ' + e);
		}
	}

	exports.restoreDatabase = function() {
		try {
			var db = exports.getDatabaseFile();
			var backup = exports.getDatabaseBackupFile();

			if(backup != null) {
				db.deleteFile();
				db.write(backup.read());
			}
		} catch(e) {
			Ti.API.info('Error restoring a backup of the database: ' + e);
		}
	}

	exports.initializeDatabase = function() {
		var db = Ti.Database.open(exports.getDbName());
		db.execute('CREATE TABLE IF NOT EXISTS skins (id VARCHAR(16) PRIMARY KEY, name VARCHAR(16) NOT NULL, description TEXT NOT NULL, timestamp VARCHAR(16) NOT NULL)');
		db.file.setRemoteBackup(true);
		db.close();
	}

	exports.askForDatabaseRestore = function(reason, successCallback) {
		var backupTime = new Date(exports.getDatabaseBackupFile().modificationTimestamp());
		var alert_restore = Ti.UI.createAlertDialog({
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
	}
	
})();
