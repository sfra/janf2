/* global define */
define('scroll',[],()=>{
    

    
    window.addEventListener('scroll', () => {
        (() => {
            document.body.style.backgroundPositionY = -5 * window.pageYOffset + 'px';
        })();

    }, false);
    
    
    


    
    
    
});