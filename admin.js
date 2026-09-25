// ==========================================
// ATTENDCHECK - ADMIN SYSTEM
// Course Setup + Sessions + Testing Mode
// Attendance Records
// ==========================================

import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// ==========================================
// ELEMENTS
// ==========================================

const courseForm = document.getElementById("courseForm");
const courseCode = document.getElementById("courseCode");
const courseTitle = document.getElementById("courseTitle");
const classLocation = document.getElementById("classLocation");
const getLocationBtn = document.getElementById("getLocationBtn");
const locationMessage = document.getElementById("locationMessage");
const latitudeInput = document.getElementById("latitude");
const longitudeInput = document.getElementById("longitude");
const radiusInput = document.getElementById("radius");

const sessionForm = document.getElementById("sessionForm");
const sessionCourse = document.getElementById("sessionCourse");
const sessionDate = document.getElementById("sessionDate");
const sessionStartTime = document.getElementById("sessionStartTime");
const sessionEndTime = document.getElementById("sessionEndTime");
const sessionMessage = document.getElementById("sessionMessage");
const generatedCodeBox = document.getElementById("generatedCodeBox");
const generatedAttendanceCode =
    document.getElementById("generatedAttendanceCode");
const copyAttendanceCodeBtn =
    document.getElementById("copyAttendanceCodeBtn");

const refreshSessionsBtn =
    document.getElementById("refreshSessionsBtn");

const sessionsMessage =
    document.getElementById("sessionsMessage");

const activeSessionsList =
    document.getElementById("activeSessionsList");

const testingModeStatus =
    document.getElementById("testingModeStatus");

const testingModeBtn =
    document.getElementById("testingModeBtn");

const testingModeMessage =
    document.getElementById("testingModeMessage");

const totalAttendance =
    document.getElementById("totalAttendance");

const todayAttendance =
    document.getElementById("todayAttendance");

const uniqueStudents =
    document.getElementById("uniqueStudents");

const attendanceSearch =
    document.getElementById("attendanceSearch");

const refreshAttendanceBtn =
    document.getElementById("refreshAttendanceBtn");

const attendanceTableBody =
    document.getElementById("attendanceTableBody");


// ==========================================
// VARIABLES
// ==========================================

let currentAdmin = null;
let currentAdminProfile = null;

let courses = [];
let attendanceRecords = [];

let testingMode = false;


// ==========================================
// AUTH PROTECTION
// ==========================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.replace("admin-auth.html");
        return;
    }

    try {

        const adminRef =
            doc(db, "users", user.uid);

        const adminSnap =
            await getDoc(adminRef);

        if (!adminSnap.exists()) {

            await signOut(auth);

            window.location.replace("admin-auth.html");

            return;
        }

        const adminData =
            adminSnap.data();

        if (adminData.role !== "admin") {

            await signOut(auth);

            window.location.replace("admin-auth.html");

            return;
        }

        currentAdmin = user;

        currentAdminProfile = adminData;

        await loadTestingMode();
        await loadCourses();
        await loadActiveSessions();
        await loadAttendance();

    } catch (error) {

        console.error(
            "Admin authentication error:",
            error
        );
    }
});


// ==========================================
// LOGOUT
// ==========================================

const logoutButtons =
    document.querySelectorAll(
        "#adminLogoutBtn, .admin-logout-btn"
    );

logoutButtons.forEach((button) => {

    button.addEventListener(
        "click",
        async () => {

            try {

                await signOut(auth);

                window.location.replace(
                    "admin-auth.html"
                );

            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );
            }
        }
    );
});


// ==========================================
// GET CURRENT DATE
// ==========================================

function getLocalDate() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            now.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// ==========================================
// GENERATE 6 DIGIT CODE
// ==========================================

function generateAttendanceCode() {

    return String(
        Math.floor(
            100000 +
            Math.random() * 900000
        )
    );
}


// ==========================================
// TESTING MODE
// ==========================================

async function loadTestingMode() {

    try {

        const settingsRef =
            doc(
                db,
                "settings",
                "system"
            );

        const settingsSnap =
            await getDoc(settingsRef);

        if (
            settingsSnap.exists()
        ) {

            testingMode =
                settingsSnap.data().testingMode === true;

        } else {

            testingMode = false;
        }

        updateTestingModeUI();

    } catch (error) {

        console.error(
            "Testing mode error:",
            error
        );

        testingMode = false;

        updateTestingModeUI();
    }
}


// ==========================================
// TESTING MODE UI
// ==========================================

function updateTestingModeUI() {

    if (testingModeStatus) {

        testingModeStatus.textContent =
            testingMode
                ? "🧪 Testing Mode is active"
                : "🔒 Testing Mode is OFF";
    }


    if (testingModeBtn) {

        testingModeBtn.textContent =
            testingMode
                ? "Turn Testing Mode OFF"
                : "Turn Testing Mode ON";
    }


    if (testingModeMessage) {

        testingModeMessage.textContent =
            testingMode
                ? "🧪 Testing Mode is active. GPS distance restrictions can be bypassed for test attendance."
                : "Normal attendance mode is active. Students must be within the configured GPS radius.";
    }
}


// ==========================================
// TOGGLE TESTING MODE
// ==========================================

if (testingModeBtn) {

    testingModeBtn.addEventListener(
        "click",
        async () => {

            if (!currentAdmin) {
                return;
            }

            try {

                testingMode =
                    !testingMode;


                await setDoc(
                    doc(
                        db,
                        "settings",
                        "system"
                    ),
                    {
                        testingMode:
                            testingMode,

                        updatedBy:
                            currentAdmin.uid,

                        updatedAt:
                            serverTimestamp()
                    },
                    {
                        merge: true
                    }
                );


                updateTestingModeUI();


            } catch (error) {

                console.error(
                    "Could not update testing mode:",
                    error
                );

                testingMode =
                    !testingMode;

                updateTestingModeUI();

                if (testingModeMessage) {

                    testingModeMessage.textContent =
                        "Unable to update Testing Mode. Please try again.";
                }
            }
        }
    );
}


// ==========================================
// GET ADMIN GPS LOCATION
// ==========================================

if (getLocationBtn) {

    getLocationBtn.addEventListener(
        "click",
        () => {

            if (!navigator.geolocation) {

                if (locationMessage) {
                    locationMessage.textContent =
                        "Geolocation is not supported by this browser.";
                }

                return;
            }


            getLocationBtn.disabled = true;

            getLocationBtn.textContent =
                "Getting Location...";


            navigator.geolocation.getCurrentPosition(

                (position) => {

                    const lat =
                        position.coords.latitude;

                    const lng =
                        position.coords.longitude;


                    if (latitudeInput) {
                        latitudeInput.value =
                            lat;
                    }

                    if (longitudeInput) {
                        longitudeInput.value =
                            lng;
                    }


                    if (classLocation) {

                        classLocation.value =
                            `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                    }


                    if (locationMessage) {

                        locationMessage.textContent =
                            "✅ Class location captured successfully.";
                    }


                    getLocationBtn.disabled = false;

                    getLocationBtn.textContent =
                        "Use My Current Location";

                },

                (error) => {

                    console.error(
                        "Location error:",
                        error
                    );


                    if (locationMessage) {

                        locationMessage.textContent =
                            "❌ Unable to get your location. Please allow location access.";
                    }


                    getLocationBtn.disabled = false;

                    getLocationBtn.textContent =
                        "Use My Current Location";
                },

                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 0
                }
            );
        }
    );
}


// ==========================================
// CREATE COURSE
// ==========================================

if (courseForm) {

    courseForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            if (!currentAdmin) {
                return;
            }


            const code =
                courseCode?.value
                    .trim()
                    .toUpperCase();

            const title =
                courseTitle?.value
                    .trim();

            const location =
                classLocation?.value
                    .trim();

            const latitude =
                Number(
                    latitudeInput?.value
                );

            const longitude =
                Number(
                    longitudeInput?.value
                );

            const radius =
                Number(
                    radiusInput?.value
                );


            if (
                !code ||
                !title ||
                !Number.isFinite(latitude) ||
                !Number.isFinite(longitude) ||
                !Number.isFinite(radius)
            ) {

                if (locationMessage) {

                    locationMessage.textContent =
                        "Please complete all course and location fields.";
                }

                return;
            }


            try {

                await addDoc(
                    collection(
                        db,
                        "courses"
                    ),
                    {
                        code: code,
                        title: title,
                        location: location,

                        latitude:
                            latitude,

                        longitude:
                            longitude,

                        radius:
                            radius,

                        createdAt:
                            serverTimestamp(),

                        createdBy:
                            currentAdmin.uid
                    }
                );


                if (locationMessage) {

                    locationMessage.textContent =
                        "✅ Course created successfully.";
                }


                courseForm.reset();

                await loadCourses();

            } catch (error) {

                console.error(
                    "Course creation error:",
                    error
                );

                if (locationMessage) {

                    locationMessage.textContent =
                        "❌ Unable to create course.";
                }
            }
        }
    );
}


// ==========================================
// LOAD COURSES
// ==========================================

async function loadCourses() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "courses"
                )
            );


        courses = [];


        snapshot.forEach(
            (docSnap) => {

                courses.push({
                    id: docSnap.id,
                    ...docSnap.data()
                });

            }
        );


        populateCourseDropdown();

    } catch (error) {

        console.error(
            "Loading courses failed:",
            error
        );
    }
}


// ==========================================
// COURSE DROPDOWN
// ==========================================

function populateCourseDropdown() {

    if (!sessionCourse) {
        return;
    }


    sessionCourse.innerHTML =
        `<option value="">
            Select Course
        </option>`;


    courses.forEach(
        (course) => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                course.id;


            option.textContent =
                `${course.code || "---"} - ${course.title || "Untitled Course"}`;


            sessionCourse.appendChild(
                option
            );
        }
    );
}


// ==========================================
// CREATE ATTENDANCE SESSION
// ==========================================

if (sessionForm) {

    sessionForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            if (!currentAdmin) {
                return;
            }


            const selectedCourseId =
                sessionCourse?.value;


            if (!selectedCourseId) {

                showSessionMessage(
                    "Please select a course."
                );

                return;
            }


            const selectedCourse =
                courses.find(
                    (course) =>
                        course.id ===
                        selectedCourseId
                );


            if (!selectedCourse) {

                showSessionMessage(
                    "Selected course could not be found."
                );

                return;
            }


            const date =
                sessionDate?.value;


            const startTime =
                sessionStartTime?.value;


            const endTime =
                sessionEndTime?.value;


            if (
                !date ||
                !startTime ||
                !endTime
            ) {

                showSessionMessage(
                    "Please complete the session date and time."
                );

                return;
            }


            if (endTime <= startTime) {

                showSessionMessage(
                    "End time must be later than start time."
                );

                return;
            }


            const attendanceCode =
                generateAttendanceCode();


            try {

                await addDoc(
                    collection(
                        db,
                        "attendanceSessions"
                    ),
                    {

                        courseId:
                            selectedCourse.id,

                        courseCode:
                            selectedCourse.code || "",

                        courseTitle:
                            selectedCourse.title || "",

                        date:
                            date,

                        startTime:
                            startTime,

                        endTime:
                            endTime,

                        latitude:
                            Number(
                                selectedCourse.latitude
                            ),

                        longitude:
                            Number(
                                selectedCourse.longitude
                            ),

                        radius:
                            Number(
                                selectedCourse.radius
                            ),

                        code:
                            attendanceCode,

                        createdBy:
                            currentAdmin.uid,

                        createdAt:
                            serverTimestamp(),

                        active:
                            true,

                        testingMode:
                            testingMode === true
                    }
                );


                if (generatedCodeBox) {
                    generatedCodeBox.style.display =
                        "block";
                }


                if (generatedAttendanceCode) {

                    generatedAttendanceCode.textContent =
                        attendanceCode;
                }


                showSessionMessage(
                    testingMode
                        ? "🧪 Test attendance session created successfully."
                        : "✅ Attendance session created successfully."
                );


                sessionForm.reset();


                await loadActiveSessions();

            } catch (error) {

                console.error(
                    "Session creation error:",
                    error
                );

                showSessionMessage(
                    "❌ Unable to create attendance session."
                );
            }
        }
    );
}


// ==========================================
// SESSION MESSAGE
// ==========================================

function showSessionMessage(message) {

    if (sessionMessage) {
        sessionMessage.textContent =
            message;
    }
}


// ==========================================
// LOAD ACTIVE SESSIONS
// ==========================================

async function loadActiveSessions() {

    if (!activeSessionsList) {
        return;
    }


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "attendanceSessions"
                )
            );


        const sessions = [];


        snapshot.forEach(
            (docSnap) => {

                const data =
                    docSnap.data();


                if (data.active === true) {

                    sessions.push({
                        id: docSnap.id,
                        ...data
                    });
                }
            }
        );


        sessions.sort(
            (a, b) => {

                const first =
                    `${a.date || ""} ${a.startTime || ""}`;

                const second =
                    `${b.date || ""} ${b.startTime || ""}`;

                return second.localeCompare(
                    first
                );
            }
        );


        renderActiveSessions(
            sessions
        );


    } catch (error) {

        console.error(
            "Loading active sessions failed:",
            error
        );


        if (sessionsMessage) {

            sessionsMessage.textContent =
                "Unable to load active sessions.";
        }
    }
}


// ==========================================
// RENDER ACTIVE SESSIONS
// ==========================================

function renderActiveSessions(sessions) {

    if (!activeSessionsList) {
        return;
    }


    if (!sessions.length) {

        activeSessionsList.innerHTML =
            `<div class="empty-state">
                No active attendance sessions.
            </div>`;

        return;
    }


    activeSessionsList.innerHTML = "";


    sessions.forEach(
        (session) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "session-card";


            const modeText =
                session.testingMode === true
                    ? "🧪 Testing Mode"
                    : "📍 Normal Mode";


            card.innerHTML = `

                <div class="session-card-content">

                    <div class="session-card-main">

                        <span class="session-mode">
                            ${modeText}
                        </span>

                        <h3>
                            ${session.courseCode || "---"}
                        </h3>

                        <p>
                            ${session.courseTitle || "Untitled Course"}
                        </p>

                        <div class="session-details">

                            <span>
                                📅 ${session.date || "-"}
                            </span>

                            <span>
                                🕐 ${session.startTime || "--:--"}
                                -
                                ${session.endTime || "--:--"}
                            </span>

                            <span>
                                🔢 Code:
                                <strong>
                                    ${session.code || "------"}
                                </strong>
                            </span>

                        </div>

                    </div>


                    <div class="session-card-actions">

                        <span class="active-badge">
                            ACTIVE
                        </span>

                        <button
                            type="button"
                            class="close-session-btn"
                            data-id="${session.id}"
                        >
                            Close Session
                        </button>

                    </div>

                </div>
            `;


            activeSessionsList.appendChild(
                card
            );
        }
    );


    document
        .querySelectorAll(
            ".close-session-btn"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        closeSession(
                            button.dataset.id
                        );
                    }
                );
            }
        );
}


// ==========================================
// CLOSE SESSION
// ==========================================

async function closeSession(
    sessionId
) {

    if (!sessionId || !currentAdmin) {
        return;
    }


    const confirmClose =
        confirm(
            "Are you sure you want to close this attendance session?"
        );


    if (!confirmClose) {
        return;
    }


    try {

        await updateDoc(
            doc(
                db,
                "attendanceSessions",
                sessionId
            ),
            {
                active: false,

                closedAt:
                    serverTimestamp(),

                closedBy:
                    currentAdmin.uid
            }
        );


        if (sessionsMessage) {

            sessionsMessage.textContent =
                "✅ Attendance session closed.";
        }


        await loadActiveSessions();


    } catch (error) {

        console.error(
            "Closing session failed:",
            error
        );


        if (sessionsMessage) {

            sessionsMessage.textContent =
                "❌ Unable to close attendance session.";
        }
    }
}


// ==========================================
// LOAD ATTENDANCE
// ==========================================

async function loadAttendance() {

    if (!attendanceTableBody) {
        return;
    }


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "attendance"
                )
            );


        attendanceRecords = [];


        snapshot.forEach(
            (docSnap) => {

                attendanceRecords.push({
                    id: docSnap.id,
                    ...docSnap.data()
                });

            }
        );


        attendanceRecords.sort(
            (a, b) => {

                const timeA =
                    a.timestamp?.seconds ||
                    0;

                const timeB =
                    b.timestamp?.seconds ||
                    0;

                return timeB - timeA;
            }
        );


        updateAttendanceStats(
            attendanceRecords
        );


        renderAttendanceTable(
            attendanceRecords
        );


    } catch (error) {

        console.error(
            "Loading attendance failed:",
            error
        );


        attendanceTableBody.innerHTML =
            `<tr>
                <td colspan="10">
                    Unable to load attendance records.
                </td>
            </tr>`;
    }
}


// ==========================================
// ATTENDANCE STATISTICS
// ==========================================

function updateAttendanceStats(
    records
) {

    const today =
        getLocalDate();


    const todayRecords =
        records.filter(
            (record) =>
                record.date === today
        );


    const students =
        new Set();


    records.forEach(
        (record) => {

            if (record.studentId) {

                students.add(
                    record.studentId
                );
            }
        }
    );


    if (totalAttendance) {

        totalAttendance.textContent =
            records.length;
    }


    if (todayAttendance) {

        todayAttendance.textContent =
            todayRecords.length;
    }


    if (uniqueStudents) {

        uniqueStudents.textContent =
            students.size;
    }
}


// ==========================================
// RENDER ATTENDANCE TABLE
// ==========================================

function renderAttendanceTable(
    records
) {

    if (!attendanceTableBody) {
        return;
    }


    const searchTerm =
        attendanceSearch?.value
            ?.trim()
            .toLowerCase() || "";


    const filtered =
        records.filter(
            (record) => {

                if (!searchTerm) {
                    return true;
                }


                const searchableText = [

                    record.studentName,

                    record.matricNumber,

                    record.email,

                    record.courseCode,

                    record.courseTitle,

                    record.date,

                    record.status

                ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();


                return searchableText.includes(
                    searchTerm
                );
            }
        );


    if (!filtered.length) {

        attendanceTableBody.innerHTML =
            `<tr>
                <td colspan="10">
                    No attendance records found.
                </td>
            </tr>`;

        return;
    }


    attendanceTableBody.innerHTML = "";


    filtered.forEach(
        (record) => {

            const row =
                document.createElement(
                    "tr"
                );


            const isTest =
                record.testingMode === true ||
                record.status === "Test Attendance";


            const status =
                isTest
                    ? "🧪 Test Attendance"
                    : "✅ Present";


            let timestamp =
                "-";


            if (
                record.timestamp &&
                record.timestamp.seconds
            ) {

                timestamp =
                    new Date(
                        record.timestamp.seconds *
                        1000
                    ).toLocaleTimeString(
                        [],
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    );
            }


            let distanceText =
                "-";


            if (
                record.distance !== null &&
                record.distance !== undefined &&
                Number.isFinite(
                    Number(record.distance)
                )
            ) {

                distanceText =
                    `${Math.round(
                        Number(record.distance)
                    )}m`;
            }


            row.innerHTML = `

                <td>
                    <strong>
                        ${record.studentName || "-"}
                    </strong>
                    <small>
                        ${record.email || ""}
                    </small>
                </td>

                <td>
                    ${record.matricNumber || "-"}
                </td>

                <td>
                    <strong>
                        ${record.courseCode || "-"}
                    </strong>
                    <small>
                        ${record.courseTitle || ""}
                    </small>
                </td>

                <td>
                    ${record.date || "-"}
                </td>

                <td>
                    ${timestamp}
                </td>

                <td>
                    ${distanceText}
                </td>

                <td>
                    ${record.radius || "-"}m
                </td>

                <td>
                    <span class="${isTest ? "test-status" : "present-status"}">
                        ${status}
                    </span>
                </td>

            `;


            attendanceTableBody.appendChild(
                row
            );
        }
    );
}


// ==========================================
// SEARCH ATTENDANCE
// ==========================================

if (attendanceSearch) {

    attendanceSearch.addEventListener(
        "input",
        () => {

            renderAttendanceTable(
                attendanceRecords
            );
        }
    );
}


// ==========================================
// REFRESH ATTENDANCE
// ==========================================

if (refreshAttendanceBtn) {

    refreshAttendanceBtn.addEventListener(
        "click",
        async () => {

            refreshAttendanceBtn.disabled =
                true;


            refreshAttendanceBtn.textContent =
                "Refreshing...";


            await loadAttendance();


            refreshAttendanceBtn.disabled =
                false;


            refreshAttendanceBtn.textContent =
                "Refresh Attendance";
        }
    );
}


// ==========================================
// REFRESH ACTIVE SESSIONS
// ==========================================

if (refreshSessionsBtn) {

    refreshSessionsBtn.addEventListener(
        "click",
        async () => {

            refreshSessionsBtn.disabled =
                true;


            refreshSessionsBtn.textContent =
                "Refreshing...";


            await loadActiveSessions();


            refreshSessionsBtn.disabled =
                false;


            refreshSessionsBtn.textContent =
                "Refresh Sessions";
        }
    );
}


// ==========================================
// COPY ATTENDANCE CODE
// ==========================================

if (copyAttendanceCodeBtn) {

    copyAttendanceCodeBtn.addEventListener(
        "click",
        async () => {

            const code =
                generatedAttendanceCode
                    ?.textContent
                    ?.trim();


            if (!code) {
                return;
            }


            try {

                await navigator.clipboard.writeText(
                    code
                );


                copyAttendanceCodeBtn.textContent =
                    "Copied ✓";


                setTimeout(
                    () => {

                        copyAttendanceCodeBtn.textContent =
                            "Copy Code";

                    },
                    2000
                );

            } catch (error) {

                console.error(
                    "Copy failed:",
                    error
                );
            }
        }
    );
}


// ==========================================
// DEFAULT SESSION DATE
// ==========================================

if (sessionDate) {

    sessionDate.value =
        getLocalDate();
}