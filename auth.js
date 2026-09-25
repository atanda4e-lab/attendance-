// ==========================================
// ATTENDCHECK - STUDENT AUTHENTICATION
// ==========================================

import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// ==========================================
// ELEMENTS
// ==========================================

const loginTab =
    document.getElementById("loginTab");

const registerTab =
    document.getElementById("registerTab");

const loginForm =
    document.getElementById("loginForm");

const registerForm =
    document.getElementById("registerForm");

const authMessage =
    document.getElementById("authMessage");


// ==========================================
// SHOW MESSAGE
// ==========================================

function showMessage(message, type = "error") {

    authMessage.style.display = "block";

    authMessage.textContent = message;

    authMessage.className =
        `auth-message ${type}`;
}


// ==========================================
// LOGIN / REGISTER TABS
// ==========================================

loginTab.addEventListener("click", () => {

    loginTab.classList.add("active");

    registerTab.classList.remove("active");

    loginForm.style.display = "block";

    registerForm.style.display = "none";

    authMessage.style.display = "none";
});


registerTab.addEventListener("click", () => {

    registerTab.classList.add("active");

    loginTab.classList.remove("active");

    loginForm.style.display = "none";

    registerForm.style.display = "block";

    authMessage.style.display = "none";
});


// ==========================================
// STUDENT REGISTRATION
// ==========================================

registerForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const fullName =
            document.getElementById(
                "registerName"
            ).value.trim();


        const matricNumber =
            document.getElementById(
                "registerMatric"
            ).value.trim();


        const email =
            document.getElementById(
                "registerEmail"
            ).value.trim();


        const password =
            document.getElementById(
                "registerPassword"
            ).value;


        const confirmPassword =
            document.getElementById(
                "registerConfirmPassword"
            ).value;


        // Check passwords
        if (password !== confirmPassword) {

            showMessage(
                "Passwords do not match."
            );

            return;
        }


        if (password.length < 6) {

            showMessage(
                "Password must contain at least 6 characters."
            );

            return;
        }


        try {

            showMessage(
                "Creating your account...",
                "checking"
            );


            // Create Firebase account
            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user =
                userCredential.user;


            // Save student information
            await setDoc(
                doc(
                    db,
                    "users",
                    user.uid
                ),
                {

                    uid:
                        user.uid,

                    fullName:
                        fullName,

                    matricNumber:
                        matricNumber,

                    email:
                        email,

                    role:
                        "student",

                    createdAt:
                        serverTimestamp()

                }
            );


            showMessage(
                "Account created successfully! Redirecting...",
                "success"
            );


            setTimeout(() => {

                window.location.href =
                    "student.html";

            }, 1500);


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            let message =
                "Unable to create account.";


            if (
                error.code ===
                "auth/email-already-in-use"
            ) {

                message =
                    "This email address is already registered.";

            }

            else if (
                error.code ===
                "auth/invalid-email"
            ) {

                message =
                    "Please enter a valid email address.";

            }

            else if (
                error.code ===
                "auth/weak-password"
            ) {

                message =
                    "Password is too weak.";

            }

            else if (
                error.code ===
                "auth/network-request-failed"
            ) {

                message =
                    "Network error. Check your internet connection.";

            }

            else {

                message =
                    error.message;
            }


            showMessage(message);
        }

    }
);


// ==========================================
// STUDENT LOGIN
// ==========================================

loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const email =
            document.getElementById(
                "loginEmail"
            ).value.trim();


        const password =
            document.getElementById(
                "loginPassword"
            ).value;


        try {

            showMessage(
                "Signing you in...",
                "checking"
            );


            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


            showMessage(
                "Login successful! Redirecting...",
                "success"
            );


            setTimeout(() => {

                window.location.href =
                    "student.html";

            }, 1000);


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            let message =
                "Unable to log in.";


            if (
                error.code ===
                "auth/invalid-credential"
            ) {

                message =
                    "Incorrect email or password.";

            }

            else if (
                error.code ===
                "auth/user-not-found"
            ) {

                message =
                    "No account was found with this email.";

            }

            else if (
                error.code ===
                "auth/wrong-password"
            ) {

                message =
                    "Incorrect password.";

            }

            else if (
                error.code ===
                "auth/invalid-email"
            ) {

                message =
                    "Please enter a valid email address.";

            }

            else {

                message =
                    error.message;
            }


            showMessage(message);
        }

    }
);


// ==========================================
// CHECK CURRENT USER
// ==========================================

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            console.log(
                "No student currently logged in."
            );

            return;
        }


        console.log(
            "Logged-in user:",
            user.email
        );


        try {

            const userRef =
                doc(
                    db,
                    "users",
                    user.uid
                );


            const userSnapshot =
                await getDoc(userRef);


            if (userSnapshot.exists()) {

                console.log(
                    "Student profile:",
                    userSnapshot.data()
                );

            }

        } catch (error) {

            console.error(
                "Unable to load student profile:",
                error
            );

        }

    }
);