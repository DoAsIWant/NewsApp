let city = document.querySelector(".city");
let send = document.querySelector(".send__req");

class WeatherAPIError extends Error{
    constructor(message){
    super(message);
    this.name = "ValidationError";
    }
}
send.addEventListener("click",()=>{
    let cityValue = city.value;
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=779222b5c67e8d3dfd38dae89311dd4f`).
    then(response=>{
    if(response.status!==200){
        throw new WeatherAPIError("Ошибка валидации");
    }
    else{
        console.log(response.json());
    }
}).catch(err=>{
    if(err instanceof WeatherAPIError){
        console.log("Произошла ошибка Weather api")
    }
    else{
        console.log("Произошла другая ошибка")
    }
})

});