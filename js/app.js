class Player{
    constructor(name){
       this.name = name;
    }
}

let players =[];

if(localStorage.getItem("players")){
     players = JSON.parse(localStorage.getItem("players"));
}else{
    localStorage.setItem("players", JSON.stringify(players));
}

const formPlayer = document.getElementById("namePlayer");
const stats = document.getElementById("playerStats")
const divStats =  document.getElementById("divStats")


formPlayer.addEventListener("submit",(e)=>{
    e.preventDefault()
    const datForm = new FormData(e.target);
    const playerObj = new Player(datForm.get("name"));
    players.push(playerObj);
    localStorage.setItem("players", JSON.stringify(players));
    formPlayer.reset();
    
})

//!---------------------------------------------------------------------
//* Elementos Html
const board = document.getElementById("board");
const scoreBoard = document.getElementById("scoreBoard");
const startButton = document.getElementById("start");
const gameOverSign = document.getElementById("gameOver");

const boardSize = 10;  //* tamaño del tablero
const gameSpeed = 100; //*la velocidad de la snake

//* tipos de cuadrados
const squareTypes = {
    emptySquare: 0,
    snakeSquare : 1,
    foodSquare : 2
};
//* Direcciones 
const directions = {
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowRight: 1,
    ArrowLeft: -1
};
//* Variables del juego 
let snake;
let score;
let direction;
let boardSquares;
let emptySquares;
let moveInterval;

//* 
const drawSnake = () => {
    snake.forEach(square => drawSquare(square,"snakeSquare"));
     
}

//* completa cada cuadrado segun su tipo
const drawSquare = (square, type) =>{
      const[row, column] = square.split("");
      boardSquares[row][column] = squareTypes[type];
      const squareElement = document.getElementById(square);
      squareElement.setAttribute("class", `square ${type}`);  
      
      if(type === "emptySquare"){
        emptySquares.push(square);
      }else{
       if(emptySquares.indexOf(square)!== -1){
                  emptySquares.splice(emptySquares.indexOf(square), 1);
       }
      }
}
//* la funcion consulta la direccion de la serpiente y pinta el siguiente cuadrado sobre el movimiento de la serpiente 
const moveSnake = ()=>{
    const newSquare = String(
    Number(snake[snake.length - 1]) + directions[direction]).padStart(2, "0");
     const [row, column] = newSquare.split("");     

     if(newSquare < 0 || 
        newSquare > boardSize * boardSize ||
        (direction === "ArrowRight" && column == 0) || 
        (direction === "ArrowLeft" && column == 9 || 
        boardSquares[row][column] === squareTypes.snakeSquare))  {
         gameOver(); 
     }else{
        snake.push(newSquare);
        if(boardSquares[row][column] === squareTypes.foodSquare){
          addFood();
        }else{
           const emptySquare = snake.shift(); 
           drawSquare(emptySquare, "emptySquare");  
        }
        drawSnake();
     } 
}
//* agrega el un cuadrado a la serpiente, actualiza el score y genera otra comida para que el jugador siga jugando
let resultado;
const addFood = ()=>{
    score++;
    updateScore();
    createRandomFood();
    
    localStorage.setItem("score",JSON.stringify(score))
}

//* esta funcion muestra el mensaje de game over, detenemos el intervalo y habilita el boton de inicio
const gameOver = () =>{
    clearInterval(moveInterval);
    startButton.disabled = false; 
    Swal.fire({
        icon: 'error',
        title: 'Game Over :C',
        text: 'Press the start button to play again',
      })
}
//* con el ArrowUp llamas  a la funcion setDirection esta funcion va a recibir una nueva direccion y setea la variable direction hacia una nueva direccion 
const setDirection = newDirection =>{
    direction = newDirection;
} 
//*  se declara de key que se toco y se pregunta que tipo de key codigo se toco
const directionEvent = key =>{
    switch(key.code){
        case "ArrowUp":
            direction != "ArrowDown" && setDirection(key.code)
            break;
        case "ArrowDown":
            direction != "ArrowUp" && setDirection(key.code)
            break;
        case "ArrowLeft":
            direction != "ArrowRight" && setDirection(key.code)
            break;
        case "ArrowRight":
            direction != "ArrowLeft" && setDirection(key.code)
            break;     
    }
}
//* crea un lugar random y luego pinta ese lugar con un cuadrado de tipo comida 
const createRandomFood = () =>{
    const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)]
    drawSquare(randomEmptySquare, "foodSquare");
}
//* funcion que actualiza el Score
const updateScore = () =>{

    scoreBoard.innerText = score;
}

//* funcion para crear el tablero 
const createBoard = () => {
    boardSquares.forEach((row, rowIndex) =>{
        row.forEach((column, columnIndex)=>{
             const squareValue = `${rowIndex}${columnIndex}`;
             const squareElement = document.createElement("div");
             squareElement.setAttribute("class", "square emptySquare");
             squareElement.setAttribute("id", squareValue);
             board.appendChild(squareElement);
             emptySquares.push(squareValue);
             
        })
    })
}



//* esto es para setear a la serpiente 
const setGame= () =>{
    snake = ['00', '01', '02', '03'];
    score = snake.length;
    direction = "ArrowRight";
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare));
    console.log(boardSquares);
    board.innerHTML = "";
    emptySquares = [];  
    createBoard();
}

//* funcion del inicio del juego
const startGame = ()=>{
    setGame();
    startButton.disabled = true;
    drawSnake();
    updateScore();
    createRandomFood();
    document.addEventListener("keydown", directionEvent);
    moveInterval = setInterval( () => moveSnake(), gameSpeed);
}

//* incio del juego
startButton.addEventListener("click", startGame);





//!-------------------------------------------------------------------------------------------------------------------------
stats.addEventListener("click",()=>{
const statsStorage = JSON.parse(localStorage.getItem("players"))
    divStats.innerHTML = ""; 
    statsStorage.forEach((name, indice) => {
        divStats.innerHTML += `
        <div class="card text-white bg-primary mb-3" id="name${indice}"style="max-width: 16rem; margin-top : 14px;">
           <div class="card-header"><h3>${name.name}</h3></div>
           <div class="card-body">
           <button class="btn btn-danger">delete user</button>
           </div>
      </div>
        `
    });
    statsStorage.forEach((name,indice)=>{
document.getElementById(`name${indice}`).children[1].children[0].addEventListener("click",()=>{
    document.getElementById(`name${indice}`).remove();
    players.splice(indice,1);
    localStorage.setItem("players", JSON.stringify(players));
})
    })
});
//!----------------------------------------------------------------------------------------------------------

const divPlayers = document.getElementById("divPlayer");

fetch('./json/users.json').then(response => response.json()).then(users=>{
    users.forEach((users,indice)=>{
       divPlayers.innerHTML +=`
       <div class="container">
         <table class="table table-dark table-striped" id="users${indice}">
         <thead>
         <tr>
           <th scope="col">User</th>
           <th scope="col">Score</th>
         </tr>
       </thead>
       <tbody>
         <tr>
           <td>${users.user}</td>
           <td>${users.score}</td>
         </tr>
       </tbody>
         </table>
       </div>
       `
    })
})
/*
*/