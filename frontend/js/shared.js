const ui = {
  showLoader(id, show) {
    const loader = document.getElementById(id);
    if (loader) {
      loader.classList.toggle("active", show);
    }
  },
  setNotice(id, message) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = message;
    }
  },
  currency(value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value || 0);
  },
  resolveImage(images = []) {
    if (!Array.isArray(images)) {
      return "";
    }
    return images.find(Boolean) || "";
  },
};

const auth = {
  getUserId(user) {
    return api.getEntityId(user);
  },
  isLoggedIn() {
    return Boolean(api.getToken());
  },
  getUser() {
    return api.getUser();
  },
  async ensureUser() {
    const existingUser = api.getUser();
    if (!api.getToken()) {
      return existingUser;
    }
    if (existingUser?._id) {
      return existingUser;
    }
    try {
      const me = await api.request("/api/users/me");
      api.setUser(me);
      return api.getUser();
    } catch (error) {
      api.clearSession();
      return null;
    }
  },
  logout(redirectTo = "/index.html") {
    api.clearSession();
    window.location.href = redirectTo;
  },
  applyNavState(user) {
    const isLoggedIn = Boolean(user);
    document.querySelectorAll("[data-auth]").forEach((el) => {
      const mode = el.dataset.auth;
      const shouldShow =
        (mode === "user" && isLoggedIn) || (mode === "guest" && !isLoggedIn);
      el.style.display = shouldShow ? "" : "none";
    });

    document.querySelectorAll("[data-role='admin']").forEach((el) => {
      const isAdmin = user?.role === "admin";
      el.style.display = isAdmin ? "" : "none";
    });

    document.querySelectorAll("[data-logout]").forEach((btn) => {
      btn.addEventListener("click", () => auth.logout());
    });
  },
};

document.addEventListener("DOMContentLoaded", async () => {
  const user = await auth.ensureUser();
  auth.applyNavState(user);
});
