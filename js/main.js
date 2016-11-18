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
    
    function show_daily_sheet(event) {
    	// navibar
    	$("#daily_sheet_navi").empty();
    	$("#daily_sheet_navi").append(
    			$('<a href="#mamma" class="breadcrumb">Mamma</a> <a href="#!" class="breadcrumb">' + event.data.name + '</a>'));	
    	
    	// photo
    	$("#daily_sheet_photo").empty();
    	$("#daily_sheet_photo").append(
    			$('<img src="' + event.data.photo + '" class="responsive-img circle">'));
    	
    	// events
    	$("#daily_sheet_events").empty();
    	var date = moment(new Date()).format("YYYY-MM-DD");
    	DB.getEventsOfDay(event.data.id, date, function(rows) {
    		console.log("event rows : " + rows.length);
    		for (var i=0; i < rows.length; i++) {
    			var ev_title = EVENT_TYPE[rows.item(i).event_type].title;
    			var ev_time = moment(new Date(rows.item(i).event_time)).format("HH:mm");
    			$("#daily_sheet_events").append(
    					$('<li class="collection-item avatar"><div class="circle">' + ev_title +'</div> <span class="title">' + ev_time + '</span></li>'));
    		}  
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