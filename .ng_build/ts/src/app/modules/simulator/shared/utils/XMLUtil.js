import { DataElement } from '../models/data-element.model';
import { Metadata } from '../models/metadata.model';
import { Diagram } from '../models/diagram.model';
import { ChoiceOption } from '../models/choice-option.model';
import { ImageOption } from '../models/image-option.model';
import { MetadataDiagram } from '../models/metadata-diagram.model';
import { EndPoint } from '../models/endpoint.model';
import { ReportSection } from '../models/report-section.model';
import { ReportText } from '../models/report-text.model';
import { ExpressionBlock } from '../models/expression-block.model';
import { Parser } from './parser';
export class XMLUtil {
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
        const /** @type {?} */ Expressions = [];
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
        let /** @type {?} */ RElementLabel;
        let /** @type {?} */ TextCondition = '';
        const /** @type {?} */ LElement = 'this.FormValues[\'' + attr.DataElementId + '\']';
        LElementLabel = this.DataElementsObj[attr.DataElementId].Label;
        RElementLabel = attr.ComparisonValue;
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
function XMLUtil_tsickle_Closure_declarations() {
    /** @type {?} */
    XMLUtil.prototype.DataElements;
    /** @type {?} */
    XMLUtil.prototype.DataElementsObj;
    /** @type {?} */
    XMLUtil.prototype.Acronyms;
    /** @type {?} */
    XMLUtil.prototype.xmlFileJSON;
    /** @type {?} */
    XMLUtil.prototype.templateDetails;
    /** @type {?} */
    XMLUtil.prototype.TemplatePartials;
    /** @type {?} */
    XMLUtil.prototype.ExpressionBlocks;
    /** @type {?} */
    XMLUtil.prototype.Endpoints;
    /** @type {?} */
    XMLUtil.prototype.NewEndPoints;
    /** @type {?} */
    XMLUtil.prototype.ValidationBlocks;
    /** @type {?} */
    XMLUtil.prototype.ValidationBlocksObj;
    /** @type {?} */
    XMLUtil.prototype.FormValues;
    /** @type {?} */
    XMLUtil.prototype.Metadata;
}
//# sourceMappingURL=XMLUtil.js.map