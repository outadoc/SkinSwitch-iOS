(function() {

	var Network = require('/includes/network');
	var Ui = require('/includes/ui');

	exports.getSkins = function() {
		var rows = [];
		var db = Ti.Database.open('skins');
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

			if(Ti.Platform.getOsname() === 'iphone') {
				var b_wear = Ti.UI.createButton({
					style: Ti.UI.iPhone.SystemButton.DISCLOSURE,
					right: 10,
					width: 10,
					height: 10
				});

				b_wear.addEventListener('click', function(e) {
					Network.uploadSkin(e.source.parent.skinData.id, e.source.parent.skinData.name);
				});

				row.add(b_wear);
			} else if(Ti.Platform.getOsname() === 'ipad') {
				row.hasChild = true;
			}

			var img_skin = Ti.UI.createImageView({
				image: Ti.Filesystem.getFile(Utils.getSkinsDir() + skinList.fieldByName('id') + '/front.png').getNativePath(),
				height: Ti.UI.FILL,
				width: 22,
				top: 2,
				bottom: 2,
				left: 13
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
		var db = Ti.Database.open('skins');
		var rowCount = db.execute('SELECT * FROM skins').getRowCount();
		db.close();
		return rowCount;
	}

})();
