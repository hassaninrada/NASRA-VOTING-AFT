const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
    loginBtn.addEventListener("click", () => {
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        const errorDiv = document.getElementById("error");

        if (!emailInput || !passwordInput) return;

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        const validAdmins = [
            { email: "hassaninrada@gmail.com", password: "7890" },
            { email: "asma.naseer@nasraschool.edu.pk", password: "7890" }
        ];

        const matched = validAdmins.find(
            admin => admin.email === email && admin.password === password
        );

        if (matched) {
            localStorage.setItem("secondary_admin_logged_in", "true");
            window.location.href = "dashboard-secondary.html";
        } else {
            if (errorDiv) {
                errorDiv.classList.remove("hidden");
                errorDiv.classList.add("block");
                setTimeout(() => {
                    errorDiv.classList.add("hidden");
                    errorDiv.classList.remove("block");
                }, 3000);
            }
        }
    });

    // Support Enter key inside the form fields
    document.getElementById("password")?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") loginBtn.click();
    });
    document.getElementById("email")?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") loginBtn.click();
    });
}


