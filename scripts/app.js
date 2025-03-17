const btnGroup = document.querySelector(".btn-group");

if (btnGroup) {
    btnGroup.querySelectorAll(".btn").forEach(button => {
        button.addEventListener("click", () => {
            btnGroup.querySelectorAll(".btn").forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
        });
    });
}

window.onload = async function () {
    const data = await DB.prices.toArray();
    displayData(data);
};

function openModal(name = "") {
    const modal = new bootstrap.Modal(document.getElementById("modalRegister"));
    document.getElementById("inputItem").value = name;
    showPage(name ? 2 : 1);
    inputItem.classList.remove("is-invalid");
    modal.show();
}

document.getElementById("modalRegister").addEventListener("shown.bs.modal", () => {
    if(!document.getElementById("step1").classList.contains("d-none")) {
        document.querySelector("#formItem .form-control")?.focus();
    }
    else if(!document.getElementById("step2").classList.contains("d-none")) {
        document.querySelector("#formDetail .form-control")?.focus();
    }
});

function showPage(page) {
    if (page == 1) {
        document.getElementById("step1").classList.remove("d-none");
        document.getElementById("step2").classList.add("d-none");
        document.getElementById("btnNextForm").classList.remove("d-none");
        document.getElementById("btnPrevForm").classList.add("d-none");
        document.getElementById("btnSave").classList.add("d-none");
        document.getElementById("modalTitle").textContent = "商品を登録";
    } else if (page == 2) {
        const inputItem = document.getElementById("inputItem");
        if (inputItem.value.trim() == "") {
            inputItem.classList.add("is-invalid");
        } else {
            inputItem.classList.remove("is-invalid");
            document.getElementById("step1").classList.add("d-none");
            document.getElementById("step2").classList.remove("d-none");
            document.getElementById("btnNextForm").classList.add("d-none");
            document.getElementById("btnPrevForm").classList.remove("d-none");
            document.getElementById("btnSave").classList.remove("d-none");
            document.getElementById("modalTitle").textContent = inputItem.value + "の価格を登録";
        }
    }
}


function displayData(data) {
    const dataList = document.getElementById("price-list");
    dataList.innerHTML = "";
    data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.tax}</td>
        `;
        dataList.appendChild(row);
    });
}
