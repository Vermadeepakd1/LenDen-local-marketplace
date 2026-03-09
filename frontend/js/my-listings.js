const listingsGrid = document.getElementById("myListingsGrid");

const loadListings = async () => {
  ui.showLoader("myListingsLoader", true);
  ui.setNotice("myListingsNotice", "");
  try {
    const user = await auth.ensureUser();
    if (!user) {
      ui.setNotice("myListingsNotice", "Please log in to view your listings.");
      return;
    }
    if (!listingsGrid) {
      return;
    }

    const listings = await api.request("/api/users/me/listings");

    if (!listings.length) {
      listingsGrid.innerHTML =
        "<div class='notice'>You have not created any listings yet.</div>";
      return;
    }

    listingsGrid.innerHTML = listings
      .map((product) => {
        const imageUrl = ui.resolveImage(product.images);
        return `
      <div class="card">
        <div class="card-media">
          ${
            imageUrl
              ? `<img src="${imageUrl}" alt="${product.title}" loading="lazy" />`
              : `<div class="media-fallback">No image</div>`
          }
        </div>
        <div class="card-body">
          <h4>${product.title}</h4>
          <div class="price">${ui.currency(product.price)}</div>
          <div class="meta">${product.status} - ${
            product.isApproved ? "Approved" : "Pending"
          }</div>
          <div class="meta">${product.condition}</div>
          <div class="hero-cta">
            <a class="btn secondary" href="/product.html?id=${
              product._id
            }">View</a>
            <button class="btn secondary" data-sold="${product._id}">
              Mark sold
            </button>
          </div>
        </div>
      </div>
    `;
      })
      .join("");

    document.querySelectorAll("[data-sold]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        await api.request(`/api/products/${btn.dataset.sold}/sold`, {
          method: "PATCH",
        });
        loadListings();
      });
    });
  } catch (error) {
    ui.setNotice("myListingsNotice", error.message);
  } finally {
    ui.showLoader("myListingsLoader", false);
  }
};

loadListings();

