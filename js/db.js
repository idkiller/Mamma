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
		"	event_type TEXT," +
		"	event_time DATETIME," +
		"	event_value TEXT)";

const EVENT_TYPE = {"wakeup": {title: "기상", category: "sleep"},
                    "mothermilk": {title: "모유", cateogry: "food"},
                    "drymilk": {title: "분유", category: "food"},
                    "milk": {title: "우유", category: "food"},
                    "babyfood": {title: "이유식", category: "food"},
                    "meal": {title: "밥", category: "food"},
                    "betweenfood": {title: "간식", category: "food"},
                    "poopoo": {title: "응가", category: "poopoo"},
                    "gotobed": {title: "취침", category: "sleep"},
                    "memo": {title: "메모", category: "memo"}};

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
			DB.createTables(db);
			
			// Insert Dummy Data
			DB.insertInitialData(db);
			
			if (callback) callback();			
		});
		
		database.transaction(function(t) {
			// Check whether the table is created or not.
			t.executeSql("SELECT * FROM baby", [], function(tr, r) {
				if (callback) callback();
			});
		});
	}
};

DB.insertInitialData = function(db) {
	db.transaction(function(t) {
		t.executeSql("INSERT INTO baby (id, name, birth, sex, photo) VALUES(?, ?, ?, ?, ?)", [1, "Siyun", "2015-06-30", 2, "images/siyun.png"], onSuccess, onError);
		t.executeSql("INSERT INTO baby (id, name, birth, sex, photo) VALUES(?, ?, ?, ?, ?)", [2, "Luo", "2014-10-19", 1, "images/luo.png"], onSuccess, onError);
		
		t.executeSql("INSERT INTO event (baby_id, event_type, event_time, event_value) VALUES(?, ?, ?, ?)",
				[1, "wakeup", "2016-11-18 07:00", ""], onSuccess, onError);
		t.executeSql("INSERT INTO event (baby_id, event_type, event_time, event_value) VALUES(?, ?, ?, ?)",
				[1, "drymilk", "2016-11-18 07:00", 180], onSuccess, onError);	
		t.executeSql("INSERT INTO event (baby_id, event_type, event_time, event_value) VALUES(?, ?, ?, ?)",
				[1, "drymilk", "2016-11-18 12:00", 220], onSuccess, onError);	
		t.executeSql("INSERT INTO event (baby_id, event_type, event_time, event_value) VALUES(?, ?, ?, ?)",
				[1, "poopoo", "2016-11-18 13:00", ""], onSuccess, onError);	
		t.executeSql("INSERT INTO event (baby_id, event_type, event_time, event_value) VALUES(?, ?, ?, ?)",
				[1, "drymilk", "2016-11-18 16:00", 240], onSuccess, onError);	
		
		t.executeSql("INSERT INTO event (baby_id, event_type, event_time, event_value) VALUES(?, ?, ?, ?)",
				[2, "wakeup", "2016-11-18 07:00", ""], onSuccess, onError);
		t.executeSql("INSERT INTO event (baby_id, event_type, event_time, event_value) VALUES(?, ?, ?, ?)",
				[2, "drymilk", "2016-11-18 07:00", 180], onSuccess, onError);	
		t.executeSql("INSERT INTO event (baby_id, event_type, event_time, event_value) VALUES(?, ?, ?, ?)",
				[2, "drymilk", "2016-11-18 12:00", 220], onSuccess, onError);	
		t.executeSql("INSERT INTO event (baby_id, event_type, event_time, event_value) VALUES(?, ?, ?, ?)",
				[2, "poopoo", "2016-11-18 13:00", ""], onSuccess, onError);	
		t.executeSql("INSERT INTO event (baby_id, event_type, event_time, event_value) VALUES(?, ?, ?, ?)",
				[2, "drymilk", "2016-11-18 16:00", 240], onSuccess, onError);	
	});
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
		t.executeSql("SELECT * FROM baby ORDER BY birth DESC", [], function(tr, ret) {
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


