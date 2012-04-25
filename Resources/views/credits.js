var win = Ti.UI.currentWindow;
Ti.include('/includes/lib/json.i18n.js');

var scrollView = Ti.UI.createScrollView({
	height: Ti.UI.FILL,
	width: Ti.UI.FILL,
	layout: 'vertical',
	contentHeight: 'auto'
});

win.add(scrollView);

var img_logo = Ti.UI.createImageView({
	image: '/img/icon-large.png',
	top: 10
});

scrollView.add(img_logo);

var lbl_app = Ti.UI.createLabel({
	text: Ti.App.getName() + ' v' + Ti.App.getVersion(),
	top: 0,
	color: '#F8F8F8',
	font: {
		fontSize: 20,
		fontWeight: 'bold'
	},
	shadowColor: 'black',
	shadowOffset: {
		x: 0,
		y: 1
	}
});

scrollView.add(lbl_app);

var lbl_credits = Ti.UI.createLabel({
	text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean imperdiet, arcu sed tincidunt tempus, arcu tellus mattis sem, volutpat fringilla velit magna vitae risus. Ut in convallis tortor. Aliquam sed placerat nisl. Fusce ante augue, ornare imperdiet vehicula at, vulputate et ipsum. Vestibulum eleifend mauris sit amet dui imperdiet aliquet. Ut vel nulla a nisi eleifend congue. Etiam tempus auctor nisl. Duis ultrices, dui ut condimentum vehicula, augue lacus scelerisque elit, et faucibus ipsum lorem vel nibh. Proin ac ipsum cursus mauris accumsan tincidunt vitae quis diam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Pellentesque faucibus molestie leo cursus aliquam. Maecenas tristique lobortis nunc. Fusce in erat nibh, ac iaculis sem.',
	font: {
		fontSize: 16
	},
	color: 'white',
	shadowColor: 'black',
	shadowOffset: {
		x: 0,
		y: 1
	},
	width: 280,
	top: 15,
	height: Ti.UI.FILL,
	textAlign: 'center'
});

scrollView.add(lbl_credits);
