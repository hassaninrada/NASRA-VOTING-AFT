import { supabase } from "./supabase-init.js";

const cid = localStorage.getItem("secondary_current_Cidno");
const v = {
    hb: localStorage.getItem("vote_headboy_secondary") || "ABSTAIN",
    hg: localStorage.getItem("vote_headgirl_secondary") || "ABSTAIN",
    dhb: localStorage.getItem("vote_deputyboy_secondary") || "ABSTAIN",
    dhg: localStorage.getItem("vote_deputygirl_secondary") || "ABSTAIN"
};

const sessIdEl = document.getElementById("sessId");
if (sessIdEl && cid) sessIdEl.textContent = `#${cid}`;

const hbEl = document.getElementById("hb");
if (hbEl) hbEl.textContent = v.hb;

const hgEl = document.getElementById("hg");
if (hgEl) hgEl.textContent = v.hg;

const dhbEl = document.getElementById("dhb");
if (dhbEl) dhbEl.textContent = v.dhb;

const dhgEl = document.getElementById("dhg");
if (dhgEl) dhgEl.textContent = v.dhg;

const finalBtn = document.getElementById("finalBtn");
if (finalBtn) {
    finalBtn.addEventListener("click", async () => {
        const overlay = document.getElementById("overlay");

        finalBtn.disabled = true;
        if (overlay) {
            overlay.classList.remove("hidden");
            overlay.classList.add("flex");
        }

        try {
            const isTch = cid && cid.startsWith("TCH");
            if (!isTch && cid) {
                const { data: s } = await supabase.from('students').select('voted_secondary').eq('cid', cid).single();
                if (s?.voted_secondary) {
                    alert("Submission blocked: ID already voted.");
                    window.location.href = "index.html";
                    return;
                }
            }

            const roles = {
                hb: "headboy_secondary",
                hg: "headgirl_secondary",
                dhb: "deputyboy_secondary",
                dhg: "deputygirl_secondary"
            };

            for (const key in v) {
                if (v[key] !== "ABSTAIN") {
                    await supabase.rpc('vote_upsert_secure', {
                        p_role: roles[key],
                        p_candidate_name: v[key],
                        p_voter_id: cid || "GUEST"
                    });
                }
            }

            if (!isTch && cid) {
                await supabase.from('students').update({ voted_secondary: true }).eq('cid', cid);
            }

            localStorage.removeItem("vote_headboy_secondary");
            localStorage.removeItem("vote_headgirl_secondary");
            localStorage.removeItem("vote_deputyboy_secondary");
            localStorage.removeItem("vote_deputygirl_secondary");

            setTimeout(() => { window.location.href = "success-secondary.html"; }, 800);

        } catch (error) {
            if (overlay) {
                overlay.classList.add("hidden");
                overlay.classList.remove("flex");
            }
            showToast("❌ System Connectivity Failure — Please Retry", "bg-red-500");
            finalBtn.disabled = false;
        }
    });
}

const restartBtn = document.getElementById("restartBtn");
if (restartBtn) {
    restartBtn.addEventListener("click", () => {
        if (confirm("Discard all current selections?")) {
            localStorage.removeItem("vote_headboy_secondary");
            localStorage.removeItem("vote_headgirl_secondary");
            localStorage.removeItem("vote_deputyboy_secondary");
            localStorage.removeItem("vote_deputygirl_secondary");
            window.location.href = "student-secondary.html";
        }
    });
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

