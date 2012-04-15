function getSkins()
{
	var rows = [];
	var db = Ti.Database.open('skins');
	var skinList = db.execute('SELECT * FROM skins');

	while(skinList.isValidRow()) {
		var row = Ti.UI.createTableViewRow({
			skinID:skinList.fieldByName('id'),
			title:skinList.fieldByName('name'),
			skinDesc:skinList.fieldByName('description'),
			skinTime:parseInt(skinList.fieldByName('timestamp')),

			editable:true,
			isExpanded:false,
			isPlaceHolder:false,
			hasChild:true,

			removePanel: function()
			{
				this.setHasChild(true);
				this.remove(this.children[0]);
				this.children[0] = null;
				this.isExpanded = false;
			}

		});

		rows.push(row);
		skinList.next();
	}
	skinList.close();

	if(rows.length == 0) {
		var row = {
			title:'No content at the moment',
			editable:false,
			isPlaceHolder:true
		};

		rows.push(row);
	}

	function sortRows(ob1, ob2)
	{
		if(ob1.title > ob2.title) {
			return 1;
		}
		else if(ob1.title < ob2.title) {
			return -1;
		}
		return 0;
	}

	rows = rows.sort(sortRows);

	db.close();
	return rows;
}

function getSkinCount()
{
	var rows = [];
	var db = Ti.Database.open('skins');
	var rowCount = db.execute('SELECT * FROM skins').getRowCount();
	db.close();
	return rowCount;
}