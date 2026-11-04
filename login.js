// AXOS BANK - Supabase Login System

const ADMIN_UID = "450d8222-2151-474a-9107-25d7cee633f6";

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        alert("Incorrect email or password. Access denied.");
        return;
    }

    const user = data.user;

    const role = user.id === ADMIN_UID ? "admin" : "visitor";

    localStorage.setItem("axosBankRole", role);

    window.location.href = "index.html";
});