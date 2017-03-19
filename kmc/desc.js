function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}
function hideAllSeasons() {
	$(".selected").removeClass("selected");
}
function hideAllPages() {
	$(".season").removeClass("shown");
}
function hideAllCovers() {
	$('.tracklist_active').css("height", "");
	$('.tracklist_active .tracks').css("height", "");
	$(".tracklist_active").removeClass("tracklist_active");
	$(".arrow_0").removeClass("arrow_0");
	$(".arrow_1").removeClass("arrow_1");
	$(".arrow_2").removeClass("arrow_2");
	$(".arrow_3").removeClass("arrow_3");
	$(".arrow_4").removeClass("arrow_4");
	$(".cover_active").removeClass("cover_active");
}
function switchTo(seasonName) {
	var seasonObj = document.getElementById("nav" + seasonName);
	var seasonPageObj = document.getElementById(seasonName);
	if(!hasClass(seasonObj, "selected")) {
		hideAllSeasons();
		seasonObj.className += " selected";
		hideAllPages();
		seasonPageObj.className += " shown";
		hideAllCovers();
	}
}
var decodeEntities = (function() {
  // this prevents any overhead from creating the object each time
  var element = document.createElement('div');

  function decodeHTMLEntities (str) {
    if(str && typeof str === 'string') {
      // strip script/html tags
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
      element.innerHTML = str;
      str = element.textContent;
      element.textContent = '';
    }

    return str;
  }

  return decodeHTMLEntities;
})();
var lastCover = -1;

function toggleCover(id) {
	var season = '';
	var offset = 0;
	if(id < music.S1.length)
		season = 'S1';
	else if(id < music.S1.length + music.S2.length) {
		season = 'S2';
		offset = music.S1.length;
	} else if(id < music.S1.length + music.S2.length + music.Movie.length) {
		season = 'Movie';
		offset = music.S1.length + music.S2.length;
	} else {
		season = 'Game';
		offset = music.S1.length + music.S2.length + music.Movie.length;
	}
	
	var elementObj = document.getElementById("tracklist_" + (Math.floor((id-offset)/5)+Math.ceil(offset/5)));
	var beforeHide = hasClass(elementObj, "tracklist_active");
	
	hideAllCovers();
	
	if(!beforeHide || lastCover != id) {
		elementObj.className += " tracklist_active";
		document.getElementById("cover_" + id).className += " cover_active";
		elementObj.className += " arrow_"+((id-offset)%5);
		
		var title = $('.tracklist_active .tracks h2').get(0);
		if(title.hasChildNodes())
			title.removeChild(title.lastChild);
		title.appendChild(document.createTextNode(music[season][id-offset].title + ' ' + music[season][id-offset].subtitle));
		
		var detail = $('.tracklist_active .tracks h3').get(0);
		if(detail.hasChildNodes())
			detail.removeChild(detail.lastChild);
		detail.appendChild(document.createTextNode(
			music[season][id-offset].meta["Catalog No."] +
			' (' + music[season][id-offset].meta["Date released"] + ')'
		));
		
		var warning = $('.tracklist_active .tracks h4').get(0);
		if(warning.hasChildNodes())
			warning.removeChild(warning.lastChild);
		if(music[season][id-offset].tracksInfo.codec == 'N/A')
			warning.appendChild(document.createTextNode('Not available in torrent'));
		
		var trackObj = $('.tracklist_active .tracks ol').get(0);
		while (trackObj.hasChildNodes()) {
			trackObj.removeChild(trackObj.lastChild);
		}
		if(music[season][id-offset].tracklist != undefined) {
			var listObj;
			var musicTitle;
			var musicDuration;
			for(var i=0;i<music[season][id-offset].tracklist.length;i++) {
				listObj = document.createElement('li');
				
				musicTitle = document.createElement('span');
				musicTitle.classList.add('music_title');
				musicTitle.appendChild(document.createTextNode(
					decodeEntities(music[season][id-offset].tracklist[i].title)
				));
				listObj.appendChild(musicTitle);
				
				if(music[season][id-offset].tracklist[i].duration != undefined) {
					musicTitle = document.createElement('span');
					musicTitle.classList.add('music_duration');
					musicTitle.appendChild(document.createTextNode(
						Math.floor(music[season][id-offset].tracklist[i].duration/60) +
						':' +
						("0" + (music[season][id-offset].tracklist[i].duration%60)).slice(-2)
					));
					listObj.appendChild(musicTitle);
				}
				trackObj.appendChild(listObj);
			}
		} else {
			errorObj = document.createElement('h4');
			errorObj.appendChild(document.createTextNode('No tracklist information available'));
			trackObj.appendChild(errorObj);
		}
		
		/* box-shadow: rgb(179, 185, 146) 12px 15px 20px inset, rgb(179, 185, 146) -1px -1px 150px inset; */
		
		$('.tracklist_active .tracks .tlcover').css('background-image','url(' + music[season][id-offset].cover + ')');
		if(music[season][id-offset].colors != undefined) {
			var magicShadow = music[season][id-offset].colors.primary + 
				' 12px 15px 20px inset, ' + music[season][id-offset].colors.primary + ' -1px -1px 150px inset';
			$('.tracklist_active .tracks .tlcover').css('-moz-box-shadow',magicShadow);
			$('.tracklist_active .tracks .tlcover').css('-webkit-box-shadow',magicShadow);
			$('.tracklist_active .tracks .tlcover').css('box-shadow',magicShadow);
			$('.tracklist_active .tracks').css('background-color',music[season][id-offset].colors.primary);
			//NEW
			$('.tracklist_active .arrow').css('background-color',music[season][id-offset].colors.primary);
			/*$('.tracklist_active .arrowcontainer .arrow').css('border-bottom','16px solid ' + music[season][id-offset].colors.primary);
			$('.tracklist_active .arrowcontainer .arrow').css('-moz-box-shadow','-0px 1px 0px ' + music[season][id-offset].colors.primary);
			$('.tracklist_active .arrowcontainer .arrow').css('-webkit-box-shadow','-0px 1px 0px ' + music[season][id-offset].colors.primary);
			$('.tracklist_active .arrowcontainer .arrow').css('box-shadow','-0px 1px 0px ' + music[season][id-offset].colors.primary);
			*/
			$('.tracklist_active .tracks h2, .tracklist_active .tracks ol li .music_title').css('color',music[season][id-offset].colors.secondary);
			$('.tracklist_active .tracks h3, .tracklist_active .tracks ol li').css('color',music[season][id-offset].colors.tertiary);
			if($('.music_duration').length)
				$('.music_duration').css('color',music[season][id-offset].colors.tertiary);
			$('.tracklist_active .tracks').css('text-shadow',music[season][id-offset].colors.shadow + ' 0 1px 0');
		} else {
			$('.tracklist_active .tracks .tlcover').css('-moz-box-shadow','');
			$('.tracklist_active .tracks .tlcover').css('-webkit-box-shadow','');
			$('.tracklist_active .tracks .tlcover').css('box-shadow','');
			$('.tracklist_active .tracks').css('background-color','');
			//NEW
			$('.tracklist_active .arrow').css('background-color',music[season][id-offset].colors.primary);
			/*$('.tracklist_active .arrowcontainer .arrow').css('border-bottom','');
			$('.tracklist_active .arrowcontainer .arrow').css('-moz-box-shadow','');
			$('.tracklist_active .arrowcontainer .arrow').css('-webkit-box-shadow','');
			$('.tracklist_active .arrowcontainer .arrow').css('box-shadow','');
			*/
			$('.tracklist_active .tracks h2, ' +
			'.tracklist_active .tracks ol li .music_title, ' +
			'.tracklist_active .tracks h3, ' +
			'.tracklist_active .tracks ol li').css('color','');
			if($('.music_duration').length)
				$('.music_duration').css('color','');
			$('.tracklist_active .tracks').css('text-shadow','');
		}
		/*
		$('.tracklist_active .tracks .tlcover img').get(0).src = music[season][id-offset].cover;
		$('.tracklist_active').css('background-image','url(' + music[season][id-offset].cover + ')');
		*/
		
		setTimeout(function() {
			$('.shown:not(:animated)').animate({
				scrollTop: $('.cover_active')[0].offsetTop - 46
			}, 500);
		}, 500);
		
		var frame_height = $('.tracklist_active .tracks ol').height();
		if (frame_height + 106 > 450) {
			$('.tracklist_active').height(450);
			$('.tracklist_active .tracks').height(418);
		} else if (frame_height > 150) {
			$('.tracklist_active').height(frame_height + 106);
			$('.tracklist_active .tracks').height(frame_height + 58);
		} else {
			$('.tracklist_active').css("height", "");
			$('.tracklist_active .tracks').css("height", "");
		}
	}
	
	lastCover = id;
}

var currID = 0;

function loadData(seasonID) {
	var elem = document.getElementById(seasonID);
	/* Cover Variables */
	var coverArt;
	var coverDiv;
	var completeTitle;
	var title;
	var subtitle;
	/* Tracklist Variables */
	var listContainer;
	var arrowContainer;
	var arrow;
	var tracklist;
	var listOrdered;
	var listCover;
	/* temp variables */
	var currTitle;
	var currSubtitle;
	
	for(var i=0;i<music[seasonID].length;i++) {
		coverDiv = document.createElement('div');
		coverDiv.classList.add('cover');
		if(music[seasonID][i].tracksInfo.codec == 'N/A')
			coverDiv.classList.add('na');
		coverDiv.id = 'cover_' + (i+currID)
		
		coverArt = document.createElement('img');
		coverArt.src = music[seasonID][i].cover;
		coverArt.id = 'coverart_' + (i+currID);
		/* IE has no suppport for dataset
		coverArt.dataset.numID = i+currID;
		coverArt.addEventListener('click', function(event){toggleCover(this.dataset.numID)}, false);
		*/
		coverArt.setAttribute('data-numID',i+currID);
		coverArt.addEventListener('click', function(event){toggleCover(this.getAttribute('data-numID'))}, false);
		coverDiv.appendChild(coverArt);
		
		coverDiv.appendChild(document.createElement('br'));
		
		completeTitle = document.createElement('span');
		completeTitle.classList.add('title');
		completeTitle.id = 'title_' + (i+currID);
		
		title = document.createElement('span');
		title.classList.add('firstline');
		
		if(music[seasonID][i].subtitle != undefined &&
		   music[seasonID][i].subtitle != "") {
			if(music[seasonID][i].meta.swapmode != undefined &&
			   music[seasonID][i].meta.swapmode == "noswap") {
				currTitle = music[seasonID][i].title;
				currSubtitle = music[seasonID][i].subtitle;
			} else {
				currTitle = music[seasonID][i].subtitle;
				currSubtitle = music[seasonID][i].title;
			}
			title.appendChild(document.createTextNode(currTitle));
			completeTitle.appendChild(title);
			completeTitle.appendChild(document.createElement('br'));
			
			subtitle = document.createElement('span');
			subtitle.classList.add('secondline');
			subtitle.appendChild(document.createTextNode(currSubtitle));
			completeTitle.appendChild(subtitle);
		} else {
			title.appendChild(document.createTextNode(music[seasonID][i].title));
			completeTitle.appendChild(title);
			completeTitle.appendChild(document.createElement('br'));
		}
		
		coverDiv.appendChild(completeTitle);
		elem.appendChild(coverDiv);
		
		if(i%5==4) {
			listContainer = document.createElement('div');
			listContainer.classList.add('tracklist');
			listContainer.id = 'tracklist_' + (Math.floor(i/5)+Math.ceil(currID/5));
			
			//arrowContainer = document.createElement('div');
			//arrowContainer.classList.add('arrowcontainer');
			
			arrow = document.createElement('div');
			arrow.classList.add('arrow');
			arrow.id = 'arrow_' + (i-4)/5;
			//arrowContainer.appendChild(arrow);
			//listContainer.appendChild(arrowContainer);
			listContainer.appendChild(arrow);
			
			tracklist = document.createElement('div');
			tracklist.classList.add('tracks');
			tracklist.id = 'tracks_' + (Math.floor(i/5)+Math.ceil(currID/5));
			
			listCover = document.createElement('div');
			//listCover.appendChild(document.createElement('img'));
			listCover.classList.add('tlcover');
			tracklist.appendChild(listCover);
			
			tracklist.appendChild(document.createElement('h2'));
			tracklist.appendChild(document.createElement('h3'));
			tracklist.appendChild(document.createElement('h4'));
			
			listOrdered = document.createElement('ol');
			listOrdered.classList.add('tl');
			listOrdered.id = 'tl_' + (Math.floor(i/5)+Math.ceil(currID/5));
			tracklist.appendChild(listOrdered);
			
			listContainer.appendChild(tracklist);
			elem.appendChild(listContainer);
		}
	}
	
	if(((music[seasonID].length-1)%5)<4) {
		listContainer = document.createElement('div');
		listContainer.classList.add('tracklist');
		listContainer.id = 'tracklist_' + (Math.floor(music[seasonID].length/5)+Math.ceil(currID/5));
		
		//arrowContainer = document.createElement('div');
		//arrowContainer.classList.add('arrowcontainer');
		
		arrow = document.createElement('div');
		arrow.classList.add('arrow');
		arrow.id = 'arrow_' + Math.floor(music[seasonID].length/5);
		//arrowContainer.appendChild(arrow);
		//listContainer.appendChild(arrowContainer);
		listContainer.appendChild(arrow);
		
		tracklist = document.createElement('div');
		tracklist.classList.add('tracks');
		tracklist.id = 'tracks_' + (Math.floor(music[seasonID].length/5)+Math.ceil(currID/5));
		
		listCover = document.createElement('div');
		//listCover.appendChild(document.createElement('img'));
		listCover.classList.add('tlcover');
		tracklist.appendChild(listCover);
		
		tracklist.appendChild(document.createElement('h2'));
		tracklist.appendChild(document.createElement('h3'));
		tracklist.appendChild(document.createElement('h4'));
		
		listOrdered = document.createElement('ol');
		listOrdered.classList.add('tl');
		listOrdered.id = 'tl_' + (Math.floor(music[seasonID].length/5)+Math.ceil(currID/5));
		tracklist.appendChild(listOrdered);
		
		listContainer.appendChild(tracklist);
		elem.appendChild(listContainer);
	}
	
	currID += music[seasonID].length;
}