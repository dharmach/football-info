var base_url = "https://api.football-data.org/v2/";
var api_token = "b18f8da9b62e44b09e95eee47821c215";
// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}
// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}
// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}
// Blok kode untuk melakukan request data json
function getMatches() {
  if ('caches' in window) {
    caches.match(base_url + "matches").then(function(response) {
      if (response) {
        response.json().then(function (data) {
		  showMatches(data);
        })
      }else{
	fetch(base_url + "matches", {
	  method: "GET",
	  headers: {
		  "X-Auth-Token": api_token,
	  },
    })
    .then(status)
    .then(json)
    .then(function(data) {
		  showMatches(data);
     })
	}

    })
  }
}
function getMatchById() {
  // Ambil nilai query parameter (?id=)
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id");
  fetch(base_url + "matches/" + idParam, {
	  method: "GET",
	  headers: {
		  "X-Auth-Token": api_token,
	  },
    })
    .then(status)
    .then(json)
    .then(function(data) {
      // Objek JavaScript dari response.json() masuk lewat variabel data.
      //console.log(data);
      // Menyusun komponen card artikel secara dinamis
      var matchHTML = `
          <div class="card">
            <div class="card-image waves-effect waves-block waves-light">
            </div>
            <div class="card-content">
              <span class="card-title">${data.match.competition.name}</span>
              ${snarkdown(data.match.status)}
            </div>
          </div>
        `;
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("body-content").innerHTML = matchHTML;
    });
}
function getStandingsById(idParam) {
  fetch(base_url + "competitions/" + idParam + "/standings", {
	  method: "GET",
	  headers: {
		  "X-Auth-Token": api_token,
	  },
    })
    .then(status)
    .then(json)
    .then(function(data) {
      // Objek JavaScript dari response.json() masuk lewat variabel data.
      // Menyusun komponen card artikel secara dinamis
		showStandings(data);
    });
}
function getTeamById() {
  // Ambil nilai query parameter (?id=)
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id");
  fetch(base_url + "teams/" + idParam, {
	  method: "GET",
	  headers: {
		  "X-Auth-Token": api_token,
	  },
    })
    .then(status)
    .then(json)
    .then(function(data) {
	  showTeam(data);

	  var btnSave = document.getElementById("btnSave");
	  var btnDel = document.getElementById("btnDel");
	  dbGetTeamById(data.id)
	   .then( result => {
		  btnSave.style.display = "none";
		  btnDel.style.display = "block";
	  }).catch( result => {
		  btnSave.style.display = "block";
		  btnDel.style.display = "none";
	  });
	  btnSave.onclick = function () {
		  dbAddTeam(data);
		  btnSave.style.display = "none";
		  btnDel.style.display = "block";
	  }
	  btnDel.onclick = function () {
		  dbDelTeam(data);
		  btnSave.style.display = "block";
		  btnDel.style.display = "none";
	  }
    });
}

function getTeams() {
	var teamEachHTML = ``;
	var data=dbGetTeams();
	data
		.then( function(data) {
			data.forEach(function(team){
				teamEachHTML +=`
					  <div class="row">
    <div class="col s12 m6">
      <div class="card blue-grey darken-1">
        <div class="card-content white-text">
          <a href="./team.html?id=${team.id}"><span class="card-title">${team.name}</span>
		  <p><img src="${team.crestUrl}" class="responsive-img center" v-align="center" width="150" height=auto /></p></a>
        </div>
      </div>
    </div>
  </div>`;
			})
		});
	console.log("api-130");
          document.getElementById("body-content").innerHTML = teamEachHTML;
	fetch(base_url + "matches", {
	  method: "GET",
	  headers: {
		  "X-Auth-Token": api_token,
	  },
    })
    .then(status)
    .then(json)
    .then(function(data) {
	  var teamsHTML='';
          document.getElementById("body-content").innerHTML = teamEachHTML;

		  });
}
function showTeam(data){
      // Objek JavaScript dari response.json() masuk lewat variabel data.
          var squadHTML = "";
          data.squad.forEach(function(squad) {
			  squadHTML += `
				  <li class="collection-item">${squad.name} (${squad.position})  (${squad.nationality})</li>
				  `;
		  })
      // Menyusun komponen card artikel secara dinamis
      teamImg= data.crestUrl==null ? ``:`<img src="${data.crestUrl}" class="responsive-img center" v-align="center" width="150" height=auto />`;
      var teamHTML = `
          <div class="card">
            <div class="card-image waves-effect waves-block waves-light">
            </div>
            <div class="card-content">`+teamImg+`
		      
              <span class="card-title">${data.name} (${data.area.name})</span>
              ${snarkdown(data.address)}
			  <p>
                  <button class="waves-effect waves-light btn blue" id="btnSave"><i class="material-icons right">save</i>Save to favorite</button>
				  <button class="waves-effect waves-light btn red" id="btnDel"><i class="material-icons right">delete</i>Delete from favorite</button>
			  </p>
			  <h5>SQUAD</h5><ul class="collection">`+squadHTML+`</ul>
            </div>
          </div>
        `;
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("body-content").innerHTML = teamHTML;
}
function showStandings(data){
      // Objek JavaScript dari response.json() masuk lewat variabel data.
          var standingsHTML = "";
          data.standings.forEach(function(standings) {
			  if(standings.type=="TOTAL"){
		          standings.table.forEach(function(table) {
					standingsHTML += `<li class="collection-item">${table.position} <a href="./team.html?id=${table.team.id}">(${table.team.name})`;
					if(table.team.crestUrl!=null)standingsHTML += `<br><img src="${table.team.crestUrl}" class="responsive-img center" v-align="center" width="150" height=auto />`;
					standingsHTML += `</a></li>`;
				  })
			  }
		  })
      // Menyusun komponen card artikel secara dinamis
      var stHTML = `
          <div class="card">
            <div class="card-image waves-effect waves-block waves-light">
            </div>
            <div class="card-content">
              <span class="card-title">${data.competition.name} (${data.competition.area.name})</span>
			  <h5>STANDINGS</h5><ul class="collection">`+standingsHTML+`</ul>
            </div>
          </div>
        `;
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("body-content").innerHTML = stHTML;
}
function showMatches(data){
          var matchesHTML = "";
			  console.log(data.matches+" showMatches-169");
          data.matches.forEach(function(matches) {
			  console.log("showMatches-171");
            matchesHTML += `
<div class="row">
    <div class="col s12 m6">
      <div class="card blue-grey darken-1">
        <div class="card-content white-text">
          <span class="card-title">${matches.competition.name}</span>
		  <p>${matches.status}</p>
		  <h5 class="card-content center"><a href="./team.html?id=${matches.homeTeam.id}">${matches.homeTeam.name}</a></h5>
		  <p class="center">vs</p>
		  <h5 class="card-content center"><a href="./team.html?id=${matches.homeTeam.id}">${matches.awayTeam.name}</a></h5>
				`;
			if(matches.score.fullTime.homeTeam!=null){
				matchesHTML +=`<p class="card-title truncate">Score:${matches.score.fullTime.homeTeam} : ${matches.score.fullTime.awayTeam}</p>`;
		    }
            matchesHTML += `
          <p>Season: ${matches.season.startDate} - ${matches.season.endDate}</p>
		  <p>Group: ${matches.group}</p>
        </div>
        <div class="card-action">
          <a href="./match.html?id=${matches.id}">Detail</a>
        </div>
      </div>
    </div>
  </div>
                `;
          });
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("body-content").innerHTML = matchesHTML;
		  document.getElementById("logo-container").innerHTML = "Football Matches";
}