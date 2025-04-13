const DB = new Dexie("PriceDB");

DB.version(1).stores({
    items: "&item, category",
    prices: "++id, item, date, shop, amount, count, price, tax, memo"
});


function todayString() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}


function selectFile(accept) {
    return new Promise((resolve, reject) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = accept;
        input.style.display = "none";
        input.addEventListener("change", () => {
            resolve(input.files[0] || null);
        });
        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    });
}


async function importFile() {

    console.log("start");

    const file = await selectFile(".csv,.json");

    console.log("end");

    if (!file) return;

    /** @type {string}*/
    const text = await file.text();

    if (file.name.endsWith(".csv")) {

        
        const rows = text.trim().split("\n").map(line => line.split(","));

        if (!rows.every(row => row.length == 7)) {
            alert("不正なCSVです");
        }

        for (const row of rows) {
            await DB.items.put({ item: row[1], category: "未分類" });
            await DB.prices.put({
                item: row[1],
                date: "20" + row[5],
                shop: row[0],
                amount: 1,
                count: row[3] - 0,
                price: row[2] - 0,
                tax: row[4] - 0,
                memo: row[6]
            });
        }

    }
    else if (file.name.endsWith(".json")) {

        const data = JSON.parse(text);

        if(data.version == DB.verno) {
            await DB.items.bulkAdd(data.items);
            await DB.prices.bulkAdd(data.prices);
        }

    }
    
}


async function exportJson() {

    const exportData = { version: DB.verno };

    for (const table of DB.tables) {
        exportData[table.name] = await table.toArray();
    }
  
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = "price_db.json";
    a.click();
  
    URL.revokeObjectURL(url);
    
}


async function deleteDB() {
    await DB.delete();
    await updateMenu();
}
