
declare var validateXML: any;

export class SchemaValidator {


    private getXMLSchema() {
        return document.getElementById('xmlSchema').innerText;
    }

    Validate(xmlFileName: string, xmlString: String) {
        xmlFileName = xmlFileName.indexOf('.xml') !== -1 ? xmlFileName : xmlFileName + '.xml';
       xmlString = xmlString.replace(/<\?[^>]*\?>/g, ''); // delete docType tags
        const schema = this.getXMLSchema().replace(/<\?[^>]*\?>/g, '');
        const Module = {
            xml: xmlString,
            schema: schema,
             arguments: ['--noout', '--schema', 'ACRAssistSchema.xsd', xmlFileName]
        };
        const validationResult = validateXML(Module);
        const successMSG = xmlFileName + ' validates';
        if (this.cleanUpResult(validationResult) === this.cleanUpResult(successMSG)) {
            return { Result: true, ErrorMessage: '' };
        }
        // tslint:disable-next-line:one-line
        else {
            return { Result: false, ErrorMessage: validationResult };
        }
    }


    cleanUpResult(res) {
        return res.replace('\n', '').replace(' ', '');
    }

}
