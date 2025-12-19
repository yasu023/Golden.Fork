

  // ================== Categories ==================
 document.addEventListener("DOMContentLoaded", function () {

  const buttons = document.querySelectorAll(".btn-food");
  const groups = document.querySelectorAll(".food-group");

  function showCategory(category) {
    groups.forEach(group => {
      group.style.display =
        group.dataset.category === category ? "block" : "none";
    });
  }

  // default category
  showCategory("Sushi");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {

      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      showCategory(btn.id);
    });
  });

});


  // ================== Dining Slider ==================
  const slides = document.querySelectorAll("#dining-slider .slide");
  let current = 0;

  if (slides.length > 0) {
    setInterval(() => {
      slides[current].classList.remove("active");
      slides[current].classList.add("exit-left");

      current = (current + 1) % slides.length;

      slides[current].classList.add("active");

      setTimeout(() => {
        slides.forEach(slide => slide.classList.remove("exit-left"));
      }, 700);

    }, 3000);
  };
// ================= USER =================
const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

// ================= CART KEY =================
const cartKey = loggedUser ? `cart_${loggedUser.email}` : "cart_guest";

// ================= CART =================
let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

// ================= CART ELEMENTS =================
const cartBtn = document.getElementById("cart-btn");
const cartSidebar = document.getElementById("cart-sidebar");
const closeCart = document.getElementById("close-cart");
const cartItemsDiv = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");

cartBtn.onclick = () => cartSidebar.classList.add("active");
closeCart.onclick = () => cartSidebar.classList.remove("active");

// ================= SAVE & RENDER =================
function saveCart() {
  localStorage.setItem(cartKey, JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  cartItemsDiv.innerHTML = "";
  let total = 0;
  let count = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;
    count += item.qty;

    cartItemsDiv.innerHTML += `
      <div class="cart-item">
        <h5>${item.name}</h5>
        <p>$${item.price}</p>
        <div class="qty">
          <button onclick="changeQty(${index}, -1)">-</button>
          ${item.qty}
          <button onclick="changeQty(${index}, 1)">+</button>
        </div>
      </div>
    `;
  });

  cartTotal.innerText = `$${total}`;
  cartCount.innerText = count;
}

function changeQty(index, change) {
  cart[index].qty += change;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  saveCart();
}

// ================= ADD TO CART =================
document.querySelectorAll(".my-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const parent = btn.closest(".col-md-3, .col-md-4");
    const name = parent.querySelector("h4").innerText;
    const price = parent.querySelector("span")
      ? parent.querySelector("span").innerText.replace("$","")
      : 20;

    const existing = cart.find(item => item.name === name);

    if (existing) {
      existing.qty++;
    } else {
      cart.push({ name, price: Number(price), qty: 1 });
    }

    saveCart();
  });
});

renderCart();

// ================= CHECKOUT =================
const checkoutBtn = document.querySelector(".cart-footer button");
const popup = document.getElementById("checkout-popup");
const closePopup = document.getElementById("close-popup");
const confirmOrder = document.getElementById("confirm-order");

checkoutBtn.addEventListener("click", () => {
  if (!loggedUser) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  popup.classList.add("active");
});

closePopup.onclick = () => popup.classList.remove("active");

confirmOrder.onclick = () => {
  alert("✅ Order confirmed! Your order will arrive in 30 minutes.");

  cart = [];
  saveCart();

  popup.classList.remove("active");
  cartSidebar.classList.remove("active");
};

// ================= LOGOUT =================
function logout() {
  localStorage.removeItem("loggedUser");
  alert("Logged out");
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", function () {
  const authLink = document.getElementById("auth-link");
  const loggedUser = localStorage.getItem("loggedUser");

  if (authLink) {
    if (loggedUser) {
      // User is logged in → show Logout
      authLink.textContent = "Logout";
      authLink.href = "#";
      authLink.onclick = logout;
    } else {
      // No user → show Login
      authLink.textContent = "Login";
      authLink.href = "login.html";
      authLink.onclick = null;
    }
  }
});

let orders = JSON.parse(localStorage.getItem("orders")) || [];
orders.push({
  user: JSON.parse(localStorage.getItem("loggedUser")).email,
  items: cart,
  date: new Date().toLocaleString()
});
localStorage.setItem("orders", JSON.stringify(orders));

