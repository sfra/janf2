define('index', ['switchPage', 'scroll'], function (switchPage, scroll) {


  let $mainNav = document.getElementById('main-nav');




  let current = sessionStorage.getItem('current');

  if (current !== null) {
    switchPage(current.replace(' ', '_'),
      (() => {

        for (let i = 0, max = $mainNav.children[0].children.length; i < max; i++) {




          if ($mainNav.children[0].children[i].innerText.split('\n')[0] === current.replace('_', ' ')) {
            return $mainNav.children[0].children[i];
          }
        }
      })());
  }


  $mainNav.addEventListener('click', (e) => {
    let $target = e.target;

    if ($target.tagName !== 'LI') {
      return;
    }


    let link = $target.innerText.toLocaleLowerCase().replace(/\n.+/g, '');

    console.log(link);

    switchPage(link.replace(' ', '_'), $target);




  }, false);




});
