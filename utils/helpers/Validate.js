const Validate = (textName, imageUrl, firstType, secondType) => {
  let errors = [];
  if (!textName || textName.trim() === "")
    errors.push("El nombre no puede estar vacio");
  if (!textName || imageUrl.trim() === "") return true;
};
