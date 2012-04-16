Ti.include('/includes/utils.js');
Ti.UI.setBackgroundColor('#000');

var db = Ti.Database.open('skins');
db.execute('CREATE TABLE IF NOT EXISTS skins (id VARCHAR(16) PRIMARY KEY, name VARCHAR(16) NOT NULL, description TEXT NOT NULL, timestamp VARCHAR(16) NOT NULL)');
db.file.setRemoteBackup(true);
db.close();

var mainWin = Ti.UI.createWindow({
	backgroundImage:getBGImage(),
	url:'views/main.js',
	tabBarHidden:true,
	title:Ti.App.getName(),
	barColor:getNavColor()
});

var navGroup = Ti.UI.iPhone.createNavigationGroup({
	window:mainWin
});

var container = Ti.UI.createWindow({
	navBarHidden:true
});

container.add(navGroup);
container.open({
	modal:false
});