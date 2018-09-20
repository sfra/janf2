/* global define, document, sessionStorage */
define('switchPage', ['__ajax'], function (__ajax) {
  'use strict';
  let $mainSection = document.querySelector('.main-section');

  function switchPage(link, $target) {

    let ajax = new __ajax(`/content/${link}.html`, {});


    sessionStorage.setItem('current', link);


    document.querySelector('.main-section > header').innerText = link.replace('_', ' ');

    if (link === 'additional') {
      return;
    }




    ajax.get().then((data) => {



      let $parent = $target.parentElement;

      if ($parent.parentElement.classList.contains('extensible')) {
        $parent.parentElement.classList.add('active');
      }


      for (let i = 0, max = $parent.children.length; i < max; i++) {
        $parent.children[i].classList.remove('active');
      }

      $target.classList.add('active');


      $mainSection.querySelector('article').classList.add('hidding');

      setTimeout(() => {
        $mainSection.querySelector('article').classList.remove('hidding');
        if (window.location.href.match('get')) {
          return;
        }
        $mainSection.querySelector('article').innerHTML = data;



      }, 1000);



    });

  }

  return switchPage;
});
