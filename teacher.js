const validTeacherCodes = [
"1235","394","645","655","669","676","678","679","686",
"703","704","713","716","720","722","733","734",
"735","739","745","772","774","788","786","954",
"1037","2274","2779","2305","2311","2408","2538",
"2852","2903","3142","3271","3276","3315","3494",
"3600","3512","3513","3581","3595","3647","3746",
"3749","3762","3788","3790","3792","3867","3869",
"3880","3907","3912","3914","3959","3976","3986",
"3989","3997","4008","4010","4029","4051","3976",
"3986","3989","3997","4008","4010","4029","4051",
"4066","4073","4078","4079","4084","4113","4121",
"4124","4125","4132","4138","4169","4172","4194",
"4195","4205","4220","4221","4234","4235","4245",
"4246","4251","4252","4258","4265","4266","4267",
"4268","4269","4270","4271","4272","4273","4274",
"4277","4280","4281","4282","4283","4284","4285",
"4287","4288","4289","4324","4334","4344","4345",
"4346"
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

