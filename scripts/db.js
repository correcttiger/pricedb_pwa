const DB = new Dexie("PriceDB");

DB.version(1).stores({
    items: "&item, category",
    prices: "++id, item, date, shop, amount, count, price, tax, memo"
});


function addData() { //name, date, shop, amount, count, price, tax, memo

    const name = "砂糖";
    const date = "25-03-16";
    const shop = "原信";
    const amount = 1000;
    const count = 1;
    const price = 198;
    const tax = [0, 8, 10][Math.random() * 3 | 0];
    const memo = "";

    DB.prices.put({ name, date, shop, amount, count, price, tax, memo});

}
