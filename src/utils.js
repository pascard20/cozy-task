import DOMPurify from 'dompurify';

export const capitalizeString = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const generateID = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

export const escapeHTML = baseText => {
  return baseText
    ?.replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export const sanitize = baseHTML => {
  return DOMPurify.sanitize(baseHTML, {
    ALLOWED_ATTR: ['id', 'class', 'type', 'name', 'placeholder', 'required', 'for', 'value', 'autocomplete']
  })
}