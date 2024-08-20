export const getLocalStorageItem = (key) => {
    const item = localStorage.getItem(key);
    return item === null ? undefined : item;
  };
  
  export const setLocalStorageItem = (key, value) => {
    localStorage.setItem(key, value);
  };