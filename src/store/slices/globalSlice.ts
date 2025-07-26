import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  isAllPermissionsGranted: false,
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setPermissionState: (
      state, 
      action: PayloadAction<boolean>
    ) => {
        state.isAllPermissionsGranted = action.payload;
    }
  },
});

export const { setPermissionState }= globalSlice.actions;

export default globalSlice.reducer;