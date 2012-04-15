var win = Ti.UI.currentWindow;
Ti.include('/includes/utils.js')

function getTextFieldRow(text, hint) {
	var row = Ti.UI.createTableViewRow({
		title:text,
		selectionStyle:Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
	});

	var textfield = Ti.UI.createTextField({
		color:'#336699',
		height:35,
		top:4,
		right:25,
		width:165,
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_NONE,
		returnKeyType:Ti.UI.RETURNKEY_NEXT,
		hintText:hint
	});

	textfield.addEventListener('focus', function() {
		view.animate({
			bottom:90,
			duration:300
		});
	});

	textfield.addEventListener('blur', function() {
		view.animate({
			bottom:0,
			duration:300
		});
	});

	row.add(textfield);
	return row;
}

var view = Ti.UI.createView({
	bottom:0,
	height:420
});

win.add(view);

var tableView = Ti.UI.createTableView({
	data:[getTextFieldRow('Skin Name', 'Name of your skin'), getTextFieldRow('Description', 'Description of your skin')],
	style:Ti.UI.iPhone.TableViewStyle.GROUPED,
	backgroundImage:null,
	scrollable:false,
	height:160
});

view.add(tableView);

tableView.data[0].rows[0].children[0].addEventListener('return', function(e) {
	tableView.data[0].rows[1].children[0].focus();
});
var b_next = Ti.UI.createButton({
	title:'Next'
});

b_next.addEventListener('click', function(e) {
	if(tableView.data[0].rows[0].children[0].getValue() == '' && tableView.data[0].rows[1].children[0].getValue() == '') {
		alert('You must specify a name and a description for this skin.');
	} else if(tableView.data[0].rows[0].children[0].getValue() == '') {
		alert('You must specify a name for this skin.');
	} else if(tableView.data[0].rows[1].children[0].getValue() == '') {
		alert('You must specify a description for this skin.');
	} else if(tableView.data[0].rows[0].children[0].getValue().length > 16) {
		alert('The name must be shorter than 16 characters.');
	} else {
		var optionDialog = Ti.UI.createOptionDialog({
			title:'Add the skin...',
			options:['From a pseudo', 'From an URL', 'Cancel'],
			cancel:2
		});

		optionDialog.addEventListener('click', function(e) {
			var win_next = Ti.UI.createWindow({
				skinName:tableView.data[0].rows[0].children[0].getValue(),
				skinDesc:tableView.data[0].rows[1].children[0].getValue(),
				backButtonTitle:'Skin Info',
				backgroundImage:getBGImage(),
				barColor:getNavColor(),
				backgroundRepeat:true,
				navGroup:win.navGroup,
				container:win.container
			});

			if(e.index == 0) {
				win_next.setUrl('url_select.js');
				win_next.from = 'pseudo';
				win_next.setTitle('From a pseudo');

				win.navGroup.open(win_next);
			} else if(e.index == 1) {
				win_next.setUrl('url_select.js');
				win_next.from = 'url';
				win_next.setTitle('From an URL');

				win.navGroup.open(win_next);
			}
		});

		optionDialog.show();
	}
});

win.setRightNavButton(b_next);

var b_close = Ti.UI.createButton({
	title:'Close'
});

b_close.addEventListener('click', function(e) {
	win.container.close();
});

win.setLeftNavButton(b_close);
