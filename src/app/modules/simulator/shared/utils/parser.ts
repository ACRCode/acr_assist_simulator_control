export class Parser {

     private stringParser: any = require('string');


    // jsondata={};
    parseToJson(xmlData: string): JSON {
        let jsonResult: JSON;
        xmlData = this.CleanUp(xmlData);
        const xmlParser = require('xml2js').parseString;
        xmlParser(xmlData, function (err, result) {
          jsonResult = result;
        });
        return jsonResult;
    }

    public IsJsonString(str: string) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }



    CleanUp(xmlstr: string) {
        xmlstr = xmlstr.replace(/<!--[\s\S]*?-->/g, ''); // remove commented lines
        xmlstr = xmlstr.replace(/\n|\t|\r/g, ' ');  // replace special characters
        xmlstr = xmlstr.replace(/ {1,}<|\t{1,}</g, '<'); // replace leading spaces and tabs
        xmlstr = xmlstr.replace(/> {1,}|>\t{1,}/g, '>'); // replace trailing spaces and tabs
        xmlstr = xmlstr.replace(/<\?[^>]*\?>/g, ''); // delete docType tags
        xmlstr = xmlstr.replace(/\"/g, '"');



        let dataElements = this.stringParser(xmlstr).between('<DataElements>', '</DataElements>').s;
        const tempDataElements = dataElements;

        dataElements = this.CleanUpTextTemplate(dataElements);
        xmlstr = xmlstr.replace(tempDataElements, dataElements);

        let endPoints = this.stringParser(xmlstr).between('<EndPoints>', '</EndPoints>').s;
        const tempEndPoints = endPoints;
        endPoints = this.CleanUpTemplatePartials(endPoints);
        endPoints = this.CleanUpReportText(endPoints, '<ReportText SectionId="findings">', '<ReportText SectionId=\'findings\'>');
        endPoints = this.CleanUpReportText(endPoints, '<ReportText SectionId="impression">', '<ReportText SectionId=\'impression\'>');
        endPoints = this.CleanUpReportText(endPoints, '<ReportText SectionId="recommendation">',
                                                '<ReportText SectionId=\'recommendation\'>');
        return xmlstr.replace(tempEndPoints, endPoints);

    }

    CleanUpTextTemplate(source: string) {

        const startMatch = '<TextExpression>';
        const endMatch = '</TextExpression>';
        if (this.stringParser(source).contains(startMatch)) {
            const str1 = this.stringParser(source).between('', startMatch).s + startMatch;
            const temp = this.stringParser(source).between(str1).s;
            const str2 = this.stringParser(temp).between('', endMatch).s;
            const _str2 = str2;
            const morphedText = this.MorphReportText(str2);
            let newText = str1 + morphedText;
            const str3 = this.stringParser(temp).between(_str2);
            if (str3 !== '') {
                newText += this.CleanUpTextTemplate(str3);
            }
            return newText;
        }
        return source;
    }


    CleanUpReportText(source: string, match1: string, match2?: string) {

        if (!(this.stringParser(source).contains(match1) || this.stringParser(source).contains(match2))) {
          return source;
        }

        const match = this.stringParser(source).contains(match1) ? match1 : match2;
        const reportTextClosing = '</ReportText>';

        const str1 = this.stringParser(source).between('', match).s + match;
        const temp = this.stringParser(source).between(str1).s;
        const str2 = this.stringParser(temp).between('', reportTextClosing).s;

        // TODO : Verify this logic
        const _str2 = str2;
        const morphedText = this.MorphReportText(str2);
        let newText = str1 + morphedText;
        const str3 = this.stringParser(temp).between(_str2);
        if (str3 !== '') {
            newText += this.CleanUpReportText(str3, match);
       }
       return newText;


    }

    CleanUpTemplatePartials(source: string) {
        const match = '<TemplatePartial';
        const templatePartialClosing = '</TemplatePartial>';
        if (this.stringParser(source).contains(match)) {
            const templateTagElement = match + this.stringParser(source).between(match, '>') + '>';
            const str1 = this.stringParser(source).between('', templateTagElement) + templateTagElement;
            const str2 = this.stringParser(source).between(templateTagElement, templatePartialClosing);
            const str3 = this.stringParser(source).between(templatePartialClosing);
            const morphedText = this.MorphReportText(str2);
            return str1 + morphedText + templatePartialClosing + this.CleanUpTemplatePartials(str3);
        } else {
            return source;
        }
    }

    MorphReportText(str2: string) {

        const text = [];
        while (str2.trim() !== '') {
            if (this.stringParser(str2).startsWith('<SectionIf') || this.stringParser(str2).startsWith('<SectionIfNot') ||
            this.stringParser(str2).startsWith('<SectionIfValue') || this.stringParser(str2).startsWith('<SectionIfValueNot')) {
                const temp = str2;
                const sectionContent = this.stringParser(str2).between('', '>') + '>';
                const newStr2 = str2.replace(sectionContent, '');
                const morphedText = '<Text>' + sectionContent + this.MorphReportText(newStr2);
                text.push(morphedText);
                str2 = this.stringParser(str2).between(temp).s;
            } else if (this.stringParser(str2).startsWith('</SectionIf>')) {
                text.push('</SectionIf>' + '</Text>');
                str2 = this.stringParser(str2).between('</SectionIf>').s;
            } else if (this.stringParser(str2).startsWith('</SectionIfNot>')) {
                text.push('</SectionIfNot>' + '</Text>');
                str2 = this.stringParser(str2).between('</SectionIfNot>').s;
            } else if (this.stringParser(str2).startsWith('</SectionIfValue>')) {
                text.push('</SectionIfValue>' + '</Text>');
                str2 = this.stringParser(str2).between('</SectionIfValue>').s;
            } else if (this.stringParser(str2).startsWith('</SectionIfValueNot>')) {
                text.push('</SectionIfValueNot>' + '</Text>');
                str2 = this.stringParser(str2).between('</SectionIfValueNot>').s;
            } else if (this.stringParser(str2).startsWith('<')) {
                const temp = this.stringParser(str2).between('', '>') + '>';
                text.push('<Text>' + temp + '</Text>');
                str2 = this.stringParser(str2).between(temp).s;
            } else {
                let temp = str2;
                if (str2.indexOf('<') !== -1) {
                  temp = this.stringParser(str2).between('', '<');
                }
                text.push('<Text>' + temp + '</Text>');
                str2 = str2.replace(temp, '');

            }
        }

        return text.join(' ');
    }

    GetSubstring(xmlstr: string, startString: string, endString: string) {
        const startIndex = xmlstr.indexOf(startString) + startString.length;
        const endIndex = xmlstr.indexOf(endString);
        return xmlstr.substring(startIndex, endIndex);
    }

    occurrences(string, subString, allowOverlapping) {
        string += '';
        subString += '';
        if (subString.length <= 0) {
          return (string.length + 1);
        }

        let n = 0, pos = 0;
        const step = allowOverlapping ? 1 : subString.length;
        while (true) {
            pos = string.indexOf(subString, pos);
            if (pos >= 0) {
                ++n;
                pos += step;
            } else  {
              break;
            }
        }
        return n;
    }

}


