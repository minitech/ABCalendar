!function() {
	'use strict';
	
	function hasClass(element, cls) {
		return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
	}
	
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
	
	function firstOfClass(collection, cls) {
		var i, c, e = collection.length;
		
		for(i = 0; i < e; i++) {
			c = collection[i];
		
			if(hasClass(c, cls)) {
				return c;
			}
		}
		
		return null;
	}
	
	var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	
	function daysInMonth(month, year) {
		if(month === 2 && year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
			return 29;
		}
		
		return monthDays[month - 1];
	}
	
	function bindHandlers(element) {
		var that = this;
	
		var monthPicker = firstOfClass(element.getElementsByTagName('select'), 'month');
		var yearPicker = firstOfClass(element.getElementsByTagName('input'), 'year');
		
		var changeListener = function() {
			if(/^\d+$/.test(yearPicker.value) && monthPicker.selectedIndex > -1) {
				that.build(+yearPicker.value, monthPicker.selectedIndex + 1);
			}
		};
		
		if(monthPicker.addEventListener) {
			monthPicker.addEventListener('change', changeListener, false);
			yearPicker.addEventListener('change', changeListener, false);
			yearPicker.addEventListener('input', changeListener, false);
			yearPicker.addEventListener('keyup', changeListener, false);
		} else if(monthPicker.attachEvent) {
			monthPicker.attachEvent('onchange', changeListener);
			yearPicker.attachEvent('onchange', changeListener);
			yearPicker.attachEvent('onkeyup', changeListener);
		}
	}

	function ABCalendar(element) {
		var that = this;
	
		this.selected = firstOfClass(element.getElementsByTagName('td'), 'selected');
		this.days = firstOfClass(element.getElementsByTagName('div'), 'days').getElementsByTagName('span');
		this.dates = element.getElementsByTagName('table')[0];

		var clickHandler = function(e) {
			if(e.target.nodeName.toLowerCase() === 'a') {
				that.makeSelected(e.target.parentNode);
				
				e.preventDefault();
			}
		};
		
		bindHandlers.call(this, element);
		
		if(element.addEventListener) {
			element.addEventListener('click', clickHandler, false);
		} else if(element.attachEvent) {
			element.attachEvent('onclick', function() {
				clickHandler({
					target: window.event.srcElement,
					preventDefault: function() {
						window.event.returnValue = false;
					}
				});
			});
		}
	}
	
	ABCalendar.prototype.makeSelected = function(cell) {
		var selected = this.selected;
		var days = this.days;
	
		if(selected) {
			if(selected.previousElementSibling) {
				removeClass(selected.previousElementSibling, 'beside-selected');
			}
			
			if(selected.parentNode.previousElementSibling) {
				removeClass(selected.parentNode.previousElementSibling.children[indexOf(selected.parentNode.children, selected)], 'above-selected');
			}
			
			removeClass(days[indexOf(selected.parentNode.children, selected)], 'selected');
			removeClass(selected, 'selected');
		}
		
		selected = cell;
		addClass(selected, 'selected');
		addClass(days[indexOf(selected.parentNode.children, selected)], 'selected');
		
		if(selected.previousElementSibling) {
			addClass(selected.previousElementSibling, 'beside-selected');
		}
		
		if(selected.parentNode.previousElementSibling) {
			addClass(selected.parentNode.previousElementSibling.children[indexOf(selected.parentNode.children, selected)], 'above-selected');
		}
		
		this.selected = selected;
	};

	ABCalendar.prototype.build = function(year, month, selected) {
		// Some utilities:
		var currentRow = document.createElement('tr');
		var dates = this.dates;
		var i;
		var selectedCell = null;
		
		var addCell = function(content, selected) {
			var cell = document.createElement('td');
			
			if(content) {
				cell.appendChild(content);
			}
			
			currentRow.appendChild(cell);
			
			if(selected) {
				selectedCell = cell;
			}
			
			if(currentRow.children.length === 7) {
				dates.tBodies[0].appendChild(currentRow);
				currentRow = document.createElement('tr');
			}
		};
	
		// Clear whatever's in the calendar right now:
		while(dates.childNodes.length > 0) {
			dates.removeChild(dates.firstChild);
		}
		
		// Create a new body:
		dates.appendChild(document.createElement('tbody'));
	
		// Get the first day of the month:
		var firstDay = new Date(year, month - 1, 1).getDay();
		
		// Get the number of days in the month:
		var numDays = daysInMonth(month, year);
		
		// Fill until we get to day 1:
		for(i = 0; i < firstDay; i++) {
			addCell();
		}
		
		// Fill the rest of the dates:
		for(i = 1; i <= numDays; i++) {
			var content = document.createElement('a');
			
			content.href = '#';
			content.className = 'date';
			content.appendChild(document.createTextNode(i.toString()));
			
			addCell(content, i === selected);
		}
		
		// Fill the empty space until the row is full:
		while(currentRow.children.length > 0) {
			addCell();
		}
		
		// And finally, if there's a preselected cell, select it:
		if(selectedCell) {
			this.makeSelected(selectedCell);
		}
	};
	
	window.ABCalendar = ABCalendar;
}();