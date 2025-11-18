// src/store/slices/uiSlice.ts

import { createSlice, type PayloadAction } from '@reduxjs/toolkit'; // <-- PERBAIKAN DI SINI
import type { RootState } from '../store';

interface UIState {
  filterCategory: string;
  searchTerm: string;
}

const initialState: UIState = {
  filterCategory: 'all', // 'all' sebagai nilai default
  searchTerm: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setFilterCategory(state, action: PayloadAction<string>) {
      state.filterCategory = action.payload;
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
  },
});

export const { setFilterCategory, setSearchTerm } = uiSlice.actions;

export default uiSlice.reducer;

// Selector
export const selectFilters = (state: RootState) => state.ui;