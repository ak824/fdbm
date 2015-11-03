jQuery(document).ready(function () {
		jQuery('.ui-page-active .owl-carousel').addClass('owl-active');
		// Touch Slider START
		jQuery('.owl-active').owlCarousel({
			items: 3,
			itemsDesktop : [1000,3], // between 1000px and 901px
			itemsDesktopSmall : [900,2], // betweem 900px and 601px
			itemsTablet: [600,2], // between 600 and 0
			autoPlay: 3000
		});
		// Touch Slider END
		
		// Validation START
		jQuery("#admin_page form").validate({
			rules: {
				storage_ttl: {
					minlength: 0
				}
			}
		});
		// Validation END
			
		// Touch Gallery START
		if ( jQuery('.gallery').hasClass('gallery-active') ) {
			var myPhotoSwipe = jQuery(".gallery-active a").photoSwipe({ enableMouseWheel: false , enableKeyboard: false });
		}
		// Touch Gallery END
		
		jQuery( 'body' ).on( "pagebeforeload", function( event ) {
			jQuery('.ui-page-active .owl-carousel').removeClass('owl-active');
			jQuery('.gallery').removeClass('gallery-active');
		});
		jQuery( 'body' ).on( "pagechange", function( event, ui ) {
			jQuery('.ui-content').on('click', '.alert', function(){
				jQuery(this).fadeOut();
			});
			// Validation START
			jQuery("#admin_page form").validate({
				rules: {
					storage_ttl: {
						minlength: 0
					}
				}
			});
			// Validation END
			
			jQuery('.ui-page-active .owl-carousel').addClass('owl-active');
			if ( jQuery('.ui-page-active .owl-carousel').hasClass('owl-active') ) {
				// Touch Slider START
				jQuery('.ui-page-active .owl-active').owlCarousel({
					items: 3,
					itemsDesktop : [1000,3], // between 1000px and 901px
					itemsDesktopSmall : [900,2], // betweem 900px and 601px
					itemsTablet: [600,2], // between 600 and 0
					autoPlay: 3000
				});
				// Touch Slider END
			}
			if ( jQuery('.gallery').hasClass('gallery-active') ) {
				var myPhotoSwipe = jQuery(".gallery-active a").photoSwipe({ enableMouseWheel: false , enableKeyboard: false });
			}
			jQuery('.menu-btn-background').removeClass('accent-color');
		});
		jQuery( document ).on( "panelopen", "#left_panel", function( event, ui ) {
			jQuery('.menu-btn-background').addClass('accent-color');
		});
		jQuery( 'body' ).on( "panelclose", "#left_panel", function( event, ui ) {
			jQuery('.menu-btn-background').removeClass('accent-color');
		});
		jQuery( document ).on( "panelopen", "#right_panel", function( event, ui ) {
			jQuery('.share-btn-background').addClass('accent-color');
		});
		jQuery( 'body' ).on( "panelclose", "#right_panel",  function( event, ui ) {
			jQuery('.share-btn-background').removeClass('accent-color');
		});
});
/*
    repo.html
*/
$(document).on("pagebeforeshow", '#repo_page', function(){
    var qs = urlParamsToObj($(this).data('url'));
    var repoUrl = $("#ownerUrl").render(qs);
    var commitsUrl = $("#commitUrl").render(qs);
    getRepo(repoUrl);
    getIssues(commitsUrl);
});

$(document).on("pagecontainerbeforechange", function (e ,data) {
   if (data.toPage[0].id == "author-detail") {
      var url = data.absUrl,
          querystring = url.split("?")[1]; /* retruns ?id=test1 */
		  if (querystring > 0) {$.mobile.fdbm.authorid = querystring;}
   }
    if (data.toPage[0].id == "series-detail") {
      var url = data.absUrl,
          querystring = url.split("?")[1]; /* retruns ?id=test1 */
		  if (querystring > 0) {$.mobile.fdbm.seriesid = querystring;}
   }
});
/*
    author-detail
*/
$(document).on("pagebeforeshow", "#author-detail", function(){
	var qs = urlParamsToObj($(this).data('url'));
    var authordetUrl = $("#authordetUrl").render(qs);
    var authorUrl = 'http://www.fictiondb.com/api/authordet.php?authorid=' + $.mobile.fdbm.authorid + '&userid=' + $.mobile.fdbm.userid;
	
	$('body').addClass('ui-loading');
	 
    $.getJSON(authorUrl)
        .done(function(data){ 
            var fav = data.response.favorite;
            if (fav == 1) {
                var favcolor = ' fav';
                }
            else {
                var favcolor = '';  
            }
            var author = '<i class="fa fa-heart fa-lg' + favcolor + '"></i>&nbsp;&nbsp;&nbsp;' + data.response.author;
            $("#authorname").html(author);                
            var booklist = data.response.books,
                template = $("#author-books").render(booklist);
            $("#books").html(template).listview("refresh");
            $('div.rateit, span.rateit').rateit();
            $(window).lazyLoadXT();
            var serieslist = data.response.series,
                template = $("#author-series").render(serieslist);
            $("#series").html(template).listview("refresh");
            var pseudolist = data.response.pseudonyms,
                template = $("#author-pseudo").render(pseudolist);
            $("#pseudo").html(template).listview("refresh");
			$('body').removeClass('ui-loading');
        });			
});
/*
    series-detail
*/
$(document).on("pagebeforeshow", "#series-detail", function(){
    var qs = urlParamsToObj($(this).data('url'));
    var seriesdetUrl = $("#seriesdetUrl").render(qs);
	var seriesUrl = 'http://www.fictiondb.com/api/seriesdet.php?seriesid=' + $.mobile.fdbm.seriesid + '&userid=' + $.mobile.fdbm.userid;
	
	$('body').addClass('ui-loading');

    $.getJSON(seriesUrl)
        .done(function(data){
            var fav = data.response.favorite;
            if (fav == 1) {
                var favcolor = ' fav';
                }
            else {
                var favcolor = '';  
            }
            var series = '<i class="fa fa-heart fa-lg' + favcolor + '"></i>&nbsp;&nbsp;&nbsp;' + data.response.seriesName;
            $("#seriesname").html(series);                
            var serieslist = data.response.books,
                template = $("#series-books").render(serieslist);
            $("#books-series").html(template).listview("refresh");
            $('div.rateit, span.rateit').rateit();
            $(window).lazyLoadXT();
			$('body').removeClass('ui-loading');
        });
});
function getRepo(url) {
    $.getJSON(url)
        .done(function(data){
            var context = data,
                template = $("#repoTmpl").render(context);
            $("#repo").html(template);
        });
}

function getIssues(url) {
    $.getJSON(url)
        .done(function(data){
            var context = data,
                template = $("#commitsTmpl").render(context);
            $("#commits").html(template).listview("refresh");
        });
}

function urlParamsToObj(qs) {
    var obj = {};
    var pairs = qs.replace(/^.+\?/,'').split('&');
    pairs.forEach(function(pair){
        var keys = pair.split('=');
        obj[keys[0]] = keys[1];
    });
    return obj;
}
function getParam(url) {
    var parsed = $.mobile.path.parseUrl(url),
        hash = parsed.hash.split("?");
    return {
        search: hash[1].split("=")[1]
    };
}