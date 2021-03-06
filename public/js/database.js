var dbPromise = idb.open("football", 1, function(upgradeDb) {
 if (!upgradeDb.objectStoreNames.contains("team")) {
   var teamOS = upgradeDb.createObjectStore("team", {keyPath: "id"});
   teamOS.createIndex("name", "name", {unique: false });
 }
});

function dbAddTeam(team){
	dbPromise.then(function(db) {
            var tx = db.transaction('team', 'readwrite');
            var store = tx.objectStore('team');
            var item = {
				id: team.id,
                name: team.name,
				crestUrl: team.crestUrl,
                created: new Date().getTime()
            };
            store.put(item); //menambahkan key "team"
            return tx.complete;
	}).then(function() {
			var mess=team.name+" berhasil disimpan.";
            console.log(mess);
			showNotif(mess);
	}).catch(function() {
            console.log(team.name+" gagal disimpan.")
	})
}

function dbDelTeam(team){
	dbPromise.then(function(db) {
            var tx = db.transaction('team', 'readwrite');
            var store = tx.objectStore('team');
            store.delete(team.id);
            return tx.complete;
	}).then(function() {
			var mess=team.name+" berhasil dihapus.";
            console.log(mess);
			showNotif(mess);
	}).catch(function() {
            console.log(team.name+" gagal dihapus.")
	})
}

function dbGetTeams(){
  return new Promise(function (resolve, reject) {
	dbPromise.then(function(db) {
	  var tx = db.transaction('team', 'readonly');
	  var store = tx.objectStore('team');
	  return store.getAll();
	}).then(function(items) {
	  //console.log('Data yang diambil: ');
	  //console.log(items);
	  resolve(items);
	});
  });
}
function dbGetTeamById(id){
  return new Promise(function (resolve, reject) {
	dbPromise.then(function(db) {
	 var tx = db.transaction('team', 'readonly');
	  var store = tx.objectStore('team');
	  // mengambil primary key berdasarkan id
	  return store.get(id);
	  //resolve(id);
	}).then(function(items) {
	  if(items != undefined) {
		console.dir(items);
		resolve(true);
	  }else{
		reject(false);
	  }
	});
  });
}
function showNotif(mess){
    const title = 'Football Info';
    const options = {
        'body': mess,
//        'icon': '/img/logo.png'
    };
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(function(registration) {
            registration.showNotification(title, options);
        });
    } else {
        console.error('Fitur notifikasi tidak diijinkan.');
    }
}