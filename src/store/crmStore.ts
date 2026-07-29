import { create } from 'zustand';

interface CrmFilters {
  search: string;
  stage: string;
  tag: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface CrmState {
  selectedLeads: string[];
  filters: CrmFilters;
  toggleSelectLead: (leadId: string) => void;
  selectAllLeads: (leadIds: string[]) => void;
  clearSelectedLeads: () => void;
  setFilters: (newFilters: Partial<CrmFilters>) => void;
  clearFilters: () => void;
}

export const useCrmStore = create<CrmState>((set) => ({
  selectedLeads: [],
  filters: {
    search: '',
    stage: '',
    tag: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  },
  
  toggleSelectLead: (leadId) => set((state) => {
    const selected = state.selectedLeads.includes(leadId)
      ? state.selectedLeads.filter(id => id !== leadId)
      : [...state.selectedLeads, leadId];
    return { selectedLeads: selected };
  }),
  
  selectAllLeads: (leadIds) => set({ selectedLeads: leadIds }),
  clearSelectedLeads: () => set({ selectedLeads: [] }),
  
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),
  
  clearFilters: () => set({
    filters: {
      search: '',
      stage: '',
      tag: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }
  })
}));
