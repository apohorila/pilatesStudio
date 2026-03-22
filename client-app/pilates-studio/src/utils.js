 export const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const clean = dateStr.endsWith("Z") ? dateStr.slice(0, -1) : dateStr;
    return new Date(clean).toLocaleString("uk-UA");
  };