import { BaseDataElement } from './base-data-element.model';

export class DurationDataElement extends BaseDataElement {
    MinimumDay: number;
    MaximumDay: number;
    MinimumHours: number;
    MaximumHours: number;
    MinimumMinutes: number;
    MaxmimumMinutes: number;

    MinimumDayOverrider: number;
    MaximumDayOverrider: number;
    MinimumHoursOverrider: number;
    MaximumHoursOverrider: number;
    MinimumMinutesOverrider: number;
    MaxmimumMinutesOverrider: number;
}
