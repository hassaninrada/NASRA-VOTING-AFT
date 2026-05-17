import { supabase } from "./supabase-init.js";

// Get student session
const gr = localStorage.getItem("primary_gr");

if (!gr) {
    alert("No active voting session found.");
    window.location.href = "student-primary.html";
}

// Load votes
const votes = {
    headboy: localStorage.getItem("vote_headboy") || "ABSTAIN",
    headgirl: localStorage.getItem("vote_headgirl") || "ABSTAIN",
    deputy_headboy: localStorage.getItem("vote_deputyheadboy") || "ABSTAIN",
    deputy_headgirl: localStorage.getItem("vote_deputyheadgirl") || "ABSTAIN",
};

// Show session ID
const sessIdEl = document.getElementById("sessId");
if (sessIdEl) {
    sessIdEl.textContent = `#${gr}`;
}

// SHOW VOTES IN UI
const hbEl = document.getElementById("hb");
if (hbEl) hbEl.textContent = votes.headboy;

const hgEl = document.getElementById("hg");
if (hgEl) hgEl.textContent = votes.headgirl;

const dhbEl = document.getElementById("dhb");
if (dhbEl) dhbEl.textContent = votes.deputy_headboy;

const dhgEl = document.getElementById("dhg");
if (dhgEl) dhgEl.textContent = votes.deputy_headgirl;

// FINAL SUBMIT
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

            const isTch = gr.startsWith("TCH");

            // CHECK ALREADY VOTED
            if (!isTch) {
                const { data: studentData, error } = await supabase
                    .from("students")
                    .select("voted_primary")
                    .eq("cid", gr)
                    .single();

                if (error) throw error;

                if (studentData?.voted_primary) {
                    alert("Vote already cast for this ID.");
                    window.location.href = "index.html";
                    return;
                }
            }

            // SUBMIT ALL VOTES
            for (const role in votes) {

                if (votes[role] !== "ABSTAIN") {

                    const { error } = await supabase.rpc("vote_upsert_secure", {
                        p_role: role,
                        p_candidate_name: votes[role],
                        p_voter_id: gr
                    });

                    if (error) throw error;
                }
            }

            // MARK AS VOTED
            if (!isTch) {
                const { error } = await supabase
                    .from("students")
                    .update({ voted_primary: true })
                    .eq("cid", gr);

                if (error) throw error;
            }

            // CLEAR LOCAL STORAGE
            localStorage.removeItem("vote_headboy");
            localStorage.removeItem("vote_headgirl");
            localStorage.removeItem("vote_deputyheadboy");
            localStorage.removeItem("vote_deputyheadgirl");

            setTimeout(() => {
                window.location.href = "success-primary.html";
            }, 800);

        } catch (err) {

            console.error("Voting Error:", err);

            if (loader) {
                loader.classList.add("hidden");
                loader.classList.remove("flex");
            }

            alert("System Failure — Please Retry");

            finalBtn.disabled = false;
        }
    });
}

// RESTART
const restartBtn = document.getElementById("restartBtn");

if (restartBtn) {
    restartBtn.addEventListener("click", () => {

        if (confirm("Discard all selections?")) {

            localStorage.removeItem("vote_headboy");
            localStorage.removeItem("vote_headgirl");
            localStorage.removeItem("vote_deputyheadboy");
            localStorage.removeItem("vote_deputyheadgirl");

            window.location.href = "student-primary.html";
        }
    });
}
