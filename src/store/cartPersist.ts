const isBrowser = typeof window !== 'undefined';

type PersistedState = {
  cart?: object;
  checkout?: object;
};

export const loadState = (): PersistedState | undefined => {
  if (!isBrowser) return undefined;

  try {
    const serializedState = localStorage.getItem('cartState');
    if (!serializedState) return undefined;

    const parsedData = JSON.parse(serializedState);

    // Backward compatibility: old format stored cart state directly (had 'items' key at root)
    if (parsedData && parsedData.items && !parsedData.cart) {
      return { cart: parsedData };
    }

    return parsedData;
  } catch (err) {
    console.error('Failed to load state:', err);
    return undefined;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const saveState = (state: any) => {
  if (!isBrowser) return;

  try {
    const serializedState = JSON.stringify({
      cart: state.cart,
      checkout: state.checkout,
    });
    localStorage.setItem('cartState', serializedState);
  } catch (err) {
    console.error('Failed to save state:', err);
  }
};
