// AXOS BANK - Supabase Connection

const SUPABASE_URL = "https://ebqwsexifwpopbatxfds.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_lgjSIvBvxXojf5_gwanQMQ_GrBEDveP";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

// AXOS BANK - Dashboard Access Protection

async function checkUserAccess() {

    const { data, error } = await supabaseClient.auth.getUser();

    if (error || !data.user) {
        window.location.href = "login.html";
        return false;
    }

    const ADMIN_UID = "450d8222-2151-474a-9107-25d7cee633f6";
    const VISITOR_UID = "a82d9ec8-f257-4348-bc94-048cc77e0779";

    let userRole;

    if (data.user.id === ADMIN_UID) {
        userRole = "admin";
    } else if (data.user.id === VISITOR_UID) {
        userRole = "visitor";
    } else {
        await supabaseClient.auth.signOut();
        window.location.href = "login.html";
        return false;
    }

    localStorage.setItem("axosBankRole", userRole);

    return true;
}
function getUserRole() {
    return localStorage.getItem("axosBankRole");
}

function isAdmin() {
    return getUserRole() === "admin";
}

function isVisitor() {
    return getUserRole() === "visitor";
}

testSupabaseConnection();