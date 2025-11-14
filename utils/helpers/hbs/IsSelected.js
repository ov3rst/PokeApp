export const IsSelected = (fValue, sValue, editMode) => {
  return editMode && fValue === sValue ? "selected" : "";
};
