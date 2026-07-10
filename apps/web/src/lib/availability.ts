export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type Slot = 'morning' | 'afternoon' | 'evening';
export type WeeklyAvailability = Record<WeekDay, Slot[]>;
