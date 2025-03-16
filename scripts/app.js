const btnGroup = document.querySelector(".btn-group");

if (btnGroup) {
    btnGroup.querySelectorAll(".btn").forEach(button => {
        button.addEventListener("click", () => {
            btnGroup.querySelectorAll(".btn").forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
        });
    });
}
