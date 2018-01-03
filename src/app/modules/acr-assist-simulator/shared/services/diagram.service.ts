import { Injectable } from '@angular/core';
import { Diagram } from '../../../core/models/diagram.model';

@Injectable()
export class DiagramService {

  private isArray(item: any): boolean {
    if (item.length)  {
      return true;
    } else {
        return false;
    }
  }

  private  returnDiagram(diagramJSON: any ): Diagram {

    const diagram = new Diagram();

    if ( diagramJSON.Attr)  {
      diagram.displaySequence = diagramJSON.Attr.DisplaySequence;
      diagram.keyDiagram = diagramJSON.Attr.KeyDiagram ?  diagramJSON.Attr.KeyDiagram : false;
    } else {
      diagram.displaySequence = undefined;
      diagram.keyDiagram = false;
    }
    diagram.label = diagramJSON.Label;
    diagram.location = diagramJSON.Location;
    return diagram;
  }

  returnDiagrams(diagramsAsJSON: any): Diagram[] {
    const diagrams = new Array<Diagram>();
    if (diagramsAsJSON !== undefined) {
         if (this.isArray(diagramsAsJSON)) {
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
