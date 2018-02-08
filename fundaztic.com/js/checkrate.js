var panel = null;
$(document).ready( function(){						
    panel = new cmsPanel( {"width":500});	
});

function checkRate(fm)
{
    var errormsg = '';
    var sp = "<br>";
		
    if( fm.loadamount.value == '')
		errormsg += 'Please key in Loan Amount.'+sp;
    if( fm.interest.value == '' )
		errormsg += 'Please key in Interest Rate p.a. (Flat).'+sp;
    if( fm.tenure.value == '' )
		errormsg += 'Please key in Tenure.'+sp;
    //if( fm.instalment.value == '' )
//		errormsg += 'Please key in No. of Instalment Paid-To-Date.'+sp;     
    
	if( errormsg != '' )
	{
			//panel.setWaitingContent();
			panel.show();
			panel.setTitle('Check Your Rate');
			panel.setContent('<div>'+errormsg+'</div>');    
            return false;
	}
	else
	{ 
	      var interest = fm.interest.value;
	      var tenure = fm.tenure.value;
	      var loadamount = fm.loadamount.value;
		T =  (1 + (tenure * interest/1200)) * loadamount;
	      var monthlyinstalment = parseFloat(T/tenure).toFixed(2);
		document.getElementById("instalmentamount").innerHTML = 'RM'+ addCommas(monthlyinstalment);	
	}
}

function addCommas(nStr)
{
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}
