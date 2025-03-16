const btnGroup = document.querySelector(".btn-group");

if (btnGroup) {
    btnGroup.querySelectorAll(".btn").forEach(button => {
        button.addEventListener("click", () => {
            btnGroup.querySelectorAll(".btn").forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
        });
    });
}

window.onload = async function() {
    const data = await DB.prices.toArray();
    displayData(data);
};

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
