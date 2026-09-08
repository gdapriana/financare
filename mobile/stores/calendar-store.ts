import { create } from 'zustand';

type CalendarStateType = {
  selectedDateKey: string | null;
  selectDate: (dateKey: string) => void;
  clearSelectedDate: () => void;
};

export const useCalendarStore = create<CalendarStateType>((set) => ({
  selectedDateKey: null,
  selectDate: (dateKey) => {
    set({ selectedDateKey: dateKey });
  },
  clearSelectedDate: () => {
    set({ selectedDateKey: null });
  },
}));
