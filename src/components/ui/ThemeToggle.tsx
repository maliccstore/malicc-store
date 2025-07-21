'use client';

import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { toggleTheme } from '../../store/slices/appSlice';

export default function ThemeToggle() {
  const theme = useAppSelector((state) => state.app.theme);
  const dispatch = useAppDispatch();

  return (
    <button onClick={() => dispatch(toggleTheme())}>
      Current theme: {theme}
    </button>
  );
}
