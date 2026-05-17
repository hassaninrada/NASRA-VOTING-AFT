import { supabase } from "./supabase-init.js";

const gr = localStorage.getItem("primary_gr");

const votes = {
    headboy: localStorage.getItem("vote_headboy") || "ABSTAIN",
    headgirl: localStorage.getItem("vote_headgirl") || "ABSTAIN",
    deputy_headboy: localStorage.getItem("vote_deputyheadboy") || "ABSTAIN",
    deputy_headgirl: localStorage.getItem("vote_deputyheadgirl") || "ABSTAIN"
};

// UI
document.getElementById("hb").textContent = votes.headboy;
document.getElementById("hg").textContent = votes.headgirl;
document.getElementById("dhb").textContent = votes.deputy_headboy;
document.getElementById("dhg").textContent = votes.deputy_headgirl;

// SESSION
const sessIdEl = document.getElementById("sessId");
if (sessIdEl && gr) sessIdEl.textContent = `#${gr}`;

// FINAL SUBMIT
document.getElementById("finalBtn")?.addEventListener("click", async () => {

    const loader = document.getElementById("loader");
    const finalBtn = document.getElementById("finalBtn");

    finalBtn.disabled = true;

    if (loader) {
        loader.classList.remove("hidden");
        loader.classList.add("flex");
    }

    try {

        const isTch = gr && gr.startsWith("TCH");

        // check already voted
        if (!isTch && gr) {
            const { data } = await supabase
                .from("students")
                .select("voted_primary")
                .eq("cid", gr)
                .single();

            if (data?.voted_primary) {
                alert("Vote already cast for this ID.");
                window.location.href = "index.html";
                return;
            }
        }

        // submit votes
        for (const role in votes) {

            if (votes[role] !== "ABSTAIN") {

                const { error } = await supabase.rpc("vote_upsert_secure", {
                    p_role: role,
                    p_candidate_name: votes[role],
                    p_voter_id: gr || "GUEST"
                });

                if (error) throw error;
            }
        }

        // mark voted
        if (!isTch && gr) {
            await supabase
                .from("students")
                .update({ voted_primary: true })
                .eq("cid", gr);
        }

        // clear storage (FIXED KEYS)
        localStorage.removeItem("vote_headboy");
        localStorage.removeItem("vote_headgirl");
        localStorage.removeItem("vote_deputyheadboy");
        localStorage.removeItem("vote_deputyheadgirl");

        setTimeout(() => {
            window.location.href = "success-primary.html";
        }, 800);

    } catch (err) {

        console.error(err);

        if (loader) {
            loader.classList.add("hidden");
            loader.classList.remove("flex");
        }

        alert("System Error — Try Again");

        finalBtn.disabled = false;
    }
});

// RESTART
document.getElementById("restartBtn")?.addEventListener("click", () => {

    if (confirm("Discard all current selections?")) {

        localStorage.removeItem("vote_headboy");
        localStorage.removeItem("vote_headgirl");
        localStorage.removeItem("vote_deputyheadboy");
        localStorage.removeItem("vote_deputyheadgirl");

        window.location.href = "student-primary.html";
    }
});





