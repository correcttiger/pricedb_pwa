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


document.getElementById("ulCategory").addEventListener("click", (event) => {
    document.getElementById("inputCategory").value = event.target.closest("a")?.textContent || "";
});

document.getElementById("ulShop").addEventListener("click", (event) => {
    document.getElementById("inputShop").value = event.target.closest("a")?.textContent || "";
});


function setBtnTax(tax) {
    const btnTaxInc = document.getElementById("btnTaxInc");
    const btnTax8 = document.getElementById("btnTax8");
    const btnTax10 = document.getElementById("btnTax10");
    btnTaxInc.classList.remove("active");
    btnTax8.classList.remove("active");
    btnTax10.classList.remove("active");
    switch (tax) {
        case 8: btnTax8.classList.add("active"); break;
        case 10: btnTax10.classList.add("active"); break;
        default: btnTaxInc.classList.add("active"); break;
    }
}


async function openModal(id = -1, item = "") {

    await DB.open();

    const categories = await DB.items.orderBy("category").uniqueKeys();
    const ulCategory = document.getElementById("ulCategory");
    ulCategory.replaceChildren();
    for (const category of categories) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.classList.add("dropdown-item");
        a.href = "#";
        a.textContent = category;
        li.appendChild(a);
        ulCategory.appendChild(li);
    }

    const shops = await DB.prices.orderBy("shop").uniqueKeys();
    const ulShop = document.getElementById("ulShop");
    ulShop.replaceChildren();
    for (const shop of shops) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.classList.add("dropdown-item");
        a.href = "#";
        a.textContent = shop;
        li.appendChild(a);
        ulShop.appendChild(li);
    }

    const inputId = document.getElementById("inputId");
    const inputItem = document.getElementById("inputItem");
    const inputCategory = document.getElementById("inputCategory");
    const inputDate = document.getElementById("inputDate");

    inputDate.value = todayString();

    if (id == -1) { //追加
        inputId.value = -1;
        document.getElementById("inputShop").value = "";
        document.getElementById("inputAmount").value = "";
        document.getElementById("inputCount").value = "";
        document.getElementById("inputPrice").value = "";
        document.getElementById("inputMemo").value = "";
        if (item) {
            const category = await DB.items.get(item);
            const data = await DB.prices.where("item").equals(item).first();
            if (category && data) {
                inputItem.value = item;
                inputCategory.value = category.category;
                setBtnTax(data?.tax);
                showPage(2);
            }
            else{
                return;
            }
        }
        else{
            inputItem.value = "";
            inputCategory.value = "";
            showPage(1);
        }
    }
    else { //編集
        const data = await DB.prices.get(id);
        if (data) {
            const category = await DB.items.get(data.item);
            if (category) {
                inputId.value = id;
                inputItem.value = data.item;
                inputCategory.value = category.category;
                inputDate.value = data.date;
                document.getElementById("inputShop").value = data.shop;
                document.getElementById("inputAmount").value = data.amount;
                document.getElementById("inputCount").value = data.count;
                document.getElementById("inputPrice").value = data.price;
                document.getElementById("inputMemo").value = data.memo;
                setBtnTax(data.btnTax8);
                showPage(2);
            }
            else {
                inputId.value = -1;
                inputItem.value = "";
                inputCategory.value = "";
                showPage(1);
            }
        }
        else {
            inputId.value = -1;
            inputItem.value = "";
            inputCategory.value = "";
            showPage(1);
        }
    }

    inputItem.classList.remove("is-invalid");

    const modal = new bootstrap.Modal(document.getElementById("modalRegister"));
    modal.show();

}


async function openModalForSelected() {
    const appbarTitle = document.getElementById("appbarTitle");
    openModal(-1, appbarTitle.innerText);
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
    const id = document.getElementById("inputId").value - 0;
    if (id == -1) {
        document.getElementById("btnDelete").classList.add("d-none");
    }
    else {
        document.getElementById("btnDelete").classList.remove("d-none");
    }
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
            document.getElementById("modalTitle").textContent = inputItem.value + "の価格を" + (id == -1 ? "登録" : "編集");
        }
    }
}


async function saveData() {

    const inputItem = document.getElementById("inputItem");
    const inputAmount = document.getElementById("inputAmount");
    const inputCount = document.getElementById("inputCount");
    const inputPrice = document.getElementById("inputPrice");

    const id = document.getElementById("inputId").value - 0;
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
    if (id == -1) {
        await DB.prices.put({ item, date, shop, amount, count, price, tax, memo });
    }
    else {
        await DB.prices.update(id, { item, date, shop, amount, count, price, tax, memo });
    }

    bootstrap.Modal.getInstance(document.getElementById("modalRegister"))?.hide();

    await updateMenu();
    await showItemPage(item);

}


async function deleteData() {
    const id = document.getElementById("inputId").value - 0;
    if (id != -1 && confirm("この価格データを削除します。\nよろしいですか？")) {
        await DB.open();
        const data = await DB.prices.get(id);
        if (data) {
            await DB.prices.delete(id);
            const otherData = await DB.prices.where("item").equals(data.item).toArray();
            if (otherData.length == 0) {
                await DB.items.delete(data.item);
            }
            await updateMenu();
            await showItemPage(data.item);
        }
        bootstrap.Modal.getInstance(document.getElementById("modalRegister"))?.hide();
    }
}


async function updateMenu() {

    await DB.open();

    const accCategory = document.getElementById("accCategory");
    const categories = await DB.items.orderBy("category").uniqueKeys();

    accCategory.replaceChildren();

    for (let i = 0; i < categories.length; i++) {
        const items = await DB.items.where("category").equals(categories[i]).toArray();

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
    await showItemPage(label.innerText);
});


const formatWithCommaRightAlign = value => {
  const formatted = value == null || value === "" ? "" : Number(value).toLocaleString();
  return gridjs.html(`<div style="text-align: right;">${formatted}</div>`);
};

const myGrid = new gridjs.Grid({
    columns: [
        {id: "id", name: "ID", hidden: true},
        {id: "date", name: "日", width: "40px"},
        {id: "shop", name: "店", width: "40px"},
        {id: "amount", name: "量", width: "20px", formatter: formatWithCommaRightAlign},
        {id: "count", name: "個数", width: "20px", formatter: formatWithCommaRightAlign},
        {id: "price", name: "￥", width: "20px", formatter: formatWithCommaRightAlign},
        {id: "ratio", name: "指標", width: "20px"},
        {id: "memo", name: "備考", width: "60px"}
    ],
    data: [],
    search: true,
    pagination: false,
    sort: true,
    width: "700px"
}).on("rowClick", (event, row) => {
    openModal(row.cells[0].data - 0);
}).render(document.getElementById("priceTable"));


async function showItemPage(item) {

    await DB.open();

    const prices = await DB.prices.where("item").equals(item).toArray();

    if (prices.length == 0) {
        document.getElementById("appbarTitle").innerText = "Price DB";
        return;
    }

    for (const data of prices) {
        data.priceWithTax = Math.floor(data.price * (100 + data.tax) / 100);
        data.unitPrice = data.priceWithTax / data.amount / data.count;
    }

    const minUnitPrice = Math.min(...prices.map(data => data.unitPrice));

    myGrid.updateConfig({
        data: prices.map(data => ({
            id: data.id,
            date: data.date,
            shop: data.shop,
            amount: data.amount,
            count: data.count,
            price: data.priceWithTax,
            ratio: (data.unitPrice / minUnitPrice).toFixed(3),
            memo: data.memo
        }))
    }).forceRender();

    document.getElementById("appbarTitle").innerText = item;

}
