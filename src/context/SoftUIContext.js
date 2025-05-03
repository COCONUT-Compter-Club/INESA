'use client';

import { createContext, useContext, useReducer } from 'react';

// Buat konteks
const SoftUIContext = createContext();

// Reducer untuk mengelola state
const initialState = {
  miniSidenav: false,
  transparentSidenav: false,
  sidenavColor: 'info',
  transparentNavbar: true,
  fixedNavbar: true,
  openConfigurator: false,
  direction: 'ltr',
  layout: 'dashboard',
};

function softUIReducer(state, action) {
  switch (action.type) {
    case 'MINI_SIDENAV':
      return { ...state, miniSidenav: action.value };
    case 'TRANSPARENT_SIDENAV':
      return { ...state, transparentSidenav: action.value };
    case 'SIDENAV_COLOR':
      return { ...state, sidenavColor: action.value };
    case 'TRANSPARENT_NAVBAR':
      return { ...state, transparentNavbar: action.value };
    case 'FIXED_NAVBAR':
      return { ...state, fixedNavbar: action.value };
    case 'OPEN_CONFIGURATOR':
      return { ...state, openConfigurator: action.value };
    case 'DIRECTION':
      return { ...state, direction: action.value };
    case 'LAYOUT':
      return { ...state, layout: action.value };
    default:
      return state;
  }
}

// Provider untuk konteks
export function SoftUIProvider({ children }) {
  const [controller, dispatch] = useReducer(softUIReducer, initialState);

  return (
    <SoftUIContext.Provider value={[controller, dispatch]}>
      {children}
    </SoftUIContext.Provider>
  );
}

// Hook untuk mengakses konteks
export function useSoftUIController() {
  const context = useContext(SoftUIContext);
  if (!context) {
    throw new Error('useSoftUIController must be used within a SoftUIProvider');
  }
  return context;
}

// Fungsi untuk mengatur state
export const setMiniSidenav = (dispatch, value) => dispatch({ type: 'MINI_SIDENAV', value });
export const setTransparentSidenav = (dispatch, value) => dispatch({ type: 'TRANSPARENT_SIDENAV', value });
export const setSidenavColor = (dispatch, value) => dispatch({ type: 'SIDENAV_COLOR', value });
export const setTransparentNavbar = (dispatch, value) => dispatch({ type: 'TRANSPARENT_NAVBAR', value });
export const setFixedNavbar = (dispatch, value) => dispatch({ type: 'FIXED_NAVBAR', value });
export const setOpenConfigurator = (dispatch, value) => dispatch({ type: 'OPEN_CONFIGURATOR', value });
export const setDirection = (dispatch, value) => dispatch({ type: 'DIRECTION', value });
export const setLayout = (dispatch, value) => dispatch({ type: 'LAYOUT', value });