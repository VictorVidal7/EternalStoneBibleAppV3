import { useMemo } from 'react';
import { useUserPreferences } from '../context/UserPreferencesContext';

export const useStyles = (styleCreator) => {
  const { nightMode, fontSize, fontFamily } = useUserPreferences();

  return useMemo(() => styleCreator(nightMode, fontSize, fontFamily), [nightMode, fontSize, fontFamily, styleCreator]);
};