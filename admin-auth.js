import { auth, db } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const form = document.getElementById("adminLoginForm");
const message = document.getElementById("adminAuthMessage");


// Check if an already logged-in user is an admin
onAuthStateChanged(auth, async (user) => {

    if (!user) {
        return;
    }

    try {

        const adminRef = doc(db, "users", user.uid);
        const adminSnap = await getDoc(adminRef);

        if (
            adminSnap.exists() &&
            adminSnap.data().role === "admin"
        ) {

            window.location.replace("admin.html");

        }

    } catch (error) {

        console.error(error);

    }

});


// Admin login
form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
        document.getElementById("adminEmail")
            .value
            .trim();

    const password =
        document.getElementById("adminPassword")
            .value;


    message.textContent =
        "Checking administrator account...";


    try {

        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


        const user =
            userCredential.user;


        const adminRef =
            doc(db, "users", user.uid);

        const adminSnap =
            await getDoc(adminRef);


        if (!adminSnap.exists()) {

            await signOut(auth);

            message.textContent =
                "No administrator profile was found for this account.";

            return;
        }


        const adminData =
            adminSnap.data();


        if (adminData.role !== "admin") {

            await signOut(auth);

            message.textContent =
                "Access denied. This account is not an administrator.";

            return;
        }


        message.textContent =
            "Admin login successful. Opening dashboard...";


        window.location.replace("admin.html");


    } catch (error) {

        console.error("Admin login error:", error);


        if (
            error.code === "auth/invalid-credential" ||
            error.code === "auth/wrong-password" ||
            error.code === "auth/user-not-found"
        ) {

            message.textContent =
                "Incorrect admin email or password.";

        } else if (
            error.code === "auth/too-many-requests"
        ) {

            message.textContent =
                "Too many login attempts. Please try again later.";

        } else {

            message.textContent =
                "Login failed. Please check your Firebase account.";

        }

    }

});