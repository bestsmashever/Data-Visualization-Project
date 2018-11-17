// Carousel

console.log('in js')
document.querySelector("#tableau1").style.display = 'none';
document.querySelector("#tableau2").style.display = 'none';
document.querySelector("#tableau3").style.display = 'none';
document.querySelector("#tableau4").style.display = 'none';
var liveMap = 0;

function showMap(id){
    if (liveMap == id){
        var tableau = "#tableau" + id;
        console.log(tableau);
        var map = document.querySelector(tableau);
        console.log(map)
        map.style.display = 'none';
    }
    else{
        
    document.querySelector("#tableau1").style.display = 'none';
    document.querySelector("#tableau2").style.display = 'none';
    document.querySelector("#tableau3").style.display = 'none';
    document.querySelector("#tableau4").style.display = 'none';

    console.log(id);
    var tableau = "#tableau" + id;
    console.log(tableau);
    var map = document.querySelector(tableau);
    console.log(map)
    map.style.display = 'block';
    liveMap = id;
    }
    



}

// comment cards
$.fn.commentCards = function(){

    return this.each(function(){
  
      var $this = $(this),
          $cards = $this.find('.card'),
          $current = $cards.filter('.card--current'),
          $next;
  
      $cards.on('click',function(){
        if ( !$current.is(this) ) {
          $cards.removeClass('card--current card--out card--next');
          $current.addClass('card--out');
          $current = $(this).addClass('card--current');
          $next = $current.next();
          $next = $next.length ? $next : $cards.first();
          $next.addClass('card--next');
        }
      });
  
      if ( !$current.length ) {
        $current = $cards.last();
        $cards.first().trigger('click');
      }
  
      $this.addClass('cards--active');
  
    })
  
  };
  
  $('.cards').commentCards();
