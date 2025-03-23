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
