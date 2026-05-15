const adminCredentials = {
    "hassaninrada@gmail.com": "123456",
    "asma.naseer@nasraschool.edu.pk": "123456"
};

const adminForm = document.getElementById("adminForm");
if (adminForm) {
    adminForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("email").value.trim();
        const pass = document.getElementById("password").value.trim();
        const errorDiv = document.getElementById("adminError");

        if (adminCredentials[email] && adminCredentials[email] === pass) {
            localStorage.setItem("loggedAdminPrimary", email);
            window.location.href = "dashboard-primary.html";
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
}

