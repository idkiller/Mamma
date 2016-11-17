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
        		console.debug(rows);
        		for (var i=0; i < rows.length; i++) {
        			$("#babies").prepend(
        					$('<a class="btn-floating waves-effect waves-light babybtn" href="#luo2"><img class="responsive-img" src="' + rows.item(i).photo + '"/></a>'));
        		}
        	}
        	
        	DB.getBabies(onSelect);
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