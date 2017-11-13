import { OnInit } from '@angular/core';
import { ExpressionBlock } from '../shared/models/expression-block.model';
import { EndPoint } from '../shared/models/endpoint.model';
import { DataElement } from '../shared/models/data-element.model';
export declare class ExpressionResultComponent implements OnInit {
    ExpBlock: ExpressionBlock;
    Result: EndPoint;
    FormValues: Object;
    DataElements: DataElement[];
    sectionResult: string;
    selectedSection: string;
    result: string;
    ngOnInit(): void;
    getResultText(): {};
    generateSectionResult(reportSection: any): {
        'Heading': any;
        'ReportText': string;
    };
    textifyReportText(reportTexts: any): string;
    evaluate(cond: any): any;
}
