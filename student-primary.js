import { supabase } from "./supabase-init.js";

const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
        const Cidno = document.getElementById("CidnoInput").value.trim();
        const btn = document.getElementById("loginBtn");

        if (!Cidno) {
            showToast("❌ Please enter your Registration ID", "bg-red-500");
            return;
        }

        const numericCidno = Cidno.replace(/\D/g, "");

        // UI Feedback
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch animate-spin"></i> Verifying...';
        }

        try {
            const { data: studentData, error } = await supabase
                .from('students')
                .select('*')
                .eq('cid', numericCidno)
                .single();

            if (error || !studentData) {
                showToast("❌ ID Not Found in Registry", "bg-red-500");
                resetBtn();
                return;
            }

            if (studentData.wing !== "Primary") {
                showToast("❌ Sector Conflict: Access Denied", "bg-red-500");
                resetBtn();
                return;
            }

            if (studentData.voted_primary) {
                showToast("⚠️ Ballot Already Cast for this ID", "bg-amber-500");
                resetBtn();
                return;
            }

            showToast("✅ Verified. Opening Ballot...", "bg-blue-600");
            localStorage.setItem("primary_current_Cidno", numericCidno);
            localStorage.setItem("primary_gr", numericCidno);

            setTimeout(() => {
                window.location.href = "headboy-primary.html";
            }, 600);

        } catch (err) {
            showToast("❌ Connection Failure", "bg-red-500");
            resetBtn();
        }
    });

    // Support Enter key
    document.getElementById("CidnoInput")?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") loginBtn.click();
    });
}

function resetBtn() {
    const btn = document.getElementById("loginBtn");
    if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<span>Authorize Session</span><i class="fa-solid fa-arrow-right-long transition-transform group-hover:translate-x-2"></i>';
    }
}

function showToast(msg, bg) {
    const toast = document.getElementById("toast");
    if (toast) {
        toast.textContent = msg;
        toast.className = `fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold text-sm z-50 transition-all ${bg} block fadeIn`;
        setTimeout(() => {
            if (toast) toast.classList.add('hidden');
        }, 4000);
    }
}

