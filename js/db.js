var database;
const DB_VERSION = 2.0;
const DB_NAME = "mamma";
const DB_DISPLAY_NAME = "mamma_db";
const DB_SIZE = 2 * 1024 * 1024;

const SCHEMA_BABY = 
		"CREATE TABLE IF NOT EXISTS baby (" +
		"	id INTEGER PRIMARY KEY ASC," +
		"	name TEXT," +
		"	birth DATE," +
		"	sex INTEGER," +
		"	weight INTEGER," +
		"	height INTEGER," +
		"	photo TEXT)";

const SCHEMA_EVENT = 
		"CREATE TABLE IF NOT EXISTS event (" +
		"	id INTEGER PRIMARY KEY ASC," +
		"	baby_id INTEGER," +
		"	event_type INTEGER," +
		"	event_time DATETIME," +
		"	event_value TEXT)";

function onSuccess(t, e) {
}

function onError(t, e) {
	console.log("Error : " + e.message);
}

function makeSureValidDate(date) {
	var d = new Date(date);
	return moment(d).format("YYYY-MM-DD");
}

function makeSureValidDateTime(datetime) {
	var dt = new Date(datetime);
	return moment(dt).format("YYYY-MM-DD HH:mm");
}

var DB = function() {
};

DB.init = function(callback) {
	if (window.openDatabase) {
		database = openDatabase(DB_NAME, DB_VERSION, DB_DISPLAY_NAME, DB_SIZE, function(db) {
			// Create Tables
			createTables(db);
			
			// Insert Dummy Data
			db.transaction(function(t) {
				t.executeSql("INSERT INTO baby (name, birth, sex) VALUES(?, ?, ?)", ["Siyun", "2015-06-30", 2], onSuccess, onError);
				t.executeSql("INSERT INTO baby (name, birth, sex) VALUES(?, ?, ?)", ["Luo", "2014-10-19", 1], onSuccess, onError);
			});
			
			if (callback) callback();			
		});
		
		database.transaction(function(t) {
			// Test if the table is created.
			t.executeSql("SELECT * FROM baby", [], function(tr, r) {
				if (callback) callback();
			});
		});
	}
};

DB.createTables = function(db) {
	db.transaction(function(t) {
		t.executeSql(SCHEMA_BABY, [], onSuccess, onError);
		t.executeSql(SCHEMA_EVENT, [], onSuccess, onError);
	});
};

DB.dropTables = function() {
	database.transaction(function(t) {
		t.executeSql("DROP TABLE baby", []);
		t.executeSql("DROP TABLE event", []);
	});
};

DB.getBabies = function(callback) {
	database.transaction(function(t) {
		t.executeSql("SELECT * FROM baby ORDER BY birth", [], function(tr, ret) {
			if (callback) {
				callback(ret.rows);
			}
		}, onError);
	});
};

DB.addBaby = function(baby, successCallback, errorCallback) {
	baby.birth = makeSureValidDate(baby.birth);	
	database.transaction(function(t) {
		t.executeSql("INSERT INTO baby(name, birth, sex) VALUES(?,?,?)", [baby.name, baby.birth, baby.sex], 
					 function(tr, r) { if (successCallback) successCallback(); }, 
					 function(tr, e) { if (errorCallback) errorCallback(e);	});
	});
};

DB.getEventsOfDay = function(baby_id, event_date, callback) {
	query_event_date = makeSureValidDate(event_date);
	database.transaction(function(t) {
		t.executeSql("SELECT * FROM event WHERE baby_id=? AND date(event_time)=?", [baby_id, query_event_date],
				function(tr, ret) {	if (callback) callback(ret.rows) }, onError);
	});
};

DB.addEvent = function(event, successCallback, errorCallback) {
	event.event_time = makeSureValidDateTime(event.event_time);
	database.transaction(function(t) {
		t.executeSql("INSERT INTO event(baby_id, event_type, event_time, event_value) VALUES(?, ?, ?, ?)", 
					 [event.baby_id, event.event_type, event.event_time, event.event_value],
					 function(tr, r) { if (successCallback) successCallback(); },
					 function(tr, e) { if (errorCallback) errorCallback(e); });
	});
};


