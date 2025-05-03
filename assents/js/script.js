const horas = document.getElementById("horas");
const minutos = document.getElementById("minutos");
const segundos = document.getElementById("segundos");


const relogio = setInterval(function time() {
    let dateToday = new Date();
    let h = dateToday.getHours();
    let m = dateToday.getMinutes();
    let s = dateToday.getSeconds();
    // Adicionando zero a esquerda
    if (h < 10) {
        h = "0" + h;
    }
    if (m < 10) {
        m = "0" + m;
    }
    if (s < 10) {
        s = "0" + s;
    }   

    horas.textContent = h;
    minutos.textContent = m;
    segundos.textContent = s;
})

const key = "6b84c61efb72f53ffc7277534c238a7f"

function colocardadosnatela(dados){
    document.querySelector(".city").innerHTML = "Tempo em " + dados.name
    document.querySelector(".temp").innerHTML = Math.floor(dados.main.temp) + "°C"
    document.querySelector(".texto-previsao").innerHTML = dados.weather[0].description
    document.querySelector(".umidade").innerHTML = "Umidade: " + dados.main.humidity + "%"
    document.querySelector(".img-previsao").src = `https://openweathermap.org/img/wn/${dados.weather[0].icon}.png`
}

async function buscarcidade(cidade){
    
    const dados = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${key}&lang=pt_br&units=metric`)
    .then((response) => response.json())

    colocardadosnatela(dados)
}

function buttonclick(){
    const cidade = document.querySelector(".input-city").value;

    buscarcidade(cidade)
}

async function buscarPorCoordenadas(lat, lon) {
    const dados = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&lang=pt_br&units=metric`)
        .then((response) => response.json());

    colocardadosnatela(dados);
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                buscarPorCoordenadas(lat, lon);
            },
            (error) => {
                alert("Não foi possível obter a localização.");
            }
        );
    } else {
        alert("Geolocalização não é suportada pelo seu navegador.");
    }
}