import PropTypes from 'prop-types';
import React, { createContext, useReducer } from 'react';
import * as actionType from '../store/actions';
import { CONFIG } from '../config/constant';

const initialState = {
  ...CONFIG,
  isOpen: [],
  isTrigger: [],
  collapseMenu: false // Ensure this is in the state to track the menu collapse status
};

const ConfigContext = createContext(initialState);
const { Provider } = ConfigContext;

const reducer = (state, action) => {
  let trigger = [...state.isTrigger];
  let open = [...state.isOpen];

  switch (action.type) {
    case actionType.CHANGE_LAYOUT:
      return { ...state, layout: action.layout };

    case actionType.COLLAPSE_MENU:
      return { ...state, collapseMenu: !state.collapseMenu };

    case actionType.COLLAPSE_TOGGLE:
      if (action.menu.type === 'sub') {
        const triggerIndex = trigger.indexOf(action.menu.id);

        if (triggerIndex > -1) {
          open = open.filter((item) => item !== action.menu.id);
          trigger = trigger.filter((item) => item !== action.menu.id);
        } else {
          open.push(action.menu.id);
          trigger.push(action.menu.id);
        }
      } else {
        const triggerIndex = trigger.indexOf(action.menu.id);
        trigger = triggerIndex === -1 ? [action.menu.id] : [];
        open = triggerIndex === -1 ? [action.menu.id] : [];
      }
      return { ...state, isOpen: open, isTrigger: trigger };

    case actionType.NAV_COLLAPSE_LEAVE:
      if (action.menu.type === 'sub') {
        const triggerIndex = trigger.indexOf(action.menu.id);
        if (triggerIndex > -1) {
          open = open.filter((item) => item !== action.menu.id);
          trigger = trigger.filter((item) => item !== action.menu.id);
        }
      }
      return { ...state, isOpen: open, isTrigger: trigger };

    case actionType.NAV_CONTENT_LEAVE:
      return { ...state, isOpen: [], isTrigger: [] };

    case actionType.RESET:
      return { ...initialState };

    default:
      console.warn(`Unhandled action type: ${action.type}`);
      return state;
  }
};

const ConfigProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

ConfigProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export { ConfigContext, ConfigProvider };
