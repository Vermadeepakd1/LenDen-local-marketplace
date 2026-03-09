const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    ui.showLoader("authLoader", true);
    ui.setNotice("authNotice", "");

    const payload = Object.fromEntries(new FormData(registerForm).entries());

    try {
      const data = await api.request("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      api.setToken(data.token);
      if (data.user) {
        api.setUser(data.user);
      }
      window.location.href = "/dashboard.html";
    } catch (error) {
      ui.setNotice("authNotice", error.message);
    } finally {
      ui.showLoader("authLoader", false);
    }
  });
}
