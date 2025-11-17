import { useReducer } from 'react';

export interface EditorState {
  isDebug: boolean;
  currentPage: number;
  totalPages: number;
  isAutoPaginationEnabled: boolean;
  showPageBoundaries: boolean;
  isPreviewMode: boolean;
  wordCount: number;
}

export type EditorAction =
  | { type: 'TOGGLE_DEBUG' }
  | { type: 'SET_CURRENT_PAGE'; payload: number }
  | { type: 'SET_TOTAL_PAGES'; payload: number }
  | { type: 'TOGGLE_AUTO_PAGINATION' }
  | { type: 'TOGGLE_PAGE_BOUNDARIES' }
  | { type: 'TOGGLE_PREVIEW_MODE' }
  | { type: 'SET_WORD_COUNT'; payload: number };

const initialState: EditorState = {
  isDebug: false,
  currentPage: 1,
  totalPages: 1,
  isAutoPaginationEnabled: true,
  showPageBoundaries: true,
  isPreviewMode: false,
  wordCount: 0,
};

const editorReducer = (state: EditorState, action: EditorAction): EditorState => {
  switch (action.type) {
    case 'TOGGLE_DEBUG':
      return { ...state, isDebug: !state.isDebug };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_TOTAL_PAGES':
      return { ...state, totalPages: action.payload };
    case 'TOGGLE_AUTO_PAGINATION':
      return { ...state, isAutoPaginationEnabled: !state.isAutoPaginationEnabled };
    case 'TOGGLE_PAGE_BOUNDARIES':
      return { ...state, showPageBoundaries: !state.showPageBoundaries };
    case 'TOGGLE_PREVIEW_MODE':
      return { ...state, isPreviewMode: !state.isPreviewMode };
    case 'SET_WORD_COUNT':
      return { ...state, wordCount: action.payload };
    default:
      return state;
  }
};

export const useEditorState = () => {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  return { state, dispatch };
};
