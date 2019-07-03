// Core engine for evaluating the decision rule logic
var $endpoints;
var $template;
var $dataElementValues;
var ruleEvaluationResults;

function evaluate_rules(template, endpoints, dataElementValues) {
    ruleEvaluationResults = [];
    $endpoints = endpoints;
    $template = template;
    $dataElementValues = dataElementValues;

    endpoints.forEach(endpoint => {
        var $endpoint = template.endpoint.endpoints.find(x => x.id == endpoint);
        processEndpointAndGenerateReportText($endpoint);
    });

    return ruleEvaluationResults;
}

function processEndpointAndGenerateReportText($endpoint) {
    var ruleEvaluationResult = Object.create(new RuleEvaluationResult());;
    var $reportTextString = '';

    $endpoint.reportSections.forEach(_reportSection => {
        $reportTextString = '';
        var conditionMet = false;
        ruleEvaluationResult.repeatedSectionName = processSectionName($endpoint.id);
        _reportSection.branch.forEach(_branch => {
            if (_branch.compositeCondition !== undefined) {
                conditionMet = _branch.compositeCondition.evaluate($dataElementValues);
            }
            if (_branch.condition !== undefined) {
                conditionMet = _branch.condition.evaluate($dataElementValues);
            }

            if (conditionMet || (_branch.compositeCondition === undefined && _branch.condition === undefined)) {
                $reportTextString += processBranch(_branch);
            }
        });
        ruleEvaluationResult.ruleEvaluationReportResult = Object.create(new RuleEvaluationReportResult());
        ruleEvaluationResult.ruleEvaluationReportResult.reportText = $reportTextString;
        ruleEvaluationResult.ruleEvaluationReportResult.sectionId = _reportSection.sectionId;
        ruleEvaluationResults.push(ruleEvaluationResult);
    });
}

function processSectionName(endPointId) {
    if (isEndpointisRepeating(endPointId)) {
        var inputText = endPointId;
        var endpointId_splitted = inputText.split('_');
        if (endpointId_splitted.length > 1) {
            var splittedText = inputText.split('_')[endpointId_splitted.length - 1].replace(/\'/g, '').split(/(\d+)/).filter(Boolean);
            var processedString = '';
            _.forEach(splittedText, function (value, key) {
                processedString += value + ' ';
            });

            return processedString.trim();
        }

        return '';
    }

    return '';
}

function isEndpointisRepeating(endpointId) {
    var result = _.map($template.endpoint.endpoints, function (o) {
        return (o.isManuallyAdded && o.id === endpointId);
    });

    var resultWithoutUndefinedValues = _.without(result, undefined);
    return resultWithoutUndefinedValues !== undefined && resultWithoutUndefinedValues.length > 0 ? true : false;
}

function processBranch(branch) {
    var $reportTextString = '';
    branch.reportText.forEach(reportText => {
        var $reportText = reportText.GetPropertyType();
        $reportTextString += $reportText.processText($template, $dataElementValues);
    });

    return $reportTextString;
}

/* Interface, Class, Report text modules and functions */

/* Interface declaration starts here */

class CompositeCondition {
    conditionType = String;
    conditions = Array < Object > [];
    IsRelevant = Boolean;

    evaluate(dataElementValues) {
        throw new Error('You must implement evaluate method inside the composite condition');
    }
}

class Condition {
    conditionType = ConditionType;
    IsRelevant = Boolean;

    evaluate(dataElementValues) {
        throw new Error('You must implement evaluate method inside the condition');
    }
}

class IReportText {
    processText(template, dataElementValues) {
        throw new Error('You must implement processText method inside the report text');
    }

    manupulateId(dynamicId) {
        throw new Error('You must implement manupulateId method inside the report text');
    };
}

/* Class declaration starts here */

class Template {
    metadata = Metadata;
    dataElements = Array < BaseDataElement > [];
    rules = Rules;
    templatePartial = Array < string > [];
    endPointsString = Array < string > [];
    xmlContent = String;
    endpoint = Endpoint;
}

class Metadata {
    label = String;
    id = String;
    schemaVersion = String;
    ruleVersion = String;
    diagrams = Array < Diagram > [];
    createdDate = Date;
    lastModifiedDate = Date;
    approvedBy = String;
    reviewedBy = String;
    developedBy = String;
    radElementSetID = String;
}

class Diagram {
    displaySequence = Number;
    keyDiagram = Boolean;
    label = String;
    location = String;
    id = String;
}

class BaseDataElement {
    id = String;
    isRequired = Boolean = true;
    displaySequence = Number;
    label = String;
    hint = String;
    diagrams = Array < Diagram > [];
    voiceCommand = String;
    currentValue = Object;
    dataElementType = String;
    isVisible = true;
    defaultValue = Object;
    cdeId = String;
    conditionalProperties = Array < ConditionalProperty > [];
    isEditable = Boolean = true;
    hasprefilled = Boolean = false;
    output = Boolean = false;
    unit = String;
    sourceFilled = String;
    codableConcept = CodableConcept;
    allowFreetext = Boolean = false;

    isRequiredOverrider = Boolean = true;
    displaySequenceOverrider = Number;

    isRepeatable = Boolean;
    repeatGroup = String;
    repeatRefID = String;
    isManuallyAdded = Boolean;
}

class ChoiceDataElement extends BaseDataElement {
    choiceInfo = Array < Choice > [];
    imageMap = ImageMap;
    allowFreetext = false;
    ChoiceNotRelevant = Array < string > [];
}

class Choice {
    label = String;
    value = String;
    default = Boolean;
    hint = String;
    reportText = String;
    allowFreetext = Boolean;
}

class ImageElements {
    location = String;
    label = String;
}

class ImageMap extends ImageElements {
    drawStyle = DrawStyle;
    map = AreaMap;
}

class DrawStyle {
    outline = String;
    hoverFill = String;
    selectedFill = String;

}
class AreaMap {
    areas = Array < Area > [];
}

class Area {
    shape = String;
    coords = String;
    choiceValue = String;
}

class CodableConcept {
    name = String;
    coding = Array < Coding > [];

    constructor() {
        this.coding = new Array();
    }
}

class Coding {
    codingSystem = CodingValue;
    codingVersion = CodingValue;
    codingCode = CodingValue;
    codingDisplay = CodingValue;
    codingUserSelected = CodingValue;

    constructor() {
        this.codingSystem = new CodingValue();
        this.codingVersion = new CodingValue();
        this.codingCode = new CodingValue();
        this.codingDisplay = new CodingValue();
        this.codingUserSelected = new CodingValue();
    }
}

class CodingValue {
    element = String;
    value = String;
}

class ConditionalProperty {
    notRelevantDataElements = NotRelevantDataElements;
    compositeCondition = CompositeCondition;
    condition = Condition;
    isRelevant = Boolean;
    isRequired = Boolean;
    DisplaySequence = Number;
    ChoiceNotRelevant = Array < string > [];
    Minimum = Number;
    Maximum = Number;
    MinimumDay = Number;
    MaximumDay = Number;
    MinimumHours = Number;
    MaximumHours = Number;
    MinimumMinutes = Number;
    MaxmimumMinutes = Number;
    MinimumSeconds = Number;
    MaxmimumSeconds = Number;
}

class NotRelevantDataElements {
    dataElementReferences = Array < DataElementRef > [];
}

class DataElementRef {
    dataElementId = String;
}



class Rules {
    decisionPoints = Array < DecisionPoint > [];
}

class Endpoint {
    endpoints = Array < EndpointItem > [];
    templatePartials = Array < TemplatePartial > [];
}

class EndpointItem {
    isManuallyAdded = Boolean;
    id = String;
    label = String;
    diagnosis = Diagnosis;
    reportSections = Array < ReportSection > [];

    constructor() {
        this.reportSections = new Array();
    }
}

class Diagnosis {
    codeAttrs = CodeAttrs;
    text = String;
}

class CodeAttrs {
    codingSystem = String;
    code = String;
}

class ReportSection {
    branch = Array < Branch > [];
    sectionId = String;

    constructor() {
        this.branch = new Array();
    }
}

class Branch {
    label = String;
    notRelevantDataElements = NotRelevantDataElements;
    compositeCondition = CompositeCondition;
    condition = Condition;
    decisionPoints = Array < DecisionPoint > [];
    endPointRef = EndPointRef;
    computedValue = ComputedValue;
    branches = Array < Branch > [];
    reportText = Array < ReportText > [];
    isManuallyAdded = Boolean;

    constructor() {
        this.decisionPoints = new Array();
        this.branches = new Array();
        this.reportText = new Array();
    }
}

class DecisionPoint {
    id = String;
    label = String;
    branches = Array < Branch > [];
    defaultBranch = Branch;
}

class EndPointRef {
    label = String;
    description = String;
    endPointId = String;
    isRepeatable = Boolean;
    repeatCount = String;
    repeatGroup = String;
    diagramId = String;
}

class ComputedValue {
    expressionText = String;
}

class RuleEvaluationResult {
    endpoindId = String;
    repeatedSectionName = String;
    ruleEvaluationReportResult = RuleEvaluationReportResult;

    constructor() {
        this.ruleEvaluationReportResult = new RuleEvaluationReportResult();
    }
}

class RuleEvaluationReportResult {
    reportText = String;
    sectionId = String;
}

class ConditionType {
    dataElementId = String;
    comparisonValue = Object;
}

class DataElementValues {
    values = new Map();

    constructor(values) {
        this.values = values;
    }

    addOrUpdate(key, value) {
        this.values.set(key, value);
    }

    get(key) {
        return this.values.get(key);
    }

    delete(key) {
        return this.values.delete(key);
    }

    getAll() {
        return this.values;
    }
}

class SectionIfValueNotCondition extends Condition {
    IsRelevant = Boolean;
    conditionType = ConditionType;
    sectionIfValue = Array < SectionIfValueCondition > [];
    sectionIfValueNot = Array < SectionIfValueNotCondition > [];

    constructor(conditionType) {
        this.conditionType = conditionType;
    }

    evaluate(dataElementValues) {
        const value = dataElementValues.get(this.conditionType.dataElementId);
        return value !== this.conditionType.comparisonValue;
    }
}

class SectionIfValueCondition extends Condition {
    IsRelevant = Boolean;
    conditionType = ConditionType;
    sectionIf = Array < SectionIfValueCondition > [];
    innerSectionIfValue = SectionIfCondition;
    innerSectionIfValueNot = SectionIfValueNotCondition;
    sectionText = String;

    constructor(conditionType) {
        this.conditionType = conditionType;
    }

    evaluate(dataElementValues) {
        const value = dataElementValues.get(this.conditionType.dataElementId);
        return value === this.conditionType.comparisonValue;
    }
}

class SectionIfCondition extends Condition {
    IsRelevant = Boolean;
    conditionType = ConditionType;

    constructor(conditionType) {
        this.conditionType = conditionType;
    }

    evaluate(dataElementValues) {
        const nonRelevantDataElements = NonRelevantPushPopService.GetNonRelevantDataelements();
        let isDataElementNotRelevant = false;

        if (!isDataElementNotRelevant) {
            const value = dataElementValues.get(this.conditionType.dataElementId);
            if (value instanceof Array) {
                return value.length > 0 ? true : false;
            }

            return value !== undefined && value !== '' ? true : false;
        }

        return false;
    }
}

class TemplatePartial {
    isManuallyAdded = Boolean;
    id = String;
    sectionIfNotValue = SectionIfValueNotCondition;
    sectionIfValues = Array < SectionIfValueCondition > [];
    branches = Array < Branch > [];

    constructor() {
        this.branches = new Array();
    }
}

/* Report text  */

class ReportText extends IReportText {
    insertPartial = InsertPartial;
    insertValue = InsertValue;
    plainText = PlainText;
    newLine = NewLine;
    tab = Tab;
    space = Space;
}

ReportText.prototype.GetPropertyType = function () {
    if (this.insertPartial !== undefined) {
        return this.insertPartial;
    }

    if (this.insertValue !== undefined) {
        return this.insertValue;
    }

    if (this.plainText !== undefined) {
        return this.plainText;
    }

    if (this.newLine !== undefined) {
        return this.newLine;
    }

    if (this.tab !== undefined) {
        return this.tab;
    }

    if (this.space !== undefined) {
        return this.space;
    }
};

/* Report text rendering for insert partial */

class InsertPartial extends IReportText {
    partialId = String;

    processText(template, dataElementValues) { }

    manupulateId(dynamicId) { }

    findText(branch, template, dataElementValues) {
        let $reportTextString = '';
        for (const reportText of branch.reportText) {
            const $reportText = reportText.GetPropertyType();
            $reportTextString += $reportText.processText(template, dataElementValues);
        }

        return $reportTextString;
    }
}

InsertPartial.prototype.manupulateId = function (dynamicId) {
    return this.partialId + '_' + dynamicId;
};

InsertPartial.prototype.processText = function (template, dataElementValues) {
    let $reportTextString = '';
    const _templatePartial = _.find(template.endpoint.templatePartials, (templatePartial) => templatePartial.id
        === this.partialId);

    if (_templatePartial !== undefined) {
        for (const _branch of _templatePartial.branches) {
            let conditionMet = false;
            if (_branch.compositeCondition !== undefined) {
                conditionMet = _branch.compositeCondition.evaluate(new DataElementValues(dataElementValues));
            }
            if (_branch.condition !== undefined) {
                conditionMet = _branch.condition.evaluate(new DataElementValues(dataElementValues));
            }

            if (conditionMet || (_branch.compositeCondition === undefined && _branch.condition === undefined)) {
                $reportTextString += this.findText(_branch, template, dataElementValues);
            }
        }
    }
    return $reportTextString;
};

/* Report text rendering for insert value */

class InsertValue extends IReportText {
    dataElementId = String;
    significantDigits = Number;

    processText(template, dataElementValues) { }

    manupulateId(dynamicId) { }

    IsDataElementChoiceDataElement(template) {
        const $dataElementId = this.dataElementId;
        const result = template.dataElements.filter(function (obj) {
            return obj.id === $dataElementId && (obj.dataElementType === 'ChoiceDataElement' ||
                obj.dataElementType === 'MultiChoiceDataElement');
        });

        return result !== undefined && result.length > 0 ? result : null;
    }
}

InsertValue.prototype.manupulateId = function (dynamicId) {
    return this.dataElementId + '_' + dynamicId;
};

InsertValue.prototype.processText = function (template, dataElementValues) {
    const $dataElementValues = dataElementValues.get(this.dataElementId);
    const choiceDataElementResults = this.IsDataElementChoiceDataElement(template);
    let possibleValues = [];

    if ($dataElementValues === undefined) {
        if (choiceDataElementResults != null) {
            const choiceElem = choiceDataElementResults[0];
            choiceElem.choiceInfo.filter(function (choice) {
                return possibleValues.push(choice.label);
            });
        }

        return '[ ' + possibleValues.join(' / ') + ' ]';
    }

    if (choiceDataElementResults != null) {
        const choiceDataElementResult = choiceDataElementResults[0];
        if ($dataElementValues !== undefined && $dataElementValues instanceof Array) {
            if ($dataElementValues.length > 0) {
                possibleValues = $dataElementValues;
                return '[<mark> ' + possibleValues.join(' / ') + ' </mark>]';
            } else {
                choiceDataElementResult.choiceInfo.filter(function (choice) {
                    return possibleValues.push(choice.label);
                });
                return '[ ' + possibleValues.join(' / ') + ' ]';
            }
        } else {
            const result = choiceDataElementResult.choiceInfo.filter(function (choice) {
                return choice.value === $dataElementValues;
            });

            if (result.length > 0) {
                return '[<mark> ' + result[0].label + ' </mark>]';
            } else if ($dataElementValues === 'freetext' || $dataElementValues === '') {
                choiceDataElementResult.choiceInfo.filter(function (val) {
                    return possibleValues.push(val.label);
                });
                return '[ ' + possibleValues.join(' / ') + ' ]';
            }
        }
    }

    return $dataElementValues === '' ? '[ ' + $dataElementValues + ' ]' : '[<mark> ' + $dataElementValues + ' </mark>]';
};

/* Report text rendering for new line */

class NewLine extends IReportText {
    isNewLine = Boolean;
    processText(template, dataElementValues) { }

    manupulateId(dynamicId) { }
}

NewLine.prototype.manupulateId = function (dynamicId) {
    return this.isNewLine;
};

NewLine.prototype.processText = function (template, dataElementValues) {
    if (TabFormatingPushPopService.GetIsTabbed()) {
        TabFormatingPushPopService.SetIsTabbed(false);
        return '</div>';
    }

    return '<br>';
};

/* Report text rendering for plain text */

class PlainText extends IReportText {
    text = String;

    processText(template, dataElementValues) { }

    manupulateId(dynamicId) { }
}

PlainText.prototype.manupulateId = function (dynamicId) {
    return this.text;
};

PlainText.prototype.processText = function (template, dataElementValues) {
    return this.text;
};

/* Report text rendering for space */

class Space extends IReportText {
    isSpace = Boolean;
    processText(template, dataElementValues) { }

    manupulateId(dynamicId) { }
}

Space.prototype.manupulateId = function (dynamicId) {
    return this.isSpace;
};

Space.prototype.processText = function (template, dataElementValues) {
    return ' ';
};

/* Report text rendering for tab */

class Tab extends IReportText {
    isTab = Boolean;
    processText(template, dataElementValues) { }
    manupulateId(dynamicId) { }
}

Tab.prototype.manupulateId = function (dynamicId) {
    return this.isTab;
};

Tab.prototype.processText = function (template, dataElementValues) {
    TabFormatingPushPopService.SetIsTabbed(true);
    const result = '<div class="spantest" style="margin-left:50px">';
    return result;
};



