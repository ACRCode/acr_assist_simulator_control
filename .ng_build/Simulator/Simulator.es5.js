import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injectable, Input, NgModule, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
var GlobalsService = (function () {
    function GlobalsService() {
        this.ComputedElementConditions = {};
        this.XMLAcronyms = {};
        this.LoadkeyDiagram = true;
        this.evaluateExpessions = true;
    }
    return GlobalsService;
}());
GlobalsService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
GlobalsService.ctorParameters = function () { return []; };
var TemplateDetails = (function () {
    function TemplateDetails() {
    }
    return TemplateDetails;
}());
var DataElement = (function () {
    function DataElement() {
        this.ArithmaticExpression = '';
        this.TextExpression = [];
        this.Visible = true;
        this.DisplaySequence = 0;
        this.ValueBlocks = [];
    }
    return DataElement;
}());
var Metadata = (function () {
    function Metadata() {
    }
    return Metadata;
}());
var Diagram = (function () {
    function Diagram() {
    }
    return Diagram;
}());
var ChoiceOption = (function () {
    function ChoiceOption() {
    }
    return ChoiceOption;
}());
var ImageOption = (function () {
    function ImageOption() {
    }
    return ImageOption;
}());
var MetadataDiagram = (function () {
    function MetadataDiagram() {
    }
    return MetadataDiagram;
}());
var EndPoint = (function () {
    function EndPoint() {
        this.ID = '';
        this.ReportSections = [];
        this.ReqDataElements = [];
    }
    return EndPoint;
}());
var ReportSection = (function () {
    function ReportSection() {
        this.Heading = '';
        this.ReportTexts = [];
        this.ReqDataElements = [];
    }
    return ReportSection;
}());
var ReportText = (function () {
    function ReportText() {
        this.Condition = '';
        this.ResultText = '';
        this.DataElementID = '';
        this.NestedReportText = [];
    }
    return ReportText;
}());
var ExpressionBlock = (function () {
    function ExpressionBlock() {
        this.Condition = '';
        this.TextCondition = '';
        this.NestedBlocks = [];
        this.ElseBlocks = [];
        this.NotRelavantDataElements = [];
        this.ValidationCondition = '';
        this.ArithmeticExpression = '';
        this.ParentID = '';
        this.Condition = '';
        this.TextCondition = '';
        this.ValidationCondition = '';
        this.NestedBlocks = [];
        this.ParentID = '';
        this.ElseBlocks = [];
        this.NotRelavantDataElements = [];
    }
    return ExpressionBlock;
}());
var Parser = (function () {
    function Parser() {
        this.stringParser = require('string');
    }
    /**
     * @param {?} xmlData
     * @return {?}
     */
    Parser.prototype.parseToJson = function (xmlData) {
        var /** @type {?} */ jsonResult;
        xmlData = this.CleanUp(xmlData);
        var /** @type {?} */ parseString = require('xml2js').parseString;
        parseString(xmlData, { explicitRoot: false, explicitArray: false, attrkey: 'Attr' }, function (err, result) {
            jsonResult = result;
        });
        return jsonResult;
    };
    /**
     * @param {?} str
     * @return {?}
     */
    Parser.prototype.IsJsonString = function (str) {
        try {
        }
        catch (e) {
            return false;
        }
        return true;
    };
    /**
     * @param {?} xmlstr
     * @return {?}
     */
    Parser.prototype.CleanUp = function (xmlstr) {
        xmlstr = xmlstr.replace(/<!--[\s\S]*?-->/g, ''); // remove commented lines
        xmlstr = xmlstr.replace(/\n|\t|\r/g, ' '); // replace special characters
        xmlstr = xmlstr.replace(/ {1,}<|\t{1,}</g, '<'); // replace leading spaces and tabs
        xmlstr = xmlstr.replace(/> {1,}|>\t{1,}/g, '>'); // replace trailing spaces and tabs
        xmlstr = xmlstr.replace(/<\?[^>]*\?>/g, ''); // delete docType tags
        xmlstr = xmlstr.replace(/\"/g, '"');
        var /** @type {?} */ dataElements = this.stringParser(xmlstr).between('<DataElements>', '</DataElements>').s;
        var /** @type {?} */ tempDataElements = dataElements;
        dataElements = this.CleanUpTextTemplate(dataElements);
        xmlstr = xmlstr.replace(tempDataElements, dataElements);
        var /** @type {?} */ endPoints = this.stringParser(xmlstr).between('<EndPoints>', '</EndPoints>').s;
        var /** @type {?} */ tempEndPoints = endPoints;
        endPoints = this.CleanUpTemplatePartials(endPoints);
        endPoints = this.CleanUpReportText(endPoints, '<ReportText SectionId="findings">', '<ReportText SectionId=\'findings\'>');
        endPoints = this.CleanUpReportText(endPoints, '<ReportText SectionId="impression">', '<ReportText SectionId=\'impression\'>');
        endPoints = this.CleanUpReportText(endPoints, '<ReportText SectionId="recommendation">', '<ReportText SectionId=\'recommendation\'>');
        return xmlstr.replace(tempEndPoints, endPoints);
    };
    /**
     * @param {?} source
     * @return {?}
     */
    Parser.prototype.CleanUpTextTemplate = function (source) {
        var /** @type {?} */ startMatch = '<TextExpression>';
        var /** @type {?} */ endMatch = '</TextExpression>';
        if (this.stringParser(source).contains(startMatch)) {
            var /** @type {?} */ str1 = this.stringParser(source).between('', startMatch).s + startMatch;
            var /** @type {?} */ temp = this.stringParser(source).between(str1).s;
            var /** @type {?} */ str2 = this.stringParser(temp).between('', endMatch).s;
            var /** @type {?} */ _str2 = str2;
            var /** @type {?} */ morphedText = this.MorphReportText(str2);
            var /** @type {?} */ newText = str1 + morphedText;
            var /** @type {?} */ str3 = this.stringParser(temp).between(_str2);
            if (str3 !== '') {
                newText += this.CleanUpTextTemplate(str3);
            }
            return newText;
        }
        return source;
    };
    /**
     * @param {?} source
     * @param {?} match1
     * @param {?=} match2
     * @return {?}
     */
    Parser.prototype.CleanUpReportText = function (source, match1, match2) {
        if (!(this.stringParser(source).contains(match1) || this.stringParser(source).contains(match2))) {
            return source;
        }
        var /** @type {?} */ match = this.stringParser(source).contains(match1) ? match1 : match2;
        var /** @type {?} */ reportTextClosing = '</ReportText>';
        var /** @type {?} */ str1 = this.stringParser(source).between('', match).s + match;
        var /** @type {?} */ temp = this.stringParser(source).between(str1).s;
        var /** @type {?} */ str2 = this.stringParser(temp).between('', reportTextClosing).s;
        // TODO : Verify this logic
        var /** @type {?} */ _str2 = str2;
        var /** @type {?} */ morphedText = this.MorphReportText(str2);
        var /** @type {?} */ newText = str1 + morphedText;
        var /** @type {?} */ str3 = this.stringParser(temp).between(_str2);
        if (str3 !== '') {
            newText += this.CleanUpReportText(str3, match);
        }
        return newText;
    };
    /**
     * @param {?} source
     * @return {?}
     */
    Parser.prototype.CleanUpTemplatePartials = function (source) {
        var /** @type {?} */ match = '<TemplatePartial';
        var /** @type {?} */ templatePartialClosing = '</TemplatePartial>';
        if (this.stringParser(source).contains(match)) {
            var /** @type {?} */ templateTagElement = match + this.stringParser(source).between(match, '>') + '>';
            var /** @type {?} */ str1 = this.stringParser(source).between('', templateTagElement) + templateTagElement;
            var /** @type {?} */ str2 = this.stringParser(source).between(templateTagElement, templatePartialClosing);
            var /** @type {?} */ str3 = this.stringParser(source).between(templatePartialClosing);
            var /** @type {?} */ morphedText = this.MorphReportText(str2);
            return str1 + morphedText + templatePartialClosing + this.CleanUpTemplatePartials(str3);
        }
        else {
            return source;
        }
    };
    /**
     * @param {?} str2
     * @return {?}
     */
    Parser.prototype.MorphReportText = function (str2) {
        var /** @type {?} */ text = [];
        while (str2.trim() !== '') {
            if (this.stringParser(str2).startsWith('<SectionIf') || this.stringParser(str2).startsWith('<SectionIfNot') ||
                this.stringParser(str2).startsWith('<SectionIfValue') || this.stringParser(str2).startsWith('<SectionIfValueNot')) {
                var /** @type {?} */ temp = str2;
                var /** @type {?} */ sectionContent = this.stringParser(str2).between('', '>') + '>';
                var /** @type {?} */ newStr2 = str2.replace(sectionContent, '');
                var /** @type {?} */ morphedText = '<Text>' + sectionContent + this.MorphReportText(newStr2);
                text.push(morphedText);
                str2 = this.stringParser(str2).between(temp).s;
            }
            else if (this.stringParser(str2).startsWith('</SectionIf>')) {
                text.push('</SectionIf>' + '</Text>');
                str2 = this.stringParser(str2).between('</SectionIf>').s;
            }
            else if (this.stringParser(str2).startsWith('</SectionIfNot>')) {
                text.push('</SectionIfNot>' + '</Text>');
                str2 = this.stringParser(str2).between('</SectionIfNot>').s;
            }
            else if (this.stringParser(str2).startsWith('</SectionIfValue>')) {
                text.push('</SectionIfValue>' + '</Text>');
                str2 = this.stringParser(str2).between('</SectionIfValue>').s;
            }
            else if (this.stringParser(str2).startsWith('</SectionIfValueNot>')) {
                text.push('</SectionIfValueNot>' + '</Text>');
                str2 = this.stringParser(str2).between('</SectionIfValueNot>').s;
            }
            else if (this.stringParser(str2).startsWith('<')) {
                var /** @type {?} */ temp = this.stringParser(str2).between('', '>') + '>';
                text.push('<Text>' + temp + '</Text>');
                str2 = this.stringParser(str2).between(temp).s;
            }
            else {
                var /** @type {?} */ temp = str2;
                if (str2.indexOf('<') !== -1) {
                    temp = this.stringParser(str2).between('', '<');
                }
                text.push('<Text>' + temp + '</Text>');
                str2 = str2.replace(temp, '');
            }
        }
        return text.join(' ');
    };
    /**
     * @param {?} xmlstr
     * @param {?} startString
     * @param {?} endString
     * @return {?}
     */
    Parser.prototype.GetSubstring = function (xmlstr, startString, endString) {
        var /** @type {?} */ startIndex = xmlstr.indexOf(startString) + startString.length;
        var /** @type {?} */ endIndex = xmlstr.indexOf(endString);
        return xmlstr.substring(startIndex, endIndex);
    };
    /**
     * @param {?} string
     * @param {?} subString
     * @param {?} allowOverlapping
     * @return {?}
     */
    Parser.prototype.occurrences = function (string, subString, allowOverlapping) {
        string += '';
        subString += '';
        if (subString.length <= 0) {
            return (string.length + 1);
        }
        var /** @type {?} */ n = 0, /** @type {?} */ pos = 0;
        var /** @type {?} */ step = allowOverlapping ? 1 : subString.length;
        while (true) {
            pos = string.indexOf(subString, pos);
            if (pos >= 0) {
                ++n;
                pos += step;
            }
            else {
                break;
            }
        }
        return n;
    };
    return Parser;
}());
var XMLUtil = (function () {
    function XMLUtil() {
        this.DataElements = [];
        this.DataElementsObj = {};
        this.Acronyms = {};
        this.xmlFileJSON = {};
        this.TemplatePartials = {};
        this.ExpressionBlocks = [];
        this.Endpoints = {};
        this.NewEndPoints = {};
        this.ValidationBlocks = [];
        this.ValidationBlocksObj = {};
        this.FormValues = {};
    }
    /**
     * @param {?} arr
     * @return {?}
     */
    XMLUtil.prototype.unique = function (arr) {
        return arr.filter(function (item, index, inputArray) {
            return inputArray.indexOf(item) === index;
        });
    };
    /**
     * @param {?} elem
     * @return {?}
     */
    XMLUtil.prototype.AppendToDataElements = function (elem) {
        elem.Visible = true;
        this.DataElements.push(elem);
        this.DataElementsObj[elem.ID] = elem;
        this.Acronyms[elem.ID] = elem.Label;
        if (elem.ElementType === 'ChoiceDataElement' || elem.ElementType === 'MultiChoiceDataElement') {
            for (var _i = 0, _a = elem.ChoiceOptions; _i < _a.length; _i++) {
                var opt = _a[_i];
                this.Acronyms[opt.Value] = opt.Label;
            }
        }
        var /** @type {?} */ obj = [];
        if (elem.IsRequired) {
            var /** @type {?} */ condition = '(this.FormValues[\'' + elem.ID + '\'] == undefined || this.FormValues[\'' +
                elem.ID + '\'] == \'\' || this.FormValues[\'' + elem.ID + '\'] == null || this.FormValues[\'' +
                elem.ID + '\'] == NaN ) && (this.FormValues[\'' + elem.ID + '\'] != 0)';
            var /** @type {?} */ message = '"' + elem.Label + '" is a required input.';
            this.ValidationBlocks.push({ 'Condition': condition, 'Message': message,
                'DataElementID': elem.ID, DataElementIndex: this.DataElements.indexOf(elem) });
            obj.push(condition);
        }
        if (elem.Minimum !== undefined) {
            var /** @type {?} */ condition = '(this.FormValues[\'' + elem.ID + '\'] < ' + elem.Minimum + ')';
            var /** @type {?} */ message = 'Minimum value required';
            this.ValidationBlocks.push({ 'Condition': condition, 'Message': message,
                'DataElementID': elem.ID, DataElementIndex: this.DataElements.indexOf(elem), 'Minimum': elem.Minimum });
            obj.push(condition);
        }
        if (obj.length > 0) {
            this.ValidationBlocksObj[elem.ID] = '(' + obj.join(' || ') + ')';
        }
    };
    /**
     * @param {?} elemObj
     * @return {?}
     */
    XMLUtil.prototype.parseBaseDataElement = function (elemObj) {
        var _this = this;
        var /** @type {?} */ elem = new DataElement();
        elem.ID = elemObj.Attr.Id;
        elem.IsRequired = elemObj.Attr.hasOwnProperty('IsRequired') ? elemObj.Attr.IsRequired : false;
        elem.Hint = elemObj.hasOwnProperty('Hint') ? elemObj.Hint : '';
        elem.Label = elemObj.Label;
        elem.DisplaySequence = elemObj.Attr.DisplaySequence !== undefined ? elemObj.Attr.DisplaySequence : 0;
        if (elemObj.Diagrams !== undefined) {
            elem.Diagrams = [];
            if (elemObj.Diagrams.Diagram.constructor.name === 'Array') {
                elemObj.Diagrams.Diagram.forEach(function (element) {
                    var /** @type {?} */ diag = _this.createDiagram(element);
                    elem.Diagrams.push(diag);
                });
            }
            else if (elemObj.Diagrams.Diagram.constructor.name === 'Object') {
                var /** @type {?} */ element = elemObj.Diagrams.Diagram;
                var /** @type {?} */ diag = this.createDiagram(element);
                elem.Diagrams.push(diag);
            }
        }
        return elem;
    };
    /**
     * @param {?} element
     * @return {?}
     */
    XMLUtil.prototype.createDiagram = function (element) {
        var /** @type {?} */ diag = new Diagram();
        diag.Label = element.Label;
        diag.Location = this.templateDetails.imagePath + '//' + element.Location;
        return diag;
    };
    /**
     * @param {?} elemObj
     * @return {?}
     */
    XMLUtil.prototype.parseGlobalDataElement = function (elemObj) {
        var /** @type {?} */ elem = new DataElement();
        elem.ElementType = 'GlobalValue';
        elem.ID = elemObj.Attr.Id;
        elem.Value = elemObj.ElementValue;
        this.AppendToDataElements(elem);
    };
    /**
     * @param {?} choice
     * @param {?} elem
     * @return {?}
     */
    XMLUtil.prototype.createChoiceOption = function (choice, elem) {
        var /** @type {?} */ choiceOption = new ChoiceOption();
        choiceOption.Label = choice.Label;
        choiceOption.Value = choice.Value;
        choiceOption.Default = choice.hasOwnProperty('Attr') ? (choice.Attr.hasOwnProperty('Default') ?
            choice.Attr.Default : false) : false;
        if (choiceOption.Default) {
            this.FormValues[elem.ID] = choiceOption.Value;
        }
        return choiceOption;
    };
    /**
     * @param {?} elemObj
     * @return {?}
     */
    XMLUtil.prototype.parseChoiceDataElements = function (elemObj) {
        var /** @type {?} */ elem = this.parseBaseDataElement(elemObj);
        elem.ElementType = 'ChoiceDataElement';
        elem.ChoiceOptions = [];
        if (elemObj.ChoiceInfo.Choice.constructor.name === 'Array') {
            for (var _i = 0, _a = elemObj.ChoiceInfo.Choice; _i < _a.length; _i++) {
                var choice = _a[_i];
                var /** @type {?} */ choiceOption = this.createChoiceOption(choice, elem);
                elem.ChoiceOptions.push(choiceOption);
            }
        }
        else if (elemObj.ChoiceInfo.Choice.constructor.name === 'Object') {
            var /** @type {?} */ choice = elemObj.ChoiceInfo.Choice;
            var /** @type {?} */ choiceOption = this.createChoiceOption(choice, elem);
            elem.ChoiceOptions.push(choiceOption);
        }
        if (elemObj.hasOwnProperty('ImageMap')) {
            elem.ImagePath = this.templateDetails.imagePath + '//' + elemObj.ImageMap.imageElements;
            elem.ImageTitle = elem.ImagePath.split('.')[0];
            if (elemObj.ImageMap.hasOwnProperty('Map')) {
                elem.ImageOptions = [];
                for (var _b = 0, _c = elemObj.ImageMap.Map.Area; _b < _c.length; _b++) {
                    var area = _c[_b];
                    var /** @type {?} */ opt = new ImageOption();
                    opt.Coordinates = area.Attr.Coords;
                    opt.Shape = area.Attr.Shape;
                    opt.Value = area.Attr.ChoiceValue;
                    elem.ImageOptions.push(opt);
                }
            }
        }
        this.AppendToDataElements(elem);
    };
    /**
     * @param {?} elemObj
     * @return {?}
     */
    XMLUtil.prototype.parseMultiChoiceDataElements = function (elemObj) {
        var /** @type {?} */ elem = this.parseBaseDataElement(elemObj);
        elem.ElementType = 'MultiChoiceDataElement';
        elem.ChoiceOptions = [];
        if (elemObj.ChoiceInfo.Choice.constructor.name === 'Array') {
            for (var _i = 0, _a = elemObj.ChoiceInfo.Choice; _i < _a.length; _i++) {
                var choice = _a[_i];
                var /** @type {?} */ choiceOption = this.createChoiceOption(choice, elem);
                elem.ChoiceOptions.push(choiceOption);
            }
        }
        else if (elemObj.ChoiceInfo.Choice.constructor.name === 'Object') {
            var /** @type {?} */ choice = elemObj.ChoiceInfo.Choice;
            var /** @type {?} */ choiceOption = this.createChoiceOption(choice, elem);
            elem.ChoiceOptions.push(choiceOption);
        }
        this.AppendToDataElements(elem);
    };
    /**
     * @param {?} elemObj
     * @return {?}
     */
    XMLUtil.prototype.parseNumericDataElements = function (elemObj) {
        var /** @type {?} */ elem = this.parseBaseDataElement(elemObj);
        elem.ElementType = 'NumericDataElement';
        elem.Minimum = elemObj.hasOwnProperty('Minimum') ? elemObj.Minimum : 0;
        this.AppendToDataElements(elem);
    };
    /**
     * @param {?} elemObj
     * @return {?}
     */
    XMLUtil.prototype.parseComputedDataElement = function (elemObj) {
        var /** @type {?} */ elem = new DataElement();
        elem.ElementType = 'ComputedElement';
        elem.ID = elemObj.Attr.Id;
        elem.DisplaySequence = elemObj.Attr.DisplaySequence !== undefined ? elemObj.Attr.DisplaySequence : 0;
        elem.Label = elemObj.hasOwnProperty('Label') ? elemObj.Label : '';
        elem.Hint = elemObj.hasOwnProperty('Hint') ? elemObj.Hint : '';
        elem.ShowValue = elemObj.Attr.hasOwnProperty('ShowValue') ? elemObj.Attr.ShowValue : false;
        if (elemObj.hasOwnProperty('DecisionPoint')) {
            elem.ValueBlocks = this.parseDecissionPoint(elemObj.DecisionPoint, 0, '0', undefined);
        }
        else if (elemObj.hasOwnProperty('ArithmeticExpression')) {
            elem.ArithmaticExpression = elemObj.ArithmeticExpression;
        }
        else if (elemObj.hasOwnProperty('TextExpression')) {
            elem.TextExpression = elemObj.TextExpression.Text;
        }
        this.AppendToDataElements(elem);
    };
    /**
     * @return {?}
     */
    XMLUtil.prototype.parseDataElements = function () {
        var /** @type {?} */ jsonObj = this.xmlFileJSON;
        // Choice Data Elements
        if (jsonObj.DataElements.hasOwnProperty('ChoiceDataElement')) {
            if (jsonObj.DataElements.ChoiceDataElement.constructor.name === 'Array') {
                for (var _i = 0, _a = jsonObj.DataElements.ChoiceDataElement; _i < _a.length; _i++) {
                    var dataElement = _a[_i];
                    this.parseChoiceDataElements(dataElement);
                }
            }
            else if (jsonObj.DataElements.ChoiceDataElement.constructor.name === 'Object') {
                this.parseChoiceDataElements(jsonObj.DataElements.ChoiceDataElement);
            }
        }
        // MultiChoice Data Elements
        if (jsonObj.DataElements.hasOwnProperty('MultiChoiceDataElement')) {
            if (jsonObj.DataElements.MultiChoiceDataElement.constructor.name === 'Array') {
                for (var _b = 0, _c = jsonObj.DataElements.MultiChoiceDataElement; _b < _c.length; _b++) {
                    var dataElement = _c[_b];
                    this.parseMultiChoiceDataElements(dataElement);
                }
            }
            else if (jsonObj.DataElements.MultiChoiceDataElement.constructor.name === 'Object') {
                this.parseMultiChoiceDataElements(jsonObj.DataElements.MultiChoiceDataElement);
            }
        }
        // Numeric DataElements
        if (jsonObj.DataElements.NumericDataElement !== undefined) {
            if (jsonObj.DataElements.NumericDataElement.constructor.name === 'Array') {
                for (var _d = 0, _e = jsonObj.DataElements.NumericDataElement; _d < _e.length; _d++) {
                    var dataElement = _e[_d];
                    this.parseNumericDataElements(dataElement);
                }
            }
            else if (jsonObj.DataElements.NumericDataElement.constructor.name === 'Object') {
                this.parseNumericDataElements(jsonObj.DataElements.NumericDataElement);
            }
        }
        // Integer Data Elements
        if (jsonObj.DataElements.IntegerDataElement !== undefined) {
            if (jsonObj.DataElements.IntegerDataElement.constructor.name === 'Array') {
                for (var _f = 0, _g = jsonObj.DataElements.IntegerDataElement; _f < _g.length; _f++) {
                    var dataElement = _g[_f];
                    this.parseNumericDataElements(dataElement);
                }
            }
            else if (jsonObj.DataElements.IntegerDataElement.constructor.name === 'Object') {
                this.parseNumericDataElements(jsonObj.DataElements.IntegerDataElement);
            }
        }
        // Global Values
        if (jsonObj.DataElements.GlobalValue !== undefined) {
            if (jsonObj.DataElements.GlobalValue.constructor.name === 'Array') {
                for (var _h = 0, _j = jsonObj.DataElements.GlobalValue; _h < _j.length; _h++) {
                    var dataElement = _j[_h];
                    this.parseGlobalDataElement(dataElement);
                }
            }
            else if (jsonObj.DataElements.GlobalValue.constructor.name === 'Object') {
                this.parseGlobalDataElement(jsonObj.DataElements.GlobalValue);
            }
        }
        // Computed DataElement
        if (jsonObj.DataElements.ComputedElement !== undefined) {
            if (jsonObj.DataElements.ComputedElement.constructor.name === 'Array') {
                for (var _k = 0, _l = jsonObj.DataElements.ComputedElement; _k < _l.length; _k++) {
                    var dataElement = _l[_k];
                    this.parseComputedDataElement(dataElement);
                }
            }
            else if (jsonObj.DataElements.ComputedElement.constructor.name === 'Object') {
                this.parseComputedDataElement(jsonObj.DataElements.ComputedElement);
            }
        }
        this.DataElements = this.DataElements.sort(function (d1, d2) { return d1.DisplaySequence - d2.DisplaySequence; });
    };
    /**
     * @param {?} templateDetails
     * @return {?}
     */
    XMLUtil.prototype.load = function (templateDetails) {
        this.templateDetails = templateDetails;
        var /** @type {?} */ parser = new Parser();
        this.xmlFileJSON = parser.parseToJson(templateDetails.templateContent);
        this.loadMetaData();
        this.parseDataElements();
        this.loadEndPoints();
        this.generateExpressions();
    };
    /**
     * @return {?}
     */
    XMLUtil.prototype.loadMetaData = function () {
        var _this = this;
        var /** @type {?} */ jsonObj = this.xmlFileJSON;
        var /** @type {?} */ metadata = new Metadata();
        metadata.Label = jsonObj.Metadata.Label;
        if (jsonObj.Metadata.Info.Diagrams !== undefined) {
            metadata.Diagrams = [];
            if (jsonObj.Metadata.Info.Diagrams.Diagram.constructor.name === 'Object') {
                if (jsonObj.Metadata.Info.Diagrams.Diagram.hasOwnProperty('Attr') &&
                    jsonObj.Metadata.Info.Diagrams.Diagram.Attr.hasOwnProperty('KeyDiagram') &&
                    jsonObj.Metadata.Info.Diagrams.Diagram.Attr.KeyDiagram === 'true') {
                    metadata.Diagrams.push(this.parseMetaDataDiagram(jsonObj.Metadata.Info.Diagrams.Diagram));
                }
            }
            else if (jsonObj.Metadata.Info.Diagrams.Diagram.constructor.name === 'Array') {
                jsonObj.Metadata.Info.Diagrams.Diagram.forEach(function (diag) {
                    if (diag.Attr.hasOwnProperty('KeyDiagram') && diag.Attr.KeyDiagram === 'true') {
                        metadata.Diagrams.push(_this.parseMetaDataDiagram(diag));
                    }
                });
            }
        }
        this.Metadata = metadata;
    };
    /**
     * @param {?} diag
     * @return {?}
     */
    XMLUtil.prototype.parseMetaDataDiagram = function (diag) {
        var /** @type {?} */ diagObj = new MetadataDiagram();
        diagObj.DisplaySequence = diag.Attr.hasOwnProperty('DisplaySequence') ? diag.Attr.DisplaySequence : 0;
        diagObj.KeyDiagram = diag.Attr.hasOwnProperty('KeyDiagram') ? diag.Attr.KeyDiagram : false;
        diagObj.Label = diag.hasOwnProperty('Label') ? diag.Label : '';
        diagObj.ImagePath = this.templateDetails.imagePath + '//' + diag.Location;
        return diagObj;
    };
    /**
     * @return {?}
     */
    XMLUtil.prototype.loadTemplatePartials = function () {
        var /** @type {?} */ jsonObj = this.xmlFileJSON;
        if (jsonObj.EndPoints.TemplatePartial !== undefined) {
            if (jsonObj.EndPoints.TemplatePartial.length === undefined) {
                var /** @type {?} */ tempPart = jsonObj.EndPoints.TemplatePartial;
                var /** @type {?} */ TemplatePartialReportTexts = [];
                if (tempPart.Text.length === undefined) {
                    var /** @type {?} */ reportText = this.parseReportText(tempPart.Text);
                    TemplatePartialReportTexts.push(reportText);
                }
                else {
                    for (var _i = 0, _a = tempPart.Text; _i < _a.length; _i++) {
                        var text = _a[_i];
                        var /** @type {?} */ reportText = this.parseReportText(text);
                        TemplatePartialReportTexts.push(reportText);
                    }
                }
                this.TemplatePartials[tempPart.Attr.Id] = TemplatePartialReportTexts;
            }
            else {
                for (var _b = 0, _c = jsonObj.EndPoints.TemplatePartial; _b < _c.length; _b++) {
                    var tempPart = _c[_b];
                    var /** @type {?} */ templatePartialReportTexts = [];
                    if (tempPart.Text.length === undefined) {
                        var /** @type {?} */ reportText = this.parseReportText(tempPart.Text);
                        templatePartialReportTexts.push(reportText);
                    }
                    else {
                        for (var _d = 0, _e = tempPart.Text; _d < _e.length; _d++) {
                            var text = _e[_d];
                            var /** @type {?} */ reportText = this.parseReportText(text);
                            templatePartialReportTexts.push(reportText);
                        }
                    }
                    this.TemplatePartials[tempPart.Attr.Id] = templatePartialReportTexts;
                }
            }
        }
    };
    /**
     * @return {?}
     */
    XMLUtil.prototype.loadEndPoints = function () {
        var /** @type {?} */ jsonObj = this.xmlFileJSON;
        this.loadTemplatePartials();
        if (jsonObj.EndPoints.EndPoint.length !== undefined) {
            for (var _i = 0, _a = jsonObj.EndPoints.EndPoint; _i < _a.length; _i++) {
                var endPoint = _a[_i];
                var /** @type {?} */ ep = this.parseEndPoint(endPoint);
                this.Endpoints[ep.ID] = ep;
            }
        }
        else {
            var /** @type {?} */ ep = this.parseEndPoint(jsonObj.EndPoints.EndPoint);
            this.Endpoints[ep.ID] = ep;
        }
    };
    /**
     * @param {?} endPoint
     * @return {?}
     */
    XMLUtil.prototype.parseEndPoint = function (endPoint) {
        var /** @type {?} */ ep = new EndPoint();
        ep.ID = endPoint.Attr.Id;
        if (endPoint.ReportTexts.ReportText.length === undefined) {
            var /** @type {?} */ section = this.parseReportSection(endPoint.ReportTexts.ReportText);
            ep.ReportSections.push(section);
            ep.ReqDataElements = ep.ReqDataElements.concat(section.ReqDataElements);
        }
        else if (endPoint.ReportTexts.ReportText.length > 0) {
            for (var _i = 0, _a = endPoint.ReportTexts.ReportText; _i < _a.length; _i++) {
                var rt = _a[_i];
                var /** @type {?} */ section = this.parseReportSection(rt);
                ep.ReportSections.push(section);
                ep.ReqDataElements = ep.ReqDataElements.concat(section.ReqDataElements);
            }
        }
        ep.ReqDataElements = this.unique(ep.ReqDataElements);
        return ep;
    };
    /**
     * @param {?} obj
     * @return {?}
     */
    XMLUtil.prototype.parseReportSection = function (obj) {
        var /** @type {?} */ reportSection = new ReportSection();
        reportSection.Heading = obj.Attr.SectionId;
        if (obj.hasOwnProperty('Text')) {
            if (obj.Text.constructor.name === 'String' || obj.Text.constructor.name === 'Object') {
                var /** @type {?} */ reportText = this.parseReportText(obj.Text);
                reportSection.ReportTexts.push(reportText);
                if (reportText.DataElementID !== '') {
                    reportSection.ReqDataElements.push(reportText.DataElementID);
                }
                // reportText.DataElementID !== '' ? reportSection.ReqDataElements.push(reportText.DataElementID) : '';
            }
            else if (obj.Text.constructor.name === 'Array' && obj.Text.length > 0) {
                for (var _i = 0, _a = obj.Text; _i < _a.length; _i++) {
                    var elem = _a[_i];
                    var /** @type {?} */ reportText = this.parseReportText(elem);
                    reportSection.ReportTexts.push(reportText);
                    if (reportText.DataElementID !== '') {
                        reportSection.ReqDataElements.push(reportText.DataElementID);
                    }
                    // reportText.DataElementID !== '' ? reportSection.ReqDataElements.push(reportText.DataElementID) : '';
                }
            }
        }
        return reportSection;
    };
    /**
     * @param {?} obj
     * @return {?}
     */
    XMLUtil.prototype.parseReportText = function (obj) {
        var /** @type {?} */ reportText = new ReportText();
        if (obj.constructor.name === 'String') {
            reportText.ResultText = obj;
        }
        else if (obj.constructor.name === 'Object') {
            if (obj.InsertValue !== undefined) {
                reportText.DataElementID = obj.InsertValue.Attr.DataElementId;
            }
            else if (obj.SectionIf !== undefined) {
                reportText.Condition = '(this.FormValues[\'' + obj.SectionIf.Attr.DataElementId +
                    '\'] != undefined && this.FormValues[\'' +
                    obj.SectionIf.Attr.DataElementId + '\'] != \'\' && this.FormValues[\'' +
                    obj.SectionIf.Attr.DataElementId + '\'] != null && this.FormValues[\'' +
                    obj.SectionIf.Attr.DataElementId + '\'] != NaN)';
                if (obj.SectionIf.Text.length !== undefined) {
                    for (var _i = 0, _a = obj.SectionIf.Text; _i < _a.length; _i++) {
                        var text = _a[_i];
                        reportText.NestedReportText.push(this.parseReportText(text));
                    }
                }
                else {
                    reportText.NestedReportText.push(this.parseReportText(obj.SectionIf.Text));
                }
            }
            else if (obj.SectionIfNot !== undefined) {
                reportText.Condition = '(this.FormValues[\'' + obj.SectionIfNot.Attr.DataElementId +
                    '\'] == undefined || this.FormValues[\'' +
                    obj.SectionIfNot.Attr.DataElementId + '\'] == \'\' || this.FormValues[\'' +
                    obj.SectionIfNot.Attr.DataElementId + '\'] == null || this.FormValues[\'' +
                    obj.SectionIfNot.Attr.DataElementId + '\'] == NaN)';
                if (obj.SectionIfNot.Text.length !== undefined) {
                    for (var _b = 0, _c = obj.SectionIfNot.Text; _b < _c.length; _b++) {
                        var text = _c[_b];
                        reportText.NestedReportText.push(this.parseReportText(text));
                    }
                }
                else {
                    reportText.NestedReportText.push(this.parseReportText(obj.SectionIfNot.Text));
                }
            }
            else if (obj.SectionIfValue !== undefined) {
                var /** @type {?} */ RElement = void 0;
                var /** @type {?} */ comparisionVal = obj.SectionIfValue.Attr.ComparisonValue;
                if (this.DataElementsObj[comparisionVal]) {
                    if (this.DataElementsObj[comparisionVal].ElementType === 'GlobalValue') {
                        comparisionVal = this.DataElementsObj[comparisionVal].Value;
                        RElement = comparisionVal;
                    }
                }
                else {
                    if (isNaN(Number(comparisionVal))) {
                        RElement = ' \'' + comparisionVal + '\'';
                    }
                    else {
                        RElement = Number(comparisionVal);
                    }
                }
                reportText.Condition = '(this.FormValues[\'' + obj.SectionIfValue.Attr.DataElementId + '\'] == ' + RElement + ')';
                if (obj.SectionIfValue.Text.length !== undefined) {
                    for (var _d = 0, _e = obj.SectionIfValue.Text; _d < _e.length; _d++) {
                        var text = _e[_d];
                        reportText.NestedReportText.push(this.parseReportText(text));
                    }
                }
                else {
                    reportText.NestedReportText.push(this.parseReportText(obj.SectionIfValue.Text));
                }
            }
            else if (obj.SectionIfValueNot !== undefined) {
                var /** @type {?} */ RElement = void 0;
                var /** @type {?} */ comparisionVal = obj.SectionIfValueNot.Attr.ComparisonValue;
                if (this.DataElementsObj[comparisionVal]) {
                    if (this.DataElementsObj[comparisionVal].ElementType === 'GlobalValue') {
                        comparisionVal = this.DataElementsObj[comparisionVal].Value;
                        RElement = comparisionVal;
                    }
                }
                else {
                    if (isNaN(Number(comparisionVal))) {
                        RElement = ' \'' + comparisionVal + '\'';
                    }
                    else {
                        RElement = Number(comparisionVal);
                    }
                }
                reportText.Condition = '(this.FormValues[\'' + obj.SectionIfValueNot.Attr.DataElementId + '\'] != ' + RElement + ')';
                if (obj.SectionIfValueNot.Text.length !== undefined) {
                    for (var _f = 0, _g = obj.SectionIfValueNot.Text; _f < _g.length; _f++) {
                        var text = _g[_f];
                        reportText.NestedReportText.push(this.parseReportText(text));
                    }
                }
                else {
                    reportText.NestedReportText.push(this.parseReportText(obj.SectionIfValueNot.Text));
                }
            }
            else if (obj.InsertPartial !== undefined) {
                reportText.NestedReportText = this.TemplatePartials[obj.InsertPartial.Attr.PartialId];
            }
        }
        return reportText;
    };
    /**
     * @return {?}
     */
    XMLUtil.prototype.generateExpressions = function () {
        var /** @type {?} */ jsonObj = this.xmlFileJSON;
        this.ExpressionBlocks = this.parseDecissionPoint(jsonObj.Rules.DecisionPoint, 0, '0', undefined);
    };
    /**
     * @param {?} decissionPoint
     * @param {?} level
     * @param {?} parentID
     * @param {?} notRelavantItems
     * @return {?}
     */
    XMLUtil.prototype.parseDecissionPoint = function (decissionPoint, level, parentID, notRelavantItems) {
        var /** @type {?} */ Blocks = [];
        if (decissionPoint.Branch.length > 0) {
            for (var /** @type {?} */ index in decissionPoint.Branch) {
                var /** @type {?} */ branch = decissionPoint.Branch[index];
                var /** @type {?} */ block = this.parseBranch(branch, level, parseInt(index, 10), parentID, notRelavantItems);
                Blocks.push(block);
            }
        }
        else {
            var /** @type {?} */ block = this.parseBranch(decissionPoint.Branch, level, 0, parentID, notRelavantItems);
            Blocks.push(block);
        }
        if (decissionPoint.DefaultBranch !== undefined) {
            var /** @type {?} */ ElseBlock = this.parseBranch(decissionPoint.DefaultBranch, level + 1, 0, parentID, notRelavantItems);
            if (Blocks.length > 0) {
                var /** @type {?} */ lastBlock = Blocks[Blocks.length - 1];
                lastBlock.ElseBlocks.push(ElseBlock);
                Blocks[Blocks.length - 1] = lastBlock;
            }
        }
        return Blocks;
    };
    /**
     * @param {?} obj
     * @return {?}
     */
    XMLUtil.prototype.parseNotRelevantElements = function (obj) {
        var /** @type {?} */ ids = [];
        if (obj.DataElementRef.constructor.name === 'Object') {
            var /** @type {?} */ index = this.DataElements.indexOf(this.DataElementsObj[obj.DataElementRef.Attr.DataElementId]);
            ids.push(index);
        }
        else if (obj.DataElementRef.constructor.name === 'Array') {
            for (var _i = 0, _a = obj.DataElementRef; _i < _a.length; _i++) {
                var dataElement = _a[_i];
                var /** @type {?} */ index = this.DataElements.indexOf(this.DataElementsObj[dataElement.Attr.DataElementId]);
                ids.push(index);
            }
        }
        return ids;
    };
    /**
     * @param {?} branch
     * @param {?} level
     * @param {?} index
     * @param {?} parentID
     * @param {?} notRelavantItems
     * @return {?}
     */
    XMLUtil.prototype.parseBranch = function (branch, level, index, parentID, notRelavantItems) {
        var /** @type {?} */ Block = new ExpressionBlock();
        Block.Level = level;
        Block.Index = index;
        Block.ParentID = parentID;
        var /** @type {?} */ childParentID = '';
        if (parentID === '0') {
            childParentID = level + '' + index;
        }
        else {
            childParentID = parentID + '' + level + '' + index;
        }
        if (branch.NotRelevantDataElements !== undefined) {
            var /** @type {?} */ notRelevantElements = this.parseNotRelevantElements(branch.NotRelevantDataElements);
            Block.NotRelavantDataElements = notRelevantElements;
        }
        if (notRelavantItems !== undefined) {
            Block.NotRelavantDataElements = Block.NotRelavantDataElements.concat(notRelavantItems);
        }
        if (branch.LessThanCondition !== undefined) {
            var /** @type {?} */ res = this.buildExpression(branch.LessThanCondition.Attr, '<');
            Block.Condition = res.Condition;
            Block.TextCondition = res.TextCondition;
            Block.ValidationCondition = res.ValidationCondition;
        }
        if (branch.GreaterThanCondition !== undefined) {
            var /** @type {?} */ res = this.buildExpression(branch.GreaterThanCondition.Attr, '>');
            Block.Condition = res.Condition;
            Block.TextCondition = res.TextCondition;
            Block.ValidationCondition = res.ValidationCondition;
        }
        if (branch.EqualCondition !== undefined) {
            var /** @type {?} */ res = this.buildExpression(branch.EqualCondition.Attr, '==');
            Block.Condition = res.Condition;
            Block.TextCondition = res.TextCondition;
            Block.ValidationCondition = res.ValidationCondition;
        }
        if (branch.GreaterThanOrEqualsCondition !== undefined) {
            var /** @type {?} */ res = this.buildExpression(branch.GreaterThanOrEqualsCondition.Attr, '>=');
            Block.Condition = res.Condition;
            Block.TextCondition = res.TextCondition;
            Block.ValidationCondition = res.ValidationCondition;
        }
        if (branch.LessThanOrEqualsCondition !== undefined) {
            var /** @type {?} */ res = this.buildExpression(branch.LessThanOrEqualsCondition.Attr, '<=');
            Block.Condition = res.Condition;
            Block.TextCondition = res.TextCondition;
            Block.ValidationCondition = res.ValidationCondition;
        }
        if (branch.NotCondition !== undefined) {
            var /** @type {?} */ res = this.buildExpressions(branch.NotCondition, '&& !');
            Block.Condition = '!(' + res.Condition + ')';
            Block.TextCondition = '!(' + res.TextCondition + ')';
            Block.ValidationCondition = res.ValidationCondition;
        }
        if (branch.OrCondition !== undefined) {
            var /** @type {?} */ res = this.buildExpressions(branch.OrCondition, '||');
            Block.Condition = res.Condition;
            Block.TextCondition = res.TextCondition;
            Block.ValidationCondition = res.ValidationCondition;
        }
        if (branch.AndCondition !== undefined) {
            var /** @type {?} */ res = this.buildExpressions(branch.AndCondition, '&&');
            Block.Condition = res.Condition;
            Block.TextCondition = res.TextCondition;
            Block.ValidationCondition = res.ValidationCondition;
        }
        if (branch.ContainsCondition !== undefined) {
            var /** @type {?} */ res = this.buildContainsExpression(branch.ContainsCondition.Attr);
            Block.Condition = res.Condition;
            Block.TextCondition = res.TextCondition;
            Block.ValidationCondition = res.ValidationCondition;
        }
        if (branch.HasAnyNChoicesCondition !== undefined) {
            var /** @type {?} */ res = this.buildNoChoiceExpression(branch.HasAnyNChoicesCondition.Attr);
            Block.Condition = res.Condition;
            Block.TextCondition = res.TextCondition;
            Block.ValidationCondition = res.ValidationCondition;
        }
        if (branch.EndPointRef !== undefined) {
            Block.Result = this.Endpoints[branch.EndPointRef.Attr.EndPointId];
            if (Block.Result.ReqDataElements.length > 0) {
                var /** @type {?} */ evc = [];
                for (var _i = 0, _a = Block.Result.ReqDataElements; _i < _a.length; _i++) {
                    var de = _a[_i];
                    var /** @type {?} */ cond = this.ValidationBlocksObj[de];
                    if (cond !== undefined) {
                        evc.push(cond);
                    }
                }
                var /** @type {?} */ valCondition = evc.length > 0 ? '(' + evc.join('||') + ')' : '';
                if (Block.ValidationCondition !== '') {
                    if (valCondition !== '') {
                        Block.ValidationCondition = '(' + Block.ValidationCondition + '||' + valCondition + ')';
                    }
                }
                else {
                    Block.ValidationCondition = valCondition;
                }
            }
        }
        if (branch.DecisionPoint !== undefined) {
            var /** @type {?} */ NestedBranches = this.parseDecissionPoint(branch.DecisionPoint, level + 1, childParentID, Block.NotRelavantDataElements);
            Block.NestedBlocks = NestedBranches;
        }
        if (branch.ArithmeticExpression !== undefined) {
            Block.ArithmeticExpression = this.parseArithmaticExpression(branch.ArithmeticExpression);
        }
        if (branch.TextExpression !== undefined) {
            Block.TextExpression = branch.TextExpression.Text;
        }
        return Block;
    };
    /**
     * @param {?} expression
     * @return {?}
     */
    XMLUtil.prototype.parseArithmaticExpression = function (expression) {
        var /** @type {?} */ res = '';
        // Removing spaces
        expression = expression.replace(/ /g, '');
        expression = expression.replace(new RegExp('{', 'g'), ' this.FormValues[\'');
        expression = expression.replace(new RegExp('}', 'g'), '\'] ');
        expression = expression.replace(new RegExp('pow', 'g'), 'Math.pow');
        expression = expression.replace(new RegExp('exp', 'g'), 'Math.exp');
        res = expression;
        return res;
    };
    /**
     * @param {?} expression
     * @param {?} op
     * @return {?}
     */
    XMLUtil.prototype.cleanArithmaticExpression = function (expression, op) {
        var /** @type {?} */ index = expression.indexOf(op);
        if (index !== -1) {
            if (expression[index - 1] !== ')' || expression[index + 1] !== '(') {
                var /** @type {?} */ firstPart = expression.substring(0, index);
                var /** @type {?} */ joinPart = '';
                if (expression[index - 1] !== ')') {
                    joinPart = '\']';
                }
                joinPart += op;
                if (expression[index + 1] !== '(') {
                    joinPart += 'this.FormValues[\'';
                }
                var /** @type {?} */ remPart = expression.substring(index + 1, expression.length);
                expression = firstPart + joinPart + this.cleanArithmaticExpression(remPart, op);
            }
        }
        return expression;
    };
    /**
     * @param {?} attr
     * @param {?} op
     * @return {?}
     */
    XMLUtil.prototype.buildExpression = function (attr, op) {
        var /** @type {?} */ comparisionVal = attr.ComparisonValue;
        var /** @type {?} */ ValidationRule = this.ValidationBlocksObj[attr.DataElementId];
        var /** @type {?} */ LElement;
        var /** @type {?} */ LElementLabel;
        var /** @type {?} */ RElement;
        var /** @type {?} */ RElementLabel;
        var /** @type {?} */ condition = '';
        var /** @type {?} */ TextCondition = '';
        if (this.DataElementsObj[attr.DataElementId]
            && this.DataElementsObj[attr.DataElementId].ElementType === 'GlobalValue') {
            var /** @type {?} */ LValue = this.DataElementsObj[attr.DataElementId].Value;
            LElementLabel = this.Acronyms[attr.DataElementId];
            LElement = LValue;
        }
        else {
            LElement = 'this.FormValues[\'' + attr.DataElementId + '\'] ';
            LElementLabel = this.Acronyms[attr.DataElementId];
        }
        if (this.DataElementsObj[attr.ComparisonValue]) {
            if (this.DataElementsObj[attr.ComparisonValue].ElementType === 'GlobalValue') {
                comparisionVal = this.DataElementsObj[attr.ComparisonValue].Value;
                RElement = comparisionVal;
                RElementLabel = this.Acronyms[attr.ComparisonValue];
            }
        }
        else {
            if (isNaN(Number(comparisionVal))) {
                RElement = ' \'' + comparisionVal + '\'';
            }
            else {
                RElement = Number(comparisionVal);
            }
            RElementLabel = this.Acronyms[comparisionVal];
        }
        condition = '(' + LElement + op + ' ' + RElement + ')';
        TextCondition = '( ' + LElementLabel + '  ' + op + '  ' + RElementLabel + ' )';
        if (ValidationRule === undefined) {
            ValidationRule = '';
        }
        return { 'TextCondition': TextCondition, 'Condition': condition, 'ValidationCondition': ValidationRule };
    };
    /**
     * @param {?} attr
     * @return {?}
     */
    XMLUtil.prototype.buildContainsExpression = function (attr) {
        var /** @type {?} */ ValidationRule = this.ValidationBlocksObj[attr.DataElementId];
        if (ValidationRule === undefined) {
            ValidationRule = '';
        }
        var /** @type {?} */ condition = '';
        var /** @type {?} */ LElementLabel;
        var /** @type {?} */ TextCondition = '';
        var /** @type {?} */ LElement = 'this.FormValues[\'' + attr.DataElementId + '\']';
        LElementLabel = this.DataElementsObj[attr.DataElementId].Label;
        var /** @type {?} */ RElement = attr.ComparisonValue;
        condition += '(';
        condition += '(' + LElement + ' != undefined)';
        condition += '&&';
        if (RElement.split(' ').length > 1) {
            condition += '(';
            TextCondition += '(';
            RElement.split(' ').forEach(function (re) {
                condition += '(' + LElement + '.indexOf(\'' + re + '\') >= 0 ) &&';
                TextCondition += '(' + LElementLabel + ' Contains ' + re + ' && ';
            });
            condition = condition.substr(0, condition.lastIndexOf('&&'));
            TextCondition = TextCondition.substr(0, TextCondition.lastIndexOf('&&'));
            condition += ')';
            TextCondition += ')';
        }
        else {
            RElement = '\'' + RElement + '\'';
            condition += '(' + LElement + '.indexOf(' + RElement + ') >= 0 )';
            TextCondition += '(' + LElementLabel + ' Contains ' + RElement + ' ) ';
        }
        condition += ')';
        TextCondition += ')';
        return { 'TextCondition': TextCondition, 'Condition': condition, 'ValidationCondition': ValidationRule };
    };
    /**
     * @param {?} attr
     * @return {?}
     */
    XMLUtil.prototype.buildNoChoiceExpression = function (attr) {
        var /** @type {?} */ ValidationRule = this.ValidationBlocksObj[attr.DataElementId];
        if (ValidationRule === undefined) {
            ValidationRule = '';
        }
        var /** @type {?} */ LElementLabel;
        var /** @type {?} */ RElementLabel;
        var /** @type {?} */ TextCondition = '';
        var /** @type {?} */ condition = '';
        var /** @type {?} */ LElement = 'this.FormValues[\'' + attr.DataElementId + '\']';
        LElementLabel = this.DataElementsObj[attr.DataElementId].Label;
        var /** @type {?} */ RElement = Number(attr.MinimumChoices);
        RElementLabel = Number(attr.MinimumChoices);
        condition += '(';
        condition += '(' + LElement + ' != undefined)';
        condition += '&&';
        condition += '(' + LElement + '.length > ' + RElement + ')';
        condition += ')';
        TextCondition += '(';
        TextCondition += '(' + LElementLabel + ' Choices are Greater than ' + RElementLabel + ')';
        TextCondition += ')';
        return { 'TextCondition': TextCondition, 'Condition': condition, 'ValidationCondition': ValidationRule };
    };
    /**
     * @param {?} obj
     * @param {?} op
     * @return {?}
     */
    XMLUtil.prototype.buildExpressions = function (obj, op) {
        var /** @type {?} */ AndOp = '&&';
        var /** @type {?} */ exp = [];
        var /** @type {?} */ TextExp = [];
        var /** @type {?} */ validaitonExp = [];
        if (obj.EqualCondition !== undefined) {
            if (Array.isArray(obj.EqualCondition)) {
                var /** @type {?} */ conditions = [];
                var /** @type {?} */ textConditions = [];
                var /** @type {?} */ valdiationConditions = [];
                for (var _i = 0, _a = obj.EqualCondition; _i < _a.length; _i++) {
                    var cond = _a[_i];
                    var /** @type {?} */ res = this.buildExpression(cond.Attr, '==');
                    conditions.push(res.Condition);
                    textConditions.push(res.TextCondition);
                    if (res.ValidationCondition !== '') {
                        valdiationConditions.push(res.ValidationCondition);
                    }
                    // res.ValidationCondition !== '' ? valdiationConditions.push(res.ValidationCondition) : '';
                }
                exp.push('(' + conditions.join(' ' + op + ' ') + ')');
                TextExp.push('(' + textConditions.join(' ' + op + ' ') + ')');
                if (valdiationConditions.length > 0) {
                    validaitonExp.push('(' + valdiationConditions.join(' ' + AndOp + ' ') + ')');
                }
            }
            else {
                var /** @type {?} */ res = this.buildExpression(obj.EqualCondition.Attr, '==');
                exp.push(res.Condition);
                TextExp.push(res.TextCondition);
                if (res.ValidationCondition !== '') {
                    validaitonExp.push(res.ValidationCondition);
                }
                // res.ValidationCondition != '' ? validaitonExp.push(res.ValidationCondition) : '';
            }
        }
        if (obj.LessThanCondition !== undefined) {
            if (Array.isArray(obj.LessThanCondition)) {
                var /** @type {?} */ conditions = [];
                var /** @type {?} */ textConditions = [];
                var /** @type {?} */ valdiationConditions = [];
                for (var _b = 0, _c = obj.LessThanCondition; _b < _c.length; _b++) {
                    var cond = _c[_b];
                    var /** @type {?} */ res = this.buildExpression(cond.Attr, '<');
                    conditions.push(res.Condition);
                    textConditions.push(res.TextCondition);
                    if (res.ValidationCondition !== '') {
                        valdiationConditions.push(res.ValidationCondition);
                    }
                    // res.ValidationCondition != '' ? valdiationConditions.push(res.ValidationCondition) : '';
                }
                exp.push('(' + conditions.join(' ' + op + ' ') + ')');
                TextExp.push('(' + textConditions.join(' ' + op + ' ') + ')');
                if (valdiationConditions.length > 0) {
                    validaitonExp.push('(' + valdiationConditions.join(' ' + AndOp + ' ') + ')');
                }
            }
            else {
                var /** @type {?} */ res = this.buildExpression(obj.LessThanCondition.Attr, '<');
                exp.push(res.Condition);
                TextExp.push(res.TextCondition);
                if (res.ValidationCondition !== '') {
                    validaitonExp.push(res.ValidationCondition);
                }
                // res.ValidationCondition != '' ? validaitonExp.push(res.ValidationCondition) : '';
            }
        }
        if (obj.GreaterThanCondition !== undefined) {
            if (Array.isArray(obj.GreaterThanCondition)) {
                var /** @type {?} */ conditions = [];
                var /** @type {?} */ textConditions = [];
                var /** @type {?} */ valdiationConditions = [];
                for (var _d = 0, _e = obj.GreaterThanCondition; _d < _e.length; _d++) {
                    var cond = _e[_d];
                    var /** @type {?} */ res = this.buildExpression(cond.Attr, '>');
                    conditions.push(res.Condition);
                    textConditions.push(res.TextCondition);
                    if (res.ValidationCondition !== '') {
                        valdiationConditions.push(res.ValidationCondition);
                    }
                    // res.ValidationCondition != '' ? valdiationConditions.push(res.ValidationCondition) : '';
                }
                exp.push('(' + conditions.join(' ' + op + ' ') + ')');
                TextExp.push('(' + textConditions.join(' ' + op + ' ') + ')');
                if (valdiationConditions.length > 0) {
                    validaitonExp.push('(' + valdiationConditions.join(' ' + AndOp + ' ') + ')');
                }
            }
            else {
                var /** @type {?} */ res = this.buildExpression(obj.GreaterThanCondition.Attr, '>');
                exp.push(res.Condition);
                TextExp.push(res.TextCondition);
                if (res.ValidationCondition !== '') {
                    validaitonExp.push(res.ValidationCondition);
                }
                // res.ValidationCondition != '' ? validaitonExp.push(res.ValidationCondition) : '';
            }
        }
        if (obj.GreaterThanOrEqualsCondition !== undefined) {
            if (Array.isArray(obj.GreaterThanOrEqualsCondition)) {
                var /** @type {?} */ conditions = [];
                var /** @type {?} */ textConditions = [];
                var /** @type {?} */ valdiationConditions = [];
                for (var _f = 0, _g = obj.GreaterThanOrEqualsCondition; _f < _g.length; _f++) {
                    var cond = _g[_f];
                    var /** @type {?} */ res = this.buildExpression(cond.Attr, '>=');
                    conditions.push(res.Condition);
                    textConditions.push(res.TextCondition);
                    if (res.ValidationCondition !== '') {
                        valdiationConditions.push(res.ValidationCondition);
                    }
                    // res.ValidationCondition != '' ? valdiationConditions.push(res.ValidationCondition) : '';
                }
                exp.push('(' + conditions.join(' ' + op + ' ') + ')');
                TextExp.push('(' + textConditions.join(' ' + op + ' ') + ')');
                if (valdiationConditions.length > 0) {
                    validaitonExp.push('(' + valdiationConditions.join(' ' + AndOp + ' ') + ')');
                }
            }
            else {
                var /** @type {?} */ res = this.buildExpression(obj.GreaterThanOrEqualsCondition.Attr, '>=');
                exp.push(res.Condition);
                TextExp.push(res.TextCondition);
                if (res.ValidationCondition !== '') {
                    validaitonExp.push(res.ValidationCondition);
                }
                // res.ValidationCondition != '' ? validaitonExp.push(res.ValidationCondition) : '';
            }
        }
        if (obj.LessThanOrEqualsCondition !== undefined) {
            if (Array.isArray(obj.LessThanOrEqualsCondition)) {
                var /** @type {?} */ conditions = [];
                var /** @type {?} */ textConditions = [];
                var /** @type {?} */ valdiationConditions = [];
                for (var _h = 0, _j = obj.LessThanOrEqualsCondition; _h < _j.length; _h++) {
                    var cond = _j[_h];
                    var /** @type {?} */ res = this.buildExpression(cond.Attr, '<=');
                    conditions.push(res.Condition);
                    textConditions.push(res.TextCondition);
                    if (res.ValidationCondition !== '') {
                        valdiationConditions.push(res.ValidationCondition);
                    }
                    // res.ValidationCondition != '' ? valdiationConditions.push(res.ValidationCondition) : '';
                }
                exp.push('(' + conditions.join(' ' + op + ' ') + ')');
                TextExp.push('(' + textConditions.join(' ' + op + ' ') + ')');
                if (valdiationConditions.length > 0) {
                    validaitonExp.push('(' + valdiationConditions.join(' ' + AndOp + ' ') + ')');
                }
            }
            else {
                var /** @type {?} */ res = this.buildExpression(obj.LessThanOrEqualsCondition.Attr, '<=');
                exp.push(res.Condition);
                TextExp.push(res.TextCondition);
                if (res.ValidationCondition !== '') {
                    validaitonExp.push(res.ValidationCondition);
                }
                // res.ValidationCondition != '' ? validaitonExp.push(res.ValidationCondition) : '';
            }
        }
        if (obj.OrCondition !== undefined) {
            if (Array.isArray(obj.OrCondition)) {
                var /** @type {?} */ conditions = [];
                var /** @type {?} */ textConditions = [];
                var /** @type {?} */ valdiationConditions = [];
                for (var _k = 0, _l = obj.OrCondition; _k < _l.length; _k++) {
                    var cond = _l[_k];
                    var /** @type {?} */ res = this.buildExpressions(cond, '||');
                    conditions.push(res.Condition);
                    textConditions.push(res.TextCondition);
                    if (res.ValidationCondition !== '') {
                        valdiationConditions.push(res.ValidationCondition);
                    }
                    // res.ValidationCondition != '' ? valdiationConditions.push(res.ValidationCondition) : '';
                }
                exp.push('(' + conditions.join(' ' + op + ' ') + ')');
                TextExp.push('(' + textConditions.join(' ' + op + ' ') + ')');
                if (valdiationConditions.length > 0) {
                    validaitonExp.push('(' + valdiationConditions.join(' ' + AndOp + ' ') + ')');
                }
            }
            else {
                var /** @type {?} */ res = this.buildExpressions(obj.OrCondition, '||');
                exp.push(res.Condition);
                TextExp.push(res.TextCondition);
                if (res.ValidationCondition !== '') {
                    validaitonExp.push(res.ValidationCondition);
                }
                // res.ValidationCondition != '' ? validaitonExp.push(res.ValidationCondition) : '';
            }
        }
        if (obj.NotCondition !== undefined) {
            if (Array.isArray(obj.NotCondition)) {
                var /** @type {?} */ conditions = [];
                var /** @type {?} */ textConditions = [];
                var /** @type {?} */ valdiationConditions = [];
                for (var _m = 0, _o = obj.NotCondition; _m < _o.length; _m++) {
                    var cond = _o[_m];
                    var /** @type {?} */ res = this.buildExpressions(cond, '&&');
                    res.Condition = '!(' + res.Condition + ')';
                    res.TextCondition = '!(' + res.TextCondition + ')';
                    conditions.push(res.Condition);
                    textConditions.push(res.TextCondition);
                    if (res.ValidationCondition !== '') {
                        valdiationConditions.push(res.ValidationCondition);
                    }
                    // res.ValidationCondition != '' ? valdiationConditions.push(res.ValidationCondition) : '';
                }
                exp.push('(' + conditions.join(' ' + op + ' ') + ')');
                TextExp.push('(' + textConditions.join(' ' + op + ' ') + ')');
                if (valdiationConditions.length > 0) {
                    validaitonExp.push('(' + valdiationConditions.join(' ' + AndOp + ' ') + ')');
                }
            }
            else {
                var /** @type {?} */ res = this.buildExpressions(obj.NotCondition, '&&');
                res.Condition = '!(' + res.Condition + ')';
                exp.push(res.Condition);
                TextExp.push(res.TextCondition);
                if (res.ValidationCondition !== '') {
                    validaitonExp.push(res.ValidationCondition);
                }
                // res.ValidationCondition != '' ? validaitonExp.push(res.ValidationCondition) : '';
            }
        }
        if (obj.AndCondition !== undefined) {
            if (Array.isArray(obj.AndCondition)) {
                var /** @type {?} */ conditions = [];
                var /** @type {?} */ textConditions = [];
                var /** @type {?} */ valdiationConditions = [];
                for (var _p = 0, _q = obj.AndCondition; _p < _q.length; _p++) {
                    var cond = _q[_p];
                    var /** @type {?} */ res = this.buildExpressions(cond, '&&');
                    conditions.push(res.Condition);
                    textConditions.push(res.TextCondition);
                    if (res.ValidationCondition !== '') {
                        valdiationConditions.push(res.ValidationCondition);
                    }
                    // res.ValidationCondition != '' ? valdiationConditions.push(res.ValidationCondition) : '';
                }
                exp.push('(' + conditions.join(' ' + op + ' ') + ')');
                TextExp.push('(' + textConditions.join(' ' + op + ' ') + ')');
                if (valdiationConditions.length > 0) {
                    validaitonExp.push('(' + valdiationConditions.join(' ' + AndOp + ' ') + ')');
                }
            }
            else {
                var /** @type {?} */ res = this.buildExpressions(obj.AndCondition, '&&');
                exp.push(res.Condition);
                TextExp.push(res.TextCondition);
                if (res.ValidationCondition !== '') {
                    validaitonExp.push(res.ValidationCondition);
                }
                // res.ValidationCondition != '' ? validaitonExp.push(res.ValidationCondition) : '';
            }
        }
        if (obj.ContainsCondition !== undefined) {
            if (Array.isArray(obj.ContainsCondition)) {
                var /** @type {?} */ conditions = [];
                var /** @type {?} */ textConditions = [];
                var /** @type {?} */ valdiationConditions = [];
                for (var _r = 0, _s = obj.ContainsCondition; _r < _s.length; _r++) {
                    var cond = _s[_r];
                    var /** @type {?} */ res = this.buildContainsExpression(cond.Attr);
                    conditions.push(res.Condition);
                    textConditions.push(res.TextCondition);
                    if (res.ValidationCondition !== '') {
                        valdiationConditions.push(res.ValidationCondition);
                    }
                    // res.ValidationCondition != '' ? valdiationConditions.push(res.ValidationCondition) : '';
                }
                exp.push('(' + conditions.join(' ' + op + ' ') + ')');
                TextExp.push('(' + textConditions.join(' ' + op + ' ') + ')');
                if (valdiationConditions.length > 0) {
                    validaitonExp.push('(' + valdiationConditions.join(' ' + AndOp + ' ') + ')');
                }
            }
            else {
                var /** @type {?} */ res = this.buildContainsExpression(obj.ContainsCondition.Attr);
                exp.push(res.Condition);
                TextExp.push(res.TextCondition);
                if (res.ValidationCondition !== '') {
                    validaitonExp.push(res.ValidationCondition);
                }
                // res.ValidationCondition != '' ? validaitonExp.push(res.ValidationCondition) : '';
            }
        }
        if (obj.HasAnyNChoicesCondition !== undefined) {
            if (Array.isArray(obj.HasAnyNChoicesCondition)) {
                var /** @type {?} */ conditions = [];
                var /** @type {?} */ textConditions = [];
                var /** @type {?} */ valdiationConditions = [];
                for (var _t = 0, _u = obj.HasAnyNChoicesCondition; _t < _u.length; _t++) {
                    var cond = _u[_t];
                    var /** @type {?} */ res = this.buildNoChoiceExpression(cond.Attr);
                    conditions.push(res.Condition);
                    textConditions.push(res.TextCondition);
                    if (res.ValidationCondition !== '') {
                        valdiationConditions.push(res.ValidationCondition);
                    }
                    // res.ValidationCondition != '' ? valdiationConditions.push(res.ValidationCondition) : '';
                }
                exp.push('(' + conditions.join(' ' + op + ' ') + ')');
                TextExp.push('(' + textConditions.join(' ' + op + ' ') + ')');
                if (valdiationConditions.length > 0) {
                    validaitonExp.push('(' + valdiationConditions.join(' ' + AndOp + ' ') + ')');
                }
            }
            else {
                var /** @type {?} */ res = this.buildNoChoiceExpression(obj.HasAnyNChoicesCondition.Attr);
                exp.push(res.Condition);
                TextExp.push(res.TextCondition);
                if (res.ValidationCondition !== '') {
                    validaitonExp.push(res.ValidationCondition);
                }
                // res.ValidationCondition != '' ? validaitonExp.push(res.ValidationCondition) : '';
            }
        }
        var /** @type {?} */ ConditionExp = '';
        if (exp.length > 1) {
            ConditionExp = '(' + exp.join(' ' + op + ' ') + ')';
        }
        else {
            ConditionExp = exp[0];
        }
        var /** @type {?} */ TextConditionExp = '';
        if (TextExp.length > 1) {
            TextConditionExp = '(' + TextExp.join(' ' + op + ' ') + ')';
        }
        else {
            TextConditionExp = TextExp[0];
        }
        var /** @type {?} */ ValidationConditionExp = '';
        if (validaitonExp.length > 1) {
            ValidationConditionExp = '(' + validaitonExp.join(' ' + AndOp + ' ') + ')';
        }
        else if (validaitonExp.length > 0) {
            ValidationConditionExp = validaitonExp[0];
        }
        return { 'TextCondition': TextConditionExp, 'Condition': ConditionExp, 'ValidationCondition': ValidationConditionExp };
    };
    return XMLUtil;
}());
var AssistSimulatorComponent = (function () {
    /**
     * @param {?} globalsService
     * @param {?} cd
     */
    function AssistSimulatorComponent(globalsService, cd) {
        this.globalsService = globalsService;
        this.cd = cd;
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    AssistSimulatorComponent.prototype.ngOnChanges = function (changes) {
        this.processData();
    };
    /**
     * @return {?}
     */
    AssistSimulatorComponent.prototype.ngOnInit = function () {
        this.processData();
    };
    /**
     * @return {?}
     */
    AssistSimulatorComponent.prototype.resetData = function () {
        this.FormValues = {};
        this.BaseFormValues = {};
        this.ExpressionBlocks = [];
        this.DataElements = [];
        this.ValidationBlocks = [];
        this.DataElementObj = {};
        this.globalsService.XMLAcronyms = {};
        this.ExpressionBlocks = [];
        this.DataElements = [];
        this.Metadata = undefined;
        this.FormValues = {};
        this.ValidationBlocks = [];
        this.globalsService.evaluateExpessions = true;
        this.globalsService.ComputedElementConditions = {};
        this.globalsService.XMLAcronyms = {};
    };
    /**
     * @return {?}
     */
    AssistSimulatorComponent.prototype.processData = function () {
        this.resetData();
        this.isValid = this.templateContent.length > 0 && this.imagePath.length > 0;
        var /** @type {?} */ templateDetails = new TemplateDetails();
        templateDetails.imagePath = this.imagePath;
        templateDetails.templateContent = this.templateContent;
        var /** @type {?} */ util = new XMLUtil();
        util.load(templateDetails);
        this.globalsService.XMLAcronyms = util.Acronyms;
        this.Metadata = util.Metadata;
        this.DataElements = util.DataElements;
        this.ExpressionBlocks = util.ExpressionBlocks;
        this.ValidationBlocks = util.ValidationBlocks;
        this.FormValues = util.FormValues;
        this.BaseFormValues = JSON.parse(JSON.stringify(this.FormValues));
    };
    /**
     * @param {?} notRelevantDataElments
     * @return {?}
     */
    AssistSimulatorComponent.prototype.displayDataElements = function (notRelevantDataElments) {
        var _this = this;
        this.DataElements.forEach(function (de) {
            var /** @type {?} */ deindex = _this.DataElements.indexOf(de);
            if (notRelevantDataElments !== undefined && notRelevantDataElments.indexOf(deindex) !== -1) {
                de.Visible = false;
            }
            else {
                de.Visible = true;
            }
        });
        this.globalsService.evaluateExpessions = false;
        this.cd.detectChanges();
        this.globalsService.evaluateExpessions = true;
    };
    return AssistSimulatorComponent;
}());
AssistSimulatorComponent.decorators = [
    { type: Component, args: [{
                selector: 'acr-assist-simulator',
                template: "\n    <ng-container *ngIf=\"(isValid!=true && isValid!= null)\">\n      <div class=\"row\">\n        <div class=\"col-sm-12 text-center alert alert-danger\">\n          <ng-container *ngIf=\"(ErrorCode == 0)\">\n            {{errorMessage}}. So we are unable to validate XML.\n          </ng-container>\n          <ng-container *ngIf=\"(ErrorCode == 1)\">\n            Selected XML does not meets the XML Schema.\n          </ng-container>\n        </div>\n      </div>\n    </ng-container>\n\n    <ng-container *ngIf=\"(isValid)\">\n      <ng-container *ngIf=\"Metadata != undefined\">\n        <div class=\"row\">\n          <div class=\"col-sm-12 text-center border-0\">\n            <h4>\n              <strong>{{Metadata.Label}} </strong>\n            </h4>\n          </div>\n        </div>\n      </ng-container>\n      <div class=\"row content-padding\">\n        <ng-container *ngIf=\"globalsService.LoadkeyDiagram != true\">\n          <div class=\"col-sm-12 \">\n            <ng-container *ngIf=\"(isValid)\">\n                <form #form=\"ngForm\" class=\"form-horizontal\">\n                <acr-data-element [ValidationBlocks]=\"ValidationBlocks\" [DataElements]=\"DataElements\" [FormValues]=\"FormValues\"></acr-data-element>\n              </form>\n            </ng-container>\n          </div>\n        </ng-container>\n        <ng-container *ngIf=\"globalsService.LoadkeyDiagram == true\">\n          <div class=\"col-sm-7 \">\n            <ng-container *ngIf=\"(isValid)\">\n               <form #form=\"ngForm\" class=\"form-horizontal\">\n                <acr-data-element [ValidationBlocks]=\"ValidationBlocks\" [DataElements]=\"DataElements\" [FormValues]=\"FormValues\"></acr-data-element>\n              </form>\n            </ng-container>\n          </div>\n          <div class=\"col-sm-5 padding-top-5\">\n            <div id=\"myNav\">\n              <ng-container *ngIf=\"Metadata != undefined\">\n                <ng-container *ngIf=\"globalsService.LoadkeyDiagram == true\">\n                  <div class=\"carousel slide\" data-ride=\"carousel\" data-interval=\"false\">\n                    <!-- Wrapper for slides -->\n                    <div class=\"carousel-inner\" role=\"listbox\">\n                      <ng-container *ngFor=\"let diag of Metadata.Diagrams \">\n                        <ng-container *ngIf=\"Metadata.Diagrams.indexOf(diag) == 0\">\n                          <div class=\"item active\">\n                            <img src=\"{{diag.ImagePath}}\">\n                          </div>\n                        </ng-container>\n\n                        <ng-container *ngIf=\"Metadata.Diagrams.indexOf(diag) > 0\">\n                          <div class=\"item\">\n                          </div>\n                        </ng-container>\n                      </ng-container>\n                    </div>\n                    <ng-container *ngIf=\"Metadata.Diagrams.length > 1\">\n                      <!-- Controls -->\n                      <a class=\"left carousel-control\" onclick=\"return false;\" href=\"#carousel-example-generic\" role=\"button\" data-slide=\"prev\">\n                        <span class=\"glyphicon glyphicon-chevron-left\" aria-hidden=\"true\"></span>\n                        <span class=\"sr-only\">Previous</span>\n                      </a>\n                      <a class=\"right carousel-control\" onclick=\"return false;\" href=\"#carousel-example-generic\" role=\"button\" data-slide=\"next\">\n                        <span class=\"glyphicon glyphicon-chevron-right\" aria-hidden=\"true\"></span>\n                        <span class=\"sr-only\">Next</span>\n                      </a>\n                    </ng-container>\n                  </div>\n                </ng-container>\n              </ng-container>\n            </div>\n          </div>\n        </ng-container>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-sm-12\">\n          <ng-container >\n            <ng-container *ngFor=\"let block of ExpressionBlocks\">\n              <acr-expresssion-block [ExpBlock]=\"block\" [FormValues]=\"FormValues\" [DataElements]=\"DataElements\" (onExpressionChanged)=\"displayDataElements($event)\"></acr-expresssion-block>\n            </ng-container>\n          </ng-container>\n        </div>\n      </div>\n    </ng-container>\n  ",
                styles: ["\n    .content-padding {\n      padding-top: 5px;\n      padding-right: 5px;\n    }\n  "],
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/**
 * @nocollapse
 */
AssistSimulatorComponent.ctorParameters = function () { return [
    { type: GlobalsService, },
    { type: ChangeDetectorRef, },
]; };
AssistSimulatorComponent.propDecorators = {
    'templateContent': [{ type: Input },],
    'imagePath': [{ type: Input },],
};
var StringUtilityService = (function () {
    function StringUtilityService() {
    }
    /**
     * @param {?} str
     * @return {?}
     */
    StringUtilityService.prototype.isEmpty = function (str) {
        return str === '';
    };
    /**
     * @param {?} text
     * @return {?}
     */
    StringUtilityService.prototype.cleanText = function (text) {
        return text.replace(/ /g, '');
    };
    return StringUtilityService;
}());
StringUtilityService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
StringUtilityService.ctorParameters = function () { return []; };
var ComputedElementComponent = (function () {
    /**
     * @param {?} stringUtilityService
     */
    function ComputedElementComponent(stringUtilityService) {
        this.stringUtilityService = stringUtilityService;
        this.DataElements = {};
        this.FormValues = {};
    }
    /**
     * @param {?} exp
     * @return {?}
     */
    ComputedElementComponent.prototype.compute = function (exp) {
        var /** @type {?} */ result = eval(exp);
        this.DataElement.Value = result;
        this.FormValues[this.DataElement.ID] = result;
        return result;
    };
    /**
     * @param {?} textBlocks
     * @return {?}
     */
    ComputedElementComponent.prototype.textify = function (textBlocks) {
        var _this = this;
        var /** @type {?} */ result = '';
        if (textBlocks.constructor.name === 'String') {
            result += textBlocks;
        }
        else if (textBlocks.length > 0) {
            textBlocks.forEach(function (text) {
                if (text.constructor.name === 'String') {
                    result += text;
                }
                else if (text.constructor.name === 'Object') {
                    result += ' ' + _this.FormValues[text.InsertValue.Attr.DataElementId] + ' ';
                }
            });
        }
        this.FormValues[this.DataElement.ID] = result;
        return result;
    };
    return ComputedElementComponent;
}());
ComputedElementComponent.decorators = [
    { type: Component, args: [{
                selector: 'acr-computed-element',
                template: "\n    <ng-container *ngIf=\"DataElement.Visible && DataElement.ShowValue\">\n      <div class=\"form-group\" [class.Visible]=\"(DataElement.Visible && DataElement.ShowValue)\">\n\n          <div class=\"col-sm-3\">\n              <label class=\"control-label DEElement\" id=\"{{DataElement.ID}}\">\n                  {{DataElement.ID}}\n              </label>\n              <ng-container *ngIf=\"!stringUtilityService.isEmpty(DataElement.Hint) \">\n                  <a>\n                      <span class=\"glyphicon glyphicon-info-sign\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"{{DataElement.Hint}}\"></span>\n                  </a>\n              </ng-container>\n          </div>\n          <div class=\"col-sm-6\">\n\n              <ng-container *ngFor=\"let valueBlock of DataElement.ValueBlocks\">\n                  <acr-value-block [ValueBlock]=\"valueBlock\" [DataElement]=\"DataElement\" [DataElements]=\"DataElements\" [FormValues]=\"FormValues\">\n                  </acr-value-block>\n              </ng-container>\n\n              <ng-container *ngIf=\"!stringUtilityService.isEmpty(DataElement.ArithmaticExpression)\">\n                  <label class=\"control-label DEElement\"> {{compute(DataElement.ArithmaticExpression)}}</label>\n              </ng-container>\n              <ng-container *ngIf=\"!stringUtilityService.isEmpty(DataElement.TextExpression)\">\n                  <label class=\"control-label DEElement\"> {{textify(DataElement.TextExpression)}}</label>\n              </ng-container>\n          </div>\n      </div>\n\n    </ng-container>\n\n    <ng-container *ngIf=\"!DataElement.ShowValue\">\n      <ng-container *ngFor=\"let valueBlock of DataElement.ValueBlocks\">\n          <acr-value-block [ValueBlock]=\"valueBlock\" [DataElement]=\"DataElement\" [DataElements]=\"DataElements\" [FormValues]=\"FormValues\">\n\n          </acr-value-block>\n\n      </ng-container>\n\n      <ng-container *ngIf=\"!stringUtilityService.isEmpty(DataElement.ArithmaticExpression)\">\n          <input type=\"hidden\" [attr.value]=\"compute(DataElement.ArithmaticExpression)\" />\n      </ng-container>\n      <ng-container *ngIf=\"!stringUtilityService.isEmpty(DataElement.TextExpression)\">\n          <input type=\"hidden\" [attr.value]=\"textify(DataElement.TextExpression)\" />\n      </ng-container>\n\n    </ng-container>\n  ",
                styles: ["\n\n  "]
            },] },
];
/**
 * @nocollapse
 */
ComputedElementComponent.ctorParameters = function () { return [
    { type: StringUtilityService, },
]; };
ComputedElementComponent.propDecorators = {
    'DataElement': [{ type: Input },],
    'DataElements': [{ type: Input },],
    'FormValues': [{ type: Input },],
};
var HintDiagramComponent = (function () {
    function HintDiagramComponent() {
    }
    return HintDiagramComponent;
}());
HintDiagramComponent.decorators = [
    { type: Component, args: [{
                selector: 'acr-hint-diagram',
                template: "\n    <button type=\"button\" class=\"btn btn-default btn-xs\" data-toggle=\"modal\" attr.data-target=\"#{{'diag_'+DataElement.ID}}\">\n      <span class=\" glyphicon glyphicon-cd\" aria-hidden=\"true\" data-toggle=\"tooltip\"  data-placement=\"right\" title=\"Hint Diagrams\"></span>\n\n    </button>\n    <div class=\"modal fade adjust-diagram \" tabindex=\"-1\" role=\"dialog\" attr.id=\"{{'diag_'+DataElement.ID}}\" aria-labelledby=\"mySmallModalLabel\">\n    <div class=\"modal-dialog modal-lg adjust-diagram-image \" role=\"document\">\n    <div class=\"modal-content\">\n    <div class=\"modal-header\">\n    <h4 class=\"modal-title\">\n    {{DataElement.Label}}\n    </h4>\n    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">\u00D7</span></button>\n    </div>\n\n\n\n    <div class=\"carousel slide\" data-ride=\"carousel\" data-interval=\"false\">\n\n\n    <!-- Wrapper for slides -->\n\n    <div class=\"carousel-inner\" role=\"listbox\">\n    <ng-container *ngFor=\"let diag of DataElement.Diagrams \">\n    <ng-container *ngIf=\"DataElement.Diagrams.indexOf(diag) == 0\">\n    <div class=\"item active\">\n    <img src=\"{{diag.Location}}\">\n    <!--<div class=\"carousel-caption\">\n\n    </div>-->\n    </div>\n    </ng-container>\n\n    <ng-container *ngIf=\"DataElement.Diagrams.indexOf(diag) > 0\">\n    <div class=\"item\">\n    <img src=\"{{diag.Location}}\">\n    <!--<div class=\"carousel-caption\">\n\n    </div>-->\n    </div>\n    </ng-container>\n\n    </ng-container>\n\n\n\n\n    </div>\n    <ng-container *ngIf=\"DataElement.Diagrams.length > 1\">\n    <!-- Controls -->\n    <a class=\"left carousel-control\" onclick=\"return false;\" href=\"#carousel-example-generic\" role=\"button\" data-slide=\"prev\">\n    <span class=\"glyphicon glyphicon-chevron-left\" aria-hidden=\"true\"></span>\n    <span class=\"sr-only\">Previous</span>\n    </a>\n    <a class=\"right carousel-control\" onclick=\"return false;\" href=\"#carousel-example-generic\" role=\"button\" data-slide=\"next\">\n    <span class=\"glyphicon glyphicon-chevron-right\" aria-hidden=\"true\"></span>\n    <span class=\"sr-only\">Next</span>\n    </a>\n    </ng-container>\n    </div>\n\n\n\n\n    </div>\n    </div>\n    </div>\n  ",
                styles: ["\n\n  "]
            },] },
];
/**
 * @nocollapse
 */
HintDiagramComponent.ctorParameters = function () { return []; };
HintDiagramComponent.propDecorators = {
    'DataElement': [{ type: Input },],
};
var ImageMapComponent = (function () {
    function ImageMapComponent() {
        this.$ = require('jquery');
        this.DataElements = {};
        this.FormValues = {};
        this.imageExist = true;
        this.SelectionValue = '';
    }
    /**
     * @return {?}
     */
    ImageMapComponent.prototype.ngOnInit = function () {
        var /** @type {?} */ request = new XMLHttpRequest();
        request.open('HEAD', this.DataElement.ImagePath, false);
        request.send();
        if (request.status === 200) {
            this.imageExist = true;
        }
        else {
            this.imageExist = false;
        }
        this.displayValue('');
    };
    /**
     * @param {?} mouseX
     * @param {?} mouseY
     * @param {?} Coordinates
     * @return {?}
     */
    ImageMapComponent.prototype.isInRectangle = function (mouseX, mouseY, Coordinates) {
        var /** @type {?} */ COArray = Coordinates.split(',');
        if (COArray[0] < mouseX
            && (COArray[0] + COArray[2]) > mouseX
            && COArray[1] < mouseY
            && (COArray[1] + COArray[3]) > mouseY) {
            return true;
        }
        return false;
    };
    /**
     * @param {?} mouseX
     * @param {?} mouseY
     * @param {?} Coordinates
     * @return {?}
     */
    ImageMapComponent.prototype.isInCircle = function (mouseX, mouseY, Coordinates) {
        var /** @type {?} */ COArray = Coordinates.split(',');
        if (Math.sqrt(Math.pow((mouseX - COArray[0]), 2) + Math.pow((mouseY - COArray[1]), 2)) < COArray[2]) {
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * @param {?} x
     * @param {?} y
     * @param {?} Coordinates
     * @return {?}
     */
    ImageMapComponent.prototype.isInPolygon = function (x, y, Coordinates) {
        var /** @type {?} */ COArray = Coordinates.split(',');
        var /** @type {?} */ vs = [];
        for (var /** @type {?} */ i = 0; i < COArray.length; i++) {
            var /** @type {?} */ point = [];
            point.push(COArray[i]);
            point.push(COArray[i + 1]);
            i += 1;
            vs.push(point);
        }
        var /** @type {?} */ inside = false;
        for (var /** @type {?} */ i = 0, /** @type {?} */ j = vs.length - 1; i < vs.length; j = i++) {
            var /** @type {?} */ xi = vs[i][0], /** @type {?} */ yi = vs[i][1];
            var /** @type {?} */ xj = vs[j][0], /** @type {?} */ yj = vs[j][1];
            var /** @type {?} */ intersect = ((yi > y) !== (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) {
                inside = !inside;
            }
        }
        return inside;
    };
    /**
     * @param {?} e
     * @param {?} dataElement
     * @return {?}
     */
    ImageMapComponent.prototype.imageClick = function (e, dataElement) {
        var /** @type {?} */ $elem = this.$(e.target);
        var /** @type {?} */ N_height = $elem.height();
        var /** @type {?} */ N_width = $elem.width();
        var /** @type {?} */ offset = $elem.offset();
        var /** @type {?} */ offset_t = offset.top - this.$(window).scrollTop();
        var /** @type {?} */ offset_l = offset.left - this.$(window).scrollLeft();
        var /** @type {?} */ x = e.clientX - offset_l;
        var /** @type {?} */ y = e.clientY - offset_t;
        for (var _i = 0, _a = dataElement.ImageOptions; _i < _a.length; _i++) {
            var opt = _a[_i];
            if (opt.Shape === 'rect') {
                if (this.isInRectangle(x, y, opt.Coordinates)) {
                    this.FormValues[dataElement.ID] = opt.Value;
                    break;
                }
            }
            else if (opt.Shape === 'circle') {
                if (this.isInCircle(x, y, opt.Coordinates)) {
                    this.FormValues[dataElement.ID] = opt.Value;
                    break;
                }
            }
            else if (opt.Shape === 'poly') {
                if (this.isInPolygon(x, y, opt.Coordinates)) {
                    this.FormValues[dataElement.ID] = opt.Value;
                    break;
                }
            }
        }
    };
    /**
     * @param {?} val
     * @return {?}
     */
    ImageMapComponent.prototype.setValue = function (val) {
        this.FormValues[this.DataElement.ID] = val;
    };
    /**
     * @param {?} val
     * @return {?}
     */
    ImageMapComponent.prototype.displayValue = function (val) {
        if (val === '') {
            this.SelectionValue = 'Image Map Diagram';
        }
        else {
            this.SelectionValue = 'Selected Value : ' + val;
        }
    };
    return ImageMapComponent;
}());
ImageMapComponent.decorators = [
    { type: Component, args: [{
                selector: 'acr-image-map',
                template: "\n    <ng-container *ngIf=\"DataElement.ImagePath != undefined\">\n\n      <div class=\"row\">\n        <div class=\"col-sm-12 text-center\">\n          OR\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-sm-12 text-left\">\n          Select value from image:-\n            <button type=\"button\" class=\"btn btn-default\" data-toggle=\"modal\" attr.data-target=\"#{{'imgMap_Modal_'+DataElement.ID}}\">\n            <span class=\"glyphicon glyphicon-picture\" aria-hidden=\"true\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Image Map\"></span>\n          </button>\n        </div>\n      </div>\n\n      <ng-container *ngIf=\"DataElement.ImagePath != undefined\">\n        <div class=\"modal fade img-modal\" tabindex=\"-1\" role=\"dialog\" attr.id=\"{{'imgMap_Modal_'+DataElement.ID}}\" aria-labelledby=\"mySmallModalLabel\">\n          <div class=\"modal-dialog modal-lg\" role=\"document\" [ngStyle]=\"{'width':DataElement.ImagePath.width + 30}\">\n            <div class=\"modal-content\">\n              <div class=\"modal-header\">\n                <h4 class=\"modal-title\">\n                  {{SelectionValue}}\n                </h4>\n                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n                  <span aria-hidden=\"true\">\u00D7</span>\n                </button>\n              </div>\n              <div class=\"modal-body\">\n                <div class=\"row\">\n                  <div class=\"col-md-12\">\n                    <ng-container *ngIf=\"imageExist == true\">\n                      <img class=\"ImgOption danger\" alt=\"No Image Available!!!\" data-dismiss=\"modal\" attr.id=\"{{'imgMap_Img_'+DataElement.ID}}\"\n                        (click)=\"imageClick($event,DataElement);\" attr.data-elementID=\"{{DataElement.ID}}\" attr.usemap=\"#{{'imgMap_'+DataElement.ID}}\"\n                        src=\"{{DataElement.ImagePath}}\">\n                      <map name=\"{{'imgMap_'+DataElement.ID}}\">\n                        <ng-container *ngFor=\"let imgOpt of DataElement.ImageOptions\">\n                          <area attr.shape=\"{{imgOpt.Shape}}\" attr.imgID=\"{{'imgMap_Img_'+DataElement.ID}}\" attr.coords=\"{{imgOpt.Coordinates}}\" attr.alt=\"{{imgOpt.Value}}\"\n                            onmouseover='myHover(this);' onmouseout='myLeave();' (mouseover)='displayValue(imgOpt.Value);' (mouseout)='displayValue(\"\");'\n                            (click)=\"setValue(imgOpt.Value);\" data-dismiss=\"modal\">\n                        </ng-container>\n                      </map>\n                    </ng-container>\n\n                    <ng-container *ngIf=\"imageExist == false\">\n                      <div class=\"\">\n                        No Image Map Available...\n                      </div>\n                    </ng-container>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </ng-container>\n    </ng-container>\n  ",
                styles: ["\n\n  "]
            },] },
];
/**
 * @nocollapse
 */
ImageMapComponent.ctorParameters = function () { return []; };
ImageMapComponent.propDecorators = {
    'DataElement': [{ type: Input },],
    'DataElements': [{ type: Input },],
    'FormValues': [{ type: Input },],
};
var DataElementComponent = (function () {
    /**
     * @param {?} stringUtilityService
     */
    function DataElementComponent(stringUtilityService) {
        this.stringUtilityService = stringUtilityService;
        this.DataElements = [];
        this.FormValues = {};
        this.ValidationBlocks = [];
        this.formInitialized = true;
        this.defaultOption = 'Select';
        this.console = console;
    }
    /**
     * @return {?}
     */
    DataElementComponent.prototype.itemSelected = function () {
    };
    /**
     * @param {?} cond
     * @return {?}
     */
    DataElementComponent.prototype.evaluate = function (cond) {
        return eval(cond);
    };
    /**
     * @param {?} DataElementID
     * @param {?} choiceValue
     * @param {?} event
     * @return {?}
     */
    DataElementComponent.prototype.updateMultichoice = function (DataElementID, choiceValue, event) {
        var /** @type {?} */ previousValue = this.FormValues[DataElementID];
        if (event.currentTarget.checked) {
            if (previousValue === undefined) {
                previousValue = [];
            }
            previousValue.push(choiceValue);
        }
        else {
            var /** @type {?} */ index = previousValue.indexOf(choiceValue);
            if (index > -1) {
                previousValue.splice(index, 1);
            }
        }
        this.FormValues[DataElementID] = previousValue;
    };
    return DataElementComponent;
}());
DataElementComponent.decorators = [
    { type: Component, args: [{
                selector: 'acr-data-element',
                template: "\n    <canvas id='Can-ImgMap'>\n\n    </canvas>\n    <ng-container *ngFor=\"let DataElement of DataElements\">\n\n\n\n      <ng-container *ngIf=\"(DataElement.ElementType == 'ComputedElement')\">\n        <acr-computed-element [DataElement]=\"DataElement\" [DataElements]=\"DataElements\" [FormValues]=\"FormValues\"></acr-computed-element>\n      </ng-container>\n\n\n      <ng-container *ngIf=\"(DataElement.ElementType == 'ChoiceDataElement' || DataElement.ElementType == 'NumericDataElement' || DataElement.ElementType == 'IntegerDataElement' || DataElement.ElementType == 'MultiChoiceDataElement') \">\n        <ng-container *ngIf=\"DataElement.Visible\">\n          <div class=\"form-group \" [class.Visible]=\"DataElement.Visible\">\n            <div class=\"col-sm-5 text-left content-padding\">\n              <label class=\"control-label DEElement\" id=\"{{DataElement.ID}}\">\n                {{DataElement.Label}}\n              </label>\n              <ng-container *ngIf=\"!stringUtilityService.isEmpty(DataElement.Hint) \">\n                <a>\n                  <span class=\"glyphicon glyphicon-info-sign\" data-toggle=\"tooltip\" data-placement=\"right\" title=\"{{DataElement.Hint}}\"></span>\n                </a>\n              </ng-container>\n              <ng-container *ngIf=\"DataElement.Diagrams != undefined \">\n                <acr-hint-diagram [DataElement]=\"DataElement\"></acr-hint-diagram>\n              </ng-container>\n              <ng-container *ngIf=\"ValidationBlocks.length > 0\">\n                <ng-container *ngFor=\"let Block of ValidationBlocks\">\n                  <ng-container *ngIf=\"(DataElement.Visible)\">\n                    <ng-container *ngIf=\"evaluate(Block.Condition)\">\n                      <ng-container *ngIf=\"Block.DataElementID == DataElement.ID\">\n                        <ng-container *ngIf=\"Block.Message =='Minimum value required'\">\n                          <span class=\"required-field\">Minimum Value: {{Block.Minimum}}</span>\n                        </ng-container>\n                        <ng-container *ngIf=\"Block.Message != 'Minimum value required'\">\n                          <span class=\"required-field\">* Required field !!!</span>\n                        </ng-container>\n                      </ng-container>\n                    </ng-container>\n                  </ng-container>\n                </ng-container>\n              </ng-container>\n            </div>\n\n            <div class=\"col-sm-7 text-left content-padding\">\n              <div class=\"input-group \">\n                <!--Choice DataElements-->\n                <ng-container *ngIf=\"DataElement.ElementType == 'ChoiceDataElement' \">\n                  <div class=\"row\">\n                    <ng-container *ngIf=\"DataElement.ChoiceOptions.length == 2\">\n                      <!-- Full width for radio if Imagepath exist -->\n                      <ng-container *ngIf=\"DataElement.ImagePath != undefined\">\n                        <div id=\"radio-inline\">\n                          <ng-container *ngFor=\"let choice of DataElement.ChoiceOptions\">\n                              <div class=\"row\">\n                                  <div class=\"col-sm-12\">\n                            <label class=\"rad DEValues\">\n                              <input type=\"radio\" [(ngModel)]=\"FormValues[DataElement.ID] \" name=\"FormValues['{{DataElement.ID}}']\" value={{choice.Value}}\n                                checked style=\"display:none;\">\n                              <div  (click)=\"itemSelected()\">\n                                <input class=\"hideInput\" type=\"radio\" [(ngModel)]=\"FormValues[DataElement.ID] \" name=\"FormValues['{{DataElement.ID}}']\" value={{choice.Value}}\n                                  checked>\n                                <span>{{choice.Label}}</span>\n\n                              </div>\n                              <div class=\"clear\"></div>\n                            </label>\n                            </div></div>\n                          </ng-container>\n                        </div>\n                      </ng-container>\n                      <!-- Full width for radio if Imagepath does not exist -->\n                      <ng-container *ngIf=\"DataElement.ImagePath == undefined\">\n                        <div id=\"radio-inline\">\n                          <ng-container *ngFor=\"let choice of DataElement.ChoiceOptions\">\n                            <div class=\"row\">\n                                <div class=\"col-sm-12\">\n                                    <label class=\"rad DEValues\">\n                                        <input type=\"radio\" [(ngModel)]=\"FormValues[DataElement.ID] \" name=\"FormValues['{{DataElement.ID}}']\" value={{choice.Value}}\n                                          checked style=\"display:none;\">\n                                        <div  (click)=\"itemSelected()\" >\n                                          <input class=\"hideInput\" type=\"radio\" [(ngModel)]=\"FormValues[DataElement.ID] \" name=\"FormValues['{{DataElement.ID}}']\" value={{choice.Value}}\n                                            checked>\n                                          <span>{{choice.Label}}</span>\n                                        </div>\n\n                                      </label>\n                                </div>\n                            </div>\n\n                          </ng-container>\n                        </div>\n                      </ng-container>\n                    </ng-container>\n                    <ng-container *ngIf=\"DataElement.ChoiceOptions.length != 2\">\n                      <!-- Dropdown will be created if choice options have more than 5 choices-->\n                      <ng-container *ngIf=\"DataElement.ChoiceOptions.length > 5\">\n                        <select id=\"{{DataElement.ID}}\" [(ngModel)]=\"FormValues[DataElement.ID]\" (ngModelChange)=\"itemSelected()\">\n                          <option [value]=\"Select\">--Select--</option>\n                          <option *ngFor=\"let choice of DataElement.ChoiceOptions\" [value]=\"choice.Value\">{{choice.Label}}</option>\n                        </select>\n                      </ng-container>\n                      <!-- Radio button will be created if choice options have are <=5 choices-->\n                      <ng-container *ngIf=\"DataElement.ChoiceOptions.length <= 5\">\n                        <ng-container *ngFor=\"let choice of DataElement.ChoiceOptions\">\n                          <div id=\"radio-inline\">\n                              <div class=\"row\">\n                                  <div class=\"col-sm-12\">\n                                    <label class=\"rad DEValues\">\n                                      <input type=\"radio\" [(ngModel)]=\"FormValues[DataElement.ID] \" name=\"FormValues['{{DataElement.ID}}']\" value={{choice.Value}}\n                                        checked style=\"display:none;\">\n                                      <div  (click)=\"itemSelected()\">\n                                        <input class=\"hideInput\" type=\"radio\" [(ngModel)]=\"FormValues[DataElement.ID] \" name=\"FormValues['{{DataElement.ID}}']\" value={{choice.Value}}\n                                          checked>\n                                        <span>{{choice.Label}}</span>\n\n                                      </div>\n\n                            </label>\n                          </div> </div>\n                          </div>\n                        </ng-container>\n                      </ng-container>\n                    </ng-container>\n                  </div>\n                  <!-- imagemap will be displyed here -->\n                  <ng-container *ngIf=\"DataElement.ImagePath != undefined\">\n                    <div class=\"row\">\n                      <acr-image-map [DataElement]=\"DataElement\" [DataElements]=\"DataElements\" [FormValues]=\"FormValues\"></acr-image-map>\n                    </div>\n                  </ng-container>\n\n\n                </ng-container>\n                <!--Multi Choice DataElements-->\n                <ng-container *ngIf=\"DataElement.ElementType == 'MultiChoiceDataElement' \">\n                  <ng-container *ngFor=\"let choice of DataElement.ChoiceOptions\">\n                    <div class=\"checkbox\">\n                      <label >\n                        <input type=\"checkbox\" value={{choice.Value}} (change)=\"updateMultichoice(DataElement.ID,choice.Value,$event)\">\n                        <span> {{choice.Label}}</span>\n                      </label>\n                    </div>\n                  </ng-container>\n                </ng-container>\n\n                <!--NumericDataElement-->\n                <ng-container *ngIf=\"DataElement.ElementType == 'NumericDataElement' \">\n                  <input type=\"number\" [(ngModel)]=\"FormValues[DataElement.ID]\" class=\"form-control\" name=\"FormValues['{{DataElement.ID}}']\"\n                    (keypress)=\"itemSelected()\">\n                </ng-container>\n              </div>\n            </div>\n          </div>\n        </ng-container>\n      </ng-container>\n    </ng-container>\n  ",
                styles: ["\n    .content-padding {\n      padding-top: 5px;\n      padding-right: 5px;\n    }\n  "]
            },] },
];
/**
 * @nocollapse
 */
DataElementComponent.ctorParameters = function () { return [
    { type: StringUtilityService, },
]; };
DataElementComponent.propDecorators = {
    'DataElements': [{ type: Input },],
    'FormValues': [{ type: Input },],
    'ValidationBlocks': [{ type: Input },],
};
var ExpresssionBlockComponent = (function () {
    /**
     * @param {?} globalsService
     */
    function ExpresssionBlockComponent(globalsService) {
        this.globalsService = globalsService;
        this.FormValues = {};
        this.ExpBlock = new ExpressionBlock();
        this.DataElements = [];
        this.onExpressionChanged = new EventEmitter();
    }
    /**
     * @param {?} cond
     * @return {?}
     */
    ExpresssionBlockComponent.prototype.validate = function (cond) {
        if (cond === '') {
            return false;
        }
        return eval(cond);
    };
    /**
     * @param {?} cond
     * @param {?} notRelevantDataElments
     * @return {?}
     */
    ExpresssionBlockComponent.prototype.evaluate = function (cond, notRelevantDataElments) {
        if (cond === '') {
            return false;
        }
        var /** @type {?} */ result = eval(cond);
        if (result && this.globalsService.evaluateExpessions) {
            this.onExpressionChanged.emit(this.ExpBlock.NotRelavantDataElements);
        }
        return result;
    };
    return ExpresssionBlockComponent;
}());
ExpresssionBlockComponent.decorators = [
    { type: Component, args: [{
                selector: 'acr-expresssion-block',
                template: "\n\n\n        <ng-container *ngIf=\"!validate(ExpBlock.ValidationCondition)\">\n\n             <ng-container *ngIf=\"evaluate(ExpBlock.Condition, ExpBlock.NotRelavantDataElements)\">\n              <ng-container *ngIf=\"(ExpBlock.Result != undefined)\">\n              <acr-expression-result [DataElements]=\"DataElements\" [ExpBlock]=\"ExpBlock\" [Result]=\"ExpBlock.Result\" [FormValues]=\"FormValues\"></acr-expression-result>\n             </ng-container>\n\n            <ng-container *ngIf=\"ExpBlock.NestedBlocks.length > 0\">\n              <ng-container *ngFor=\"let NestedBlock of ExpBlock.NestedBlocks\">\n                    <acr-expresssion-block [ExpBlock]=\"NestedBlock\" [FormValues]=\"FormValues\" [DataElements]=\"DataElements\" ></acr-expresssion-block>\n              </ng-container>\n            </ng-container>\n          </ng-container>\n\n          <ng-container *ngIf=\"ExpBlock.ElseBlocks.length > 0\">\n            <ng-container *ngIf=\"!evaluate(ExpBlock.Condition,ExpBlock.NotRelavantDataElements)\">\n              <ng-container *ngFor=\"let ElseBlock of ExpBlock.ElseBlocks\">\n               <acr-expresssion-block [ExpBlock]=\"ElseBlock\" [FormValues]=\"FormValues\" [DataElements]=\"DataElements\"> </acr-expresssion-block>\n              </ng-container>\n            </ng-container>\n          </ng-container>\n        </ng-container>\n  ",
                styles: ["\n\n  "]
            },] },
];
/**
 * @nocollapse
 */
ExpresssionBlockComponent.ctorParameters = function () { return [
    { type: GlobalsService, },
]; };
ExpresssionBlockComponent.propDecorators = {
    'FormValues': [{ type: Input },],
    'ExpBlock': [{ type: Input },],
    'DataElements': [{ type: Input },],
    'onExpressionChanged': [{ type: Output },],
};
var ValueBlockComponent = (function () {
    /**
     * @param {?} globalsService
     */
    function ValueBlockComponent(globalsService) {
        this.globalsService = globalsService;
        this.DataElements = {};
        this.FormValues = {};
    }
    /**
     * @param {?} exp
     * @return {?}
     */
    ValueBlockComponent.prototype.evaluate = function (exp) {
        if (this.ValueBlock.ParentID === '0' && this.ValueBlock.Level === 0 && this.ValueBlock.Index === 0) {
            this.globalsService.ComputedElementConditions[this.DataElement.ID] = {};
            this.FormValues[this.DataElement.ID] = '';
        }
        if (this.FormValues[this.DataElement.ID] !== '') {
            return false;
        }
        if (exp === '') {
            return true;
        }
        var /** @type {?} */ result = eval(exp);
        if (result) {
            var /** @type {?} */ temp = this.globalsService.ComputedElementConditions[this.DataElement.ID];
            temp[this.ValueBlock.ParentID] = this.ValueBlock.Index;
            this.globalsService.ComputedElementConditions[this.DataElement.ID] = temp;
            if (this.ValueBlock.TextExpression !== undefined && this.ValueBlock.TextExpression.length > 0) {
                this.FormValues['hasAbnormality'] = this.textify(this.ValueBlock.TextExpression);
            }
            else if (this.ValueBlock.ArithmeticExpression !== '') {
                this.FormValues['hasAbnormality'] = this.compute(this.ValueBlock.ArithmeticExpression);
            }
        }
        return result;
    };
    /**
     * @param {?} exp
     * @return {?}
     */
    ValueBlockComponent.prototype.validate = function (exp) {
        if (exp === '') {
            return false;
        }
        return eval(exp);
    };
    /**
     * @param {?} exp
     * @return {?}
     */
    ValueBlockComponent.prototype.compute = function (exp) {
        var /** @type {?} */ result = eval(exp);
        this.DataElement.Value = result;
        this.FormValues[this.DataElement.ID] = result;
        return result;
    };
    /**
     * @param {?} textBlocks
     * @return {?}
     */
    ValueBlockComponent.prototype.textify = function (textBlocks) {
        var _this = this;
        var /** @type {?} */ res = '';
        if (textBlocks.constructor.name === 'String') {
            res += textBlocks;
        }
        else if (textBlocks.length > 0) {
            textBlocks.forEach(function (text) {
                if (text.constructor.name === 'String') {
                    res += text;
                }
                else if (text.constructor.name === 'Object') {
                    res += ' ' + _this.FormValues[text.InsertValue.Attr.DataElementId] + ' ';
                }
            });
        }
        this.FormValues[this.DataElement.ID] = res;
        return res;
    };
    return ValueBlockComponent;
}());
ValueBlockComponent.decorators = [
    { type: Component, args: [{
                selector: 'acr-value-block',
                template: "\n    <ng-container *ngIf=\"!validate(ValueBlock.ValidationCondition)\">\n      <ng-container *ngIf=\"evaluate(ValueBlock.Condition)\">\n          <ng-container *ngIf=\"ValueBlock.ArithmeticExpression !=''\">\n              <ng-container *ngIf=\"DataElement.ShowValue\">\n                  <label class=\"control-label DEElement\">  {{compute(ValueBlock.ArithmeticExpression)}}</label>\n              </ng-container>\n              <ng-container *ngIf=\"!DataElement.ShowValue\">\n                  <input type=\"hidden\"   [attr.value]=\"compute(ValueBlock.ArithmeticExpression)\" />\n              </ng-container>\n          </ng-container>\n          <ng-container *ngIf=\"ValueBlock.TextExpression !== '' && ValueBlock.TextExpression !=undefined \">\n              <ng-container *ngIf=\"DataElement.ShowValue\">\n                  <label class=\"control-label DEElement\">  {{textify(ValueBlock.TextExpression)}}</label>\n              </ng-container>\n              <ng-container *ngIf=\"!DataElement.ShowValue\">\n                  <input type=\"hidden\"   [attr.value]=\"textify(ValueBlock.TextExpression)\" />\n              </ng-container>\n          </ng-container>\n          <ng-container *ngIf=\"ValueBlock.NestedBlocks.length > 0\">\n              <ng-container *ngFor=\"let NestedBlock of ValueBlock.NestedBlocks\">\n                  <acr-value-block [ValueBlock]=\"NestedBlock\" [DataElement]=\"DataElement\" [DataElements]=\"DataElements\" [FormValues]=\"FormValues\"></acr-value-block>\n              </ng-container>\n          </ng-container>\n      </ng-container>\n\n      <ng-container *ngIf=\"ValueBlock.ElseBlocks.length > 0\">\n          <ng-container *ngIf=\"!evaluate(ValueBlock.Condition)\">\n              <ng-container *ngFor=\"let ElseBlock of ValueBlock.ElseBlocks\">\n                  <acr-value-block [ValueBlock]=\"ElseBlock\" [DataElement]=\"DataElement\" [DataElements]=\"DataElements\" [FormValues]=\"FormValues\"></acr-value-block>\n              </ng-container>\n          </ng-container>\n      </ng-container>\n    </ng-container>\n  ",
                styles: ["\n\n  "]
            },] },
];
/**
 * @nocollapse
 */
ValueBlockComponent.ctorParameters = function () { return [
    { type: GlobalsService, },
]; };
ValueBlockComponent.propDecorators = {
    'ValueBlock': [{ type: Input },],
    'DataElement': [{ type: Input },],
    'DataElements': [{ type: Input },],
    'FormValues': [{ type: Input },],
};
var ExpressionResultComponent = (function () {
    function ExpressionResultComponent() {
        this.FormValues = {};
        this.DataElements = [];
        this.sectionResult = '';
        this.selectedSection = '';
    }
    /**
     * @return {?}
     */
    ExpressionResultComponent.prototype.ngOnInit = function () {
        if (this.Result.ReportSections.length > 0) {
            this.selectedSection = this.Result.ReportSections[0].Heading;
        }
    };
    /**
     * @return {?}
     */
    ExpressionResultComponent.prototype.getResultText = function () {
        var /** @type {?} */ res = {};
        for (var _i = 0, _a = this.Result.ReportSections; _i < _a.length; _i++) {
            var section = _a[_i];
            var /** @type {?} */ sectionResult = this.generateSectionResult(section);
            res[sectionResult.Heading] = sectionResult.ReportText;
        }
        return res;
    };
    /**
     * @param {?} reportSection
     * @return {?}
     */
    ExpressionResultComponent.prototype.generateSectionResult = function (reportSection) {
        var /** @type {?} */ reportText = this.textifyReportText(reportSection.ReportTexts);
        return { 'Heading': reportSection.Heading, 'ReportText': reportText };
    };
    /**
     * @param {?} reportTexts
     * @return {?}
     */
    ExpressionResultComponent.prototype.textifyReportText = function (reportTexts) {
        var /** @type {?} */ res = '';
        for (var _i = 0, reportTexts_1 = reportTexts; _i < reportTexts_1.length; _i++) {
            var reportText = reportTexts_1[_i];
            if (reportText.ResultText !== '') {
                res += reportText.ResultText;
            }
            if (reportText.DataElementID !== '') {
                res += this.FormValues[reportText.DataElementID];
            }
            if (reportText.Condition !== '') {
                if (this.evaluate(reportText.Condition)) {
                    res += this.textifyReportText(reportText.NestedReportText);
                }
            }
            if (reportText.Condition === '') {
                res += this.textifyReportText(reportText.NestedReportText);
            }
        }
        return res;
    };
    /**
     * @param {?} cond
     * @return {?}
     */
    ExpressionResultComponent.prototype.evaluate = function (cond) {
        if (cond === '') {
            return false;
        }
        var /** @type {?} */ res = eval(cond);
        return res;
    };
    return ExpressionResultComponent;
}());
ExpressionResultComponent.decorators = [
    { type: Component, args: [{
                selector: 'acr-expression-result',
                template: "\n    <div class=\"panel panel-default\">\n\n      <div class=\"panel-heading text-left\">\n        Report Text: <select id=\"ddlSections\" (change)=\"generateReportText()\" [(ngModel)]=\"selectedSection\">\n          <ng-container *ngFor=\"let Section of Result.ReportSections\">\n            <option [value]=\"Section.Heading\" [selected]=\"Section.Heading == 'findings'\">{{Section.Heading}}</option>\n          </ng-container>\n        </select>\n      </div>\n    </div>\n    <div>\n      <ng-container *ngFor=\"let Section of Result.ReportSections\">\n        <ng-container *ngIf=\"selectedSection == Section.Heading\">\n          <acr-report-text [ReportTexts]=\"Section.ReportTexts\" [FormValues]=\"FormValues\"></acr-report-text>\n        </ng-container>\n      </ng-container>\n    </div>\n  ",
                styles: ["\n\n  "]
            },] },
];
/**
 * @nocollapse
 */
ExpressionResultComponent.ctorParameters = function () { return []; };
ExpressionResultComponent.propDecorators = {
    'ExpBlock': [{ type: Input },],
    'Result': [{ type: Input },],
    'FormValues': [{ type: Input },],
    'DataElements': [{ type: Input },],
};
var ReportTextComponent = (function () {
    function ReportTextComponent() {
        this.FormValues = {};
        this.ReportTexts = [];
    }
    /**
     * @param {?} cond
     * @return {?}
     */
    ReportTextComponent.prototype.evaluate = function (cond) {
        if (cond === '') {
            return false;
        }
        return eval(cond);
    };
    /**
     * @param {?} dataElementID
     * @return {?}
     */
    ReportTextComponent.prototype.InsertValue = function (dataElementID) {
        if (Array.isArray(this.FormValues[dataElementID])) {
            return this.FormValues[dataElementID].join(', ');
        }
        return this.FormValues[dataElementID];
    };
    return ReportTextComponent;
}());
ReportTextComponent.decorators = [
    { type: Component, args: [{
                selector: 'acr-report-text',
                template: "\n    <ng-container *ngFor=\"let ReportText of ReportTexts\">\n      <ng-container *ngIf=\"ReportText.ResultText != ''\">\n        <div >\n          <label> {{ReportText.ResultText}} </label>\n        </div>\n      </ng-container>\n      <ng-container *ngIf=\"ReportText.DataElementID != ''\">\n        <div >\n          <label> {{InsertValue(ReportText.DataElementID)}} </label>\n        </div>\n        <br/>\n      </ng-container>\n\n      <ng-container *ngIf=\"ReportText.Condition != ''\">\n        <ng-container *ngIf=\"evaluate(ReportText.Condition)\">\n          <acr-report-text [ReportTexts]=\"ReportText.NestedReportText\" [FormValues]=\"FormValues\"></acr-report-text>\n        </ng-container>\n      </ng-container>\n\n      <ng-container *ngIf=\"ReportText.Condition == ''\">\n        <acr-report-text [ReportTexts]=\"ReportText.NestedReportText\" [FormValues]=\"FormValues\"></acr-report-text>\n      </ng-container>\n    </ng-container>\n  ",
                styles: ["\n\n  "]
            },] },
];
/**
 * @nocollapse
 */
ReportTextComponent.ctorParameters = function () { return []; };
ReportTextComponent.propDecorators = {
    'FormValues': [{ type: Input },],
    'ReportTexts': [{ type: Input },],
};
var SettingsService = (function () {
    function SettingsService() {
        this.loadkeyDiagram = true;
    }
    return SettingsService;
}());
SettingsService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
SettingsService.ctorParameters = function () { return []; };
var components = [AssistSimulatorComponent, ComputedElementComponent, HintDiagramComponent,
    ImageMapComponent, DataElementComponent, ExpresssionBlockComponent,
    ValueBlockComponent, ExpressionResultComponent, ReportTextComponent];
var SimulatorModule = (function () {
    function SimulatorModule() {
    }
    return SimulatorModule;
}());
SimulatorModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    FormsModule
                ],
                declarations: components,
                exports: components,
                providers: [StringUtilityService, GlobalsService, SettingsService]
            },] },
];
/**
 * @nocollapse
 */
SimulatorModule.ctorParameters = function () { return []; };
var FileDetails = (function () {
    /**
     * @param {?} fileName
     * @param {?} fileContents
     */
    function FileDetails(fileName, fileContents) {
        this.fileName = fileName;
        this.fileContents = fileContents;
    }
    return FileDetails;
}());
var FileUploadLoaderComponent = (function () {
    function FileUploadLoaderComponent() {
        this.onFileContentRead = new EventEmitter();
        this.fileReader = new FileReader();
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    FileUploadLoaderComponent.prototype.changeListener = function ($event) {
        this.readThis($event.target);
    };
    /**
     * @param {?} inputValue
     * @return {?}
     */
    FileUploadLoaderComponent.prototype.readThis = function (inputValue) {
        var _this = this;
        this.readFile = inputValue.files[0];
        var /** @type {?} */ self = this;
        this.fileReader.onloadend = function (e) {
            self.onFileContentRead.emit(new FileDetails(self.readFile.name, _this.fileReader.result));
        };
        this.fileReader.readAsText(this.readFile);
    };
    return FileUploadLoaderComponent;
}());
FileUploadLoaderComponent.decorators = [
    { type: Component, args: [{
                selector: 'acr-file-upload-loader',
                template: "\n    <div class = \"row\">\n      <div class= \"col-sm-12\">\n          <div class=\"panel panel-default\">\n              <div class=\"panel-heading\">Select  the Template file</div>\n              <div class=\"panel-body\">\n                  <div class=\"row\">\n                        <div class=\"col-sm-6\"> Select the file to be uploaded</div>\n                        <div class=\"col-sm-6\"><input type=\"file\" accept=\".xml\" (change)=\"changeListener($event)\"></div>\n                  </div>\n              </div>\n            </div>\n      </div>\n    </div>\n  ",
                styles: ["\n\n  "]
            },] },
];
/**
 * @nocollapse
 */
FileUploadLoaderComponent.ctorParameters = function () { return []; };
FileUploadLoaderComponent.propDecorators = {
    'onFileContentRead': [{ type: Output },],
};
var components$1 = [FileUploadLoaderComponent];
var SimulatorLoaderModule = (function () {
    function SimulatorLoaderModule() {
    }
    return SimulatorLoaderModule;
}());
SimulatorLoaderModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [components$1],
                exports: [components$1]
            },] },
];
/**
 * @nocollapse
 */
SimulatorLoaderModule.ctorParameters = function () { return []; };
/**
 * Generated bundle index. Do not edit.
 */
export { SimulatorModule, SimulatorLoaderModule, AssistSimulatorComponent as ɵa, ComputedElementComponent as ɵc, DataElementComponent as ɵg, ExpressionResultComponent as ɵj, ExpresssionBlockComponent as ɵh, HintDiagramComponent as ɵe, ImageMapComponent as ɵf, ReportTextComponent as ɵk, GlobalsService as ɵb, SettingsService as ɵl, StringUtilityService as ɵd, ValueBlockComponent as ɵi, FileUploadLoaderComponent as ɵm };
//# sourceMappingURL=Simulator.es5.js.map
