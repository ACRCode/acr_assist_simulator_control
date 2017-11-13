export class Parser {
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
            JSON.parse(str);
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
function Parser_tsickle_Closure_declarations() {
    /** @type {?} */
    Parser.prototype.stringParser;
}
//# sourceMappingURL=parser.js.map