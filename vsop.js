'use strict';

const KEY_UP = 38;
const KEY_DOWN = 40;
var currentSection = 0;
var cantidadSecciones = 0;
var enAnimacion = false;
var currentHeight = 0;

function getWindowHeight() {
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

function initMainContainer() {
  $('html').css({
    'overflow':'hidden',
    'height': '100%'
  });
  $('body').css({
    'overflow':'hidden',
    'height': '100%'
  });
  $('#VerticalScrollFullPage').css({
    'height':'100%',
    'position':'relative',
    'transition':'all 1s ease 0s',
    'transform':'translate(0px,0px)'
  });
}

function initSecciones() {
  $('.section').each(function(i){
    $(this).attr('id','section'+i);
    $(this).css({
      'height':getWindowHeight()
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
  transitionScroll(delta);
}

$(document).ready(function() {
  initMainContainer();
  initSecciones();

  // KEYS
  $(document).keydown(function(event) {
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
  var mc = new Hammer(vsop);
  mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
  mc.on('panup', function() {
      transitionScroll(-1);
  });
  mc.on('pandown', function() {
      transitionScroll(1);
  });

  $(window).resize(function() {
    setSecciones();
  });
});
