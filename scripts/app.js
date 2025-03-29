document.addEventListener("DOMContentLoaded", () => {

    const btnGroup = document.querySelector(".btn-group");
    if (btnGroup) {
        const buttons = btnGroup.querySelectorAll(".btn");
        const clickFunc = (event) => {
            for (const button of buttons) {
                button.classList.remove("active");
            }
            event.target.classList.add("active");
        }
        for (const button of buttons) {
            button.addEventListener("click", clickFunc);
        }
    }

    updateMenu();

});


const clickCategoryFunc = (event) => {
    event.preventDefault();
    document.getElementById("inputCategory").value = event.target.textContent;
}

const clickShopFunc = (event) => {
    event.preventDefault();
    document.getElementById("inputShop").value = event.target.textContent;
}

async function openModal(name = "") {

    const modal = new bootstrap.Modal(document.getElementById("modalRegister"));

    document.getElementById("inputItem").value = name;

    await DB.open();

    const categories = await DB.items.orderBy("category").uniqueKeys();
    const ulCategory = document.getElementById("ulCategory");
    ulCategory.innerHTML = "";
    for (const category of categories) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.classList.add("dropdown-item");
        a.href = "#";
        a.textContent = category;
        a.addEventListener("click", clickCategoryFunc);
        li.appendChild(a);
        ulCategory.appendChild(li);
    }

    const shops = await DB.prices.orderBy("shop").uniqueKeys();
    const ulShop = document.getElementById("ulShop");
    ulShop.innerHTML = "";
    for (const shop of shops) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.classList.add("dropdown-item");
        a.href = "#";
        a.textContent = shop;
        a.addEventListener("click", clickShopFunc);
        li.appendChild(a);
        ulShop.appendChild(li);
    }

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


async function saveData() {

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

    inputAmount.classList.remove("is-invalid");
    inputCount.classList.remove("is-invalid");
    inputPrice.classList.remove("is-invalid");

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

    let tax = 0;
    if (document.getElementById("btnTax8").classList.contains("active")) {
        tax = 8;
    }
    else if (document.getElementById("btnTax10").classList.contains("active")) {
        tax = 10;
    }

    await DB.open();
    await DB.items.put({ item, category });
    await DB.prices.put({ item, date, shop, amount, count, price, tax, memo });

    const modal = bootstrap.Modal.getInstance(document.getElementById("modalRegister"));
    modal?.hide();

    await updateMenu();

}


async function updateMenu() {

    await DB.open();

    const accCategory = document.getElementById("accCategory");
    const categories = await DB.items.orderBy("category").uniqueKeys();

    accCategory.innerHTML = "";

    for (let i = 0; i < categories.length; i++) {
        const items = await DB.items.where({ category: categories[i] }).toArray();

        const accordionId = "accordion-" + i;
        accCategory.innerHTML += `
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${accordionId}">
                        ${categories[i]}
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

    }

}


document.getElementById("accCategory").addEventListener("change", async (event) => {

    const label = document.querySelector(`label[for="${event.target.id}"]`);

    alert(label.innerText);

    await showItemPage(label.innerText);

});


async function showItemPage(item) {
    await DB.open();
    alert("opened");
    const prices = await DB.prices.where({ item: item }).toArray();
    alert("got data");
    const tbodyPrice = document.getElementById("tbodyPrice");
    tbodyPrice.innerHTML = "";
    for (const data of prices) {
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
        tbodyPrice.appendChild(row);
    }
    alert("done");
    document.getElementById("appbarTitle").innerText = item;
}


document.getElementById("tbodyPrice").addEventListener("click", (event) => {
    const targetRow = event.target.closest("tr");
    if (targetRow) {
        print("Clicked Row:", targetRow.rowIndex);
    }
});
