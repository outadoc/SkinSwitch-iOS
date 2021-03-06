var win = Ti.UI.currentWindow,
	Utils = require('/includes/utils');
	
Ti.include('/includes/lib/json.i18n.js');

var container = Ti.UI.createView({
	layout: 'vertical',
	height: Ti.UI.FILL
}),

lbl_question = Ti.UI.createLabel({
	text: '- ' + win.question,
	color: 'white',
	top: 30,
	left: 10,
	right: 10,
	font: {
		fontWeight: 'bold',
		fontSize: 19
	}
}),

txtfield_answer = Ti.UI.createTextField({
	borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
	autocorrect: false,
	hintText: I('addProcess.process.challenge.hint'),
	height: 40,
	top: 20,
	left: 10,
	right: 10
}),

lbl_info = Ti.UI.createLabel({
	text: I('addProcess.process.challenge.help'),
	left: (Utils.isiPad()) ? '7%' : 15,
	right: (Utils.isiPad()) ? '7%' : 15,
	top: 30,
	color: '#F8F8F8',
	font: {
		fontSize: (Utils.isiPad()) ? 18 : 15
	},
	shadowColor: 'black',
	shadowOffset: {
		x: 0,
		y: 1
	}
});

container.add(lbl_question);
container.add(txtfield_answer);
container.add(lbl_info);

win.add(container);

var b_cancel = Ti.UI.createButton({
	title: I('addProcess.process.challenge.cancel')
}),

b_continue = Ti.UI.createButton({
	title: I('addProcess.process.challenge.continue'),
	style: Titanium.UI.iPhone.SystemButtonStyle.DONE
});

b_cancel.addEventListener('click', function() {
	win.navGroup.close();
});

win.setLeftNavButton(b_cancel);

b_continue.addEventListener('click', function() {
	var xhr_answer = Ti.Network.createHTTPClient({
		onload: function(e) {
			var responseObj = {};
			
			try {
				responseObj = JSON.parse(this.getResponseText());
			} catch(e) {
				responseObj.error = this.getResponseText();
			}
			
			if(responseObj.error != null) {
				//oh noes, an error!
				//strip HTML tags
				var error = Ti.XML.parseString("<div>" + responseObj.error + "</div>");
				alert(error.getElementsByTagName("div").item(0).textContent);
			}
			
			win.navGroup.close();
		},
		onerror: function(e) {
			win.triggerError('challenge');
		},
		autoRedirect: false
	});
	
	b_continue.setEnabled(false);
	
	xhr_answer.open('POST', 'https://minecraft.net/challenge');
	xhr_answer.send({
		answer: txtfield_answer.getValue(),
		questionId: win.questionID
	});
});

win.setRightNavButton(b_continue);