// ==========================================
// ATTENDCHECK - ADMIN SYSTEM
// Course Management + Attendance Management
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
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// ==========================================
// ELEMENT HELPER
// ==========================================

const $ = (id) => document.getElementById(id);

// ==========================================
// COURSE ELEMENTS
// ==========================================

const courseForm = $("courseForm");
const courseCode = $("courseCode");
const courseTitle = $("courseTitle");
const classLocation = $("classLocation");
const getLocationBtn = $("getLocationBtn");
const locationMessage = $("locationMessage");
const latitude = $("latitude");
const longitude = $("longitude");
const radius = $("radius");

// ==========================================
// COURSE MANAGEMENT
// ==========================================

const refreshCoursesBtn = $("refreshCoursesBtn");
const coursesMessage = $("coursesMessage");
const courseManagementList = $("courseManagementList");

// ==========================================
// SESSION ELEMENTS
// ==========================================

const sessionForm = $("sessionForm");
const sessionCourse = $("sessionCourse");
const sessionDate = $("sessionDate");
const sessionStartTime = $("sessionStartTime");
const sessionEndTime = $("sessionEndTime");
const sessionMessage = $("sessionMessage");

const generatedCodeBox = $("generatedCodeBox");
const generatedAttendanceCode = $("generatedAttendanceCode");
const copyAttendanceCodeBtn = $("copyAttendanceCodeBtn");

const refreshSessionsBtn = $("refreshSessionsBtn");
const sessionsMessage = $("sessionsMessage");
const activeSessionsList = $("activeSessionsList");

// ==========================================
// TESTING MODE
// ==========================================

const testingModeStatus = $("testingModeStatus");
const testingModeBtn = $("testingModeBtn");
const testingModeMessage = $("testingModeMessage");

// ==========================================
// ATTENDANCE
// ==========================================

const totalAttendance = $("totalAttendance");
const todayAttendance = $("todayAttendance");
const uniqueStudents = $("uniqueStudents");
const attendanceSearch = $("attendanceSearch");
const refreshAttendanceBtn = $("refreshAttendanceBtn");
const attendanceTableBody = $("attendanceTableBody");

// ==========================================
// GLOBAL DATA
// ==========================================

let currentAdmin = null;
let courses = [];
let attendanceRecords = [];
let testingMode = false;
let editingCourseId = null;

// ==========================================
// SAFE HTML
// ==========================================

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ==========================================
// MESSAGE HELPER
// ==========================================

function showMessage(element, message, type = "info") {
    if (!element) return;

    element.textContent = message;
    element.style.display = "block";

    if (type === "success") {
        element.style.color = "green";
    } else if (type === "error") {
        element.style.color = "red";
    } else {
        element.style.color = "";
    }
}

// ==========================================
// TODAY
// ==========================================

function getToday() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// ==========================================
// TIME CHECK
// ==========================================

function isSessionExpired(session) {
    const today = getToday();

    if (session.date < today) return true;

    if (session.date > today) return false;

    if (!session.endTime) return false;

    const now = new Date();

    const currentTime =
        `${String(now.getHours()).padStart(2, "0")}:` +
        `${String(now.getMinutes()).padStart(2, "0")}`;

    return currentTime > session.endTime;
}

// ==========================================
// GENERATE CODE
// ==========================================

function generateAttendanceCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// ==========================================
// LOAD TESTING MODE
// ==========================================

async function loadTestingMode() {
    try {
        const systemRef = doc(db, "settings", "system");
        const systemSnap = await getDoc(systemRef);

        if (systemSnap.exists()) {
            testingMode = systemSnap.data().testingMode === true;
        } else {
            testingMode = false;
        }

        updateTestingModeUI();

    } catch (error) {
        console.error("Testing mode error:", error);

        testingMode = false;
        updateTestingModeUI();
    }
}

// ==========================================
// UPDATE TESTING MODE UI
// ==========================================

function updateTestingModeUI() {
    if (testingModeStatus) {
        testingModeStatus.textContent =
            testingMode ? "ON" : "OFF";
    }

    if (testingModeBtn) {
        testingModeBtn.textContent =
            testingMode
                ? "Turn Testing Mode OFF"
                : "Turn Testing Mode ON";
    }
}

// ==========================================
// TOGGLE TESTING MODE
// ==========================================

async function toggleTestingMode() {
    try {
        testingMode = !testingMode;

        await setDoc(
            doc(db, "settings", "system"),
            {
                testingMode: testingMode,
                updatedAt: serverTimestamp(),
                updatedBy: currentAdmin.uid
            },
            { merge: true }
        );

        updateTestingModeUI();

        showMessage(
            testingModeMessage,
            testingMode
                ? "Testing Mode is now ON."
                : "Testing Mode is now OFF.",
            "success"
        );

    } catch (error) {
        console.error("Toggle testing mode error:", error);

        testingMode = !testingMode;
        updateTestingModeUI();

        showMessage(
            testingModeMessage,
            "Unable to change Testing Mode.",
            "error"
        );
    }
}

// ==========================================
// GET GPS LOCATION
// ==========================================

function getLocation() {
    if (!navigator.geolocation) {
        showMessage(
            locationMessage,
            "Geolocation is not supported by this browser.",
            "error"
        );
        return;
    }

    showMessage(
        locationMessage,
        "Getting your current location..."
    );

    navigator.geolocation.getCurrentPosition(
        (position) => {

            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            if (latitude) {
                latitude.value = lat.toFixed(8);
            }

            if (longitude) {
                longitude.value = lng.toFixed(8);
            }

            showMessage(
                locationMessage,
                "Location captured successfully.",
                "success"
            );
        },

        (error) => {
            console.error("Location error:", error);

            let message =
                "Unable to get your location.";

            if (error.code === 1) {
                message =
                    "Location permission was denied.";
            }

            if (error.code === 2) {
                message =
                    "Your location could not be determined.";
            }

            if (error.code === 3) {
                message =
                    "Location request timed out.";
            }

            showMessage(
                locationMessage,
                message,
                "error"
            );
        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );
}

// ==========================================
// LOAD COURSES
// ==========================================

async function loadCourses() {
    try {
        const snapshot =
            await getDocs(collection(db, "courses"));

        courses = [];

        snapshot.forEach((courseDoc) => {
            courses.push({
                id: courseDoc.id,
                ...courseDoc.data()
            });
        });

        courses.sort((a, b) =>
            String(a.code || "")
                .localeCompare(String(b.code || ""))
        );

        populateSessionCourses();
        renderCourseManagement();

    } catch (error) {
        console.error("Load courses error:", error);

        showMessage(
            coursesMessage,
            "Unable to load courses.",
            "error"
        );
    }
}

// ==========================================
// POPULATE SESSION COURSES
// ==========================================

function populateSessionCourses() {
    if (!sessionCourse) return;

    sessionCourse.innerHTML =
        `<option value="">Select a course</option>`;

    courses.forEach((course) => {

        const option =
            document.createElement("option");

        option.value = course.id;

        option.textContent =
            `${course.code || ""} - ${course.title || ""}`;

        sessionCourse.appendChild(option);
    });
}

// ==========================================
// RENDER COURSE MANAGEMENT
// ==========================================

function renderCourseManagement() {
    if (!courseManagementList) return;

    if (courses.length === 0) {
        courseManagementList.innerHTML =
            `<p>No courses have been added yet.</p>`;
        return;
    }

    courseManagementList.innerHTML =
        courses.map((course) => {

            const code =
                escapeHTML(course.code || "");

            const title =
                escapeHTML(course.title || "");

            const location =
                escapeHTML(course.location || "Not specified");

            const lat =
                course.latitude ?? "";

            const lng =
                course.longitude ?? "";

            const courseRadius =
                course.radius ?? 100;

            return `
                <div class="course-management-card"
                     style="
                        border:1px solid #ddd;
                        border-radius:10px;
                        padding:15px;
                        margin-bottom:12px;
                     ">

                    <h3>${code}</h3>

                    <p>
                        <strong>${title}</strong>
                    </p>

                    <p>
                        Location: ${location}
                    </p>

                    <p>
                        Latitude: ${escapeHTML(lat)}
                        <br>
                        Longitude: ${escapeHTML(lng)}
                        <br>
                        Radius: ${escapeHTML(courseRadius)}m
                    </p>

                    <div style="display:flex;gap:8px;flex-wrap:wrap;">

                        <button
                            type="button"
                            class="edit-course-btn"
                            data-id="${course.id}">
                            Edit
                        </button>

                        <button
                            type="button"
                            class="delete-course-btn"
                            data-id="${course.id}">
                            Delete
                        </button>

                    </div>

                </div>
            `;
        }).join("");

    document
        .querySelectorAll(".edit-course-btn")
        .forEach((button) => {

            button.addEventListener("click", () => {
                editCourse(button.dataset.id);
            });

        });

    document
        .querySelectorAll(".delete-course-btn")
        .forEach((button) => {

            button.addEventListener("click", () => {
                deleteCourse(button.dataset.id);
            });

        });
}

// ==========================================
// ADD / UPDATE COURSE
// ==========================================

async function saveCourse(event) {
    event.preventDefault();

    if (!currentAdmin) return;

    const code =
        courseCode?.value.trim().toUpperCase();

    const title =
        courseTitle?.value.trim();

    const location =
        classLocation?.value.trim();

    const lat =
        Number(latitude?.value);

    const lng =
        Number(longitude?.value);

    const courseRadius =
        Number(radius?.value);

    if (!code || !title) {
        showMessage(
            locationMessage,
            "Enter the course code and course title.",
            "error"
        );
        return;
    }

    if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
    ) {
        showMessage(
            locationMessage,
            "Please capture or enter a valid location.",
            "error"
        );
        return;
    }

    if (
        !Number.isFinite(courseRadius) ||
        courseRadius <= 0
    ) {
        showMessage(
            locationMessage,
            "Enter a valid attendance radius.",
            "error"
        );
        return;
    }

    try {

        if (!editingCourseId) {

            const existing =
                courses.find(
                    (course) =>
                        String(course.code || "")
                            .toUpperCase() === code
                );

            if (existing) {
                showMessage(
                    locationMessage,
                    "A course with this code already exists.",
                    "error"
                );
                return;
            }

            await addDoc(
                collection(db, "courses"),
                {
                    code,
                    title,
                    location,
                    latitude: lat,
                    longitude: lng,
                    radius: courseRadius,
                    createdBy: currentAdmin.uid,
                    createdAt: serverTimestamp()
                }
            );

            showMessage(
                locationMessage,
                "Course added successfully.",
                "success"
            );

        } else {

            await updateDoc(
                doc(db, "courses", editingCourseId),
                {
                    code,
                    title,
                    location,
                    latitude: lat,
                    longitude: lng,
                    radius: courseRadius,
                    updatedBy: currentAdmin.uid,
                    updatedAt: serverTimestamp()
                }
            );

            showMessage(
                locationMessage,
                "Course updated successfully.",
                "success"
            );

            editingCourseId = null;
        }

        courseForm?.reset();

        await loadCourses();

    } catch (error) {

        console.error("Save course error:", error);

        showMessage(
            locationMessage,
            "Unable to save course. Check the browser console.",
            "error"
        );
    }
}

// ==========================================
// EDIT COURSE
// ==========================================

function editCourse(courseId) {

    const course =
        courses.find(
            (item) => item.id === courseId
        );

    if (!course) return;

    editingCourseId = courseId;

    if (courseCode) {
        courseCode.value =
            course.code || "";
    }

    if (courseTitle) {
        courseTitle.value =
            course.title || "";
    }

    if (classLocation) {
        classLocation.value =
            course.location || "";
    }

    if (latitude) {
        latitude.value =
            course.latitude ?? "";
    }

    if (longitude) {
        longitude.value =
            course.longitude ?? "";
    }

    if (radius) {
        radius.value =
            course.radius ?? 100;
    }

    showMessage(
        locationMessage,
        "Editing course. Update the details and submit.",
        "info"
    );

    courseForm?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// ==========================================
// DELETE COURSE
// ==========================================

async function deleteCourse(courseId) {

    const course =
        courses.find(
            (item) => item.id === courseId
        );

    if (!course) return;

    const confirmed =
        confirm(
            `Delete ${course.code} - ${course.title}?`
        );

    if (!confirmed) return;

    try {

        await deleteDoc(
            doc(db, "courses", courseId)
        );

        showMessage(
            coursesMessage,
            "Course deleted successfully.",
            "success"
        );

        await loadCourses();

    } catch (error) {

        console.error("Delete course error:", error);

        showMessage(
            coursesMessage,
            "Unable to delete course.",
            "error"
        );
    }
}

// ==========================================
// CREATE ATTENDANCE SESSION
// ==========================================

async function createSession(event) {

    event.preventDefault();

    const courseId =
        sessionCourse?.value;

    const date =
        sessionDate?.value;

    const startTime =
        sessionStartTime?.value;

    const endTime =
        sessionEndTime?.value;

    if (!courseId) {
        showMessage(
            sessionMessage,
            "Select a course.",
            "error"
        );
        return;
    }

    if (!date || !startTime || !endTime) {
        showMessage(
            sessionMessage,
            "Enter the date, start time and end time.",
            "error"
        );
        return;
    }

    if (endTime <= startTime) {
        showMessage(
            sessionMessage,
            "End time must be later than start time.",
            "error"
        );
        return;
    }

    const course =
        courses.find(
            (item) => item.id === courseId
        );

    if (!course) {
        showMessage(
            sessionMessage,
            "Selected course could not be found.",
            "error"
        );
        return;
    }

    try {

        const sessionCode =
            generateAttendanceCode();

        const sessionData = {

            courseId,

            courseCode:
                course.code || "",

            courseTitle:
                course.title || "",

            date,

            startTime,

            endTime,

            latitude:
                Number(course.latitude),

            longitude:
                Number(course.longitude),

            radius:
                Number(course.radius || 100),

            code:
                sessionCode,

            active: true,

            testingMode:
                testingMode === true,

            createdBy:
                currentAdmin.uid,

            createdAt:
                serverTimestamp()
        };

        await addDoc(
            collection(db, "attendanceSessions"),
            sessionData
        );

        if (generatedAttendanceCode) {
            generatedAttendanceCode.textContent =
                sessionCode;
        }

        if (generatedCodeBox) {
            generatedCodeBox.style.display =
                "block";
        }

        showMessage(
            sessionMessage,
            "Attendance session created successfully.",
            "success"
        );

        sessionForm?.reset();

        await loadActiveSessions();

    } catch (error) {

        console.error(
            "Create session error:",
            error
        );

        showMessage(
            sessionMessage,
            "Unable to create attendance session.",
            "error"
        );
    }
}

// ==========================================
// LOAD ACTIVE SESSIONS
// ==========================================

async function loadActiveSessions() {

    try {

        const snapshot =
            await getDocs(
                collection(db, "attendanceSessions")
            );

        const sessions = [];

        for (const sessionDoc of snapshot.docs) {

            const session = {
                id: sessionDoc.id,
                ...sessionDoc.data()
            };

            if (
                session.active === true &&
                isSessionExpired(session)
            ) {

                try {

                    await updateDoc(
                        doc(
                            db,
                            "attendanceSessions",
                            session.id
                        ),
                        {
                            active: false,
                            autoClosed: true,
                            closedAt:
                                serverTimestamp(),
                            closedBy:
                                currentAdmin.uid
                        }
                    );

                } catch (closeError) {

                    console.error(
                        "Auto close error:",
                        closeError
                    );
                }

                continue;
            }

            if (session.active === true) {
                sessions.push(session);
            }
        }

        sessions.sort((a, b) => {

            const aTime =
                `${a.date || ""} ${a.startTime || ""}`;

            const bTime =
                `${b.date || ""} ${b.startTime || ""}`;

            return bTime.localeCompare(aTime);
        });

        renderActiveSessions(sessions);

    } catch (error) {

        console.error(
            "Load active sessions error:",
            error
        );

        showMessage(
            sessionsMessage,
            "Unable to load attendance sessions.",
            "error"
        );
    }
}

// ==========================================
// RENDER ACTIVE SESSIONS
// ==========================================

function renderActiveSessions(sessions) {

    if (!activeSessionsList) return;

    if (sessions.length === 0) {

        activeSessionsList.innerHTML =
            `<p>No active attendance sessions.</p>`;

        return;
    }

    activeSessionsList.innerHTML =
        sessions.map((session) => {

            return `
                <div
                    style="
                        border:1px solid #ddd;
                        border-radius:10px;
                        padding:15px;
                        margin-bottom:12px;
                    "
                >

                    <h3>
                        ${escapeHTML(session.courseCode)}
                        -
                        ${escapeHTML(session.courseTitle)}
                    </h3>

                    <p>
                        Date:
                        ${escapeHTML(session.date)}
                    </p>

                    <p>
                        Time:
                        ${escapeHTML(session.startTime)}
                        -
                        ${escapeHTML(session.endTime)}
                    </p>

                    <p>
                        Attendance Code:
                        <strong>
                            ${escapeHTML(session.code)}
                        </strong>
                    </p>

                    <p>
                        ${
                            session.testingMode
                                ? "Testing Mode"
                                : "Normal Mode"
                        }
                    </p>

                    <button
                        type="button"
                        class="close-session-btn"
                        data-id="${session.id}"
                    >
                        Close Session
                    </button>

                </div>
            `;

        }).join("");

    document
        .querySelectorAll(".close-session-btn")
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => closeSession(button.dataset.id)
            );

        });
}

// ==========================================
// CLOSE SESSION
// ==========================================

async function closeSession(sessionId) {

    const confirmed =
        confirm(
            "Are you sure you want to close this attendance session?"
        );

    if (!confirmed) return;

    try {

        await updateDoc(
            doc(
                db,
                "attendanceSessions",
                sessionId
            ),
            {
                active: false,
                closedAt: serverTimestamp(),
                closedBy: currentAdmin.uid
            }
        );

        showMessage(
            sessionsMessage,
            "Attendance session closed.",
            "success"
        );

        await loadActiveSessions();

    } catch (error) {

        console.error(
            "Close session error:",
            error
        );

        showMessage(
            sessionsMessage,
            "Unable to close the session.",
            "error"
        );
    }
}

// ==========================================
// COPY ATTENDANCE CODE
// ==========================================

async function copyAttendanceCode() {

    const code =
        generatedAttendanceCode?.textContent?.trim();

    if (!code) return;

    try {

        await navigator.clipboard.writeText(code);

        showMessage(
            sessionMessage,
            "Attendance code copied.",
            "success"
        );

    } catch (error) {

        console.error(
            "Copy code error:",
            error
        );

        alert(
            `Attendance Code: ${code}`
        );
    }
}

// ==========================================
// LOAD ATTENDANCE
// ==========================================

async function loadAttendance() {

    try {

        const snapshot =
            await getDocs(
                collection(db, "attendance")
            );

        attendanceRecords = [];

        snapshot.forEach((attendanceDoc) => {

            attendanceRecords.push({
                id: attendanceDoc.id,
                ...attendanceDoc.data()
            });

        });

        renderAttendance(
            attendanceRecords
        );

    } catch (error) {

        console.error(
            "Load attendance error:",
            error
        );

        if (attendanceTableBody) {
            attendanceTableBody.innerHTML =
                `<tr>
                    <td colspan="7">
                        Unable to load attendance.
                    </td>
                </tr>`;
        }
    }
}

// ==========================================
// RENDER ATTENDANCE
// ==========================================

function renderAttendance(records) {

    if (!attendanceTableBody) return;

    const search =
        attendanceSearch?.value
            ?.trim()
            .toLowerCase() || "";

    const filtered =
        records.filter((record) => {

            if (!search) return true;

            const text = [
                record.studentName,
                record.studentMatric,
                record.studentEmail,
                record.courseCode,
                record.courseTitle,
                record.date,
                record.status
            ]
                .join(" ")
                .toLowerCase();

            return text.includes(search);
        });

    updateAttendanceStats(records);

    if (filtered.length === 0) {

        attendanceTableBody.innerHTML =
            `<tr>
                <td colspan="7">
                    No attendance records found.
                </td>
            </tr>`;

        return;
    }

    filtered.sort((a, b) => {

        const aTime =
            a.timestamp?.seconds || 0;

        const bTime =
            b.timestamp?.seconds || 0;

        return bTime - aTime;
    });

    attendanceTableBody.innerHTML =
        filtered.map((record) => {

            return `
                <tr>

                    <td>
                        ${escapeHTML(
                            record.studentName ||
                            "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            record.studentMatric ||
                            "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            record.courseCode ||
                            "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            record.date ||
                            "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            record.status ||
                            "Present"
                        )}
                    </td>

                    <td>
                        ${record.testingMode
                            ? "Testing"
                            : "Normal"}
                    </td>

                    <td>
                        ${escapeHTML(
                            record.distance != null
                                ? `${Math.round(
                                    Number(
                                        record.distance
                                    )
                                  )}m`
                                : "-"
                        )}
                    </td>

                </tr>
            `;

        }).join("");
}

// ==========================================
// ATTENDANCE STATISTICS
// ==========================================

function updateAttendanceStats(records) {

    const today =
        getToday();

    const todayRecords =
        records.filter(
            (record) =>
                record.date === today
        );

    const students =
        new Set();

    records.forEach((record) => {

        const id =
            record.studentId ||
            record.studentMatric ||
            record.studentEmail;

        if (id) {
            students.add(id);
        }
    });

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
// AUTHENTICATION
// ==========================================

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.href =
                "admin-auth.html";

            return;
        }

        try {

            const userRef =
                doc(db, "users", user.uid);

            const userSnap =
                await getDoc(userRef);

            if (!userSnap.exists()) {

                await signOut(auth);

                window.location.href =
                    "admin-auth.html";

                return;
            }

            const userData =
                userSnap.data();

            if (userData.role !== "admin") {

                alert(
                    "You do not have administrator access."
                );

                await signOut(auth);

                window.location.href =
                    "admin-auth.html";

                return;
            }

            currentAdmin = {
                uid: user.uid,
                email: user.email,
                ...userData
            };

            console.log(
                "Admin authenticated:",
                currentAdmin
            );

            // Load everything separately.
            // One failed section will not destroy the whole page.

            await loadTestingMode();
            await loadCourses();
            await loadActiveSessions();
            await loadAttendance();

        } catch (error) {

            console.error(
                "Admin authentication error:",
                error
            );

            alert(
                "Unable to load Admin Portal. Check the browser console."
            );
        }
    }
);

// ==========================================
// EVENT LISTENERS
// ==========================================

if (courseForm) {
    courseForm.addEventListener(
        "submit",
        saveCourse
    );
}

if (getLocationBtn) {
    getLocationBtn.addEventListener(
        "click",
        getLocation
    );
}

if (refreshCoursesBtn) {
    refreshCoursesBtn.addEventListener(
        "click",
        loadCourses
    );
}

if (sessionForm) {
    sessionForm.addEventListener(
        "submit",
        createSession
    );
}

if (refreshSessionsBtn) {
    refreshSessionsBtn.addEventListener(
        "click",
        loadActiveSessions
    );
}

if (copyAttendanceCodeBtn) {
    copyAttendanceCodeBtn.addEventListener(
        "click",
        copyAttendanceCode
    );
}

if (testingModeBtn) {
    testingModeBtn.addEventListener(
        "click",
        toggleTestingMode
    );
}

if (refreshAttendanceBtn) {
    refreshAttendanceBtn.addEventListener(
        "click",
        loadAttendance
    );
}

if (attendanceSearch) {
    attendanceSearch.addEventListener(
        "input",
        () => {
            renderAttendance(
                attendanceRecords
            );
        }
    );
}

// ==========================================
// INITIAL DATE
// ==========================================

if (sessionDate) {
    sessionDate.value = getToday();
}

// ==========================================
// FINAL LOG
// ==========================================

console.log(
    "AttendCheck Admin Portal loaded successfully."
);