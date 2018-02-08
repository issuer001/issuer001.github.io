var panelCtr = 0;
function cmsPanel( opt )
{
    this.init( opt );   
}

cmsPanel.prototype = {
    init:function( opt )
    {	 
        this.ctr = panelCtr++;
        var pWidth = (opt.width != null && opt.width!='' )?opt.width:300;
        var pHeight = ( opt.height!= null )?opt.height:'auto'; 
    	var pTitle = (opt.title != null && opt.title!='' )?opt.title:'Loading, Please wait...';
        var maxHeight = (opt.maxHeight !=null && opt.maxHeight!='')?opt.maxHeight:$(window).height();   
        this.loadingimage = ( opt.loadingimage != null && opt.loadingimage != '' )?opt.loadingimage:'cms/scripts/jquery/loading.gif';
        var pMsg  = (opt.msg != null && opt.msg!='' )?opt.msg:'<div align="center"><img width="32px" src="'+this.loadingimage+'"></div>';
        if( $('#resultPanel' + this.ctr).length == 0)
        {
        	  $(document.body).append('<div title="'+pTitle+'" id="resultPanel'+this.ctr+'">'+pMsg+'</div>');
        	  $('#resultPanel'+this.ctr).dialog({
        	  	modal:true,
        	  	width:pWidth,
        	  	draggable:false,
        	  	minHeight:10,
        	  	resizable:false,
        	  	autoOpen:false,
        	  	height:pHeight,
				maxHeight:maxHeight,
				//buttons: { "x": function() { $(this).dialog('close'); }, "close": function() { $(this).dialog('close'); } },
				buttons: { "x": function() { $(this).dialog('close'); } },
				create:function () {
					$(this).closest(".ui-dialog")
					.find(".ui-dialog-buttonset button:first") // the first button
					.addClass("custom");
				}
        	  });
        	   var dialogParent = $('#resultPanel').parent();
        	  $('.ui-dialog-titlebar-close', dialogParent).css('display', 'none');
        }
        else
        {
        	    $('#resultPanel' +this.ctr).html(pMsg);
        		$('#ui-dialog-title-resultPanel'+this.ctr).html(pTitle);
        		$('#resultPanel'+this.ctr).dialog('open');
        		
        }
    },
    
    setTitle:function(pTitle )
    {
	    var dialogParent = $('#resultPanel'+this.ctr).parent();
	    $('.ui-dialog-title', dialogParent ).html ( pTitle );
    },
    
    setContent:function(pContent )
    {
        $('#resultPanel'+this.ctr).html(pContent);
    },
    
    show:function()
    {
        $('#resultPanel'+this.ctr).dialog('open');  
    },
    
    hide:function()
    {
        $('#resultPanel'+this.ctr).dialog('close');   
    },
    
    setWaitingContent:function()
    {
        var pTitle = 'Loading, Please wait...';
    	  var pMsg  = '<div align="center"><img src="'+this.loadingimage+'"></div>';
    	  
    	  this.setContent( pMsg );
    	  this.setTitle( pTitle );
    },
    
    beforeClose:function( fn )
    {
	    $('#resultPanel'+this.ctr).bind( "dialogbeforeclose",fn);
    }
}

var numberOnly = function( ev ) {
	try
	{
		var charcode = ( ev.charCode != null)?ev.charCode:ev.keyCode;
		
	  var character = String.fromCharCode(charcode);
	 
	  if ((charcode==null) || (charcode==0) || (charcode==8) || 
	      (charcode==9) || (charcode==13) || (charcode==27) )
	    return true;
	  if (("1234567890").indexOf(character) > -1)
	    return true;
	}
	catch(E)
	{
			return true;
	}
  return false;
}

var decimalOnly = function( ev ) {
	
	try
	{
		var charcode = ( ev.charCode != null)?ev.charCode:ev.keyCode;
		
	  var character = String.fromCharCode(charcode);
	 
	  if ((charcode==null) || (charcode==0) || (charcode==8) || 
      (charcode==9) || (charcode==13) || (charcode==27) )
    	return true;
  	if (("-1234567890.").indexOf(character) > -1)
    	return true;
	}
	catch(E)
	{
		return true;
	}
  return false;
	
}

var alphaNumericOnly = function( ev ) {
	try
	{
		var charcode = ( ev.charCode != null)?ev.charCode:ev.keyCode;
		
	  var character = String.fromCharCode(charcode);

	  if ((charcode==null) || (charcode==0) || (charcode==8) || 
	      (charcode==9) || (charcode==13) || (charcode==27) )
	    return true;
	  if (("0123456789.abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_").indexOf(character) > -1)
	    return true;
	}
	catch(E)
	{
		return true;
	}
  return false;
}

var customCharSet = function( ev, characterSet ) {
	try
	{
		var charcode = ( ev.charCode != null)?ev.charCode:ev.keyCode;
		
	  var character = String.fromCharCode(charcode);
	 
	  
	 	// control keys
	  if ((charcode==null) || (charcode==0) || (charcode==8) || 
	      (charcode==9) || (charcode==13) || (charcode==27) )
	    return true;
	  else if (characterSet.indexOf(character) > -1)
	    return true;
	}
	catch(E)
	{
		return true;
	}
  return false;
}

var isEmail = function(str) {

		var at="@"
		var dot="."

		var lat=str.indexOf(at)
		var lstr=str.length
		var ldot=str.indexOf(dot)
		if (str.indexOf(at)==-1){
		   return false
		}

		if (str.indexOf(at)==-1 || str.indexOf(at)==0 || str.indexOf(at)==lstr){
		   return false
		}

		if (str.indexOf(dot)==-1 || str.indexOf(dot)==0 || str.indexOf(dot)==lstr){
		    return false
		}

		 if (str.indexOf(at,(lat+1))!=-1){
		    return false
		 }

		 if (str.substring(lat-1,lat)==dot || str.substring(lat+1,lat+2)==dot){
		    return false
		 }

		 if (str.indexOf(dot,(lat+2))==-1){
		    return false
		 }
		
		 if (str.indexOf(" ")!=-1){
		    return false
		 }

 		 return true					
}

var dump = function(ob, print_method ){
			var str = '';
			
			if( ob instanceof Array )
			{
					for( i=0; i<ob.length; i++ ) {
						str += i + ':' + ob[i] + '\n';
					}
			}
			else
		  {
				for( item in ob ) {
					str += item + ':' + ob[item] + '\n';
				}
			}
			if( print_method == 'write') {
				var newwin = window.open('about:blank');
				newwin.document.write(str);
			}
			else {
				alert(str);
			}
}

var in_array = function( val, arr ){
	if( arr ==null || !arr instanceof Array ) {
		return false;
	}
	
	for( var i=0; i<arr.length; i++ ){
		if( val == arr[i] ) {
			return true;
		}
	}
	
	return false;
}

var dateDiff = function(unit, from, to) {
	var one_unit = 1;
	if( unit == 'day' ) {
		one_unit=1000*60*60*24;
	}
	//Calculate difference btw the two dates, and convert to days
	return Math.ceil((to.getTime()-from.getTime())/(one_unit));
}

var clone = function (obj) {

        if(obj == null || typeof(obj) != 'object') return obj;



        if(obj.constructor == Array) {

                var temp = [];

                for(var i = 0; i < obj.length; i++) {

                        if(typeof(obj[i]) == 'object')   temp.push(clone(obj[i]));

                        else temp.push(obj[i]);

                }

                return temp;

        }



        var temp = {};

        for(var key in obj) temp[key] = clone(obj[key]);

        return temp;

}

function isnumeric(strString)
   //  check for valid numeric strings	
   {
   var strValidChars = "0123456789.";
   var strChar;
   var blnResult = true;

   if (strString.length == 0) return false;

   //  test strString consists of valid characters listed above
   for (i = 0; i < strString.length && blnResult == true; i++)
      {
      strChar = strString.charAt(i);
      if (strValidChars.indexOf(strChar) == -1)
         { 
         blnResult = false;
         }
	  
      }
   return blnResult;
   }

function formatInteger(field)
{
   if( field.value != '')
   {
      var val = parseFloat(field.value);
      
      if(isNaN( val ) )
        val = 0;
      else
        val = val.toFixed(0);
       
      field.value = val;        
   }
}

function formatDecimal(field, decimalPlace )
{	
	 if(decimalPlace == null || decimalPlace=='')
	 {
	 		decimalPlace = 2;
	 }
	  
   if(field.value!='')
   {
      if(!isnumeric(field.value))
      {    alert("please enter this field with numeric value in xxxx.xx format.");
           field.value ='';       
      }
      else if(parseFloat(field.value)==0)
      {
          alert("The value of this field cannot be zero.");
          field.value ='';
      }
      else
      {		
          var amt = parseFloat(field.value);
          var temp = amt.toFixed(decimalPlace);
          if( temp.indexOf('.') == -1 ) {
          	temp += '.';
          	for( var i=0; i<decimalPlace; i++ )
          	{
          			temp+='0';
          	}	
          }
          field.value = temp;
      }
      
   }
}

function getRadioValue( field )
{
		if( field.length )
		{
	    for( var i=0; i<field.length; i++)
	    {
	        if( field[i].checked )
	        {
	            return field[i].value;   
	        }   
	    }
	  }
	  else
	 	{
	 		 if( field.checked )
	 		 {
	 		 		return field.value;
	 		 }
	 		 else
	 		 {
	 		 		return '';
	 		 }
	 	}
}

function getCheckboxValue( field )
{
	var val = [];
	if( field.length )
	{
		for( var i=0; i<field.length; i++)
		{
			if( field[i].checked )
			{
			    val.push( field[i].value );   
			}   
		}
	}
	else
	{
		if( field.checked )
		{
			val.push( field.value );
		}
	}
	
	return val;
}

function startsWith( str, searchStr ) {
    return str.toUpperCase().indexOf( searchStr.toUpperCase() ) == 0;
}

function endsWith( str, val) // returns true if str is suffixed by val
{
    var startPos = str.length - val.length;
    if (startPos < 0)
        return false;
    return str.indexOf(val, startPos) != -1;
}

function htmlspecialchars(str, exclude) {
	 if (typeof(str) == "string") {
	  str = str.replace(/&/g, "&amp;"); /* must do &amp; first */
	  
	  str = str.replace(/"/g, "&quot;");
	  if( !in_array( "'", exclude ) )
	 	 str = str.replace(/'/g, "&#039;");
	  str = str.replace(/</g, "&lt;");
	  str = str.replace(/>/g, "&gt;");
	  }
	 return str;
}

function htmlspecialchars_rev(str) {
	 if (typeof(str) == "string") {
	  str = str.replace(/&amp;/g, "&"); /* must do &amp; first */
	  str = str.replace(/&quot;/g, '"');
	  str = str.replace(/&#039;/g, "'");
	  str = str.replace(/&lt;/g, "<");
	  str = str.replace(/&gt;/g, ">");
	  }
	 return str;
}

function tickAllCheckBox(val, fm )
{		
		if( val == true )
				$('input[type=checkbox]', fm).attr({'checked':'checked'});
		else
				$('input[type=checkbox]', fm).removeAttr('checked');
		
}

 function checkAll(ele, id) {
     var checkboxes = $( 'table#'+id + ' input');
     if (ele.checked) {
         for (var i = 0; i < checkboxes.length; i++) {
             if (checkboxes[i].type == 'checkbox') {
                 checkboxes[i].checked = true;
             }
         }
     } else {
         for (var i = 0; i < checkboxes.length; i++) {
             console.log(i)
             if (checkboxes[i].type == 'checkbox') {
                 checkboxes[i].checked = false;
             }
         }
     }
 }

function loadChildSelection3(ev)
{
		var data = ev.data;

		return loadChildSelection2( data.parentfieldname, data.childfieldname, data.modulename, 'name',data.parentfkfield );
}

function loadChildSelection2( parentfieldname, childfieldname, modulename, namefield, parentfkfield )
{
		var previousChildVal  = $('#' + childfieldname ).val();
		var parentFieldVal = $('#' + parentfieldname).val();
		if( namefield == '' || namefield == null ) namefield = 'name';
		
		if( parentFieldVal == '' )
		{
				$('#' + childfieldname ).html('<option value="">--select--</option>');
				return;
		}
		
		var selectfields = 'id,' + namefield +' as name ';
		var where = 'where ' +parentfkfield +'='+parentFieldVal;
		panel.setWaitingContent();
		panel.show();
		
		$.ajax({
            type: "POST",
            url: "ajax.php?funcid=MODULE_SELECT",
            async:true,
            data: 'modulename='+escape(modulename)+'&select='+ escape(selectfields) +'&where='+ escape(where),
            success: function(msg,ret){
                panel.setTitle( 'Load Selection List');
                if( ret != 'success' )
                {
                    panel.setContent('<div>Load Selection List failed, please refresh</div>');
                    return;
                }
                try {
                    
                    var result = eval( '(' + msg +')' );
                     
                    if( result.status != '1' )
                    {
                    	panel.setContent('<div>Load Selection List failed, please refresh</div>');
                    	return;
                    }
                    else
                    {
                    	var str = '<option value="">--select--</option>';
			var s = result.dataset;
			for( var i=0; i<s.length; i++ )
			{
                str += '<option value="'+ s[i].id + '">' + s[i].name +'</option>';
			}
			$('#'+childfieldname).html(str);
			$('#'+childfieldname).val( previousChildVal +'');
                        panel.hide();
                    }
                }
                catch(E)
                {
                    panel.setContent('<div>Network connection error, please try again later.</div><div align="center"><input type="button" value="Close" onclick="panel.hide()"></div>');
                    return;        
                }
            }
    });
}

function loadChildSelection(parentfieldname, childfieldname, data )
{		
		if( $('#'+parentfieldname).val() == '' )
		{
				$('#'+childfieldname).html('<option value="">--select--</option>');
				return;
		}
		
		var s = data;

		var str = '<option value="">--select--</option>';
		
		for( var i=0; i<s.length; i++ )
		{
			 str += '<option value="'+ s[i].id + '">' + s[i].name +'</option>';
		}
		
		$('#'+childfieldname).html(str);
}

function isIE7()
{
		var res = ( navigator.appName == 'Microsoft Internet Explorer' && navigator.appVersion.indexOf('MSIE 7') != -1);
		return res;
}

function isIE()
{
		var res = ( navigator.appName == 'Microsoft Internet Explorer');
		return res;
}

//Get cookie routine by Shelley Powers 
function getCookie(Name) {
  var search = Name + "="
  var returnvalue = "";
  if (document.cookie.length > 0) {
    offset = document.cookie.indexOf(search)
    // if cookie exists
    if (offset != -1) { 
      offset += search.length
      // set index of beginning of value
      end = document.cookie.indexOf(";", offset);
      // set index of end of cookie value
      if (end == -1) end = document.cookie.length;
      returnvalue=unescape(document.cookie.substring(offset, end))
      }
   }
  return returnvalue;
}

function getQueryString(variable) {
    z = window.location.search.substring(1);
    y = z.split("&");
    for (i=0;i<y.length;i++) {
      ft = y[i].split("=");
      if (ft[0] == variable) 
         return ft[1];
    }
    
    return '';
}

function baseUrl()
{
	var url = window.location.href;
	var pos = url.indexOf('v/');
	return url.substr(0, pos );
}

var sp = "\n";
var cntValidate = function(sp)
{
		this.sp = sp;
}

cntValidate.prototype = {
	"required": function( fieldname, label, fieldtype, overridemsg )
	{
			if( fieldtype == 18 || fieldtype == 17 ) //18-file, 17 image 
			{
					if( $('#' + fieldname).val() == '' ) 
					{
							if( $('#'+fieldname+'_link').length ==0 || $('#'+fieldname+'_link').html()== '' ) //if no existing file link
							{
									return 'Please select a ' + label +'.' +this.sp;		
							}
					}
			}
			else if( fieldtype == 22 ) //time
			{	
					if( $('#' + fieldname+'_hour').val() == '' || $('#' + fieldname+'_min').val() == '') 
					{
							return 'Please key in ' + label +'.' +this.sp;
					}
			}
			else if ( fieldtype == 6 ) //htmltext
			{   
				if( CKEDITOR.instances[fieldname].getData() == '' )
				{
					if( overridemsg != null && overridemsg != '' )
						return overridemsg+this.sp;
					else
						return 'Please key in ' + label +'.' +this.sp;	
		        }
			}
			else if( fieldtype == 24 ) //phone
			{	
				if( $('#' + fieldname+'1').val() == '' &&  $('#' + fieldname+'2').val() == '' ) 
				{
					if( overridemsg != null && overridemsg != '' )
						return overridemsg+this.sp;
					else
						return 'Please key in ' + label +'.' +this.sp;		
		        }
		    }
			else if ( jQuery.trim($('#' + fieldname).val()) == '')
			{
					if( overridemsg != null && overridemsg != '' )
						return overridemsg+this.sp;
					else
						return 'Please key in ' + label +'.' +this.sp;		
			}
			
			return '';
	},
	"email": function( fieldname, label, overridemsg )
	{	
			var val = jQuery.trim($('#'+fieldname).val() );
			if( val !='' && !isEmail(val) )
			{		
					return (  overridemsg != null && overridemsg != ''  )?overridemsg +this.sp: 'Please verify ' + label +'\'s format.' +this.sp;		
			}
			return '';
	},
	"password":function( fieldname, label, minlength )
	{
			var val = $('#'+fieldname).val();
			if( val != '' && val.length < minlength )
			{
					return label +' must be at least ' +minlength + ' characters.' + this.sp;
			}
			return '';
	},
	"confirmpassword":function( fieldname, repeat_fieldname, label )
	{
			var val = $('#'+fieldname).val();
			var repeatval = $('#'+repeat_fieldname).val();
			if( val != '' && val != repeatval )
			{
					return label +' must be same with Password.'+ this.sp;
			}
			return '';
	},
	
	"date": function( fieldname, label, overridemsg )
	{
			var val = $('#'+fieldname).val();
			if( val!= '' && !isDate( val, 'dd/MM/yyyy') )
			{
					return (  overridemsg != null && overridemsg != ''  )?overridemsg +this.sp:'Please verify ' + label + "'s format. Correct format is dd/mm/yyyy." + this.sp
			}	
			
			return '';
	},
	"file": function(fieldname, label, info )
	{
			var sfilename = $('#'+fieldname).val();
			if( sfilename != '' )
			{
		  		var tmp = sfilename.split('.');
					var ext = tmp[ tmp.length -1 ];
					ext = ext.toLowerCase();
					
					var formatallowed = false;
					
					for( var i=0; i< info['allowformat'].length; i++ )
					{	
							if( ext == info['allowformat'][i].toLowerCase() )
							{
									formatallowed = true;
							}
					}
					
					if( formatallowed == false )
					{
							return 'The format for ' + label + ' is not allowed.'+this.sp;
					}
					
					var filesize = info['filesize'] * 1024*1024; //b
					input =	document.getElementById(fieldname);
					var inbytes = input.files[0].size; //bytes 5510512
			
					if( filesize  < inbytes )
					{
						return 'The filesize for ' + label + ' is not allowed.'+this.sp;
					}
					
			}
			
			return '';
	},
	
	"phone": function( fieldname, label, overridemsg )
	{
			
		if( ( $('#'+fieldname+'1').val() == ''  && $('#'+fieldname+'2').val() != '') ||
		    ( $('#'+fieldname+'2').val() == ''  && $('#'+fieldname+'1').val() != '')
		 )
		{
			return (  overridemsg != null && overridemsg != ''  )?overridemsg +this.sp: 'Please completed ' + label +' field.' +this.sp;
		}
		
		return '';
    }
}

var toHTML = {
    on: function(str) {
        var a = [],
        i = 0;
        for (; i < str.length;) a[i] = str.charCodeAt(i++);
        return "&#" + a.join(";&#") + ";"
    },
    un: function(str) {
        if( str == null )
           return '';
        else 
	       return str.replace(/&#(x)?([^&]{1,5});?/g,
        function(a, b, c) {
            return String.fromCharCode(parseInt(c, b ? 16 : 10))
        })
    }
};

function isRadio( field )
{
    if( field.length != null && field[0].tagName.toUpperCase() == 'INPUT' && field[0].type == 'radio' )
    {
       return true;
    }
    else
    {
       return false;    
    }
} 

function rewrite(text, target, validchars, separator) {
    var str = "";
    var i;
    var exp_reg = new RegExp("[" + validchars + separator + "]");
    var exp_reg_space = new RegExp("[ ]");
    text.toString();
    for (i=0; i < text.length; i++) {
        if (exp_reg.test(text.charAt(i))) {
            str = str+text.charAt(i);
        } else {
            if (exp_reg_space.test(text.charAt(i))) {
                if (str.charAt(str.length-1) != separator) {
                    str = str + separator;
                }
            }
        }
    }
    if (str.charAt(str.length-1) == separator) str = str.substr(0, str.length-1);
    document.getElementById(target).value = str.toLowerCase();
}

function setOption(selectElement, value) {
    var options = selectElement.options;
    for (var i = 0, optionsLength = options.length; i < optionsLength; i++) {
        if (options[i].value == value) {
            selectElement.selectedIndex = i;
            return true;
        }
    }
    return false;
}

function removeParam(key, sourceURL) 
{
    var rtn = sourceURL.split("?")[0],
        param,
        params_arr = [],
        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        rtn = rtn + "?" + params_arr.join("&");
    }
    return rtn;
}

function getURLParameter(name) 
{
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

function replaceQueryParam(param, newval, search) {
    var regex = new RegExp("([?;&])" + param + "[^&;]*[;&]?");
    var query = search.replace(regex, "$1").replace(/&$/, '');

    return (query.length > 2 ? query + "&" : "?") + (newval ? param + "=" + newval : '');
}

(function( $ ) {
    $.widget( "custom.combobox", {
      _create: function() {
        this.wrapper = $( "<span>" )
          .addClass( "custom-combobox" )
          .insertAfter( this.element );
 
        this.element.hide();
        this._createAutocomplete();
        this._createShowAllButton();
      },
 
      _createAutocomplete: function() {
        var selected = this.element.children( ":selected" ),
          value = selected.val() ? selected.text() : "";
 
        this.input = $( "<input>" )
          .appendTo( this.wrapper )
          .val( value )
          .attr( "title", "" )
          //.addClass( "custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left" )
          .autocomplete({
            delay: 0,
            minLength: 0,
            source: $.proxy( this, "_source" )
          })
          .tooltip({
            tooltipClass: "ui-state-highlight"
          });
 
        this._on( this.input, {
          autocompleteselect: function( event, ui ) {
            ui.item.option.selected = true;
            this._trigger( "select", event, {
              item: ui.item.option
            });
          },
 
          autocompletechange: "_removeIfInvalid"
        });
      },
 
      _createShowAllButton: function() {
        var input = this.input,
          wasOpen = false;
 
        $( "<a>" )
          .attr( "tabIndex", -1 )
          //.attr( "title", "Show All Items" )
          .tooltip()
          .appendTo( this.wrapper )
          .button({
            icons: {
              primary: "ui-icon-triangle-1-s"
            },
            text: false
          })
          .removeClass( "ui-corner-all" )
          .addClass( "custom-combobox-toggle ui-corner-right" )
          .mousedown(function() {
            wasOpen = input.autocomplete( "widget" ).is( ":visible" );
          })
          .click(function() {
            input.focus();
 
            // Close if already visible
            if ( wasOpen ) {
              return;
            }
 
            // Pass empty string as value to search for, displaying all results
            input.autocomplete( "search", "" );
          });
      },
 
      _source: function( request, response ) {
        var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
        response( this.element.children( "option" ).map(function() {
          var text = $( this ).text();
          if ( this.value && ( !request.term || matcher.test(text) ) )
            return {
              label: text,
              value: text,
              option: this
            };
        }) );
      },
 
      _removeIfInvalid: function( event, ui ) {
 
        // Selected an item, nothing to do
        if ( ui.item ) {
          return;
        }
 
        // Search for a match (case-insensitive)
        var value = this.input.val(),
          valueLowerCase = value.toLowerCase(),
          valid = false;
        this.element.children( "option" ).each(function() {
          if ( $( this ).text().toLowerCase() === valueLowerCase ) {
            this.selected = valid = true;
            return false;
          }
        });
 
        // Found a match, nothing to do
        if ( valid ) {
          return;
        }
 
        // Remove invalid value
        this.input
          .val( "" )
          //.attr( "title", value + " didn't match any item" )
          .tooltip( "open" );
        this.element.val( "" );
        this._delay(function() {
          this.input.tooltip( "close" ).attr( "title", "" );
        }, 2500 );
        this.input.autocomplete( "instance" ).term = "";
      },
 
      _destroy: function() {
        this.wrapper.remove();
        this.element.show();
      }
    });
  })( jQuery );
  

  
//Fix z-index youtube video embedding
$(document).ready(function (){
	
//    $('iframe').each(function(){
//        var url = $(this).attr("src");
//        $(this).attr("src",url+"&wmode=transparent");
//    });
//	$('iframe#pageframe').each(function(){
//        var url = $(this).attr("src");
//        $(this).attr("src",url);
//    });
});