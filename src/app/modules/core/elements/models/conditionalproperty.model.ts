import { NotRelevantDataElements } from '../../models/notrelevantdataelements.model';
import { CompositeCondition } from '../../composite-condition';
import { Condition } from '../../condition';

export class ConditionalProperty {
    notRelevantDataElements: NotRelevantDataElements;
    compositeCondition: CompositeCondition;
    condition: Condition;
    isRelevant: boolean;
    isRequired: boolean;
    DisplaySequence: number;
    ChoiceNotRelevant: string[];
    Minimum: number;
    Maximum: number;
    MinimumDay: number;
    MaximumDay: number;
    MinimumHours: number;
    MaximumHours: number;
    MinimumMinutes: number;
    MaxmimumMinutes: number;
    showKeyDiagram: string;
}
