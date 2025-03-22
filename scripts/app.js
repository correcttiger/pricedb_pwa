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
    if (!document.getElementById("step1").classList.contains("d-none")) {
        document.querySelector("#formItem .form-control")?.focus();
    }
    else if (!document.getElementById("step2").classList.contains("d-none")) {
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

            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, "0");
            const dd = String(today.getDate()).padStart(2, "0");
            document.getElementById("inputDate").value = `${yyyy}-${mm}-${dd}`;

        }
    }
}


function saveData() {

    const inputItem = document.getElementById("inputItem");
    const inputAmount = document.getElementById("inputAmount")
    const inputCount = document.getElementById("inputCount")

    const item = document.getElementById("inputItem").value;
    const category = document.getElementById("inputCategory").value;
    const date = document.getElementById("inputDate").value;
    const shop = document.getElementById("inputShop").value;
    const amount = document.getElementById("inputAmount").value;
    const count = document.getElementById("inputCount").value;
    const price = document.getElementById("inputPrice").value;
    const memo = document.getElementById("inputMemo").value;

    console.log(date);
    return;

    let tax = 0;
    if (document.getElementById("btnTax8").classList.contains("active")) {
        tax = 8;
    }
    else if (document.getElementById("btnTax10").classList.contains("active")) {
        tax = 10;
    }

    DB.items.put({ item, category });
    DB.prices.put({ item, date, shop, amount, count, price, tax, memo});

    const modal = bootstrap.Modal.getInstance(document.getElementById("modalRegister"));
    modal?.hide();

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
