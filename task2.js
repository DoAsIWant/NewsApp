function delay(time){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{resolve()},time);
    })
}

delay(3000).then(()=>{console.log("Test")});
