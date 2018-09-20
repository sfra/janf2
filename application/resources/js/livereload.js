
window.onload = ()=>{
    'use strict';
    let socket = io.connect('http://0.0.0.0:3003');
    socket.on('fs',()=>{
        document.location.href=document.location.href;

    });
    
    socket.on('hello',(data)=>{
        console.log(data);
    });
};