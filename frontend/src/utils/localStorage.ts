const setLocalStorage = <T>(key: string, value: T): void => {
  if (typeof window === "undefined") return;

  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error("setLocalStorage error:", error);
  }
};

const getLocalStorage = <T>(key: string): T | null => {
  if (typeof window === "undefined") return null;

  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    return JSON.parse(item) as T;
  } catch (error) {
    console.error("getLocalStorage error:", error);
    return null;
  }
};

export const localStorageManager = {
  set: setLocalStorage,
  get: getLocalStorage,
};
