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

function colocardadosnatela(dados) { // Coloca os dados na tela
    document.querySelector(".city").innerHTML = "Tempo em " + dados.name
    document.querySelector(".temp").innerHTML = Math.floor(dados.main.temp) + "°C"
    document.querySelector(".texto-previsao").innerHTML = dados.weather[0].description
    document.querySelector(".umidade").innerHTML = "Umidade: " + dados.main.humidity + "%"
    document.querySelector(".img-previsao").src = `https://openweathermap.org/img/wn/${dados.weather[0].icon}.png`
}

async function buscarcidade(cidade) { // Busca a previsão do tempo com base na cidade

    const dados = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${key}&lang=pt_br&units=metric`)
        .then((response) => response.json())

    colocardadosnatela(dados)
}

function buttonclick() { // Função chamada ao clicar no botão de buscar
    const cidade = document.querySelector(".input-city").value;

    buscarcidade(cidade)
}

async function buscarPorCoordenadas(lat, lon) { // Busca a previsão do tempo com base nas coordenadas
    const dados = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&lang=pt_br&units=metric`)
        .then((response) => response.json());

    colocardadosnatela(dados);
}

function getLocation() { // Pede permissão para acessar a localização do usuário
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

let snakeGameActive = false;

function startSnakeGame() {
    if (snakeGameActive) return; // Evita iniciar o jogo mais de uma vez
    snakeGameActive = true;

    // Cria o canvas para o jogo
    const canvas = document.createElement("canvas");
    canvas.id = "snake-game";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "1000";
    canvas.style.backgroundColor = "#111";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    const box = 20;
    let snake = [{ x: 9 * box, y: 10 * box }];
    let direction = "RIGHT";
    let food = generateFoodPosition();

    function generateFoodPosition() { // Gera uma posição aleatória para a comida
        const maxX = Math.floor(canvas.width / box) - 1;
        const maxY = Math.floor(canvas.height / box) - 1;
        return {
            x: Math.floor(Math.random() * maxX) * box,
            y: Math.floor(Math.random() * maxY) * box,
        };
    }

    document.addEventListener("keydown", changeDirection);

    function changeDirection(event) {
        if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
        if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
        if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
        if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    }

    function drawGame() { // Função principal do jogo
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Desenha a cobra
        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = i === 0 ? "lime" : "green";
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
        }

        // Desenha a comida
        ctx.fillStyle = "red";
        ctx.fillRect(food.x, food.y, box, box);

        // Move a cobra
        let head = { ...snake[0] };
        if (direction === "UP") head.y -= box;
        if (direction === "DOWN") head.y += box;
        if (direction === "LEFT") head.x -= box;
        if (direction === "RIGHT") head.x += box;

        // Verifica colisão com as bordas ou com o próprio corpo
        if (
            head.x < 0 ||
            head.y < 0 ||
            head.x >= canvas.width ||
            head.y >= canvas.height ||
            snake.some((segment) => segment.x === head.x && segment.y === head.y)
        ) {
            alert("Game Over!"); // Exibe mensagem de game over
            document.body.removeChild(canvas);
            snakeGameActive = false;
            return;
        }

        // Verifica colisão com a comida
        if (head.x === food.x && head.y === food.y) {
            food = generateFoodPosition();
        } else {
            snake.pop();
        }

        snake.unshift(head);

        setTimeout(drawGame, 100);
    }

    drawGame();
}

// Ativa o jogo ao pressionar "Ctrl + S"
document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "s") {
        event.preventDefault(); // Evita o comportamento padrão do navegador
        startSnakeGame();
    }
});