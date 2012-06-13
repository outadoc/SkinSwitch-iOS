Ti.include('/includes/network.js');

function getSkins() {
	var rows = [];
	var db = Ti.Database.open('skins');
	var skinList = db.execute('SELECT * FROM skins');

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
			height: 45,
			leftImage: '/img/blank.png',
			removePanel: function() {
				this.isExpanded = false;
			},
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
				uploadSkin(e.source.parent.skinData.id, e.source.parent.skinData.name);
			});

			row.add(b_wear);
		} else if(Ti.Platform.getOsname() === 'ipad') {
			row.hasChild = true;
		}

		var img_skin = Ti.UI.createImageView({
			image: Ti.Filesystem.getFile(getSkinsDir() + skinList.fieldByName('id') + '/front.png').getNativePath(),
			height: Ti.UI.FILL,
			width: 18,
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
		var row = {
			title: I('main.noContent'),
			editable: false,
			isPlaceholder: true
		};

		rows.push(row);
	}

	function sortRows(ob1, ob2) {
		if(ob1.title > ob2.title) {
			return 1;
		} else if(ob1.title < ob2.title) {
			return -1;
		}
		return 0;
	}

	rows = rows.sort(sortRows);

	db.close();
	return rows;
}

function getSkinCount() {
	var rows = [];
	var db = Ti.Database.open('skins');
	var rowCount = db.execute('SELECT * FROM skins').getRowCount();
	db.close();
	return rowCount;
}