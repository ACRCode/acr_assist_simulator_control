import { Injectable } from '@angular/core';
import { Diagram } from 'testruleengine/Library/Models/Class';
import { ArrayCheckerService } from './array-checker.service';

@Injectable()
export class DiagramService {

 constructor(private arrayCheckerSeviceService: ArrayCheckerService) {

 }

private  returnDiagram(diagramJSON: any ): Diagram {

    const diagram = new Diagram();

    if ( diagramJSON.Attr)  {
      diagram.displaySequence = diagramJSON.Attr.DisplaySequence;
      diagram.keyDiagram = diagramJSON.Attr.IsKeyDiagram ?  diagramJSON.Attr.IsKeyDiagram : false;
    } else {
      diagram.displaySequence = undefined;
      diagram.keyDiagram = false;
    }
    diagram.label = diagramJSON.Label;
    diagram.location = diagramJSON.Location;
    diagram.id = diagramJSON.Id;
    return diagram;
  }

  returnDiagrams(diagramsAsJSON: any): Diagram[] {
    const diagrams = new Array<Diagram>();
    if (diagramsAsJSON !== undefined) {
         if (this.arrayCheckerSeviceService.isArray(diagramsAsJSON)) {
          for (const diagram of diagramsAsJSON) {
            diagrams.push(this.returnDiagram(diagram));
        }
      } else {
          diagrams.push(this.returnDiagram(diagramsAsJSON));
      }
   }
   return diagrams;
  }

}
