var win = Ti.UI.currentWindow;

var Utils = require('/includes/utils');

var searchBar = Ti.UI.createSearchBar({
	barColor: Utils.getNavColor(),
	hint: 'Search on MC Network',
	showCancel: true,
	top: 0
});

win.add(searchBar);

var tableView = Ti.UI.createTableView({
	height: Ti.UI.FILL
});

win.add(tableView);

searchBar.addEventListener('return', function(e) {
	e.source.blur();
	getSkinsFromSearch(e.source.getValue());
});

searchBar.addEventListener('cancel', function(e) {
	e.source.blur();
	getLatestSkins();
});

getLatestSkins();

function getSkinsFromSearch(match) {
	getRequestResults({
		method: 'searchSkinByName',
		match: searchBar.getValue(),
		max: 10,
		start: 0
	});
}

function getLatestSkins(match) {
	getRequestResults({
		method: 'getLastestSkins',
		max: 10,
		start: 0
	});
}

function getRequestResults(params) {
	var xhr = Ti.Network.createHTTPClient({
		onload: function(e) {
			var resultArray = [];
			
			try {
				resultArray = JSON.parse(this.responseText);
				
				if(resultArray.error != null) {
					alert(resultArray.error);
				} else {
					tableView.setData([]);
					
					for(var i = 0; i < resultArray.length; i++) {
						Ti.API.info(resultArray[i]);
						
						tableView.appendRow({
							title: resultArray[i].title,
							skinData: resultArray[i]
						});
					}
				}
			} catch(e) {
				alert('Couldn\'t parse result :s');
			}
		}
	});
	
	xhr.open('POST', 'http://skinmanager.fr.nf/json/');
	xhr.send(params);
}
