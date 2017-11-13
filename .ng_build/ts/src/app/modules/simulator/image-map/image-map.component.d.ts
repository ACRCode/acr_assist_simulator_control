import { OnInit } from '@angular/core';
import { DataElement } from '../shared/models/data-element.model';
export declare class ImageMapComponent implements OnInit {
    $: any;
    DataElement: DataElement;
    DataElements: Object;
    FormValues: Object;
    imageExist: boolean;
    SelectionValue: string;
    ngOnInit(): void;
    isInRectangle(mouseX: any, mouseY: any, Coordinates: any): boolean;
    isInCircle(mouseX: any, mouseY: any, Coordinates: any): boolean;
    isInPolygon(x: any, y: any, Coordinates: any): boolean;
    imageClick(e: any, dataElement: any): void;
    setValue(val: any): void;
    displayValue(val: any): void;
}
