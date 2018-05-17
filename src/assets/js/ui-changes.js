$.widget.bridge('uibutton', $.ui.button);
$(document).ready(function() {
		var xmlText = ' <ReportingModule> <Metadata> <Label>Adrenal CT</Label> <ID>ACR_Adrenal_CT_2_0</ID> <SchemaVersion>1.0</SchemaVersion> <ModuleVersion>2.0</ModuleVersion> <Info> <Diagrams> <Diagram DisplaySequence="1" IsKeyDiagram="true"> <Location>keyimage.PNG</Location> <Label>Adrenal CT</Label> </Diagram> </Diagrams> </Info> <ReportCitationText>Adrenal CT</ReportCitationText> <ApplicableSexes Value="Both" /> </Metadata> <DataElements> <ChoiceDataElement Id="imagefeatures" DisplaySequence="1" IsRequired="true"> <Label>Imageing Features</Label> <ChoiceInfo> <Choice> <Value>Diagnostic</Value> <Label>Diagnostic Benign</Label> </Choice> <Choice> <Value>Interminate</Value> <Label>Interminate</Label> </Choice> </ChoiceInfo> </ChoiceDataElement> <ChoiceDataElement Id="diagimagfeatures" DisplaySequence="2" IsRequired="true"> <Label>Diagnostic Imaging Features</Label> <ChoiceInfo> <Choice> <Value>myelolipoma</Value> <Label>Myelolipoma, No enhancement, Ca</Label> </Choice> <Choice> <Value>signalonCSMR</Value> <Label>≤10 HU or Signal on CS-MR</Label> </Choice> </ChoiceInfo> </ChoiceDataElement> <IntegerDataElement Id="adrenalmass" DisplaySequence="3" IsRequired="true"> <Label>Adrenal Mass</Label> <Minimum>1</Minimum> </IntegerDataElement> <ChoiceDataElement Id="priorimaging" DisplaySequence="4" IsRequired="true"> <Label>Prior Imaging</Label> <ChoiceInfo> <Choice> <Value>yes</Value> <Label>Yes</Label> </Choice> <Choice> <Value>no</Value> <Label>No</Label> </Choice> </ChoiceInfo> </ChoiceDataElement> <ChoiceDataElement Id="imgenlarge" DisplaySequence="5" IsRequired="true"> <Label>Imaging enlarge</Label> <ChoiceInfo> <Choice> <Value>stablemorethan1year</Value> <Label>Stable ≥ 1 year</Label> </Choice> <Choice> <Value>Neworenlarging</Value> <Label>New or enlarging</Label> </Choice> </ChoiceInfo> </ChoiceDataElement> <ChoiceDataElement Id="cancerhx" DisplaySequence="6" IsRequired="true"> <Label>Cancer Hx</Label> <ChoiceInfo> <Choice> <Value>Yes</Value> <Label>Yes</Label> </Choice> <Choice> <Value>No</Value> <Label>No</Label> </Choice> </ChoiceInfo> </ChoiceDataElement> <ChoiceDataElement Id="ncct" DisplaySequence="7" IsRequired="true"> <Label>Reduced dose NCCT</Label> <ChoiceInfo> <Choice> <Value>lessthan10</Value> <Label>≤10 HU</Label> </Choice> <Choice> <Value>greaterthan10</Value> <Label>&gt;10 HU</Label> </Choice> </ChoiceInfo> </ChoiceDataElement> <ChoiceDataElement Id="washout" DisplaySequence="8" IsRequired="true"> <Label>Adrenal CT washout</Label> <ChoiceInfo> <Choice> <Value>noenhancement</Value> <Label>No enhancement (&lt; 10 HU) = cyst or hemorrhage</Label> </Choice> <Choice> <Value>greaterthan60</Value> <Label>APW/RPW ≥60/40%</Label> </Choice> <Choice> <Value>lessthan60</Value> <Label>APW/RPW &lt;60/40%</Label> </Choice> </ChoiceInfo> </ChoiceDataElement> </DataElements> <Rules> <DecisionPoint Id="AdernalMassDetected"> <Label>Incidental, Asymptomatic Adrenal Mass Detected on any CT or MR exam</Label> <Branch> <NotRelevantDataElements> <DataElementRef DataElementId="adrenalmass" /> <DataElementRef DataElementId="cancerhx" /> <DataElementRef DataElementId="priorimaging" /> <DataElementRef DataElementId="imgenlarge" /> <DataElementRef DataElementId="ncct" /> <DataElementRef DataElementId="washout" /> </NotRelevantDataElements> <EqualCondition DataElementId="imagefeatures" ComparisonValue="Diagnostic" /> <DecisionPoint Id="DiagnosticImagingFeatures"> <Label>Diagnostic Imaging Features</Label> <Branch> <EqualCondition DataElementId="diagimagfeatures" ComparisonValue="myelolipoma" /> <EndPointRef EndPointId="benignnoFU" /> </Branch> <Branch> <EqualCondition DataElementId="diagimagfeatures" ComparisonValue="signalonCSMR" /> <EndPointRef EndPointId="benignadenoma" /> </Branch> </DecisionPoint> </Branch> <Branch> <NotRelevantDataElements> <DataElementRef DataElementId="diagimagfeatures" /> </NotRelevantDataElements> <EqualCondition DataElementId="imagefeatures" ComparisonValue="Interminate" /> <DecisionPoint Id="IndeterminateImagingDP"> <Label>Indeterminate Imaging Features</Label> <Branch> <NotRelevantDataElements> <DataElementRef DataElementId="priorimaging" /> <DataElementRef DataElementId="imgenlarge" /> <DataElementRef DataElementId="ncct" /> <DataElementRef DataElementId="washout" /> </NotRelevantDataElements> <GreaterThanOrEqualsCondition DataElementId="adrenalmass" ComparisonValue="4" /> <DecisionPoint Id="Intermediategreaterthan4"> <Label /> <Branch> <EqualCondition DataElementId="cancerhx" ComparisonValue="No" /> <EndPointRef EndPointId="considerresection" /> </Branch> <Branch> <EqualCondition DataElementId="cancerhx" ComparisonValue="Yes" /> <EndPointRef EndPointId="considerBX" /> </Branch> </DecisionPoint> </Branch> <Branch> <AndCondition> <GreaterThanOrEqualsCondition DataElementId="adrenalmass" ComparisonValue="1" /> <LessThanCondition DataElementId="adrenalmass" ComparisonValue="4" /> </AndCondition> <DecisionPoint Id="priorimagingDP"> <Label>Prior Imaging</Label> <Branch> <NotRelevantDataElements> <DataElementRef DataElementId="ncct" /> <DataElementRef DataElementId="washout" /> </NotRelevantDataElements> <EqualCondition DataElementId="priorimaging" ComparisonValue="yes" /> <DecisionPoint Id="imgenlargeDP"> <Label>Image Enlarge DP</Label> <Branch> <NotRelevantDataElements> <DataElementRef DataElementId="cancerhx" /> </NotRelevantDataElements> <EqualCondition DataElementId="imgenlarge" ComparisonValue="stablemorethan1year" /> <EndPointRef EndPointId="benignnoFU" /> </Branch> <Branch> <EqualCondition DataElementId="imgenlarge" ComparisonValue="Neworenlarging" /> <DecisionPoint Id="PICancerDP"> <Label>Image enlarge DP</Label> <Branch> <EqualCondition DataElementId="cancerhx" ComparisonValue="No" /> <EndPointRef EndPointId="consider12" /> </Branch> <Branch> <EqualCondition DataElementId="cancerhx" ComparisonValue="Yes" /> <EndPointRef EndPointId="considerBX" /> </Branch> </DecisionPoint> </Branch> </DecisionPoint> </Branch> <Branch> <NotRelevantDataElements> <DataElementRef DataElementId="imgenlarge" /> </NotRelevantDataElements> <EqualCondition DataElementId="priorimaging" ComparisonValue="no" /> <DecisionPoint Id="nopriorimagingDP"> <Label /> <Branch> <EqualCondition DataElementId="cancerhx" ComparisonValue="Yes" /> <DecisionPoint Id="CancerYsNcctDP"> <Label>NCCT DP</Label> <Branch> <NotRelevantDataElements> <DataElementRef DataElementId="washout" /> </NotRelevantDataElements> <EqualCondition DataElementId="ncct" ComparisonValue="lessthan10" /> <EndPointRef EndPointId="benignadenoma" /> </Branch> <Branch> <EqualCondition DataElementId="ncct" ComparisonValue="greaterthan10" /> <DecisionPoint Id="CancerYswashoutDP"> <Label>Washout DP</Label> <Branch> <EqualCondition DataElementId="washout" ComparisonValue="noenhancement" /> <EndPointRef EndPointId="benignnoFU" /> </Branch> <Branch> <EqualCondition DataElementId="washout" ComparisonValue="greaterthan60" /> <EndPointRef EndPointId="benignadenoma" /> </Branch> <Branch> <EqualCondition DataElementId="washout" ComparisonValue="lessthan60" /> <EndPointRef EndPointId="ImagingFU" /> </Branch> </DecisionPoint> </Branch> </DecisionPoint> </Branch> <Branch> <EqualCondition DataElementId="cancerhx" ComparisonValue="No" /> <DecisionPoint Id="nocancerhxDP"> <Label /> <Branch> <NotRelevantDataElements> <DataElementRef DataElementId="ncct" /> <DataElementRef DataElementId="washout" /> </NotRelevantDataElements> <AndCondition> <GreaterThanOrEqualsCondition DataElementId="adrenalmass" ComparisonValue="1" /> <LessThanOrEqualsCondition DataElementId="adrenalmass" ComparisonValue="2" /> </AndCondition> <EndPointRef EndPointId="consider12probBenign" /> </Branch> <Branch> <AndCondition> <GreaterThanCondition DataElementId="adrenalmass" ComparisonValue="2" /> <LessThanCondition DataElementId="adrenalmass" ComparisonValue="4" /> </AndCondition> <DecisionPoint Id="ncctDP"> <Label>NCCT DP</Label> <Branch> <NotRelevantDataElements> <DataElementRef DataElementId="washout" /> </NotRelevantDataElements> <EqualCondition DataElementId="ncct" ComparisonValue="lessthan10" /> <EndPointRef EndPointId="benignadenoma" /> </Branch> <Branch> <EqualCondition DataElementId="ncct" ComparisonValue="greaterthan10" /> <DecisionPoint Id="washoutDP"> <Label>Washout DP</Label> <Branch> <EqualCondition DataElementId="washout" ComparisonValue="noenhancement" /> <EndPointRef EndPointId="benignnoFU" /> </Branch> <Branch> <EqualCondition DataElementId="washout" ComparisonValue="greaterthan60" /> <EndPointRef EndPointId="benignadenoma" /> </Branch> <Branch> <EqualCondition DataElementId="washout" ComparisonValue="lessthan60" /> <EndPointRef EndPointId="ImagingFU" /> </Branch> </DecisionPoint> </Branch> </DecisionPoint> </Branch> </DecisionPoint> </Branch> </DecisionPoint> </Branch> </DecisionPoint> </Branch> </DecisionPoint> </Branch> </DecisionPoint> </Rules> <EndPoints> <EndPoint Id="benignadenoma"> <ReportTexts> <ReportText SectionId="findings">Benign adenoma, no F/U</ReportText> </ReportTexts> </EndPoint> <EndPoint Id="considerresection"> <ReportTexts> <ReportText SectionId="findings">Consider resection</ReportText> </ReportTexts> </EndPoint> <EndPoint Id="considerBX"> <ReportTexts> <ReportText SectionId="findings">Consider Bx or PET-CT</ReportText> </ReportTexts> </EndPoint> <EndPoint Id="benignnoFU"> <ReportTexts> <ReportText SectionId="findings">Benign, no F/U</ReportText> </ReportTexts> </EndPoint> <EndPoint Id="consider12"> <ReportTexts> <ReportText SectionId="findings">Consider 12 months F/U adrenal CT or resection.</ReportText> </ReportTexts> </EndPoint> <EndPoint Id="consider12probBenign"> <ReportTexts> <ReportText SectionId="findings">Probably benign Consider 12 months F/U adrenal CT or resection.</ReportText> </ReportTexts> </EndPoint> <EndPoint Id="ImagingFU"> <ReportTexts> <ReportText SectionId="findings">Imaging F/U, Bx, PET-CT, or resection depending on clinical scenario.</ReportText> </ReportTexts> </EndPoint> </EndPoints> </ReportingModule>';
	
	$('.comment-no-likes').tooltip();
    $('[data-toggle="tooltip"]').tooltip();
    //$('.comments-block-scrollable').slimScroll({
    //    height: '650px'
    //});
    //$('.div-simulator-testCases-block').slimScroll({
    //    height: '745px'
    //});
    //$('#div-simulator-form').slimScroll({
    //    height:''+window.innerHeight-186+'px'
    //});
    $('.img-decissionTree').loupe();
    
});
$('.btn-testcases-collapse-more').on('click', function () {
      var  btnmore = $(this);
      var  moreBlock = $(btnmore).parents('.testcases-collapse-more-block');
      var  testCasesDiv = $(btnmore).parents('.div-testcases-list:first');
      var  moretestcases = $(testCasesDiv).find('.testcases-collapse');
      
        $(moretestcases).removeClass('hidden').show();
        $(moreBlock).addClass('hidden').hide();

        $(testCasesDiv).find('.wrap').removeClass('wrap').addClass('no-wrap');
    });
$('.btn-testcases-collapse-less').on('click', function () {
       var btnless = $(this);    
       var testCasesDiv = $(btnless).parents('.div-testcases-list:first');
       var moreBlock = $(testCasesDiv).find('.testcases-collapse-more-block:first');
       var moretestcases = $(testCasesDiv).find('.testcases-collapse');

        $(moretestcases).addClass('hidden').hide();
        $(moreBlock).removeClass('hidden').show();
        $(testCasesDiv).find('.no-wrap').removeClass('no-wrap').addClass('wrap');

    });

var toggleDecissionTreeMagnifier = function(btn) {
  var magnifier = $(btn).attr('data-magnifier-on');
    if (magnifier) {
      

    }
    else {
        $('.img-decissionTree').loupe();
    }
}
var decissionTreeOpen = function(btn) {
    $(btn).hide();

    $('#div-decissionTree-Block').removeClass('hidden').show();
    adjustTabsPanelWidth();
    hideSideBar();

}
var closeDecissionTree =function(btn) {

    $('#div-decissionTree-Block').addClass('hidden').hide();
    $('#btn-decissionTree-block-open').show();
    adjustTabsPanelWidth();

}
var adjustTabsPanelWidth = function() {
   var tabClassname = '';
   var commentBlockClass = 'col-xs-2 col-sm-2 col-md-4 col-lg-2';
    if ($('#div-comments-block').hasClass('hidden')) {
        if ($('#div-decissionTree-Block').hasClass('hidden')) {
            tabClassname = 'col-xs-12 col-sm-12 col-md-12 col-lg-12';
        }
        else {
            tabClassname = 'col-xs-8 col-sm-8 col-md-12 col-lg-8';
           
        }
    }
    else if ($('#div-decissionTree-Block').hasClass('hidden')) {
        tabClassname = 'col-xs-8 col-sm-8 col-md-8 col-lg-8';
        commentBlockClass = 'col-xs-4 col-sm-4 col-md-4 col-lg-4';
    }
    else {
        tabClassname = 'col-xs-6 col-sm-6 col-md-8 col-lg-6';
    }
    $('#div-tabs-panel').attr('class', tabClassname);
    if (!$('#div-comments-block').hasClass('hidden')) {
        $('#div-comments-block').attr('class', commentBlockClass);
    }

}
var openCommentWindow = function(trigger) {
    $('#div-comments-block').removeClass('hidden').show();
    adjustTabsPanelWidth();
    hideSideBar();
}

var closeCommentsBlock = function() {
    $('#div-comments-block').addClass('hidden');
    adjustTabsPanelWidth();
}

function hideSideBar() {
    if (!$('body').hasClass('sidebar-collapse'))
        $('.sidebar-toggle').trigger('click');
}

function toggleTestCasesFilter(btn) {
	simulator_testCases_block_height=$('.div-simulator-testCases-block').height();
    if ($('#div-testcases-filter').hasClass('hidden')) {
        $('#div-testcases-filter').removeClass('hidden').show();
        $(btn).find('i').removeClass('fa fa-angle-double-down').addClass('fa fa-angle-double-up');
		$('.div-simulator-testCases-block').css('height', ''+(simulator_testCases_block_height-($('#div-testcases-filter').height()+10))+'px');

    } else {        
        $(btn).find('i').removeClass('fa fa-angle-double-up').addClass('fa fa-angle-double-down');
		$('.div-simulator-testCases-block').css('height',''+(simulator_testCases_block_height+$('#div-testcases-filter').height()+10)+'px');
		$('#div-testcases-filter').addClass('hidden').hide();
    }
}
function toggleTestCases() {
   var btn = $('#btn-toggle-testCases');
   var testCaseBlock = $('#div-testCases-Block');
   var simulatorBlock = $('#div-simulator-block');
   var optionsBlock = $('#div-simulator-block-toptions');
    if ($(testCaseBlock).hasClass('hidden')) {
        $(optionsBlock).addClass('hidden');
        $(testCaseBlock).removeClass('hidden').show();
        $(simulatorBlock).removeClass('col-md-12').addClass('col-md-7');

    }
    else {
        $(optionsBlock).removeClass('hidden');
        $(testCaseBlock).addClass('hidden').hide();
        $(simulatorBlock).removeClass('col-md-7').addClass('col-md-12');
    }
}

function executeTestCase() {
    if ($('#div-simulator-results-block').hasClass('hidden')){
	   	$('#div-simulator-results-block').removeClass('hidden').show();
		$('#div-simulator-form').css({"height":''+($('#div-simulator-form').height()-247)+'px'});
	}
}
