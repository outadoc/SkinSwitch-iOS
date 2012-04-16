function getRandomID() {
	return String(Math.floor(Math.random() * 98765862));
}

function getSkinsDir() {
	Titanium.Filesystem.getFile(Titanium.Filesystem.getApplicationDataDirectory() + 'skins/').createDirectory();
	return Titanium.Filesystem.getApplicationDataDirectory() + 'skins/';
}

function getBGImage() {
	return '/img/bg.png';
}

function getNavColor() {
	return '#888888';
}

function getHeaderFooterView(text, height) {
	var label = Ti.UI.createLabel({
		text:text,
		color:'#F8F8F8',
		font: {
			fontSize:15,
			fontWeight:'bold'
		},
		shadowColor:'black',
		shadowOffset: {
			x:0,
			y:1
		},
		top:5,
		left:15,
		width:295
	});
	
	var view = Ti.UI.createView({
		height:height
	});
	
	view.add(label);
	return view;
}