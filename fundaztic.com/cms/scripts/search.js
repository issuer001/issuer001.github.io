var panel = null;          
$(document).ready( function(){
    panel = new cmsPanel( {"width":500} );     
}); 

function goSearch(fm)
{	
	var keyword = fm.keyword.value;	
	keyword = keyword.replace(/"/g,"");
//	var submenu = fm.submenu.value;	
//	var filterby = fm.filterby.value;	
//	window.location = submenu+"search?keyword="+keyword;
	window.location = "search?keyword="+encodeURIComponent(keyword);
}

function goSearchContent(fm)
{
	var pglang = fm.lang.value;	
	var keyword = fm.keyword.value;	
	window.location= pglang+"/search?keyword="+keyword;
}

function getTownListByState()
{
	var fm = document.getElementById('fmLocation');

	var fk_state = fm.fk_state.value;
	 $.ajax({
            type: "POST",
            url: "a/MISC/getTownListByState",
            async:true,
            data: 'fk_state='+fk_state,
            success: function(msg,ret){
                if( ret != 'success' )
                {
                    panel.setContent('<div>Town listing is failed to load, please refresh</div>');
                    return;
                }
                try {
                    
                    var result = eval( '(' + msg +')' );
                     
                    if( result.status == '1' )
                    {
                    	$('#fk_town')
						.find('option')
						.remove()
						.end()
						.append(result.option)
						;
                    }							
                }
                catch(E)
                {
                    panel.setContent('<div>Network connection error, please try again later.</div>');
                    return;        
                }
            }
    });
}

function getStoreList(fm)
{
	var filterType = $('#filterOptions li.active a').attr('class');
	var filterby = fm.filterby.value;	
	filterby = filterby.replace(/"/g,"");

	window.location = "store-location?filterby="+encodeURIComponent(filterby)+"&fk_state="+encodeURIComponent(filterType);		
}

function searchStore(fm)
{
	var keyword = fm.keyword.value;	
	var keyword = keyword.replace("&", "+");

	window.location = "store-locator?keyword="+encodeURIComponent(keyword);		
}
