var current_baby = {};

( function () {
    window.addEventListener( 'tizenhwkey', function( ev ) {
        if( ev.keyName === "back" ) {
            var activePopup = document.querySelector( '.ui-popup-active' ),
                page = document.getElementsByClassName( 'ui-page-active' )[0],
                pageid = page ? page.id : "";

            if( pageid === "one" && !activePopup ) {
                try {
                    tizen.application.getCurrentApplication().exit();
                } catch (ignore) {
                }
            } else {
                window.history.back();
            }
        }
    } );
    
    
    function page1_init() {
    	DB.init(function(){
    		var onSelect = function(rows) {
        		for (var i=0; i < rows.length; i++) {
        			var baby_id = rows.item(i).id;
        			var baby_photo = rows.item(i).photo;
        			$("#babies").prepend(
        					$('<a id="baby_' + baby_id + '" class="btn-floating waves-effect waves-light babybtn" href="#daily_sheet"><img class="responsive-img" src="' + baby_photo + '"/></a>'));
        			$("#baby_" + baby_id).click(rows.item(i), show_daily_sheet);
        		}
        	}
        	
        	DB.getBabies(onSelect);
    	});
    }
    
    function load_events_of_current_baby() {
    	$("#daily_sheet_events").empty();
    	var date = moment(new Date()).format("YYYY-MM-DD");
    	DB.getEventsOfDay(current_baby.id, date, function(rows) {
    		console.log("event rows : " + rows.length);
    		for (var i=0; i < rows.length; i++) {
    			var ev_title = EVENT_TYPE[rows.item(i).event_type].title;
    			var ev_time = moment(new Date(rows.item(i).event_time)).format("HH:mm");
    			$("#daily_sheet_events").append(
    					$('<li class="collection-item avatar"><div class="circle">' + ev_title +'</div> <span class="title">' + ev_time + '</span></li>'));
    		}
    	});
    }
    
    function show_daily_sheet(event) {
    	current_baby = event.data;
    	
    	// navibar
    	$("#daily_sheet_navi").empty();
    	$("#daily_sheet_navi").append(
    			$('<a href="#mamma" class="breadcrumb">Mamma</a> <a href="#!" class="breadcrumb">' + event.data.name + '</a>'));	
    	
    	// photo
    	$("#daily_sheet_photo").empty();
    	$("#daily_sheet_photo").append(
    			$('<img src="' + event.data.photo + '" class="responsive-img circle">'));
    	
    	// button
    	$("#daily_sheet_memo_btn").click(event.data, show_memo_page);
    	
    	// events
    	load_events_of_current_baby();
    }
    
    function show_memo_page(event) {
    	
    	// navibar
    	$("#memo_sketch_navi").empty();
    	$("#memo_sketch_navi").append(
    			$('<a href="#mamma" class="breadcrumb">Mamma</a> <a href="#daily_sheet" class="breadcrumb">' + current_baby.name + '</a><a href="#!" class="breadcrumb">Memo</a>'));	

    	// textarea
    	$("#memo_sketch_textarea").val('');
    	
    	// button
    	$("#memo_sketch_done").click(event.data, save_memo);
    }
    
    function save_memo(event) {
    	var e = {};
    	e["baby_id"] = current_baby.id;
    	e["event_type"] = "memo";
    	e["event_time"] = moment(new Date()).format("YYYY-MM-DD HH:mm");
    	e["event_value"] = $("memo_sketch_textarea").val();
    	
    	DB.addEvent(e, function() {
    		load_events_of_current_baby();
    		window.location.href="#daily_sheet";
    	}, function(err) {
    		console.log(err.message);
    		alert(err.message);
    	});
    }
    
    $(document).ready(function(){
    	$('.modal').modal();
    	$('#ageslider').each(function(){
    		noUiSlider.create(this, {
    			start: 0,
    			connect: [true, false],
    			step:1,
    			range: {
    				'min': 0,
    				'max': 8
    			}
    		});
    		this.noUiSlider.on('update', function( values, handle ) {
        		$("#age").val(values[handle]);
        	});
    	});
    	
    	page1_init();
    
//    	setTimeout(page1_init, 50);
    });
    
} () );