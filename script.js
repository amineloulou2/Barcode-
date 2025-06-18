let products = [];

try {
  const storedProducts = localStorage.getItem("products");
  if (storedProducts) {
    products = JSON.parse(storedProducts);
  }
} catch (e) {
  console.error("خطأ في تحميل المنتجات:", e);
}

function initializeProducts() {
  const select = document.getElementById("printProduct");
  select.innerHTML = '<option value="">-- اختر منتجا --</option>';

  if (products.length === 0) {
    const option = document.createElement("option");
    option.textContent = "لا توجد منتجات متاحة";
    option.disabled = true;
    select.appendChild(option);
    return;
  }

  products.forEach(product => {
    const option = document.createElement("option");
    option.value = product.barcode;
    option.textContent = product.name;
    select.appendChild(option);
  });
}

function printBarcodes() {
  const barcode = document.getElementById("printProduct").value;
  const qty = parseInt(document.getElementById("printQty").value) || 1;
  const labelSize = document.getElementById("labelSize").value;
  const preview = document.getElementById("printPreview");

  if (!barcode) return alert("❗ يرجى اختيار منتج للطباعة");
  if (qty < 1 || qty > 50) return alert("❗ عدد الملصقات يجب أن يكون بين 1 و 50");

  const product = products.find(p => String(p.barcode) === String(barcode));
  if (!product) return alert("❌ المنتج غير موجود");

  let labelWidth = "300px", labelHeight = "180px";
  let barcodeHeight = 40, barcodeWidth = 2;

  if (labelSize === "30x20") {
    labelWidth = "240px";
    labelHeight = "120px";
    barcodeHeight = 25;
    barcodeWidth = 1.5;
  } else if (labelSize === "50x30") {
    labelWidth = "360px";
    labelHeight = "180px";
    barcodeHeight = 50;
    barcodeWidth = 2.5;
  }

  preview.innerHTML = "";

  for (let i = 0; i < qty; i++) {
    const label = document.createElement("div");
    label.className = "label";
    label.style.width = labelWidth;
    label.style.height = labelHeight;
    label.innerHTML = `
      <div class="store-name">BAZAR SERDANI</div>
      <div class="price">Prix: ${formatPrice(product.price || 0)} DA</div>
      <div class="barcode-container">
        <svg class="barcode" data-code="${product.barcode}"></svg>
        <div class="barcode-number">${product.barcode}</div>
      </div>
    `;
    preview.appendChild(label);
  }

  document.querySelectorAll('.barcode').forEach(el => {
    const code = el.getAttribute("data-code");
    JsBarcode(el, code, {
      format: "EAN13",
      displayValue: false,
      height: barcodeHeight,
      margin: 5,
      width: barcodeWidth
    });
  });

  alert(`✅ تم تحضير ${qty} ملصق للطباعة`);
}

function formatPrice(price) {
  const priceStr = Math.round(price).toString();
  return priceStr.length > 3
    ? priceStr.slice(0, -3) + ' ' + priceStr.slice(-3)
    : priceStr;
}

document.addEventListener('DOMContentLoaded', function () {
  initializeProducts();
  document.getElementById("printBtn").addEventListener('click', printBarcodes);
});
