const validTeacherCodes = [
    "TCH101", 
    "TCH102", 
    "TCH103",
    // Add all your codes here...
];

const toggleBtn = document.getElementById("toggleVisibleBtn");
if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
        const input = document.getElementById("teacherCode");
        const icon = document.getElementById("eyeIcon");
        if (input && icon) {
            if (input.type === "password") {
                input.type = "text";
                icon.classList.replace("fa-eye", "fa-eye-slash");
            } else {
                input.type = "password";
                icon.classList.replace("fa-eye-slash", "fa-eye");
            }
        }
    });
}

// Real-time validation feedback
const teacherCodeEl = document.getElementById("teacherCode");
if (teacherCodeEl) {
    teacherCodeEl.addEventListener("input", (e) => {
        const val = e.target.value.trim().toUpperCase();
        const errorElem = document.getElementById("error");
        if (!errorElem) return;

        if (val.length === 0) {
            errorElem.textContent = "Ready for Authentication";
            errorElem.className = "text-blue-400 text-[10px] font-black uppercase tracking-widest text-center min-h-[1rem]";
            return;
        }

        if (validTeacherCodes.includes(val)) {
            errorElem.textContent = "✓ Credential Verified";
            errorElem.className = "text-green-500 text-[10px] font-black uppercase tracking-widest text-center min-h-[1rem]";
        } else if (val.startsWith("TCH") && val.length >= 4) {
            errorElem.textContent = "Validating Sequence...";
            errorElem.className = "text-orange-400 text-[10px] font-black uppercase tracking-widest text-center min-h-[1rem]";
        } else {
            errorElem.textContent = "Entering Authorization Code...";
            errorElem.className = "text-blue-400 text-[10px] font-black uppercase tracking-widest text-center min-h-[1rem]";
        }
    });

    // Allow Enter key to submit
    teacherCodeEl.addEventListener("keypress", (e) => {
        if (e.key === "Enter") teacherLogin();
    });
}

const loginBtn = document.getElementById("authorizeBtn");
if (loginBtn) {
    loginBtn.addEventListener("click", teacherLogin);
}

function teacherLogin() {
    const codeEl = document.getElementById("teacherCode");
    const code = codeEl ? codeEl.value.trim().toUpperCase() : "";
    const errorElem = document.getElementById("error");

    if (!code) {
        if (errorElem) {
            errorElem.textContent = "Credential Required";
            errorElem.className = "text-red-500 text-[10px] font-black uppercase tracking-widest text-center min-h-[1rem]";
        }
        return;
    }

    if (validTeacherCodes.includes(code)) {
        localStorage.setItem("primary_gr", code);
        localStorage.setItem("secondary_current_Cidno", code);
        localStorage.setItem("currentTeacher", code);
        window.location.href = "teacher-hub.html";
    } else {
        if (errorElem) {
            errorElem.textContent = "Access Denied — Invalid Code";
            errorElem.className = "text-red-600 text-[10px] font-black uppercase tracking-widest text-center min-h-[1rem]";
        }
    }
}

