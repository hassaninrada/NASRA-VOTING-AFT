const exitBtn = document.getElementById("exitBtn");
if (exitBtn) {
    exitBtn.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}

// Security: Prevent back navigation to voting sequence
history.pushState(null, null, location.href);
window.onpopstate = function () {
    history.go(1);
};
