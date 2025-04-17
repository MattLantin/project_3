function toggleDescription(btn) {
    const parent = btn.closest('.pro');
    const desc = parent.querySelector('.hidden_elmnt');
    if (desc.style.display === 'none' || desc.style.display === '') {
      desc.style.display = 'block';
    } else {
      desc.style.display = 'none';
    }
  }
  
  document.addEventListener("DOMContentLoaded", function () {
    const proCards = document.querySelectorAll(".pro");
  
    proCards.forEach(card => {
      const form = document.createElement("form");
      form.className = "qty_select_form";
      form.setAttribute("onClick", "event.stopPropagation();");
  
      const select = document.createElement("select");
      select.name = "qty_select";
      select.className = "qty_select";
  
      const imgSrc = card.querySelector("img").getAttribute("src");
      const productName = card.querySelector("h5").textContent.trim();
      const priceText = card.querySelector("h4").textContent.replace("$", "");
      const priceValue = parseFloat(priceText);
      const localKey = `qty_${imgSrc}`;
  
      for (let i = 0; i <= 10; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        select.appendChild(option);
      }
  
      const savedData = JSON.parse(localStorage.getItem(localKey));
      if (savedData && savedData.quantity !== undefined) {
        select.value = savedData.quantity;
      }
  
      function updateStorage() {
        const itemData = {
          quantity: parseInt(select.value),
          price: priceValue,
          name: productName
        };
        localStorage.setItem(localKey, JSON.stringify(itemData));
      }
  
      select.addEventListener("change", updateStorage);
      form.appendChild(select);
      card.querySelector(".des").appendChild(form);
    });
  
    document.querySelectorAll(".show_description").forEach(btn => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        toggleDescription(this);
      });
    });
  
    document.querySelectorAll(".add_item").forEach(btn => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
  
        const proCard = this.closest(".pro");
        const select = proCard.querySelector("select.qty_select");
        const currentVal = parseInt(select.value);
        const maxVal = parseInt(select.options[select.options.length - 1].value);
  
        const imgSrc = proCard.querySelector("img").getAttribute("src");
        const productName = proCard.querySelector("h5").textContent.trim();
        const priceText = proCard.querySelector("h4").textContent.replace("$", "");
        const priceValue = parseFloat(priceText);
        const localKey = `qty_${imgSrc}`;
  
        if (currentVal < maxVal) {
          select.value = currentVal + 1;
          const updatedItem = {
            quantity: parseInt(select.value),
            price: priceValue,
            name: productName
          };
          localStorage.setItem(localKey, JSON.stringify(updatedItem));
        }
      });
    });
  });
  
  const bar = document.getElementById('bar');
  const close = document.getElementById('close');
  const nav = document.getElementById('navbar');
  
  if (bar) {
    bar.addEventListener('click', () => {
      nav.classList.add('active');
    });
  }
  
  if (close) {
    close.addEventListener('click', () => {
      nav.classList.remove('active');
    });
  }
  

  document.addEventListener("DOMContentLoaded", function () {
    const cartTableBody = document.querySelector("#cart tbody");
  
    if (!cartTableBody) return;
  
    // Clear existing rows
    cartTableBody.innerHTML = "";
  
    // Loop through localStorage to build cart rows
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
  
      if (key.startsWith("qty_")) {
        const item = JSON.parse(localStorage.getItem(key));
        const imgSrc = key.replace("qty_", "");
        const name = item.name || "Unnamed Product";
        const price = parseFloat(item.price);
        const quantity = parseInt(item.quantity);
  
        if (quantity === 0) continue;
  
        const subtotal = (price * quantity).toFixed(2);
  
        const row = document.createElement("tr");
        row.innerHTML = `
          <td><a href="#" class="remove-btn" data-key="${key}"><i class="far fa-times-circle"></i></a></td>
          <td><img src="${imgSrc}" alt="" /></td>
          <td>${name}</td>
          <td>$${price.toFixed(2)}</td>
          <td><input type="number" value="${quantity}" min="0" class="qty-input" data-key="${key}" data-price="${price}" /></td>
          <td class="total">$${subtotal}</td>
        `;
        cartTableBody.appendChild(row);
      }
    }
  
    updateCartTotal();
  
    // Handle quantity change
    cartTableBody.addEventListener("input", function (e) {
      if (e.target.classList.contains("qty-input")) {
        const input = e.target;
        const key = input.dataset.key;
        const newQty = parseInt(input.value);
        const price = parseFloat(input.dataset.price);
        const row = input.closest("tr");
        const totalCell = row.querySelector(".total");
  
        if (!isNaN(newQty) && key) {
          const item = JSON.parse(localStorage.getItem(key));
          item.quantity = newQty;
          localStorage.setItem(key, JSON.stringify(item));
  
          if (newQty === 0) {
            row.remove();
          } else {
            totalCell.textContent = `$${(price * newQty).toFixed(2)}`;
          }
  
          updateCartTotal();
        }
      }
    });
  
    // Handle remove button
    cartTableBody.addEventListener("click", function (e) {
      const removeBtn = e.target.closest(".remove-btn");
      if (removeBtn) {
        e.preventDefault();
        const key = removeBtn.dataset.key;
        localStorage.removeItem(key);
        removeBtn.closest("tr").remove();
        updateCartTotal();
      }
    });
  });
  
  // Update subtotal and total
  function updateCartTotal() {
    const cartTotalEl = document.getElementById("cart-total");
    const cartSubtotalEl = document.getElementById("cart-subtotal");
  
    if (!cartTotalEl || !cartSubtotalEl) return;
  
    let total = 0;
  
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
  
      if (key.startsWith("qty_")) {
        const item = JSON.parse(localStorage.getItem(key));
        const quantity = parseInt(item.quantity);
        const price = parseFloat(item.price);
  
        if (!isNaN(quantity) && !isNaN(price) && quantity > 0) {
          total += price * quantity;
        }
      }
    }
  
    const formattedTotal = total.toFixed(2);
    cartSubtotalEl.textContent = formattedTotal;
    cartTotalEl.textContent = formattedTotal;
  }
  
  document.addEventListener("DOMContentLoaded", function () {
    const checkoutBtn = document.querySelector('#subtotal .normal');
  
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", function () {
        // Remove only cart-related keys (those starting with qty_)
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key.startsWith("qty_")) {
            localStorage.removeItem(key);
          }
        }
  
        // Redirect to thankyou.html
        window.location.href = "thankyou.html";
      });
    }
  });
  