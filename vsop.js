'use strict';

const KEY_UP = 38;
const KEY_DOWN = 40;
const WIDTH_MOBILE = 768;
const STATE = {
	Mobile: 'mobile',
	Desktop: 'desktop'
};
var currentSection = 0;
var cantidadSecciones = 0;
var enAnimacion = false;
var currentHeight = 0;
var currentState;

function getWindowHeight() {
	return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

function getWindowWidth() {
	return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

function isMobile(w) {
	return (w < WIDTH_MOBILE);
}

function initMainContainer(of, h, tr) {
	$('html').css({
		'overflow': of,
		'height': h
	});
	$('body').css({
		'overflow': of,
		'height': h
	});
	$('#VerticalScrollFullPage').css({
		'height': h,
		'position': 'relative',
		'transition': 'all 1s ease 0s',
		'transform':' translate(0px,'+tr+'px)'
	});
}

function initSecciones(h) {
	$('.section').each(function(i){
		$(this).attr('id','section'+i);
		$(this).css({
			'height': h
		});
		cantidadSecciones = i;
	});
}

function setSecciones() {
	$('.section').each(function(){
		$(this).css({
			'height':getWindowHeight()
		});
	});
	currentHeight = -getWindowHeight() * currentSection;
	$('#VerticalScrollFullPage').css({
		'transform':'translate(0px,'+currentHeight+'px)'
	});
}

function initSetupDesktop() {
	initMainContainer('hidden', '100%', 0);
	initSecciones(getWindowHeight());
	currentState = STATE.Desktop;
}

function initSetupMobile() {
	initMainContainer('visible', 'auto', 0);
	initSecciones('auto');
	currentState = STATE.Mobile;
}

function transitionScroll(value) {
	if (enAnimacion === false) {
		if (value >= 0) {
			if(currentSection > 0){
				currentSection--;
				currentHeight = currentHeight+getWindowHeight();
				enAnimacion = true;
			}
		} else {
			if(currentSection < cantidadSecciones){
				currentSection++;
				currentHeight = currentHeight-getWindowHeight();
				enAnimacion = true;
			}
		}
		$('#VerticalScrollFullPage').css({
			'transform':'translate(0px,'+currentHeight+'px)'
		}).one('transitionend', function(){
			enAnimacion = false;
		});
	}
}

function displaywheel(e){
	var evt = window.event || e;
	var delta = evt.detail ? evt.detail*(-120) : evt.wheelDelta;
	if (!isMobile(getWindowWidth())) {
		transitionScroll(delta);
	}
}

$(document).ready(function() {

	if (!isMobile(getWindowWidth())) {
		initSetupDesktop();
	} else {
		initSetupMobile();
	}

	// KEYS
	$(document).keydown(function(event) {
		if (!isMobile(getWindowWidth())) {
			switch(event.keyCode) {
				case KEY_UP:
					transitionScroll(1);
					break;
				case KEY_DOWN:
					transitionScroll(-1);
					break;
				default:
					break;
			}
		}
		event.preventDefault();
	});

	// WHEEL
	var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? 'DOMMouseScroll' : 'mousewheel';

	if (document.attachEvent) {
		document.attachEvent('on'+mousewheelevt, displaywheel);
	}
	else if (document.addEventListener) {
		document.addEventListener(mousewheelevt, displaywheel, false);
	}

	// TOUCH
	var vsop = document.getElementById('VerticalScrollFullPage');
	delete Hammer.defaults.cssProps.userSelect;
	var mc = new Hammer(vsop, { inputClass: Hammer.TouchInput });
	mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
	mc.on('panup', function() {
		if (!isMobile(getWindowWidth())) {
			transitionScroll(-1);
		}
	});
	mc.on('pandown', function() {
		if (!isMobile(getWindowWidth())) {
			transitionScroll(1);
		}
	});

	$(window).resize(function() {
		if (!isMobile(getWindowWidth())) {
			if (currentState !== STATE.Desktop) {
				initSetupDesktop();
			}
			setSecciones();
		} else {
			if (currentState !== STATE.Mobile) {
				initSetupMobile();
			}
		}
	});
});
