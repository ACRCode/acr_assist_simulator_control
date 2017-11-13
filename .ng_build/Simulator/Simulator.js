import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injectable, Input, NgModule, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

class GlobalsService {
    constructor() {
        this.ComputedElementConditions = {};
        this.XMLAcronyms = {};
        this.LoadkeyDiagram = true;
        this.evaluateExpessions = true;
    }
}
GlobalsService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
GlobalsService.ctorParameters = () => [];

class TemplateDetails {
}

class DataElement {
    constructor() {
        this.ArithmaticExpression = '';
        this.TextExpression = [];
        this.Visible = true;
        this.DisplaySequence = 0;
        this.ValueBlocks = [];
    }
}

class Metadata {
}

class Diagram {
}

class ChoiceOption {
}

class ImageOption {
}

class MetadataDiagram {
}

class EndPoint {
    constructor() {
        this.ID = '';
        this.ReportSections = [];
        this.ReqDataElements = [];
    }
}

class ReportSection {
    constructor() {
        this.Heading = '';
        this.ReportTexts = [];
        this.ReqDataElements = [];
    }
}

class ReportText {
    constructor() {
        this.Condition = '';
        this.ResultText = '';
        this.DataElementID = '';
        this.NestedReportText = [];
    }
}

class ExpressionBlock {
    constructor() {
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
}

class Parser {
    constructor() {
        this.stringParser = require('string');
    }
    /**
     * @param {?} xmlData
     * @return {?}
     */
    parseToJson(xmlData) {
        let /** @type {?} */ jsonResult;
        xmlData = this.CleanUp(xmlData);
        const /** @type {?} */ parseString = require('xml2js').parseString;
        parseString(xmlData, { explicitRoot: false, explicitArray: false, attrkey: 'Attr' }, function (err, result) {
            jsonResult = result;
        });
        return jsonResult;
    }
    /**
     * @param {?} str
     * @return {?}
     */
    IsJsonString(str) {
        try {
            
        }
        catch (e) {
            return false;
        }
        return true;
    }
    /**
     * @param {?} xmlstr
     * @return {?}
     */
    CleanUp(xmlstr) {
        xmlstr = xmlstr.replace(/<!--[\s\S]*?-->/g, ''); // remove commented lines
        xmlstr = xmlstr.replace(/\n|\t|\r/g, ' '); // replace special characters
        xmlstr = xmlstr.replace(/ {1,}<|\t{1,}</g, '<'); // replace leading spaces and tabs
        xmlstr = xmlstr.replace(/> {1,}|>\t{1,}/g, '>'); // replace trailing spaces and tabs
        xmlstr = xmlstr.replace(/<\?[^>]*\?>/g, ''); // delete docType tags
        xmlstr = xmlstr.replace(/\"/g, '"');
        let /** @type {?} */ dataElements = this.stringParser(xmlstr).between('<DataElements>', '</DataElements>').s;
        const /** @type {?} */ tempDataElements = dataElements;
        dataElements = this.CleanUpTextTemplate(dataElements);
        xmlstr = xmlstr.replace(tempDataElements, dataElements);
        let /** @type {?} */ endPoints = this.stringParser(xmlstr).between('<EndPoints>', '</EndPoints>').s;
        const /** @type {?} */ tempEndPoints = endPoints;
        endPoints = this.CleanUpTemplatePartials(endPoints);
        endPoints = this.CleanUpReportText(endPoints, '<ReportText SectionId="findings">', '<ReportText SectionId=\'findings\'>');
        endPoints = this.CleanUpReportText(endPoints, '<ReportText SectionId="impression">', '<ReportText SectionId=\'impression\'>');
        endPoints = this.CleanUpReportText(endPoints, '<ReportText SectionId="recommendation">', '<ReportText SectionId=\'recommendation\'>');
        return xmlstr.replace(tempEndPoints, endPoints);
    }
    /**
     * @param {?} source
     * @return {?}
     */
    CleanUpTextTemplate(source) {
        const /** @type {?} */ startMatch = '<TextExpression>';
        const /** @type {?} */ endMatch = '</TextExpression>';
        if (this.stringParser(source).contains(startMatch)) {
            const /** @type {?} */ str1 = this.stringParser(source).between('', startMatch).s + startMatch;
            const /** @type {?} */ temp = this.stringParser(source).between(str1).s;
            const /** @type {?} */ str2 = this.stringParser(temp).between('', endMatch).s;
            const /** @type {?} */ _str2 = str2;
            const /** @type {?} */ morphedText = this.MorphReportText(str2);
            let /** @type {?} */ newText = str1 + morphedText;
            const /** @type {?} */ str3 = this.stringParser(temp).between(_str2);
            if (str3 !== '') {
                newText += this.CleanUpTextTemplate(str3);
            }
            return newText;
        }
        return source;
    }
    /**
     * @param {?} source
     * @param {?} match1
     * @param {?=} match2
     * @return {?}
     */
    CleanUpReportText(source, match1, match2) {
        if (!(this.stringParser(source).contains(match1) || this.stringParser(source).contains(match2))) {
            return source;
        }
        const /** @type {?} */ match = this.stringParser(source).contains(match1) ? match1 : match2;
        const /** @type {?} */ reportTextClosing = '</ReportText>';
        const /** @type {?} */ str1 = this.stringParser(source).between('', match).s + match;
        const /** @type {?} */ temp = this.stringParser(source).between(str1).s;
        const /** @type {?} */ str2 = this.stringParser(temp).between('', reportTextClosing).s;
        // TODO : Verify this logic
        const /** @type {?} */ _str2 = str2;
        const /** @type {?} */ morphedText = this.MorphReportText(str2);
        let /** @type {?} */ newText = str1 + morphedText;
        const /** @type {?} */ str3 = this.stringParser(temp).between(_str2);
        if (str3 !== '') {
            newText += this.CleanUpReportText(str3, match);
        }
        return newText;
    }
    /**
     * @param {?} source
     * @return {?}
     */
    CleanUpTemplatePartials(source) {
        const /** @type {?} */ match = '<TemplatePartial';
        const /** @type {?} */ templatePartialClosing = '</TemplatePartial>';
        if (this.stringParser(source).contains(match)) {
            const /** @type {?} */ templateTagElement = match + this.stringParser(source).between(match, '>') + '>';
            const /** @type {?} */ str1 = this.stringParser(source).between('', templateTagElement) + templateTagElement;
            const /** @type {?} */ str2 = this.stringParser(source).between(templateTagElement, templatePartialClosing);
            const /** @type {?} */ str3 = this.stringParser(source).between(templatePartialClosing);
            const /** @type {?} */ morphedText = this.MorphReportText(str2);
            return str1 + morphedText + templatePartialClosing + this.CleanUpTemplatePartials(str3);
        }
        else {
            return source;
        }
    }
    /**
     * @param {?} str2
     * @return {?}
     */
    MorphReportText(str2) {
        const /** @type {?} */ text = [];
        while (str2.trim() !== '') {
            if (this.stringParser(str2).startsWith('<SectionIf') || this.stringParser(str2).startsWith('<SectionIfNot') ||
                this.stringParser(str2).startsWith('<SectionIfValue') || this.stringParser(str2).startsWith('<SectionIfValueNot')) {
                const /** @type {?} */ temp = str2;
                const /** @type {?} */ sectionContent = this.stringParser(str2).between('', '>') + '>';
                const /** @type {?} */ newStr2 = str2.replace(sectionContent, '');
                const /** @type {?} */ morphedText = '<Text>' + sectionContent + this.MorphReportText(newStr2);
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
                const /** @type {?} */ temp = this.stringParser(str2).between('', '>') + '>';
                text.push('<Text>' + temp + '</Text>');
                str2 = this.stringParser(str2).between(temp).s;
            }
            else {
                let /** @type {?} */ temp = str2;
                if (str2.indexOf('<') !== -1) {
                    temp = this.stringParser(str2).between('', '<');
                }
                text.push('<Text>' + temp + '</Text>');
                str2 = str2.replace(temp, '');
            }
        }
        return text.join(' ');
    }
    /**
     * @param {?} xmlstr
     * @param {?} startString
     * @param {?} endString
     * @return {?}
     */
    GetSubstring(xmlstr, startString, endString) {
        const /** @type {?} */ startIndex = xmlstr.indexOf(startString) + startString.length;
        const /** @type {?} */ endIndex = xmlstr.indexOf(endString);
        return xmlstr.substring(startIndex, endIndex);
    }
    /**
     * @param {?} string
     * @param {?} subString
     * @param {?} allowOverlapping
     * @return {?}
     */
    occurrences(string, subString, allowOverlapping) {
        string += '';
        subString += '';
        if (subString.length <= 0) {
            return (string.length + 1);
        }
        let /** @type {?} */ n = 0, /** @type {?} */ pos = 0;
        const /** @type {?} */ step = allowOverlapping ? 1 : subString.length;
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
    }
}

class XMLUtil {
    constructor() {
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
    unique(arr) {
        return arr.filter(function (item, index, inputArray) {
            return inputArray.indexOf(item) === index;
        });
    }
    /**
     * @param {?} elem
     * @return {?}
     */
    AppendToDataElements(elem) {
        elem.Visible = true;
        this.DataElements.push(elem);
        this.DataElementsObj[elem.ID] = elem;
        this.Acronyms[elem.ID] = elem.Label;
        if (elem.ElementType === 'ChoiceDataElement' || elem.ElementType === 'MultiChoiceDataElement') {
            for (const /** @type {?} */ opt of elem.ChoiceOptions) {
                this.Acronyms[opt.Value] = opt.Label;
            }
        }
        const /** @type {?} */ obj = [];
        if (elem.IsRequired) {
            const /** @type {?} */ condition = '(this.FormValues[\'' + elem.ID + '\'] == undefined || this.FormValues[\'' +
                elem.ID + '\'] == \'\' || this.FormValues[\'' + elem.ID + '\'] == null || this.FormValues[\'' +
                elem.ID + '\'] == NaN ) && (this.FormValues[\'' + elem.ID + '\'] != 0)';
            const /** @type {?} */ message = '"' + elem.Label + '" is a required input.';
            this.ValidationBlocks.push({ 'Condition': condition, 'Message': message,
                'DataElementID': elem.ID, DataElementIndex: this.DataElements.indexOf(elem) });
            obj.push(condition);
        }
        if (elem.Minimum !== undefined) {
            const /** @type {?} */ condition = '(this.FormValues[\'' + elem.ID + '\'] < ' + elem.Minimum + ')';
            const /** @type {?} */ message = 'Minimum value required';
            this.ValidationBlocks.push({ 'Condition': condition, 'Message': message,
                'DataElementID': elem.ID, DataElementIndex: this.DataElements.indexOf(elem), 'Minimum': elem.Minimum });
            obj.push(condition);
        }
        if (obj.length > 0) {
            this.ValidationBlocksObj[elem.ID] = '(' + obj.join(' || ') + ')';
        }
    }
    /**
     * @param {?} elemObj
     * @return {?}
     */
    parseBaseDataElement(elemObj) {
        const /** @type {?} */ elem = new DataElement();
        elem.ID = elemObj.Attr.Id;
        elem.IsRequired = elemObj.Attr.hasOwnProperty('IsRequired') ? elemObj.Attr.IsRequired : false;
        elem.Hint = elemObj.hasOwnProperty('Hint') ? elemObj.Hint : '';
        elem.Label = elemObj.Label;
        elem.DisplaySequence = elemObj.Attr.DisplaySequence !== undefined ? elemObj.Attr.DisplaySequence : 0;
        if (elemObj.Diagrams !== undefined) {
            elem.Diagrams = [];
            if (elemObj.Diagrams.Diagram.constructor.name === 'Array') {
                elemObj.Diagrams.Diagram.forEach(element => {
                    const /** @type {?} */ diag = this.createDiagram(element);
                    elem.Diagrams.push(diag);
                });
            }
            else if (elemObj.Diagrams.Diagram.constructor.name === 'Object') {
                const /** @type {?} */ element = elemObj.Diagrams.Diagram;
                const /** @type {?} */ diag = this.createDiagram(element);
                elem.Diagrams.push(diag);
            }
        }
        return elem;
    }
    /**
     * @param {?} element
     * @return {?}
     */
    createDiagram(element) {
        const /** @type {?} */ diag = new Diagram();
        diag.Label = element.Label;
        diag.Location = this.templateDetails.imagePath + '//' + element.Location;
        return diag;
    }
    /**
     * @param {?} elemObj
     * @return {?}
     */
    parseGlobalDataElement(elemObj) {
        const /** @type {?} */ elem = new DataElement();
        elem.ElementType = 'GlobalValue';
        elem.ID = elemObj.Attr.Id;
        elem.Value = elemObj.ElementValue;
        this.AppendToDataElements(elem);
    }
    /**
     * @param {?} choice
     * @param {?} elem
     * @return {?}
     */
    createChoiceOption(choice, elem) {
        const /** @type {?} */ choiceOption = new ChoiceOption();
        choiceOption.Label = choice.Label;
        choiceOption.Value = choice.Value;
        choiceOption.Default = choice.hasOwnProperty('Attr') ? (choice.Attr.hasOwnProperty('Default') ?
            choice.Attr.Default : false) : false;
        if (choiceOption.Default) {
            this.FormValues[elem.ID] = choiceOption.Value;
        }
        return choiceOption;
    }
    /**
     * @param {?} elemObj
     * @return {?}
     */
    parseChoiceDataElements(elemObj) {
        const /** @type {?} */ elem = this.parseBaseDataElement(elemObj);
        elem.ElementType = 'ChoiceDataElement';
        elem.ChoiceOptions = [];
        if (elemObj.ChoiceInfo.Choice.constructor.name === 'Array') {
            for (const /** @type {?} */ choice of elemObj.ChoiceInfo.Choice) {
                const /** @type {?} */ choiceOption = this.createChoiceOption(choice, elem);
                elem.ChoiceOptions.push(choiceOption);
            }
        }
        else if (elemObj.ChoiceInfo.Choice.constructor.name === 'Object') {
            const /** @type {?} */ choice = elemObj.ChoiceInfo.Choice;
            const /** @type {?} */ choiceOption = this.createChoiceOption(choice, elem);
            elem.ChoiceOptions.push(choiceOption);
        }
        if (elemObj.hasOwnProperty('ImageMap')) {
            elem.ImagePath = this.templateDetails.imagePath + '//' + elemObj.ImageMap.imageElements;
            elem.ImageTitle = elem.ImagePath.split('.')[0];
            if (elemObj.ImageMap.hasOwnProperty('Map')) {
                elem.ImageOptions = [];
                for (const /** @type {?} */ area of elemObj.ImageMap.Map.Area) {
                    const /** @type {?} */ opt = new ImageOption();
                    opt.Coordinates = area.Attr.Coords;
                    opt.Shape = area.Attr.Shape;
                    opt.Value = area.Attr.ChoiceValue;
                    elem.ImageOptions.push(opt);
                }
            }
        }
        this.AppendToDataElements(elem);
    }
    /**
     * @param {?} elemObj
     * @return {?}
     */
    parseMultiChoiceDataElements(elemObj) {
        const /** @type {?} */ elem = this.parseBaseDataElement(elemObj);
        elem.ElementType = 'MultiChoiceDataElement';
        elem.ChoiceOptions = [];
        if (elemObj.ChoiceInfo.Choice.constructor.name === 'Array') {
            for (const /** @type {?} */ choice of elemObj.ChoiceInfo.Choice) {
                const /** @type {?} */ choiceOption = this.createChoiceOption(choice, elem);
                elem.ChoiceOptions.push(choiceOption);
            }
        }
        else if (elemObj.ChoiceInfo.Choice.constructor.name === 'Object') {
            const /** @type {?} */ choice = elemObj.ChoiceInfo.Choice;
            const /** @type {?} */ choiceOption = this.createChoiceOption(choice, elem);
            elem.ChoiceOptions.push(choiceOption);
        }
        this.AppendToDataElements(elem);
    }
    /**
     * @param {?} elemObj
     * @return {?}
     */
    parseNumericDataElements(elemObj) {
        const /** @type {?} */ elem = this.parseBaseDataElement(elemObj);
        elem.ElementType = 'NumericDataElement';
        elem.Minimum = elemObj.hasOwnProperty('Minimum') ? elemObj.Minimum : 0;
        this.AppendToDataElements(elem);
    }
    /**
     * @param {?} elemObj
     * @return {?}
     */
    parseComputedDataElement(elemObj) {
        const /** @type {?} */ elem = new DataElement();
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
    }
    /**
     * @return {?}
     */
    parseDataElements() {
        const /** @type {?} */ jsonObj = this.xmlFileJSON;
        // Choice Data Elements
        if (jsonObj.DataElements.hasOwnProperty('ChoiceDataElement')) {
            if (jsonObj.DataElements.ChoiceDataElement.constructor.name === 'Array') {
                for (const /** @type {?} */ dataElement of jsonObj.DataElements.ChoiceDataElement) {
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
                for (const /** @type {?} */ dataElement of jsonObj.DataElements.MultiChoiceDataElement) {
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
                for (const /** @type {?} */ dataElement of jsonObj.DataElements.NumericDataElement) {
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
                for (const /** @type {?} */ dataElement of jsonObj.DataElements.IntegerDataElement) {
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
                for (const /** @type {?} */ dataElement of jsonObj.DataElements.GlobalValue) {
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
                for (const /** @type {?} */ dataElement of jsonObj.DataElements.ComputedElement) {
                    this.parseComputedDataElement(dataElement);
                }
            }
            else if (jsonObj.DataElements.ComputedElement.constructor.name === 'Object') {
                this.parseComputedDataElement(jsonObj.DataElements.ComputedElement);
            }
        }
        this.DataElements = this.DataElements.sort(function (d1, d2) { return d1.DisplaySequence - d2.DisplaySequence; });
    }
    /**
     * @param {?} templateDetails
     * @return {?}
     */
    load(templateDetails) {
        this.templateDetails = templateDetails;
        const /** @type {?} */ parser = new Parser();
        this.xmlFileJSON = parser.parseToJson(templateDetails.templateContent);
        this.loadMetaData();
        this.parseDataElements();
        this.loadEndPoints();
        this.generateExpressions();
    }
    /**
     * @return {?}
     */
    loadMetaData() {
        const /** @type {?} */ jsonObj = this.xmlFileJSON;
        const /** @type {?} */ metadata = new Metadata();
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
                jsonObj.Metadata.Info.Diagrams.Diagram.forEach(diag => {
                    if (diag.Attr.hasOwnProperty('KeyDiagram') && diag.Attr.KeyDiagram === 'true') {
                        metadata.Diagrams.push(this.parseMetaDataDiagram(diag));
                    }
                });
            }
        }
        this.Metadata = metadata;
    }
    /**
     * @param {?} diag
     * @return {?}
     */
    parseMetaDataDiagram(diag) {
        const /** @type {?} */ diagObj = new MetadataDiagram();
        diagObj.DisplaySequence = diag.Attr.hasOwnProperty('DisplaySequence') ? diag.Attr.DisplaySequence : 0;
        diagObj.KeyDiagram = diag.Attr.hasOwnProperty('KeyDiagram') ? diag.Attr.KeyDiagram : false;
        diagObj.Label = diag.hasOwnProperty('Label') ? diag.Label : '';
        diagObj.ImagePath = this.templateDetails.imagePath + '//' + diag.Location;
        return diagObj;
    }
    /**
     * @return {?}
     */
    loadTemplatePartials() {
        const /** @type {?} */ jsonObj = this.xmlFileJSON;
        if (jsonObj.EndPoints.TemplatePartial !== undefined) {
            if (jsonObj.EndPoints.TemplatePartial.length === undefined) {
                const /** @type {?} */ tempPart = jsonObj.EndPoints.TemplatePartial;
                const /** @type {?} */ TemplatePartialReportTexts = [];
                if (tempPart.Text.length === undefined) {
                    const /** @type {?} */ reportText = this.parseReportText(tempPart.Text);
                    TemplatePartialReportTexts.push(reportText);
                }
                else {
                    for (const /** @type {?} */ text of tempPart.Text) {
                        const /** @type {?} */ reportText = this.parseReportText(text);
                        TemplatePartialReportTexts.push(reportText);
                    }
                }
                this.TemplatePartials[tempPart.Attr.Id] = TemplatePartialReportTexts;
            }
            else {
                for (const /** @type {?} */ tempPart of jsonObj.EndPoints.TemplatePartial) {
                    const /** @type {?} */ templatePartialReportTexts = [];
                    if (tempPart.Text.length === undefined) {
                        const /** @type {?} */ reportText = this.parseReportText(tempPart.Text);
                        templatePartialReportTexts.push(reportText);
                    }
                    else {
                        for (const /** @type {?} */ text of tempPart.Text) {
                            const /** @type {?} */ reportText = this.parseReportText(text);
                            templatePartialReportTexts.push(reportText);
                        }
                    }
                    this.TemplatePartials[tempPart.Attr.Id] = templatePartialReportTexts;
                }
            }
        }
    }
    /**
     * @return {?}
     */
    loadEndPoints() {
        const /** @type {?} */ jsonObj = this.xmlFileJSON;
        this.loadTemplatePartials();
        if (jsonObj.EndPoints.EndPoint.length !== undefined) {
            for (const /** @type {?} */ endPoint of jsonObj.EndPoints.EndPoint) {
                const /** @type {?} */ ep = this.parseEndPoint(endPoint);
                this.Endpoints[ep.ID] = ep;
            }
        }
        else {
            const /** @type {?} */ ep = this.parseEndPoint(jsonObj.EndPoints.EndPoint);
            this.Endpoints[ep.ID] = ep;
        }
    }
    /**
     * @param {?} endPoint
     * @return {?}
     */
    parseEndPoint(endPoint) {
        const /** @type {?} */ ep = new EndPoint();
        ep.ID = endPoint.Attr.Id;
        if (endPoint.ReportTexts.ReportText.length === undefined) {
            const /** @type {?} */ section = this.parseReportSection(endPoint.ReportTexts.ReportText);
            ep.ReportSections.push(section);
            ep.ReqDataElements = ep.ReqDataElements.concat(section.ReqDataElements);
        }
        else if (endPoint.ReportTexts.ReportText.length > 0) {
            for (const /** @type {?} */ rt of endPoint.ReportTexts.ReportText) {
                const /** @type {?} */ section = this.parseReportSection(rt);
                ep.ReportSections.push(section);
                ep.ReqDataElements = ep.ReqDataElements.concat(section.ReqDataElements);
            }
        }
        ep.ReqDataElements = this.unique(ep.ReqDataElements);
        return ep;
    }
    /**
     * @param {?} obj
     * @return {?}
     */
    parseReportSection(obj) {
        const /** @type {?} */ reportSection = new ReportSection();
        reportSection.Heading = obj.Attr.SectionId;
        if (obj.hasOwnProperty('Text')) {
            if (obj.Text.constructor.name === 'String' || obj.Text.constructor.name === 'Object') {
                const /** @type {?} */ reportText = this.parseReportText(obj.Text);
                reportSection.ReportTexts.push(reportText);
                if (reportText.DataElementID !== '') {
                    reportSection.ReqDataElements.push(reportText.DataElementID);
                }
                // reportText.DataElementID !== '' ? reportSection.ReqDataElements.push(reportText.DataElementID) : '';
            }
            else if (obj.Text.constructor.name === 'Array' && obj.Text.length > 0) {
                for (const /** @type {?} */ elem of obj.Text) {
                    const /** @type {?} */ reportText = this.parseReportText(elem);
                    reportSection.ReportTexts.push(reportText);
                    if (reportText.DataElementID !== '') {
                        reportSection.ReqDataElements.push(reportText.DataElementID);
                    }
                    // reportText.DataElementID !== '' ? reportSection.ReqDataElements.push(reportText.DataElementID) : '';
                }
            }
        }
        return reportSection;
    }
    /**
     * @param {?} obj
     * @return {?}
     */
    parseReportText(obj) {
        const /** @type {?} */ reportText = new ReportText();
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
                    for (const /** @type {?} */ text of obj.SectionIf.Text) {
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
                    for (const /** @type {?} */ text of obj.SectionIfNot.Text) {
                        reportText.NestedReportText.push(this.parseReportText(text));
                    }
                }
                else {
                    reportText.NestedReportText.push(this.parseReportText(obj.SectionIfNot.Text));
                }
            }
            else if (obj.SectionIfValue !== undefined) {
                let /** @type {?} */ RElement;
                let /** @type {?} */ comparisionVal = obj.SectionIfValue.Attr.ComparisonValue;
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
                    for (const /** @type {?} */ text of obj.SectionIfValue.Text) {
                        reportText.NestedReportText.push(this.parseReportText(text));
                    }
                }
                else {
                    reportText.NestedReportText.push(this.parseReportText(obj.SectionIfValue.Text));
                }
            }
            else if (obj.SectionIfValueNot !== undefined) {
                let /** @type {?} */ RElement;
                let /** @type {?} */ comparisionVal = obj.SectionIfValueNot.Attr.ComparisonValue;
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
                    for (const /** @type {?} */ text of obj.SectionIfValueNot.Text) {
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
    }
    /**
     * @return {?}
     */
    generateExpressions() {
        const /** @type {?} */ jsonObj = this.xmlFileJSON;
        this.ExpressionBlocks = this.parseDecissionPoint(jsonObj.Rules.DecisionPoint, 0, '0', undefined);
    }
    /**
     * @param {?} decissionPoint
     * @param {?} level
     * @param {?} parentID
     * @param {?} notRelavantItems
     * @return {?}
     */
    parseDecissionPoint(decissionPoint, level, parentID, notRelavantItems) {
        const /** @type {?} */ Blocks = [];
        if (decissionPoint.Branch.length > 0) {
            for (const /** @type {?} */ index in decissionPoint.Branch) {
                const /** @type {?} */ branch = decissionPoint.Branch[index];
                const /** @type {?} */ block = this.parseBranch(branch, level, parseInt(index, 10), parentID, notRelavantItems);
                Blocks.push(block);
            }
        }
        else {
            const /** @type {?} */ block = this.parseBranch(decissionPoint.Branch, level, 0, parentID, notRelavantItems);
            Blocks.push(block);
        }
        if (decissionPoint.DefaultBranch !== undefined) {
            const /** @type {?} */ ElseBlock = this.parseBranch(decissionPoint.DefaultBranch, level + 1, 0, parentID, notRelavantItems);
            if (Blocks.length > 0) {
                const /** @type {?} */ lastBlock = Blocks[Blocks.length - 1];
                lastBlock.ElseBlocks.push(ElseBlock);
                Blocks[Blocks.length - 1] = lastBlock;
            }
        }
        return Blocks;
    }
    /**
     * @param {?} obj
     * @return {?}
     */
    parseNotRelevantElements(obj) {
        const /** @type {?} */ ids = [];
        if (obj.DataElementRef.constructor.name === 'Object') {
            const /** @type {?} */ index = this.DataElements.indexOf(this.DataElementsObj[obj.DataElementRef.Attr.DataElementId]);
            ids.push(index);
        }
        else if (obj.DataElementRef.constructor.name === 'Array') {
            for (const /** @type {?} */ dataElement of obj.DataElementRef) {
                const /** @type {?} */ index = this.DataElements.indexOf(this.DataElementsObj[dataElement.Attr.DataElementId]);
                ids.push(index);
            }
        }
        return ids;
    }
    /**
     * @param {?} branch
     * @param {?} level
     * @param {?} index
     * @param {?} parentID
     * @param {?} notRelavantItems
     * @return {?}
     */
    parseBranch(branch, level, index, parentID, notRelavantItems) {
        const /** @type {?} */ Block = new ExpressionBlock();
        Block.Level = level;
        Block.Index = index;
        Block.ParentID = parentID;
        let /** @type {?} */ childParentID = '';
        if (parentID === '0') {
            childParentID = level + '' + index;
        }
        else {
            childParentID = parentID + '' + level + '' + index;
        }
        if (branch.NotRelevantDataElements !== undefined) {
            const /** @type {?} */ notRelevantElements = this.parseNotRelevantElements(branch.NotRelevantDataElements);
            Block.NotRelavantDataElements = notRelevantElements;
        }
        if (notRelavantItems !== undefined) {
            Block.NotRelavantDataElements = Block.NotRelavantDataElements.concat(notRelavantItems);
        }
        if (branch.LessThanCondition !== undefined) {
            const /** @type {?} */ res = this.buildExpression(branch.LessThanCondition.Attr, '<');
            Block.Condition = res.Condition;
            Block.TextCondition = res.TextCondition;
            Block.ValidationCondition = res.ValidationCondition;
        }
        if (branch.GreaterThanCondition !== undefined) {
            const /** @type {?} */ res = this.buildExpression(branch.GreaterThanCondition.Attr, '>');
            Block.Condition = res.Condition;
            Block.TextCondition = res.TextCondition;
            Block.ValidationCondition = res.ValidationCondition;
        }
        if (branch.EqualCondition !== undefined) {
            const /** @type {?} */ res = this.buildExpression(branch.EqualCondition.Attr, '==');
            Block.Condition = res.Condition;
            Block.TextCondition = res.TextCondition;
            Block.ValidationCondition = res.ValidationCondition;
        }
        if (branch.GreaterThanOrEqualsCondition !== undefined) {
            const /** @type {?} */ res = this.buildExpression(branch.GreaterThanOrEqualsCondition.Attr, '>=');
            Block.Condition = res.Condition;
            Block.TextCondition = res.TextCondition;
            Block.ValidationCondition = res.ValidationCondition;
        }
        if (branch.LessThanOrEqualsCondition !== undefined) {
            const /** @type {?} */ res = this.buildExpression(branch.LessThanOrEqualsCondition.Attr, '<=');
            Block.Condition = res.Condition;
            Block.TextCondition = res.TextCondition;
            Block.ValidationCondition = res.ValidationCondition;
        }
        if (branch.NotCondition !== undefined) {
            const /** @type {?} */ res = this.buildExpressions(branch.NotCondition, '&& !');
            Block.Condition = '!(' + res.Condition + ')';
            Block.TextCondition = '!(' + res.TextCondition + ')';
            Block.ValidationCondition = res.ValidationCondition;
        }
        if (branch.OrCondition !== undefined) {
            const /** @type {?} */ res = this.buildExpressions(branch.OrCondition, '||');
            Block.Condition = res.Condition;
            Block.TextCondition = res.TextCondition;
            Block.ValidationCondition = res.ValidationCondition;
        }
        if (branch.AndCondition !== undefined) {
            const /** @type {?} */ res = this.buildExpressions(branch.AndCondition, '&&');
            Block.Condition = res.Condition;
            Block.TextCondition = res.TextCondition;
            Block.ValidationCondition = res.ValidationCondition;
        }
        if (branch.ContainsCondition !== undefined) {
            const /** @type {?} */ res = this.buildContainsExpression(branch.ContainsCondition.Attr);
            Block.Condition = res.Condition;
            Block.TextCondition = res.TextCondition;
            Block.ValidationCondition = res.ValidationCondition;
        }
        if (branch.HasAnyNChoicesCondition !== undefined) {
            const /** @type {?} */ res = this.buildNoChoiceExpression(branch.HasAnyNChoicesCondition.Attr);
            Block.Condition = res.Condition;
            Block.TextCondition = res.TextCondition;
            Block.ValidationCondition = res.ValidationCondition;
        }
        if (branch.EndPointRef !== undefined) {
            Block.Result = this.Endpoints[branch.EndPointRef.Attr.EndPointId];
            if (Block.Result.ReqDataElements.length > 0) {
                const /** @type {?} */ evc = [];
                for (const /** @type {?} */ de of Block.Result.ReqDataElements) {
                    const /** @type {?} */ cond = this.ValidationBlocksObj[de];
                    if (cond !== undefined) {
                        evc.push(cond);
                    }
                }
                const /** @type {?} */ valCondition = evc.length > 0 ? '(' + evc.join('||') + ')' : '';
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
            const /** @type {?} */ NestedBranches = this.parseDecissionPoint(branch.DecisionPoint, level + 1, childParentID, Block.NotRelavantDataElements);
            Block.NestedBlocks = NestedBranches;
        }
        if (branch.ArithmeticExpression !== undefined) {
            Block.ArithmeticExpression = this.parseArithmaticExpression(branch.ArithmeticExpression);
        }
        if (branch.TextExpression !== undefined) {
            Block.TextExpression = branch.TextExpression.Text;
        }
        return Block;
    }
    /**
     * @param {?} expression
     * @return {?}
     */
    parseArithmaticExpression(expression) {
        let /** @type {?} */ res = '';
        // Removing spaces
        expression = expression.replace(/ /g, '');
        expression = expression.replace(new RegExp('{', 'g'), ' this.FormValues[\'');
        expression = expression.replace(new RegExp('}', 'g'), '\'] ');
        expression = expression.replace(new RegExp('pow', 'g'), 'Math.pow');
        expression = expression.replace(new RegExp('exp', 'g'), 'Math.exp');
        res = expression;
        return res;
    }
    /**
     * @param {?} expression
     * @param {?} op
     * @return {?}
     */
    cleanArithmaticExpression(expression, op) {
        const /** @type {?} */ index = expression.indexOf(op);
        if (index !== -1) {
            if (expression[index - 1] !== ')' || expression[index + 1] !== '(') {
                const /** @type {?} */ firstPart = expression.substring(0, index);
                let /** @type {?} */ joinPart = '';
                if (expression[index - 1] !== ')') {
                    joinPart = '\']';
                }
                joinPart += op;
                if (expression[index + 1] !== '(') {
                    joinPart += 'this.FormValues[\'';
                }
                const /** @type {?} */ remPart = expression.substring(index + 1, expression.length);
                expression = firstPart + joinPart + this.cleanArithmaticExpression(remPart, op);
            }
        }
        return expression;
    }
    /**
     * @param {?} attr
     * @param {?} op
     * @return {?}
     */
    buildExpression(attr, op) {
        let /** @type {?} */ comparisionVal = attr.ComparisonValue;
        let /** @type {?} */ ValidationRule = this.ValidationBlocksObj[attr.DataElementId];
        let /** @type {?} */ LElement;
        let /** @type {?} */ LElementLabel;
        let /** @type {?} */ RElement;
        let /** @type {?} */ RElementLabel;
        let /** @type {?} */ condition = '';
        let /** @type {?} */ TextCondition = '';
        if (this.DataElementsObj[attr.DataElementId]
            && this.DataElementsObj[attr.DataElementId].ElementType === 'GlobalValue') {
            const /** @type {?} */ LValue = this.DataElementsObj[attr.DataElementId].Value;
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
    }
    /**
     * @param {?} attr
     * @return {?}
     */
    buildContainsExpression(attr) {
        let /** @type {?} */ ValidationRule = this.ValidationBlocksObj[attr.DataElementId];
        if (ValidationRule === undefined) {
            ValidationRule = '';
        }
        let /** @type {?} */ condition = '';
        let /** @type {?} */ LElementLabel;
        let /** @type {?} */ TextCondition = '';
        const /** @type {?} */ LElement = 'this.FormValues[\'' + attr.DataElementId + '\']';
        LElementLabel = this.DataElementsObj[attr.DataElementId].Label;
        let /** @type {?} */ RElement = attr.ComparisonValue;
        condition += '(';
        condition += '(' + LElement + ' != undefined)';
        condition += '&&';
        if (RElement.split(' ').length > 1) {
            condition += '(';
            TextCondition += '(';
            RElement.split(' ').forEach(re => {
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
    }
    /**
     * @param {?} attr
     * @return {?}
     */
    buildNoChoiceExpression(attr) {
        let /** @type {?} */ ValidationRule = this.ValidationBlocksObj[attr.DataElementId];
        if (ValidationRule === undefined) {
            ValidationRule = '';
        }
        let /** @type {?} */ LElementLabel;
        let /** @type {?} */ RElementLabel;
        let /** @type {?} */ TextCondition = '';
        let /** @type {?} */ condition = '';
        const /** @type {?} */ LElement = 'this.FormValues[\'' + attr.DataElementId + '\']';
        LElementLabel = this.DataElementsObj[attr.DataElementId].Label;
        const /** @type {?} */ RElement = Number(attr.MinimumChoices);
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
    }
    /**
     * @param {?} obj
     * @param {?} op
     * @return {?}
     */
    buildExpressions(obj, op) {
        const /** @type {?} */ AndOp = '&&';
        const /** @type {?} */ exp = [];
        const /** @type {?} */ TextExp = [];
        const /** @type {?} */ validaitonExp = [];
        if (obj.EqualCondition !== undefined) {
            if (Array.isArray(obj.EqualCondition)) {
                const /** @type {?} */ conditions = [];
                const /** @type {?} */ textConditions = [];
                const /** @type {?} */ valdiationConditions = [];
                for (const /** @type {?} */ cond of obj.EqualCondition) {
                    const /** @type {?} */ res = this.buildExpression(cond.Attr, '==');
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
                const /** @type {?} */ res = this.buildExpression(obj.EqualCondition.Attr, '==');
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
                const /** @type {?} */ conditions = [];
                const /** @type {?} */ textConditions = [];
                const /** @type {?} */ valdiationConditions = [];
                for (const /** @type {?} */ cond of obj.LessThanCondition) {
                    const /** @type {?} */ res = this.buildExpression(cond.Attr, '<');
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
                const /** @type {?} */ res = this.buildExpression(obj.LessThanCondition.Attr, '<');
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
                const /** @type {?} */ conditions = [];
                const /** @type {?} */ textConditions = [];
                const /** @type {?} */ valdiationConditions = [];
                for (const /** @type {?} */ cond of obj.GreaterThanCondition) {
                    const /** @type {?} */ res = this.buildExpression(cond.Attr, '>');
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
                const /** @type {?} */ res = this.buildExpression(obj.GreaterThanCondition.Attr, '>');
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
                const /** @type {?} */ conditions = [];
                const /** @type {?} */ textConditions = [];
                const /** @type {?} */ valdiationConditions = [];
                for (const /** @type {?} */ cond of obj.GreaterThanOrEqualsCondition) {
                    const /** @type {?} */ res = this.buildExpression(cond.Attr, '>=');
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
                const /** @type {?} */ res = this.buildExpression(obj.GreaterThanOrEqualsCondition.Attr, '>=');
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
                const /** @type {?} */ conditions = [];
                const /** @type {?} */ textConditions = [];
                const /** @type {?} */ valdiationConditions = [];
                for (const /** @type {?} */ cond of obj.LessThanOrEqualsCondition) {
                    const /** @type {?} */ res = this.buildExpression(cond.Attr, '<=');
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
                const /** @type {?} */ res = this.buildExpression(obj.LessThanOrEqualsCondition.Attr, '<=');
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
                const /** @type {?} */ conditions = [];
                const /** @type {?} */ textConditions = [];
                const /** @type {?} */ valdiationConditions = [];
                for (const /** @type {?} */ cond of obj.OrCondition) {
                    const /** @type {?} */ res = this.buildExpressions(cond, '||');
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
                const /** @type {?} */ res = this.buildExpressions(obj.OrCondition, '||');
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
                const /** @type {?} */ conditions = [];
                const /** @type {?} */ textConditions = [];
                const /** @type {?} */ valdiationConditions = [];
                for (const /** @type {?} */ cond of obj.NotCondition) {
                    const /** @type {?} */ res = this.buildExpressions(cond, '&&');
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
                const /** @type {?} */ res = this.buildExpressions(obj.NotCondition, '&&');
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
                const /** @type {?} */ conditions = [];
                const /** @type {?} */ textConditions = [];
                const /** @type {?} */ valdiationConditions = [];
                for (const /** @type {?} */ cond of obj.AndCondition) {
                    const /** @type {?} */ res = this.buildExpressions(cond, '&&');
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
                const /** @type {?} */ res = this.buildExpressions(obj.AndCondition, '&&');
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
                const /** @type {?} */ conditions = [];
                const /** @type {?} */ textConditions = [];
                const /** @type {?} */ valdiationConditions = [];
                for (const /** @type {?} */ cond of obj.ContainsCondition) {
                    const /** @type {?} */ res = this.buildContainsExpression(cond.Attr);
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
                const /** @type {?} */ res = this.buildContainsExpression(obj.ContainsCondition.Attr);
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
                const /** @type {?} */ conditions = [];
                const /** @type {?} */ textConditions = [];
                const /** @type {?} */ valdiationConditions = [];
                for (const /** @type {?} */ cond of obj.HasAnyNChoicesCondition) {
                    const /** @type {?} */ res = this.buildNoChoiceExpression(cond.Attr);
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
                const /** @type {?} */ res = this.buildNoChoiceExpression(obj.HasAnyNChoicesCondition.Attr);
                exp.push(res.Condition);
                TextExp.push(res.TextCondition);
                if (res.ValidationCondition !== '') {
                    validaitonExp.push(res.ValidationCondition);
                }
                // res.ValidationCondition != '' ? validaitonExp.push(res.ValidationCondition) : '';
            }
        }
        let /** @type {?} */ ConditionExp = '';
        if (exp.length > 1) {
            ConditionExp = '(' + exp.join(' ' + op + ' ') + ')';
        }
        else {
            ConditionExp = exp[0];
        }
        let /** @type {?} */ TextConditionExp = '';
        if (TextExp.length > 1) {
            TextConditionExp = '(' + TextExp.join(' ' + op + ' ') + ')';
        }
        else {
            TextConditionExp = TextExp[0];
        }
        let /** @type {?} */ ValidationConditionExp = '';
        if (validaitonExp.length > 1) {
            ValidationConditionExp = '(' + validaitonExp.join(' ' + AndOp + ' ') + ')';
        }
        else if (validaitonExp.length > 0) {
            ValidationConditionExp = validaitonExp[0];
        }
        return { 'TextCondition': TextConditionExp, 'Condition': ConditionExp, 'ValidationCondition': ValidationConditionExp };
    }
}

class AssistSimulatorComponent {
    /**
     * @param {?} globalsService
     * @param {?} cd
     */
    constructor(globalsService, cd) {
        this.globalsService = globalsService;
        this.cd = cd;
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        this.processData();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.processData();
    }
    /**
     * @return {?}
     */
    resetData() {
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
    }
    /**
     * @return {?}
     */
    processData() {
        this.resetData();
        this.isValid = this.templateContent.length > 0 && this.imagePath.length > 0;
        const /** @type {?} */ templateDetails = new TemplateDetails();
        templateDetails.imagePath = this.imagePath;
        templateDetails.templateContent = this.templateContent;
        const /** @type {?} */ util = new XMLUtil();
        util.load(templateDetails);
        this.globalsService.XMLAcronyms = util.Acronyms;
        this.Metadata = util.Metadata;
        this.DataElements = util.DataElements;
        this.ExpressionBlocks = util.ExpressionBlocks;
        this.ValidationBlocks = util.ValidationBlocks;
        this.FormValues = util.FormValues;
        this.BaseFormValues = JSON.parse(JSON.stringify(this.FormValues));
    }
    /**
     * @param {?} notRelevantDataElments
     * @return {?}
     */
    displayDataElements(notRelevantDataElments) {
        this.DataElements.forEach(de => {
            const /** @type {?} */ deindex = this.DataElements.indexOf(de);
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
    }
}
AssistSimulatorComponent.decorators = [
    { type: Component, args: [{
                selector: 'acr-assist-simulator',
                template: `
    <ng-container *ngIf="(isValid!=true && isValid!= null)">
      <div class="row">
        <div class="col-sm-12 text-center alert alert-danger">
          <ng-container *ngIf="(ErrorCode == 0)">
            {{errorMessage}}. So we are unable to validate XML.
          </ng-container>
          <ng-container *ngIf="(ErrorCode == 1)">
            Selected XML does not meets the XML Schema.
          </ng-container>
        </div>
      </div>
    </ng-container>

    <ng-container *ngIf="(isValid)">
      <ng-container *ngIf="Metadata != undefined">
        <div class="row">
          <div class="col-sm-12 text-center border-0">
            <h4>
              <strong>{{Metadata.Label}} </strong>
            </h4>
          </div>
        </div>
      </ng-container>
      <div class="row content-padding">
        <ng-container *ngIf="globalsService.LoadkeyDiagram != true">
          <div class="col-sm-12 ">
            <ng-container *ngIf="(isValid)">
                <form #form="ngForm" class="form-horizontal">
                <acr-data-element [ValidationBlocks]="ValidationBlocks" [DataElements]="DataElements" [FormValues]="FormValues"></acr-data-element>
              </form>
            </ng-container>
          </div>
        </ng-container>
        <ng-container *ngIf="globalsService.LoadkeyDiagram == true">
          <div class="col-sm-7 ">
            <ng-container *ngIf="(isValid)">
               <form #form="ngForm" class="form-horizontal">
                <acr-data-element [ValidationBlocks]="ValidationBlocks" [DataElements]="DataElements" [FormValues]="FormValues"></acr-data-element>
              </form>
            </ng-container>
          </div>
          <div class="col-sm-5 padding-top-5">
            <div id="myNav">
              <ng-container *ngIf="Metadata != undefined">
                <ng-container *ngIf="globalsService.LoadkeyDiagram == true">
                  <div class="carousel slide" data-ride="carousel" data-interval="false">
                    <!-- Wrapper for slides -->
                    <div class="carousel-inner" role="listbox">
                      <ng-container *ngFor="let diag of Metadata.Diagrams ">
                        <ng-container *ngIf="Metadata.Diagrams.indexOf(diag) == 0">
                          <div class="item active">
                            <img src="{{diag.ImagePath}}">
                          </div>
                        </ng-container>

                        <ng-container *ngIf="Metadata.Diagrams.indexOf(diag) > 0">
                          <div class="item">
                          </div>
                        </ng-container>
                      </ng-container>
                    </div>
                    <ng-container *ngIf="Metadata.Diagrams.length > 1">
                      <!-- Controls -->
                      <a class="left carousel-control" onclick="return false;" href="#carousel-example-generic" role="button" data-slide="prev">
                        <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                      </a>
                      <a class="right carousel-control" onclick="return false;" href="#carousel-example-generic" role="button" data-slide="next">
                        <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                      </a>
                    </ng-container>
                  </div>
                </ng-container>
              </ng-container>
            </div>
          </div>
        </ng-container>
      </div>
      <div class="row">
        <div class="col-sm-12">
          <ng-container >
            <ng-container *ngFor="let block of ExpressionBlocks">
              <acr-expresssion-block [ExpBlock]="block" [FormValues]="FormValues" [DataElements]="DataElements" (onExpressionChanged)="displayDataElements($event)"></acr-expresssion-block>
            </ng-container>
          </ng-container>
        </div>
      </div>
    </ng-container>
  `,
                styles: [`
    .content-padding {
      padding-top: 5px;
      padding-right: 5px;
    }
  `],
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/**
 * @nocollapse
 */
AssistSimulatorComponent.ctorParameters = () => [
    { type: GlobalsService, },
    { type: ChangeDetectorRef, },
];
AssistSimulatorComponent.propDecorators = {
    'templateContent': [{ type: Input },],
    'imagePath': [{ type: Input },],
};

class StringUtilityService {
    /**
     * @param {?} str
     * @return {?}
     */
    isEmpty(str) {
        return str === '';
    }
    /**
     * @param {?} text
     * @return {?}
     */
    cleanText(text) {
        return text.replace(/ /g, '');
    }
}
StringUtilityService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
StringUtilityService.ctorParameters = () => [];

class ComputedElementComponent {
    /**
     * @param {?} stringUtilityService
     */
    constructor(stringUtilityService) {
        this.stringUtilityService = stringUtilityService;
        this.DataElements = {};
        this.FormValues = {};
    }
    /**
     * @param {?} exp
     * @return {?}
     */
    compute(exp) {
        const /** @type {?} */ result = eval(exp);
        this.DataElement.Value = result;
        this.FormValues[this.DataElement.ID] = result;
        return result;
    }
    /**
     * @param {?} textBlocks
     * @return {?}
     */
    textify(textBlocks) {
        let /** @type {?} */ result = '';
        if (textBlocks.constructor.name === 'String') {
            result += textBlocks;
        }
        else if (textBlocks.length > 0) {
            textBlocks.forEach(text => {
                if (text.constructor.name === 'String') {
                    result += text;
                }
                else if (text.constructor.name === 'Object') {
                    result += ' ' + this.FormValues[text.InsertValue.Attr.DataElementId] + ' ';
                }
            });
        }
        this.FormValues[this.DataElement.ID] = result;
        return result;
    }
}
ComputedElementComponent.decorators = [
    { type: Component, args: [{
                selector: 'acr-computed-element',
                template: `
    <ng-container *ngIf="DataElement.Visible && DataElement.ShowValue">
      <div class="form-group" [class.Visible]="(DataElement.Visible && DataElement.ShowValue)">

          <div class="col-sm-3">
              <label class="control-label DEElement" id="{{DataElement.ID}}">
                  {{DataElement.ID}}
              </label>
              <ng-container *ngIf="!stringUtilityService.isEmpty(DataElement.Hint) ">
                  <a>
                      <span class="glyphicon glyphicon-info-sign" data-toggle="tooltip" data-placement="top" title="{{DataElement.Hint}}"></span>
                  </a>
              </ng-container>
          </div>
          <div class="col-sm-6">

              <ng-container *ngFor="let valueBlock of DataElement.ValueBlocks">
                  <acr-value-block [ValueBlock]="valueBlock" [DataElement]="DataElement" [DataElements]="DataElements" [FormValues]="FormValues">
                  </acr-value-block>
              </ng-container>

              <ng-container *ngIf="!stringUtilityService.isEmpty(DataElement.ArithmaticExpression)">
                  <label class="control-label DEElement"> {{compute(DataElement.ArithmaticExpression)}}</label>
              </ng-container>
              <ng-container *ngIf="!stringUtilityService.isEmpty(DataElement.TextExpression)">
                  <label class="control-label DEElement"> {{textify(DataElement.TextExpression)}}</label>
              </ng-container>
          </div>
      </div>

    </ng-container>

    <ng-container *ngIf="!DataElement.ShowValue">
      <ng-container *ngFor="let valueBlock of DataElement.ValueBlocks">
          <acr-value-block [ValueBlock]="valueBlock" [DataElement]="DataElement" [DataElements]="DataElements" [FormValues]="FormValues">

          </acr-value-block>

      </ng-container>

      <ng-container *ngIf="!stringUtilityService.isEmpty(DataElement.ArithmaticExpression)">
          <input type="hidden" [attr.value]="compute(DataElement.ArithmaticExpression)" />
      </ng-container>
      <ng-container *ngIf="!stringUtilityService.isEmpty(DataElement.TextExpression)">
          <input type="hidden" [attr.value]="textify(DataElement.TextExpression)" />
      </ng-container>

    </ng-container>
  `,
                styles: [`

  `]
            },] },
];
/**
 * @nocollapse
 */
ComputedElementComponent.ctorParameters = () => [
    { type: StringUtilityService, },
];
ComputedElementComponent.propDecorators = {
    'DataElement': [{ type: Input },],
    'DataElements': [{ type: Input },],
    'FormValues': [{ type: Input },],
};

class HintDiagramComponent {
}
HintDiagramComponent.decorators = [
    { type: Component, args: [{
                selector: 'acr-hint-diagram',
                template: `
    <button type="button" class="btn btn-default btn-xs" data-toggle="modal" attr.data-target="#{{'diag_'+DataElement.ID}}">
      <span class=" glyphicon glyphicon-cd" aria-hidden="true" data-toggle="tooltip"  data-placement="right" title="Hint Diagrams"></span>

    </button>
    <div class="modal fade adjust-diagram " tabindex="-1" role="dialog" attr.id="{{'diag_'+DataElement.ID}}" aria-labelledby="mySmallModalLabel">
    <div class="modal-dialog modal-lg adjust-diagram-image " role="document">
    <div class="modal-content">
    <div class="modal-header">
    <h4 class="modal-title">
    {{DataElement.Label}}
    </h4>
    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
    </div>



    <div class="carousel slide" data-ride="carousel" data-interval="false">


    <!-- Wrapper for slides -->

    <div class="carousel-inner" role="listbox">
    <ng-container *ngFor="let diag of DataElement.Diagrams ">
    <ng-container *ngIf="DataElement.Diagrams.indexOf(diag) == 0">
    <div class="item active">
    <img src="{{diag.Location}}">
    <!--<div class="carousel-caption">

    </div>-->
    </div>
    </ng-container>

    <ng-container *ngIf="DataElement.Diagrams.indexOf(diag) > 0">
    <div class="item">
    <img src="{{diag.Location}}">
    <!--<div class="carousel-caption">

    </div>-->
    </div>
    </ng-container>

    </ng-container>




    </div>
    <ng-container *ngIf="DataElement.Diagrams.length > 1">
    <!-- Controls -->
    <a class="left carousel-control" onclick="return false;" href="#carousel-example-generic" role="button" data-slide="prev">
    <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
    </a>
    <a class="right carousel-control" onclick="return false;" href="#carousel-example-generic" role="button" data-slide="next">
    <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
    </a>
    </ng-container>
    </div>




    </div>
    </div>
    </div>
  `,
                styles: [`

  `]
            },] },
];
/**
 * @nocollapse
 */
HintDiagramComponent.ctorParameters = () => [];
HintDiagramComponent.propDecorators = {
    'DataElement': [{ type: Input },],
};

class ImageMapComponent {
    constructor() {
        this.$ = require('jquery');
        this.DataElements = {};
        this.FormValues = {};
        this.imageExist = true;
        this.SelectionValue = '';
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        const /** @type {?} */ request = new XMLHttpRequest();
        request.open('HEAD', this.DataElement.ImagePath, false);
        request.send();
        if (request.status === 200) {
            this.imageExist = true;
        }
        else {
            this.imageExist = false;
        }
        this.displayValue('');
    }
    /**
     * @param {?} mouseX
     * @param {?} mouseY
     * @param {?} Coordinates
     * @return {?}
     */
    isInRectangle(mouseX, mouseY, Coordinates) {
        const /** @type {?} */ COArray = Coordinates.split(',');
        if (COArray[0] < mouseX
            && (COArray[0] + COArray[2]) > mouseX
            && COArray[1] < mouseY
            && (COArray[1] + COArray[3]) > mouseY) {
            return true;
        }
        return false;
    }
    /**
     * @param {?} mouseX
     * @param {?} mouseY
     * @param {?} Coordinates
     * @return {?}
     */
    isInCircle(mouseX, mouseY, Coordinates) {
        const /** @type {?} */ COArray = Coordinates.split(',');
        if (Math.sqrt(Math.pow((mouseX - COArray[0]), 2) + Math.pow((mouseY - COArray[1]), 2)) < COArray[2]) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * @param {?} x
     * @param {?} y
     * @param {?} Coordinates
     * @return {?}
     */
    isInPolygon(x, y, Coordinates) {
        const /** @type {?} */ COArray = Coordinates.split(',');
        const /** @type {?} */ vs = [];
        for (let /** @type {?} */ i = 0; i < COArray.length; i++) {
            const /** @type {?} */ point = [];
            point.push(COArray[i]);
            point.push(COArray[i + 1]);
            i += 1;
            vs.push(point);
        }
        let /** @type {?} */ inside = false;
        for (let /** @type {?} */ i = 0, /** @type {?} */ j = vs.length - 1; i < vs.length; j = i++) {
            const /** @type {?} */ xi = vs[i][0], /** @type {?} */ yi = vs[i][1];
            const /** @type {?} */ xj = vs[j][0], /** @type {?} */ yj = vs[j][1];
            const /** @type {?} */ intersect = ((yi > y) !== (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) {
                inside = !inside;
            }
        }
        return inside;
    }
    /**
     * @param {?} e
     * @param {?} dataElement
     * @return {?}
     */
    imageClick(e, dataElement) {
        const /** @type {?} */ $elem = this.$(e.target);
        const /** @type {?} */ N_height = $elem.height();
        const /** @type {?} */ N_width = $elem.width();
        const /** @type {?} */ offset = $elem.offset();
        const /** @type {?} */ offset_t = offset.top - this.$(window).scrollTop();
        const /** @type {?} */ offset_l = offset.left - this.$(window).scrollLeft();
        const /** @type {?} */ x = e.clientX - offset_l;
        const /** @type {?} */ y = e.clientY - offset_t;
        for (const /** @type {?} */ opt of dataElement.ImageOptions) {
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
    }
    /**
     * @param {?} val
     * @return {?}
     */
    setValue(val) {
        this.FormValues[this.DataElement.ID] = val;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    displayValue(val) {
        if (val === '') {
            this.SelectionValue = 'Image Map Diagram';
        }
        else {
            this.SelectionValue = 'Selected Value : ' + val;
        }
    }
}
ImageMapComponent.decorators = [
    { type: Component, args: [{
                selector: 'acr-image-map',
                template: `
    <ng-container *ngIf="DataElement.ImagePath != undefined">

      <div class="row">
        <div class="col-sm-12 text-center">
          OR
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 text-left">
          Select value from image:-
            <button type="button" class="btn btn-default" data-toggle="modal" attr.data-target="#{{'imgMap_Modal_'+DataElement.ID}}">
            <span class="glyphicon glyphicon-picture" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="Image Map"></span>
          </button>
        </div>
      </div>

      <ng-container *ngIf="DataElement.ImagePath != undefined">
        <div class="modal fade img-modal" tabindex="-1" role="dialog" attr.id="{{'imgMap_Modal_'+DataElement.ID}}" aria-labelledby="mySmallModalLabel">
          <div class="modal-dialog modal-lg" role="document" [ngStyle]="{'width':DataElement.ImagePath.width + 30}">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">
                  {{SelectionValue}}
                </h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div class="modal-body">
                <div class="row">
                  <div class="col-md-12">
                    <ng-container *ngIf="imageExist == true">
                      <img class="ImgOption danger" alt="No Image Available!!!" data-dismiss="modal" attr.id="{{'imgMap_Img_'+DataElement.ID}}"
                        (click)="imageClick($event,DataElement);" attr.data-elementID="{{DataElement.ID}}" attr.usemap="#{{'imgMap_'+DataElement.ID}}"
                        src="{{DataElement.ImagePath}}">
                      <map name="{{'imgMap_'+DataElement.ID}}">
                        <ng-container *ngFor="let imgOpt of DataElement.ImageOptions">
                          <area attr.shape="{{imgOpt.Shape}}" attr.imgID="{{'imgMap_Img_'+DataElement.ID}}" attr.coords="{{imgOpt.Coordinates}}" attr.alt="{{imgOpt.Value}}"
                            onmouseover='myHover(this);' onmouseout='myLeave();' (mouseover)='displayValue(imgOpt.Value);' (mouseout)='displayValue("");'
                            (click)="setValue(imgOpt.Value);" data-dismiss="modal">
                        </ng-container>
                      </map>
                    </ng-container>

                    <ng-container *ngIf="imageExist == false">
                      <div class="">
                        No Image Map Available...
                      </div>
                    </ng-container>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ng-container>
    </ng-container>
  `,
                styles: [`

  `]
            },] },
];
/**
 * @nocollapse
 */
ImageMapComponent.ctorParameters = () => [];
ImageMapComponent.propDecorators = {
    'DataElement': [{ type: Input },],
    'DataElements': [{ type: Input },],
    'FormValues': [{ type: Input },],
};

class DataElementComponent {
    /**
     * @param {?} stringUtilityService
     */
    constructor(stringUtilityService) {
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
    itemSelected() {
    }
    /**
     * @param {?} cond
     * @return {?}
     */
    evaluate(cond) {
        return eval(cond);
    }
    /**
     * @param {?} DataElementID
     * @param {?} choiceValue
     * @param {?} event
     * @return {?}
     */
    updateMultichoice(DataElementID, choiceValue, event) {
        let /** @type {?} */ previousValue = this.FormValues[DataElementID];
        if (event.currentTarget.checked) {
            if (previousValue === undefined) {
                previousValue = [];
            }
            previousValue.push(choiceValue);
        }
        else {
            const /** @type {?} */ index = previousValue.indexOf(choiceValue);
            if (index > -1) {
                previousValue.splice(index, 1);
            }
        }
        this.FormValues[DataElementID] = previousValue;
    }
}
DataElementComponent.decorators = [
    { type: Component, args: [{
                selector: 'acr-data-element',
                template: `
    <canvas id='Can-ImgMap'>

    </canvas>
    <ng-container *ngFor="let DataElement of DataElements">



      <ng-container *ngIf="(DataElement.ElementType == 'ComputedElement')">
        <acr-computed-element [DataElement]="DataElement" [DataElements]="DataElements" [FormValues]="FormValues"></acr-computed-element>
      </ng-container>


      <ng-container *ngIf="(DataElement.ElementType == 'ChoiceDataElement' || DataElement.ElementType == 'NumericDataElement' || DataElement.ElementType == 'IntegerDataElement' || DataElement.ElementType == 'MultiChoiceDataElement') ">
        <ng-container *ngIf="DataElement.Visible">
          <div class="form-group " [class.Visible]="DataElement.Visible">
            <div class="col-sm-5 text-left content-padding">
              <label class="control-label DEElement" id="{{DataElement.ID}}">
                {{DataElement.Label}}
              </label>
              <ng-container *ngIf="!stringUtilityService.isEmpty(DataElement.Hint) ">
                <a>
                  <span class="glyphicon glyphicon-info-sign" data-toggle="tooltip" data-placement="right" title="{{DataElement.Hint}}"></span>
                </a>
              </ng-container>
              <ng-container *ngIf="DataElement.Diagrams != undefined ">
                <acr-hint-diagram [DataElement]="DataElement"></acr-hint-diagram>
              </ng-container>
              <ng-container *ngIf="ValidationBlocks.length > 0">
                <ng-container *ngFor="let Block of ValidationBlocks">
                  <ng-container *ngIf="(DataElement.Visible)">
                    <ng-container *ngIf="evaluate(Block.Condition)">
                      <ng-container *ngIf="Block.DataElementID == DataElement.ID">
                        <ng-container *ngIf="Block.Message =='Minimum value required'">
                          <span class="required-field">Minimum Value: {{Block.Minimum}}</span>
                        </ng-container>
                        <ng-container *ngIf="Block.Message != 'Minimum value required'">
                          <span class="required-field">* Required field !!!</span>
                        </ng-container>
                      </ng-container>
                    </ng-container>
                  </ng-container>
                </ng-container>
              </ng-container>
            </div>

            <div class="col-sm-7 text-left content-padding">
              <div class="input-group ">
                <!--Choice DataElements-->
                <ng-container *ngIf="DataElement.ElementType == 'ChoiceDataElement' ">
                  <div class="row">
                    <ng-container *ngIf="DataElement.ChoiceOptions.length == 2">
                      <!-- Full width for radio if Imagepath exist -->
                      <ng-container *ngIf="DataElement.ImagePath != undefined">
                        <div id="radio-inline">
                          <ng-container *ngFor="let choice of DataElement.ChoiceOptions">
                              <div class="row">
                                  <div class="col-sm-12">
                            <label class="rad DEValues">
                              <input type="radio" [(ngModel)]="FormValues[DataElement.ID] " name="FormValues['{{DataElement.ID}}']" value={{choice.Value}}
                                checked style="display:none;">
                              <div  (click)="itemSelected()">
                                <input class="hideInput" type="radio" [(ngModel)]="FormValues[DataElement.ID] " name="FormValues['{{DataElement.ID}}']" value={{choice.Value}}
                                  checked>
                                <span>{{choice.Label}}</span>

                              </div>
                              <div class="clear"></div>
                            </label>
                            </div></div>
                          </ng-container>
                        </div>
                      </ng-container>
                      <!-- Full width for radio if Imagepath does not exist -->
                      <ng-container *ngIf="DataElement.ImagePath == undefined">
                        <div id="radio-inline">
                          <ng-container *ngFor="let choice of DataElement.ChoiceOptions">
                            <div class="row">
                                <div class="col-sm-12">
                                    <label class="rad DEValues">
                                        <input type="radio" [(ngModel)]="FormValues[DataElement.ID] " name="FormValues['{{DataElement.ID}}']" value={{choice.Value}}
                                          checked style="display:none;">
                                        <div  (click)="itemSelected()" >
                                          <input class="hideInput" type="radio" [(ngModel)]="FormValues[DataElement.ID] " name="FormValues['{{DataElement.ID}}']" value={{choice.Value}}
                                            checked>
                                          <span>{{choice.Label}}</span>
                                        </div>

                                      </label>
                                </div>
                            </div>

                          </ng-container>
                        </div>
                      </ng-container>
                    </ng-container>
                    <ng-container *ngIf="DataElement.ChoiceOptions.length != 2">
                      <!-- Dropdown will be created if choice options have more than 5 choices-->
                      <ng-container *ngIf="DataElement.ChoiceOptions.length > 5">
                        <select id="{{DataElement.ID}}" [(ngModel)]="FormValues[DataElement.ID]" (ngModelChange)="itemSelected()">
                          <option [value]="Select">--Select--</option>
                          <option *ngFor="let choice of DataElement.ChoiceOptions" [value]="choice.Value">{{choice.Label}}</option>
                        </select>
                      </ng-container>
                      <!-- Radio button will be created if choice options have are <=5 choices-->
                      <ng-container *ngIf="DataElement.ChoiceOptions.length <= 5">
                        <ng-container *ngFor="let choice of DataElement.ChoiceOptions">
                          <div id="radio-inline">
                              <div class="row">
                                  <div class="col-sm-12">
                                    <label class="rad DEValues">
                                      <input type="radio" [(ngModel)]="FormValues[DataElement.ID] " name="FormValues['{{DataElement.ID}}']" value={{choice.Value}}
                                        checked style="display:none;">
                                      <div  (click)="itemSelected()">
                                        <input class="hideInput" type="radio" [(ngModel)]="FormValues[DataElement.ID] " name="FormValues['{{DataElement.ID}}']" value={{choice.Value}}
                                          checked>
                                        <span>{{choice.Label}}</span>

                                      </div>

                            </label>
                          </div> </div>
                          </div>
                        </ng-container>
                      </ng-container>
                    </ng-container>
                  </div>
                  <!-- imagemap will be displyed here -->
                  <ng-container *ngIf="DataElement.ImagePath != undefined">
                    <div class="row">
                      <acr-image-map [DataElement]="DataElement" [DataElements]="DataElements" [FormValues]="FormValues"></acr-image-map>
                    </div>
                  </ng-container>


                </ng-container>
                <!--Multi Choice DataElements-->
                <ng-container *ngIf="DataElement.ElementType == 'MultiChoiceDataElement' ">
                  <ng-container *ngFor="let choice of DataElement.ChoiceOptions">
                    <div class="checkbox">
                      <label >
                        <input type="checkbox" value={{choice.Value}} (change)="updateMultichoice(DataElement.ID,choice.Value,$event)">
                        <span> {{choice.Label}}</span>
                      </label>
                    </div>
                  </ng-container>
                </ng-container>

                <!--NumericDataElement-->
                <ng-container *ngIf="DataElement.ElementType == 'NumericDataElement' ">
                  <input type="number" [(ngModel)]="FormValues[DataElement.ID]" class="form-control" name="FormValues['{{DataElement.ID}}']"
                    (keypress)="itemSelected()">
                </ng-container>
              </div>
            </div>
          </div>
        </ng-container>
      </ng-container>
    </ng-container>
  `,
                styles: [`
    .content-padding {
      padding-top: 5px;
      padding-right: 5px;
    }
  `]
            },] },
];
/**
 * @nocollapse
 */
DataElementComponent.ctorParameters = () => [
    { type: StringUtilityService, },
];
DataElementComponent.propDecorators = {
    'DataElements': [{ type: Input },],
    'FormValues': [{ type: Input },],
    'ValidationBlocks': [{ type: Input },],
};

class ExpresssionBlockComponent {
    /**
     * @param {?} globalsService
     */
    constructor(globalsService) {
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
    validate(cond) {
        if (cond === '') {
            return false;
        }
        return eval(cond);
    }
    /**
     * @param {?} cond
     * @param {?} notRelevantDataElments
     * @return {?}
     */
    evaluate(cond, notRelevantDataElments) {
        if (cond === '') {
            return false;
        }
        const /** @type {?} */ result = eval(cond);
        if (result && this.globalsService.evaluateExpessions) {
            this.onExpressionChanged.emit(this.ExpBlock.NotRelavantDataElements);
        }
        return result;
    }
}
ExpresssionBlockComponent.decorators = [
    { type: Component, args: [{
                selector: 'acr-expresssion-block',
                template: `


        <ng-container *ngIf="!validate(ExpBlock.ValidationCondition)">

             <ng-container *ngIf="evaluate(ExpBlock.Condition, ExpBlock.NotRelavantDataElements)">
              <ng-container *ngIf="(ExpBlock.Result != undefined)">
              <acr-expression-result [DataElements]="DataElements" [ExpBlock]="ExpBlock" [Result]="ExpBlock.Result" [FormValues]="FormValues"></acr-expression-result>
             </ng-container>

            <ng-container *ngIf="ExpBlock.NestedBlocks.length > 0">
              <ng-container *ngFor="let NestedBlock of ExpBlock.NestedBlocks">
                    <acr-expresssion-block [ExpBlock]="NestedBlock" [FormValues]="FormValues" [DataElements]="DataElements" ></acr-expresssion-block>
              </ng-container>
            </ng-container>
          </ng-container>

          <ng-container *ngIf="ExpBlock.ElseBlocks.length > 0">
            <ng-container *ngIf="!evaluate(ExpBlock.Condition,ExpBlock.NotRelavantDataElements)">
              <ng-container *ngFor="let ElseBlock of ExpBlock.ElseBlocks">
               <acr-expresssion-block [ExpBlock]="ElseBlock" [FormValues]="FormValues" [DataElements]="DataElements"> </acr-expresssion-block>
              </ng-container>
            </ng-container>
          </ng-container>
        </ng-container>
  `,
                styles: [`

  `]
            },] },
];
/**
 * @nocollapse
 */
ExpresssionBlockComponent.ctorParameters = () => [
    { type: GlobalsService, },
];
ExpresssionBlockComponent.propDecorators = {
    'FormValues': [{ type: Input },],
    'ExpBlock': [{ type: Input },],
    'DataElements': [{ type: Input },],
    'onExpressionChanged': [{ type: Output },],
};

class ValueBlockComponent {
    /**
     * @param {?} globalsService
     */
    constructor(globalsService) {
        this.globalsService = globalsService;
        this.DataElements = {};
        this.FormValues = {};
    }
    /**
     * @param {?} exp
     * @return {?}
     */
    evaluate(exp) {
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
        const /** @type {?} */ result = eval(exp);
        if (result) {
            const /** @type {?} */ temp = this.globalsService.ComputedElementConditions[this.DataElement.ID];
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
    }
    /**
     * @param {?} exp
     * @return {?}
     */
    validate(exp) {
        if (exp === '') {
            return false;
        }
        return eval(exp);
    }
    /**
     * @param {?} exp
     * @return {?}
     */
    compute(exp) {
        const /** @type {?} */ result = eval(exp);
        this.DataElement.Value = result;
        this.FormValues[this.DataElement.ID] = result;
        return result;
    }
    /**
     * @param {?} textBlocks
     * @return {?}
     */
    textify(textBlocks) {
        let /** @type {?} */ res = '';
        if (textBlocks.constructor.name === 'String') {
            res += textBlocks;
        }
        else if (textBlocks.length > 0) {
            textBlocks.forEach(text => {
                if (text.constructor.name === 'String') {
                    res += text;
                }
                else if (text.constructor.name === 'Object') {
                    res += ' ' + this.FormValues[text.InsertValue.Attr.DataElementId] + ' ';
                }
            });
        }
        this.FormValues[this.DataElement.ID] = res;
        return res;
    }
}
ValueBlockComponent.decorators = [
    { type: Component, args: [{
                selector: 'acr-value-block',
                template: `
    <ng-container *ngIf="!validate(ValueBlock.ValidationCondition)">
      <ng-container *ngIf="evaluate(ValueBlock.Condition)">
          <ng-container *ngIf="ValueBlock.ArithmeticExpression !=''">
              <ng-container *ngIf="DataElement.ShowValue">
                  <label class="control-label DEElement">  {{compute(ValueBlock.ArithmeticExpression)}}</label>
              </ng-container>
              <ng-container *ngIf="!DataElement.ShowValue">
                  <input type="hidden"   [attr.value]="compute(ValueBlock.ArithmeticExpression)" />
              </ng-container>
          </ng-container>
          <ng-container *ngIf="ValueBlock.TextExpression !== '' && ValueBlock.TextExpression !=undefined ">
              <ng-container *ngIf="DataElement.ShowValue">
                  <label class="control-label DEElement">  {{textify(ValueBlock.TextExpression)}}</label>
              </ng-container>
              <ng-container *ngIf="!DataElement.ShowValue">
                  <input type="hidden"   [attr.value]="textify(ValueBlock.TextExpression)" />
              </ng-container>
          </ng-container>
          <ng-container *ngIf="ValueBlock.NestedBlocks.length > 0">
              <ng-container *ngFor="let NestedBlock of ValueBlock.NestedBlocks">
                  <acr-value-block [ValueBlock]="NestedBlock" [DataElement]="DataElement" [DataElements]="DataElements" [FormValues]="FormValues"></acr-value-block>
              </ng-container>
          </ng-container>
      </ng-container>

      <ng-container *ngIf="ValueBlock.ElseBlocks.length > 0">
          <ng-container *ngIf="!evaluate(ValueBlock.Condition)">
              <ng-container *ngFor="let ElseBlock of ValueBlock.ElseBlocks">
                  <acr-value-block [ValueBlock]="ElseBlock" [DataElement]="DataElement" [DataElements]="DataElements" [FormValues]="FormValues"></acr-value-block>
              </ng-container>
          </ng-container>
      </ng-container>
    </ng-container>
  `,
                styles: [`

  `]
            },] },
];
/**
 * @nocollapse
 */
ValueBlockComponent.ctorParameters = () => [
    { type: GlobalsService, },
];
ValueBlockComponent.propDecorators = {
    'ValueBlock': [{ type: Input },],
    'DataElement': [{ type: Input },],
    'DataElements': [{ type: Input },],
    'FormValues': [{ type: Input },],
};

class ExpressionResultComponent {
    constructor() {
        this.FormValues = {};
        this.DataElements = [];
        this.sectionResult = '';
        this.selectedSection = '';
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.Result.ReportSections.length > 0) {
            this.selectedSection = this.Result.ReportSections[0].Heading;
        }
    }
    /**
     * @return {?}
     */
    getResultText() {
        const /** @type {?} */ res = {};
        for (const /** @type {?} */ section of this.Result.ReportSections) {
            const /** @type {?} */ sectionResult = this.generateSectionResult(section);
            res[sectionResult.Heading] = sectionResult.ReportText;
        }
        return res;
    }
    /**
     * @param {?} reportSection
     * @return {?}
     */
    generateSectionResult(reportSection) {
        const /** @type {?} */ reportText = this.textifyReportText(reportSection.ReportTexts);
        return { 'Heading': reportSection.Heading, 'ReportText': reportText };
    }
    /**
     * @param {?} reportTexts
     * @return {?}
     */
    textifyReportText(reportTexts) {
        let /** @type {?} */ res = '';
        for (const /** @type {?} */ reportText of reportTexts) {
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
    }
    /**
     * @param {?} cond
     * @return {?}
     */
    evaluate(cond) {
        if (cond === '') {
            return false;
        }
        const /** @type {?} */ res = eval(cond);
        return res;
    }
}
ExpressionResultComponent.decorators = [
    { type: Component, args: [{
                selector: 'acr-expression-result',
                template: `
    <div class="panel panel-default">

      <div class="panel-heading text-left">
        Report Text: <select id="ddlSections" (change)="generateReportText()" [(ngModel)]="selectedSection">
          <ng-container *ngFor="let Section of Result.ReportSections">
            <option [value]="Section.Heading" [selected]="Section.Heading == 'findings'">{{Section.Heading}}</option>
          </ng-container>
        </select>
      </div>
    </div>
    <div>
      <ng-container *ngFor="let Section of Result.ReportSections">
        <ng-container *ngIf="selectedSection == Section.Heading">
          <acr-report-text [ReportTexts]="Section.ReportTexts" [FormValues]="FormValues"></acr-report-text>
        </ng-container>
      </ng-container>
    </div>
  `,
                styles: [`

  `]
            },] },
];
/**
 * @nocollapse
 */
ExpressionResultComponent.ctorParameters = () => [];
ExpressionResultComponent.propDecorators = {
    'ExpBlock': [{ type: Input },],
    'Result': [{ type: Input },],
    'FormValues': [{ type: Input },],
    'DataElements': [{ type: Input },],
};

class ReportTextComponent {
    constructor() {
        this.FormValues = {};
        this.ReportTexts = [];
    }
    /**
     * @param {?} cond
     * @return {?}
     */
    evaluate(cond) {
        if (cond === '') {
            return false;
        }
        return eval(cond);
    }
    /**
     * @param {?} dataElementID
     * @return {?}
     */
    InsertValue(dataElementID) {
        if (Array.isArray(this.FormValues[dataElementID])) {
            return this.FormValues[dataElementID].join(', ');
        }
        return this.FormValues[dataElementID];
    }
}
ReportTextComponent.decorators = [
    { type: Component, args: [{
                selector: 'acr-report-text',
                template: `
    <ng-container *ngFor="let ReportText of ReportTexts">
      <ng-container *ngIf="ReportText.ResultText != ''">
        <div >
          <label> {{ReportText.ResultText}} </label>
        </div>
      </ng-container>
      <ng-container *ngIf="ReportText.DataElementID != ''">
        <div >
          <label> {{InsertValue(ReportText.DataElementID)}} </label>
        </div>
        <br/>
      </ng-container>

      <ng-container *ngIf="ReportText.Condition != ''">
        <ng-container *ngIf="evaluate(ReportText.Condition)">
          <acr-report-text [ReportTexts]="ReportText.NestedReportText" [FormValues]="FormValues"></acr-report-text>
        </ng-container>
      </ng-container>

      <ng-container *ngIf="ReportText.Condition == ''">
        <acr-report-text [ReportTexts]="ReportText.NestedReportText" [FormValues]="FormValues"></acr-report-text>
      </ng-container>
    </ng-container>
  `,
                styles: [`

  `]
            },] },
];
/**
 * @nocollapse
 */
ReportTextComponent.ctorParameters = () => [];
ReportTextComponent.propDecorators = {
    'FormValues': [{ type: Input },],
    'ReportTexts': [{ type: Input },],
};

class SettingsService {
    constructor() {
        this.loadkeyDiagram = true;
    }
}
SettingsService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
SettingsService.ctorParameters = () => [];

const components = [AssistSimulatorComponent, ComputedElementComponent, HintDiagramComponent,
    ImageMapComponent, DataElementComponent, ExpresssionBlockComponent,
    ValueBlockComponent, ExpressionResultComponent, ReportTextComponent];
class SimulatorModule {
}
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
SimulatorModule.ctorParameters = () => [];

class FileDetails {
    /**
     * @param {?} fileName
     * @param {?} fileContents
     */
    constructor(fileName, fileContents) {
        this.fileName = fileName;
        this.fileContents = fileContents;
    }
}

class FileUploadLoaderComponent {
    constructor() {
        this.onFileContentRead = new EventEmitter();
        this.fileReader = new FileReader();
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    changeListener($event) {
        this.readThis($event.target);
    }
    /**
     * @param {?} inputValue
     * @return {?}
     */
    readThis(inputValue) {
        this.readFile = inputValue.files[0];
        const /** @type {?} */ self = this;
        this.fileReader.onloadend = (e) => {
            self.onFileContentRead.emit(new FileDetails(self.readFile.name, this.fileReader.result));
        };
        this.fileReader.readAsText(this.readFile);
    }
}
FileUploadLoaderComponent.decorators = [
    { type: Component, args: [{
                selector: 'acr-file-upload-loader',
                template: `
    <div class = "row">
      <div class= "col-sm-12">
          <div class="panel panel-default">
              <div class="panel-heading">Select  the Template file</div>
              <div class="panel-body">
                  <div class="row">
                        <div class="col-sm-6"> Select the file to be uploaded</div>
                        <div class="col-sm-6"><input type="file" accept=".xml" (change)="changeListener($event)"></div>
                  </div>
              </div>
            </div>
      </div>
    </div>
  `,
                styles: [`

  `]
            },] },
];
/**
 * @nocollapse
 */
FileUploadLoaderComponent.ctorParameters = () => [];
FileUploadLoaderComponent.propDecorators = {
    'onFileContentRead': [{ type: Output },],
};

const components$1 = [FileUploadLoaderComponent];
class SimulatorLoaderModule {
}
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
SimulatorLoaderModule.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { SimulatorModule, SimulatorLoaderModule, AssistSimulatorComponent as ɵa, ComputedElementComponent as ɵc, DataElementComponent as ɵg, ExpressionResultComponent as ɵj, ExpresssionBlockComponent as ɵh, HintDiagramComponent as ɵe, ImageMapComponent as ɵf, ReportTextComponent as ɵk, GlobalsService as ɵb, SettingsService as ɵl, StringUtilityService as ɵd, ValueBlockComponent as ɵi, FileUploadLoaderComponent as ɵm };
//# sourceMappingURL=Simulator.js.map
