export const IsTypeSelected = (types, value, editMode) => {
  let selected = "";
  if (editMode)
    for (let i = 0; i < types.length; i++) {
      if (types[i].name === value) selected = "selected";
    }

  return selected;
};
