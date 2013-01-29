(function() {
	
	exports.getEmptyRow = function() {
		var row = Ti.UI.createTableViewRow({
			editable: false,
			isPlaceholder: true,
			selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.GRAY
		});
		
		var lbl_title = Ti.UI.createLabel({
			text: I('main.noContent.title'),
			font: {
				fontWeight: 'bold',
				fontSize: 17
			},
			top: 7,
			left: 10,
			right: 10,
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE
		});
		
		row.add(lbl_title);
		
		var lbl_help = Ti.UI.createLabel({
			text: I('main.noContent.help'),
			top: 35,
			bottom: 10,
			left: 10,
			right: 10,
			font: {
				fontSize: 15
			},
			height: Ti.UI.SIZE,
			width: Ti.UI.FILL
		});
		
		row.add(lbl_help);
	}
	
})();
