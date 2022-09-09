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