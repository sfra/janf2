require(['__ajax'],(__ajax)=>{
    
    
    function switchPage(link){
        
        let ajax = new __ajax(`content/${link}`,{});
        
            ajax.get((data)=>{
                console.log(data);
            }, (err)=>{
            console.log(err);
            });

    };
        
    return switchPage;
    
});