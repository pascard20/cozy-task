export const capitalizeString = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const generateID = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}
