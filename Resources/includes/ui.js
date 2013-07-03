(function() {
	
	Ti.include('/includes/lib/json.i18n.js');
	
	exports.getSkinFrame = function(skinData, ipad_win) {
		var view = Ti.UI.createView({
			top: 10,
			width: 98,
			height: 100,
			skinData: skinData,
			layout: 'vertical'
		});
		
		var backgroundFrame = Ti.UI.createImageView({
			image: '/img/itemframe.png',
			width: 72,
			height: 72
		});
		
		var headPreview = Ti.UI.createImageView({
			image: (skinData == null) ? '/img/plus_sign.png' : exports.getHeadFromSkinID(skinData.id),
			top: 15,
			left: 15,
			right: 15,
			bottom: 15
		});
		
		backgroundFrame.add(headPreview);
		
		var title = Ti.UI.createLabel({
			text: (skinData == null) ? I('main.addSkin') : skinData.name,
			top: 3,
			width: 75,
			height: 20,
			font: {
				fontSize: (skinData == null) ? 10 : 12,
				fontFamily: 'Minecraftia'
			},
			color: 'white',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
		});
		
		view.add(backgroundFrame);
		view.add(title);
		
		if(skinData != null) {
			var startTimestamp = 0;
			var wasCanceled = false;
			
			var anim_normal = Ti.UI.createAnimation({
				transform: Ti.UI.create2DMatrix({
					rotate: 0,
					scale: 1
				}),
				duration: 300
			});
			
			var anim_maxout = Ti.UI.createAnimation({
				transform: Ti.UI.create2DMatrix({
					rotate: 180,
					scale: 1.5
				}),
				curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
				duration: 1000
			}); 
			
			anim_maxout.addEventListener('complete', function(e) {
				startTimestamp = 0;
				headPreview.animate(anim_normal);
				
				if(!wasCanceled) {
					Network.uploadSkin(skinData, ipad_win);
				}
				
				wasCanceled = false;
			});

			backgroundFrame.addEventListener('touchstart', function(e) {	
				wasCanceled = false;			
				startTimestamp = (new Date).getTime();
				headPreview.animate(anim_maxout);
			});
			
			backgroundFrame.addEventListener('touchend', function(e) {
				headPreview.animate(anim_normal);
				
				if((new Date).getTime() - startTimestamp < 300) {
					if(Utils.isiPad()) {
						exports.getiPadDetailWindow(skinData, ipad_win);
					} else {
						var win = exports.getiPhoneDetailWindow(skinData);
		
						var anim = Ti.UI.createAnimation({
							transform: Ti.UI.create2DMatrix({
								scale: 1.1
							}),
							duration: 200
						});
			
						anim.addEventListener('complete', function() {
							win.animate({
								transform: Ti.UI.create2DMatrix({
									scale: 1.0
								}),
								duration: 200
							});
						});
			
						win.open(anim);
					}
				}
				
				wasCanceled = true;
				startTimestamp = 0;
			});
			
			backgroundFrame.addEventListener('touchcancel', function(e) {
				headPreview.animate(anim_normal);
				wasCanceled = true;
				startTimestamp = 0;
			});
		} else {
			backgroundFrame.addEventListener('click', function(e) {
				if(Utils.isiPad()) {
					var info_win = Ti.UI.createWindow({
						url: 'add_process/info.js',
						title: I('addProcess.skinInfo.title'),
						backgroundImage: Utils.getBGImage(),
						barColor: Utils.getNavColor(),
						backgroundRepeat: true,
						masterGroup: win.masterGroup
					});
			
					info_win.addEventListener('close', updateSkinsList);
					ipad_win.masterGroup.open(info_win);
				} else {
					var container = Ti.UI.createWindow({
						navBarHidden: true
					});
				
					var info_win = Ti.UI.createWindow({
						url: 'add_process/info.js',
						title: I('addProcess.skinInfo.title'),
						backgroundImage: Utils.getBGImage(),
						barColor: Utils.getNavColor(),
						backgroundRepeat: true,
						container: container
						
					});
				
					var group = Ti.UI.iPhone.createNavigationGroup({
						window: info_win
					});
				
					info_win.navGroup = group;
					container.add(group);
					container.addEventListener('close', updateSkinsList);
					container.open({
						modal: true
					});
				}
			});
		}
		
		return view;
	}
	
	exports.getHeadFromSkinID = function(skinID) {
		return Ti.Filesystem.getFile(Utils.getSkinsDir() + skinID + '/front.png').read().imageAsCropped({
			height: 42,
			width: 42,
			x: 21,
			y: 0
		});
	}
	
	exports.getSkinsShowcaseView = function(skins, ipad_win) {
		var container = Ti.UI.createView({
			layout: 'horizontal',
		  	left: 13,
		  	top: 13,
		  	bottom: 13,
		  	right: 13,
		  	height: Ti.UI.FILL
		});
				
		if(Utils.isiPad()) {
			container.addEventListener('click', function(e) {
				if(e.source == container) {
					Utils.closeiPadSkinDetails(ipad_win);
				}
			});
		}
		
		if(skins == null || skins.length == 0) {
			container.add(exports.getSkinFrame(null, ipad_win));
		}
		
		for(var i = 0; i < skins.length; i ++) {
			container.add(exports.getSkinFrame(skins[i], ipad_win));
		}
		
		return container;
	}
	
	exports.getiPhoneDetailWindow = function(skinData) {
		var win = Ti.UI.createWindow({
			transform: Ti.UI.create2DMatrix({
				scale: 0
			})
		});
		
		function closeDetailWin() {
			win.close({
				transform: Ti.UI.create2DMatrix({
					scale: 0
				}),
				duration: 300
			});
		}
		
		win.addEventListener('click', function(e) {
			if(e.source == win) {
				closeDetailWin();
			}
		});
		
		win.addEventListener('close', function() {
			win = null;
		});
		
		var containerView = Ti.UI.createView({
			height: 355,
			width: 300,
			backgroundColor: '#f2f2f2',
			borderWidth: 2,
			borderColor: 'gray',
			borderRadius: 10,
			layout: 'vertical'
		});
		
		win.add(containerView);
		
		var skinInfoView = Ti.UI.createScrollView({
			width: Ti.UI.FILL,
			height: containerView.height - 45,
			contentWidth: Ti.UI.FILL,
		  	contentHeight: Ti.UI.SIZE,
		  	showVerticalScrollIndicator: true,
		  	layout: 'vertical'
		});
		
		containerView.add(skinInfoView);
		
		var skinTitle = Ti.UI.createLabel({
			text: skinData.name,
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			font: {
				fontSize: 21,
				fontFamily: 'HelveticaNeue-Light'
			},
			color: 'gray',
			top: 10,
			left: 20,
			right: 20,
			height: 25
		});
		
		skinInfoView.add(skinTitle);
		
		skinInfoView.add(exports.getHorizontalSeparator('lightGray'));
		
		var skinView = exports.getSkinPreview(skinData.id);
		skinInfoView.add(skinView);
		
		var descriptionTitle = Ti.UI.createLabel({
			text: I('main.skinDetails.description'),
			font: {
				fontSize: 17,
			},
			color: 'gray',
			top: 10,
			left: 20,
			right: 20,
			height: 20
		});
		
		skinInfoView.add(descriptionTitle);
		
		var skinDescription = Ti.UI.createLabel({
			text: skinData.desc,
			font: {
				fontSize: 15,
			},
			color: 'lightGray',
			top: 5,
			left: 20,
			right: 20
		});
		
		skinInfoView.add(skinDescription);
		
		var timestampTitle = Ti.UI.createLabel({
			text: I('main.skinDetails.creation'),
			font: {
				fontSize: 17,
			},
			color: 'gray',
			top: 10,
			left: 20,
			right: 20,
			height: 20
		});
		
		skinInfoView.add(timestampTitle);
		
		var skinTimestamp = Ti.UI.createLabel({
			text: (new Date(skinData.time)).toLocaleDateString(),
			font: {
				fontSize: 15,
			},
			color: 'lightGray',
			top: 5,
			bottom: 20,
			left: 20,
			right: 20,
			height: 20
		});
		
		skinInfoView.add(skinTimestamp);
		
		var actionView = Ti.UI.createView({
			bottom: 0,
			top: 0,
			height: 44,
			width: Ti.UI.FILL,
			layout: 'horizontal',
			borderColor: 'lightGray',
			borderWidth: 1,
		});
		
		containerView.add(actionView);
		
		var b_delete = Ti.UI.createButton({
			image : '/img/delete_grey.png',
			width: 44,
			height: Ti.UI.FILL,
			style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
			color: 'gray',
			selectedColor: 'lightGray',
			font: {
				fontSize: 17
			}
		});
		
		actionView.add(b_delete);
		actionView.add(exports.getVerticalSeparator('lightGray'));
		
		var b_edit = Ti.UI.createButton({
			image : '/img/edit_grey.png',
			width: 44,
			height: Ti.UI.FILL,
			style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
			color: 'gray',
			selectedColor: 'lightGray',
			font: {
				fontSize: 17
			}
		});
		
		actionView.add(b_edit);
		actionView.add(exports.getVerticalSeparator('lightGray'));
		
		var b_wear = Ti.UI.createButton({
			title: I('main.skinDetails.wear'),
			width: 120,
			height: Ti.UI.FILL,
			style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
			color: 'gray',
			selectedColor: 'lightGray',
			font: {
				fontSize: 17
			}
		});
		
		actionView.add(b_wear);
		actionView.add(exports.getVerticalSeparator('lightGray'));
		
		var b_close = Ti.UI.createButton({
			title: I('buttons.close'),
			width: 89,
			height: Ti.UI.FILL,
			style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
			color: 'gray',
			selectedColor: 'lightGray',
			font: {
				fontSize: 17
			}
		});
		
		actionView.add(b_close);
		
		b_close.addEventListener('click', function(e) {
			closeDetailWin();
		});
		
		b_edit.addEventListener('click', function(e) {
			var edit_win = Ti.UI.createWindow({
				url: '/views/add_process/info.js',
				skinIDToEdit: skinData.id,
				title: I('editSkin.title'),
				backgroundImage: Utils.getBGImage(),
				barColor: Utils.getNavColor(),
				backgroundRepeat: true
			});

			edit_win.addEventListener('close', updateSkinsList);
			
			edit_win.open({
				modal: true
			});
			
			closeDetailWin();
		});
		
		b_delete.addEventListener('click', function(e) {
			closeDetailWin();
			Database.deleteSkin(skinData);
		});
		
		b_wear.addEventListener('click', function(e) {
			closeDetailWin();
			Network.uploadSkin(skinData.id, skinData.name);
		});

		return win;
	}
	
	exports.getiPadDetailWindow = function(skinData, win) {
		var skinInfoView = Ti.UI.createView({
			height: Ti.UI.SIZE,
			width: Ti.UI.FILL,
			layout: 'vertical'
		});

		var skinTitle = Ti.UI.createLabel({
			text: skinData.name,
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			font: {
				fontSize: 28,
				fontFamily: 'HelveticaNeue-Light'
			},
			color: 'gray',
			top: 10,
			left: 20,
			right: 20,
			height: 25
		});
		
		skinInfoView.add(skinTitle);
		
		skinInfoView.add(exports.getHorizontalSeparator('lightGray'));
		
		var skinView = exports.getSkinPreview(skinData.id);
		skinView.top = 30;
		skinInfoView.add(skinView);
		
		var descriptionTitle = Ti.UI.createLabel({
			text: I('main.skinDetails.description'),
			font: {
				fontSize: 22,
			},
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			color: 'gray',
			top: 10,
			left: 20,
			right: 20,
			height: 20
		});
		
		skinInfoView.add(descriptionTitle);
		
		var skinDescription = Ti.UI.createLabel({
			text: skinData.desc,
			font: {
				fontSize: 20,
			},
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			color: 'lightGray',
			top: 5,
			left: 20,
			right: 20
		});
		
		skinInfoView.add(skinDescription);
		
		var timestampTitle = Ti.UI.createLabel({
			text: I('main.skinDetails.creation'),
			font: {
				fontSize: 22,
			},
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			color: 'gray',
			top: 30,
			left: 20,
			right: 20,
			height: 20
		});
		
		skinInfoView.add(timestampTitle);
		
		var skinTimestamp = Ti.UI.createLabel({
			text: (new Date(skinData.time)).toLocaleDateString(),
			font: {
				fontSize: 20,
			},
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			color: 'lightGray',
			top: 5,
			bottom: 20,
			left: 20,
			right: 20,
			height: 20
		});
		
		skinInfoView.add(skinTimestamp);
		
		//buttons
		
		var b_delete = Ti.UI.createButton({
			image: '/img/delete.png'
		});

		b_delete.addEventListener('click', function() {
			Utils.closeiPadSkinDetails(win);
			Database.deleteSkin(skinData);
		});

		var b_edit = Ti.UI.createButton({
			image: '/img/edit.png',
		});

		b_edit.addEventListener('click', function() {
			var win_info = Ti.UI.createWindow({
				url: '/views/add_process/info.js',
				title: I('editSkin.title'),
				backgroundImage: Utils.getBGImage(),
				barColor: Utils.getNavColor(),
				backgroundRepeat: true,
				masterGroup: win.masterGroup,
				skinIDToEdit: skinData.id,
				updateSkinsList: updateSkinsList
			});
			
			Utils.closeiPadSkinDetails(win);
			win.masterGroup.open(win_info);
		});

		win.detailWin.remove(win.detailContent);
		win.detailContent = Ti.UI.createView({
			layout: 'vertical',
			opacity: 0,
			height: Ti.UI.SIZE,
			top: '10%'
		});

		win.detailContent.add(skinInfoView);

		win.detailWin.setRightNavButton(b_edit, {animated: true});
		win.detailWin.setLeftNavButton(b_delete, {animated: true});

		win.detailWin.add(win.detailContent);
		win.detailContent.animate({
			opacity: 1,
			duration: 300,
			curve: Ti.UI.ANIMATION_CURVE_EASE_IN
		});
	}
	
	exports.getVerticalSeparator = function(color) {
		return Ti.UI.createView({
			width: 1,
			height: Ti.UI.FILL,
			backgroundColor: color
		});
	}
	
	exports.getHorizontalSeparator = function(color) {
		return Ti.UI.createView({
			height: 1,
			width: '80%',
			top: 10,
			backgroundColor: color
		});
	}
	
	exports.getSkinPreview = function(skinID) {
		var height = (Utils.isiPad()) ? 300 : 170,
			width = (Utils.isiPad()) ? 150 : 85;
		
		var view_skin = Ti.UI.createImageView({
			height: height,
			width: width,
			top: 15,
			bottom: 15
		});

		var img_skin_front = Ti.UI.createImageView({
			defaultImage: '/img/char_front.png',
			image: Ti.Filesystem.getFile(Utils.getSkinsDir() + skinID + '/front.png').getNativePath(),
			height: height,
			width: width,
			top: 0,
			left: 0
		});

		view_skin.add(img_skin_front);

		var img_skin_back = Ti.UI.createImageView({
			defaultImage: '/img/char_back.png',
			image: Ti.Filesystem.getFile(Utils.getSkinsDir() + skinID + '/back.png').getNativePath(),
			height: height,
			width: width,
			top: 0,
			left: 0
		});
		
		//fix bug where you wouldn't be able to click?
		view_skin.addEventListener('click', function(e) {});
		
		img_skin_front.addEventListener('click', function() {
			view_skin.animate({
				view: img_skin_back,
				transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
			});
		});

		img_skin_back.addEventListener('click', function() {
			view_skin.animate({
				view: img_skin_front,
				transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
			});
		});
		
		return view_skin;
	}
	
	exports.getSingleSearchResult = function(skinData) {
		var view = Ti.UI.createView({
			left: 10,
			right: 10,
			height: Ti.UI.SIZE,
			borderRadius: 7,
			backgroundColor: 'white',
			skinData: skinData,
			layout: 'vertical'
		});
		
		var lbl_title = Ti.UI.createLabel({
			text: skinData.title,
			left: 10,
			right: 10,
			top: 20,
			height: 20,
			color: '#4f4f4f',
			textAlign: 'center',
			font: {
				fontSize: 18
			}
		});
		
		view.add(lbl_title);
		
		var lbl_author = Ti.UI.createLabel({
			text: 'by #' + skinData.owner,
			color: '9f9f9f',
			height: 20,
			left: 10,
			right: 10,
			font: {
				fontSize: 15
			},
			textAlign: 'center',
		});
		
		view.add(lbl_author);
		
		var height = (Titanium.Platform.displayCaps.platformHeight <= 480) ? 160 : 200,
			width = (Titanium.Platform.displayCaps.platformHeight <= 480) ? 80 : 100;
			
		var view_skin = Ti.UI.createImageView({
			top: 20,
			height: height,
			width: width
		});
	
		var img_skin_front = Ti.UI.createImageView({
			defaultImage: '/img/char_front.png',
			image: '/img/char_front.png',
			isLoaded: false,
			height: height,
			width: width,
			top: 0,
			left: 0
		});
		
		view.frontImg = img_skin_front;
		view_skin.add(img_skin_front);
	
		var img_skin_back = Ti.UI.createImageView({
			defaultImage: '/img/char_back.png',
			image: '/img/char_back.png',
			isLoaded: false,
			height: height,
			width: width,
			top: 0,
			left: 0
		});
		
		view.backImg = img_skin_back;
		
		//fix bug where you wouldn't be able to click?
		view_skin.addEventListener('click', function(e) {});
		
		img_skin_front.addEventListener('click', function() {
			view_skin.animate({
				view: img_skin_back,
				transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
			});
		});
	
		img_skin_back.addEventListener('click', function() {
			view_skin.animate({
				view: img_skin_front,
				transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
			});
		});
		
		view.add(view_skin);
		
		var b_add = Ti.UI.createButton({
			title: 'Select this skin',
			left: 20,
			right: 20,
			height: 30,
			top: 20,
			bottom: 20
		});
		
		view.add(b_add);
		
		return view;
	}
	
})();
