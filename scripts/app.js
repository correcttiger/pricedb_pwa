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
            document.getElementById("inputDate").value = todayString();

        }
    }
}


function saveData() {

    const inputItem = document.getElementById("inputItem");
    const inputAmount = document.getElementById("inputAmount");
    const inputCount = document.getElementById("inputCount");
    const inputPrice = document.getElementById("inputPrice");

    const item = inputItem.value;
    const category = document.getElementById("inputCategory").value;
    const date = document.getElementById("inputDate").value || todayString();
    const shop = document.getElementById("inputShop").value;
    const amount = inputAmount.value;
    const count = inputCount.value;
    const price = inputPrice.value;
    const memo = document.getElementById("inputMemo").value;

    if (isNaN(amount) || amount <= 0 || amount % 1 > 0) {
        inputAmount.classList.add("is-invalid");
        return;
    }
    if (isNaN(count) || count <= 0 || count % 1 > 0) {
        inputCount.classList.add("is-invalid");
        return;
    }
    if (isNaN(price) || price <= 0 || price % 1 > 0) {
        inputPrice.classList.add("is-invalid");
        return;
    }

    inputAmount.classList.remove("is-invalid");
    inputCount.classList.remove("is-invalid");
    inputPrice.classList.remove("is-invalid");

    let tax = 0;
    if (document.getElementById("btnTax8").classList.contains("active")) {
        tax = 8;
    }
    else if (document.getElementById("btnTax10").classList.contains("active")) {
        tax = 10;
    }

    DB.items.put({ item, category });
    DB.prices.put({ item, date, shop, amount, count, price, tax, memo });

    const modal = bootstrap.Modal.getInstance(document.getElementById("modalRegister"));
    modal?.hide();

    updateMenu();

}


async function updateMenu() {

    const accCategory = document.getElementById("accCategory");
    const categories = await DB.items.orderBy("category").uniqueKeys();

    accCategory.innerHTML = "";

    categories.forEach(async (category, index) => {
        const items = await DB.items.where({ category }).toArray();

        const accordionId = "accordion-" + index;
        accCategory.innerHTML += `
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${accordionId}">
                        ${category}
                    </button>
                </h2>
                <div id="${accordionId}" class="accordion-collapse collapse">
                    <div class="accordion-body">
                        ${items.map((item, j) => {
                            const itemId = accordionId + "-" + j;
                            return `<input type="radio" class="btn-check" name="category" id="${itemId}" autocomplete="off">
                                    <label class="btn btn-outline-secondary w-100 mb-1" for="${itemId}">${item.item}</label>`;
                        }).join("\n")}
                    </div>
                </div>
            </div>
        `;

    });

}


document.getElementById("accCategory").addEventListener("change", (event) => {

    const label = document.querySelector(`label[for="${event.target.id}"]`);

    showItemPage(label.innerText);

});


async function showItemPage(item) {
    const prices = await DB.prices.where({ item }).toArray();
    const tbPrice = document.getElementById("tbPrice");
    tbPrice.innerHTML = "";
    prices.forEach(data => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="text-center">${data.date}</td>
            <td class="text-center">${data.shop}</td>
            <td class="text-end">${data.amount}</td>
            <td class="text-end">${data.count}</td>
            <td class="text-end">${data.price}</td>
            <td class="text-end">${""}</td>
            <td class="text-start">${data.memo}</td>
        `;
        tbPrice.appendChild(row);
    });
    document.getElementById("appbarTitle").innerText = item;
}


// function displayData(data) {
//     const dataList = document.getElementById("price-list");
//     dataList.innerHTML = "";
//     data.forEach(item => {
//         const row = document.createElement("tr");
//         row.innerHTML = `
//             <td>${item.date}</td>
//             <td>${item.shop}</td>
//             <td>${item.amount}</td>
//             <td>${item.count}</td>
//             <td>${item.price}</td>
//             <td>${""}</td>
//             <td>${item.memo}</td>
//         `;
//         dataList.appendChild(row);
//     });
// }
