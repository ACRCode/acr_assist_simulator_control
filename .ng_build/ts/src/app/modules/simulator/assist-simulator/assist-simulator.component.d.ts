import { OnInit, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { DataElement } from '../shared/models/data-element.model';
import { GlobalsService } from '../shared/services/globals.service';
import { ExpressionBlock } from '../shared/models/expression-block.model';
import { Metadata } from '../shared/models/metadata.model';
export declare class AssistSimulatorComponent implements OnInit, OnChanges {
    private globalsService;
    private cd;
    templateContent: string;
    imagePath: string;
    errorMessage: string;
    ErrorCode: number;
    FormValues: Object;
    ExpressionBlocks: ExpressionBlock[];
    isValid: boolean;
    DataElements: DataElement[];
    FormChanged: boolean;
    BaseFormValues: Object;
    ValidationBlocks: any;
    DataElementObj: any;
    Metadata: Metadata;
    constructor(globalsService: GlobalsService, cd: ChangeDetectorRef);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnInit(): void;
    resetData(): void;
    processData(): void;
    displayDataElements(notRelevantDataElments: any): void;
}
