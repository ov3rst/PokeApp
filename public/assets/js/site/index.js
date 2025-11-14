document.querySelectorAll("#btn-delete").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    const inputDelete = document.getElementById("delete-input");

    inputDelete.setAttribute("value", id);
  });
});
