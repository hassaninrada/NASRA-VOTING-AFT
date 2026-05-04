import { supabase } from "./supabase-init.js";

const gr = localStorage.getItem("primary_gr");
const votes = {
    headboy: localStorage.getItem("vote_headboy") || "ABSTAIN",
    headgirl: localStorage.getItem("vote_headgirl") || "ABSTAIN",
    deputyboy: localStorage.getItem("vote_deputyboy") || "ABSTAIN",
    deputygirl: localStorage.getItem("vote_deputygirl") || "ABSTAIN"
};

const sessIdEl = document.getElementById("sessId");
if (sessIdEl && gr) sessIdEl.textContent = `#${gr}`;

const hbEl = document.getElementById("hb");
if (hbEl) hbEl.textContent = votes.headboy;

const hgEl = document.getElementById("hg");
if (hgEl) hgEl.textContent = votes.headgirl;

const dhbEl = document.getElementById("dhb");
if (dhbEl) dhbEl.textContent = votes.deputyboy;

const dhgEl = document.getElementById("dhg");
if (dhgEl) dhgEl.textContent = votes.deputygirl;

const finalBtn = document.getElementById("finalBtn");
if (finalBtn) {
    finalBtn.addEventListener("click", async () => {
        const loader = document.getElementById("loader");

        finalBtn.disabled = true;
        if (loader) {
            loader.classList.remove("hidden");
            loader.classList.add("flex");
        }

        try {
            const isTch = gr && gr.startsWith("TCH");
            if (!isTch && gr) {
                const { data: s } = await supabase.from('students').select('voted_primary').eq('cid', gr).single();
                if (s?.voted_primary) {
                    alert("Vote already cast for this ID.");
                    window.location.href = "index.html";
                    return;
                }
            }

            for (const role in votes) {
                if (votes[role] !== "ABSTAIN") {
                    await supabase.rpc('vote_upsert_secure', {
                        p_role: role,
                        p_candidate_name: votes[role],
                        p_voter_id: gr || "GUEST"
                    });
                }
            }

            if (!isTch && gr) {
                await supabase.from('students').update({ voted_primary: true }).eq('cid', gr);
            }

            localStorage.removeItem("vote_headboy");
            localStorage.removeItem("vote_headgirl");
            localStorage.removeItem("vote_deputyboy");
            localStorage.removeItem("vote_deputygirl");

            setTimeout(() => { window.location.href = "success-primary.html"; }, 800);

        } catch (err) {
            if (loader) {
                loader.classList.add("hidden");
                loader.classList.remove("flex");
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
            localStorage.removeItem("vote_headboy");
            localStorage.removeItem("vote_headgirl");
            localStorage.removeItem("vote_deputyboy");
            localStorage.removeItem("vote_deputygirl");
            window.location.href = "student-primary.html";
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

