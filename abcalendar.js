function addClass(element, cls) {
	element.className += ' ' + cls;
}

function removeClass(element, cls) {
	var classes = element.className.split(' ');
	var r = [];
	var i, c, l = classes.length;
	
	for(i = 0; i < l; i++) {
		c = classes[i];
		
		if(c && c !== cls) {
			r.push(c);
		}
	}
	
	element.className = r.join(' ');
}

function indexOf(collection, item) {
	var i, l = collection.length;
	
	for(i = 0; i < l; i++) {
		if(collection[i] === item) {
			return i;
		}
	}
	
	return -1;
}

function ABCalendar(element) {
	var selected = element.querySelector('td.selected');

	element.addEventListener('click', function(e) {
		if(e.target.nodeName.toLowerCase() === 'a') {
			if(selected) {
				if(selected.previousElementSibling) {
					removeClass(selected.previousElementSibling, 'beside-selected');
				}
				
				if(selected.parentNode.previousElementSibling) {
					removeClass(selected.parentNode.previousElementSibling.children[indexOf(selected.parentNode.children, selected)], 'above-selected');
				}
				
				removeClass(selected, 'selected');
			}
			
			selected = e.target.parentNode;
			addClass(selected, 'selected');
			
			if(selected.previousElementSibling) {
				addClass(selected.previousElementSibling, 'beside-selected');
			}
			
			if(selected.parentNode.previousElementSibling) {
				addClass(selected.parentNode.previousElementSibling.children[indexOf(selected.parentNode.children, selected)], 'above-selected');
			}
			
			e.preventDefault();
		}
	});
}