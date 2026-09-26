// ==========================================
// ATTENDCHECK - ADMIN SYSTEM
// Course + Session + Attendance + Reports
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
// HELPER
// ==========================================

const $ = (id) => document.getElementById(id);

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

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

function getToday() {
    const now = new Date();

    return `${now.getFullYear()}-${String(
        now.getMonth() + 1
    ).padStart(2, "0")}-${String(
        now.getDate()
    ).padStart(2, "0")}`;
}

function generateAttendanceCode() {
    return Math.floor(
        100000 + Math.random() * 900000
    ).toString();
}

// ==========================================
// ELEMENTS
// ==========================================

// Course
const courseForm = $("courseForm");
const courseCode = $("courseCode");
const courseTitle = $("courseTitle");
const classLocation = $("classLocation");
const getLocationBtn = $("getLocationBtn");
const locationMessage = $("locationMessage");
const latitude = $("latitude");
const longitude = $("longitude");
const radius = $("radius");

// Course management
const refreshCoursesBtn = $("refreshCoursesBtn");
const coursesMessage = $("coursesMessage");
const courseManagementList = $("courseManagementList");

// Session
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

// Testing
const testingModeStatus = $("testingModeStatus");
const testingModeBtn = $("testingModeBtn");
const testingModeMessage = $("testingModeMessage");

// Attendance
const totalAttendance = $("totalAttendance");
const todayAttendance = $("todayAttendance");
const uniqueStudents = $("uniqueStudents");
const attendanceSearch = $("attendanceSearch");
const refreshAttendanceBtn = $("refreshAttendanceBtn");
const attendanceTableBody = $("attendanceTableBody");

// Reports
const reportTotalSessions = $("reportTotalSessions");
const reportTotalAttendance = $("reportTotalAttendance");
const reportUniqueStudents = $("reportUniqueStudents");
const reportAttendanceRate = $("reportAttendanceRate");

const reportCourseFilter = $("reportCourseFilter");
const reportDateFilter = $("reportDateFilter");
const generateReportBtn = $("generateReportBtn");
const refreshReportBtn = $("refreshReportBtn");
const reportMessage = $("reportMessage");

const attendanceReportTableBody =
    $("attendanceReportTableBody");

const studentReportTableBody =
    $("studentReportTableBody");

// ==========================================
// GLOBAL DATA
// ==========================================

let currentAdmin = null;
let courses = [];
let attendanceRecords = [];
let attendanceSessions = [];
let testingMode = false;
let editingCourseId = null;

// ==========================================
// TESTING MODE
// ==========================================

async function loadTestingMode() {
    try {
        const systemSnap = await getDoc(
            doc(db, "settings", "system")
        );

        testingMode =
            systemSnap.exists() &&
            systemSnap.data().testingMode === true;

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

function updateTestingModeUI() {

    if (testingModeStatus) {
        testingModeStatus.textContent =
            testingMode
                ? "🟢 Testing Mode is ON"
                : "🔴 Testing Mode is OFF";
    }

    if (testingModeBtn) {
        testingModeBtn.textContent =
            testingMode
                ? "🛑 Turn Testing Mode OFF"
                : "🧪 Enable Testing Mode";
    }
}

async function toggleTestingMode() {

    if (!currentAdmin) return;

    const newMode = !testingMode;

    try {

        await setDoc(
            doc(db, "settings", "system"),
            {
                testingMode: newMode,
                updatedAt: serverTimestamp(),
                updatedBy: currentAdmin.uid
            },
            { merge: true }
        );

        testingMode = newMode;

        updateTestingModeUI();

        showMessage(
            testingModeMessage,
            testingMode
                ? "Testing Mode is now ON."
                : "Testing Mode is now OFF.",
            "success"
        );

    } catch (error) {

        console.error(
            "Toggle testing mode error:",
            error
        );

        showMessage(
            testingModeMessage,
            "Unable to change Testing Mode.",
            "error"
        );
    }
}

// ==========================================
// GPS LOCATION
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

            if (latitude) {
                latitude.value =
                    position.coords.latitude.toFixed(8);
            }

            if (longitude) {
                longitude.value =
                    position.coords.longitude.toFixed(8);
            }

            showMessage(
                locationMessage,
                "Location captured successfully.",
                "success"
            );
        },

        (error) => {

            console.error(
                "Location error:",
                error
            );

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
// COURSES
// ==========================================

async function loadCourses() {

    try {

        const snapshot =
            await getDocs(
                collection(db, "courses")
            );

        courses = snapshot.docs.map(
            (courseDoc) => ({
                id: courseDoc.id,
                ...courseDoc.data()
            })
        );

        courses.sort(
            (a, b) =>
                String(a.code || "")
                    .localeCompare(
                        String(b.code || "")
                    )
        );

        populateSessionCourses();
        populateReportCourseFilter();
        renderCourseManagement();

    } catch (error) {

        console.error(
            "Load courses error:",
            error
        );

        showMessage(
            coursesMessage,
            "Unable to load courses.",
            "error"
        );
    }
}

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

function populateReportCourseFilter() {

    if (!reportCourseFilter) return;

    const currentValue =
        reportCourseFilter.value;

    reportCourseFilter.innerHTML =
        `<option value="">All Courses</option>`;

    courses.forEach((course) => {

        const option =
            document.createElement("option");

        option.value =
            course.code || "";

        option.textContent =
            `${course.code || ""} - ${course.title || ""}`;

        reportCourseFilter.appendChild(option);
    });

    if (
        currentValue &&
        courses.some(
            (course) =>
                course.code === currentValue
        )
    ) {
        reportCourseFilter.value =
            currentValue;
    }
}

function renderCourseManagement() {

    if (!courseManagementList) return;

    if (courses.length === 0) {

        courseManagementList.innerHTML =
            `<p>No courses have been added yet.</p>`;

        return;
    }

    courseManagementList.innerHTML =
        courses.map((course) => {

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
                        ${escapeHTML(course.code)}
                    </h3>

                    <p>
                        <strong>
                            ${escapeHTML(course.title)}
                        </strong>
                    </p>

                    <p>
                        Location:
                        ${escapeHTML(
                            course.location ||
                            "Not specified"
                        )}
                    </p>

                    <p>
                        Latitude:
                        ${escapeHTML(
                            course.latitude ?? "-"
                        )}
                        <br>

                        Longitude:
                        ${escapeHTML(
                            course.longitude ?? "-"
                        )}
                        <br>

                        Radius:
                        ${escapeHTML(
                            course.radius ?? "-"
                        )}m
                    </p>

                    <div
                        style="
                            display:flex;
                            gap:8px;
                            flex-wrap:wrap;
                        "
                    >

                        <button
                            type="button"
                            class="edit-course-btn"
                            data-id="${course.id}"
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            class="delete-course-btn"
                            data-id="${course.id}"
                        >
                            Delete
                        </button>

                    </div>

                </div>
            `;

        }).join("");

    document
        .querySelectorAll(".edit-course-btn")
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => editCourse(
                    button.dataset.id
                )
            );

        });

    document
        .querySelectorAll(".delete-course-btn")
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => deleteCourse(
                    button.dataset.id
                )
            );

        });
}

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

    if (!code || !title || !location) {

        showMessage(
            locationMessage,
            "Please complete all course details.",
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
            "Please capture a valid GPS location.",
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

            const duplicate =
                courses.find(
                    (course) =>
                        String(course.code || "")
                            .toUpperCase() === code
                );

            if (duplicate) {

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
                doc(
                    db,
                    "courses",
                    editingCourseId
                ),
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

            editingCourseId = null;

            showMessage(
                locationMessage,
                "Course updated successfully.",
                "success"
            );
        }

        courseForm?.reset();

        await loadCourses();

    } catch (error) {

        console.error(
            "Save course error:",
            error
        );

        showMessage(
            locationMessage,
            "Unable to save course.",
            "error"
        );
    }
}

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
        "Editing course. Update the details and submit."
    );

    courseForm?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

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

        console.error(
            "Delete course error:",
            error
        );

        showMessage(
            coursesMessage,
            "Unable to delete course.",
            "error"
        );
    }
}

// ==========================================
// CREATE SESSION
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
            "Enter the date and time.",
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
            "Selected course was not found.",
            "error"
        );

        return;
    }

    try {

        const code =
            generateAttendanceCode();

        await addDoc(
            collection(db, "attendanceSessions"),
            {
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
                code,
                active: true,
                testingMode:
                    testingMode === true,
                createdBy:
                    currentAdmin.uid,
                createdAt:
                    serverTimestamp()
            }
        );

        if (generatedAttendanceCode) {
            generatedAttendanceCode.textContent =
                code;
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

        if (sessionDate) {
            sessionDate.value =
                getToday();
        }

        await loadActiveSessions();
        await loadReports();

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
// LOAD SESSIONS
// ==========================================

function isSessionExpired(session) {

    if (!session.date) return false;

    const today = getToday();

    if (session.date < today) {
        return true;
    }

    if (session.date > today) {
        return false;
    }

    if (!session.endTime) {
        return false;
    }

    const now = new Date();

    const currentTime =
        `${String(now.getHours()).padStart(2, "0")}:` +
        `${String(now.getMinutes()).padStart(2, "0")}`;

    return currentTime > session.endTime;
}

async function loadActiveSessions() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "attendanceSessions"
                )
            );

        attendanceSessions = [];

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

                } catch (error) {

                    console.error(
                        "Auto-close error:",
                        error
                    );
                }

                session.active = false;
            }

            attendanceSessions.push(session);
        }

        renderActiveSessions();

        updateReportSessionCount();

    } catch (error) {

        console.error(
            "Load sessions error:",
            error
        );

        showMessage(
            sessionsMessage,
            "Unable to load attendance sessions.",
            "error"
        );
    }
}

function renderActiveSessions() {

    if (!activeSessionsList) return;

    const active =
        attendanceSessions.filter(
            (session) =>
                session.active === true
        );

    if (active.length === 0) {

        activeSessionsList.innerHTML =
            `<p>No active attendance sessions.</p>`;

        return;
    }

    activeSessionsList.innerHTML =
        active.map((session) => {

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
                        ${escapeHTML(
                            session.courseCode
                        )}
                        -
                        ${escapeHTML(
                            session.courseTitle
                        )}
                    </h3>

                    <p>
                        Date:
                        ${escapeHTML(
                            session.date
                        )}
                    </p>

                    <p>
                        Time:
                        ${escapeHTML(
                            session.startTime
                        )}
                        -
                        ${escapeHTML(
                            session.endTime
                        )}
                    </p>

                    <p>
                        Attendance Code:
                        <strong>
                            ${escapeHTML(
                                session.code
                            )}
                        </strong>
                    </p>

                    <p>
                        ${
                            session.testingMode
                                ? "🧪 Testing Mode"
                                : "📍 Normal Mode"
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
                () => closeSession(
                    button.dataset.id
                )
            );

        });
}

async function closeSession(sessionId) {

    const confirmed =
        confirm(
            "Close this attendance session?"
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
                closedAt:
                    serverTimestamp(),
                closedBy:
                    currentAdmin.uid
            }
        );

        showMessage(
            sessionsMessage,
            "Attendance session closed.",
            "success"
        );

        await loadActiveSessions();
        await loadReports();

    } catch (error) {

        console.error(
            "Close session error:",
            error
        );

        showMessage(
            sessionsMessage,
            "Unable to close session.",
            "error"
        );
    }
}

// ==========================================
// COPY CODE
// ==========================================

async function copyAttendanceCode() {

    const code =
        generatedAttendanceCode?.textContent?.trim();

    if (!code || code === "------") return;

    try {

        await navigator.clipboard.writeText(code);

        showMessage(
            sessionMessage,
            "Attendance code copied.",
            "success"
        );

    } catch (error) {

        console.error(
            "Copy error:",
            error
        );

        alert(
            `Attendance Code: ${code}`
        );
    }
}

// ==========================================
// ATTENDANCE
// ==========================================

async function loadAttendance() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "attendance"
                )
            );

        attendanceRecords =
            snapshot.docs.map(
                (attendanceDoc) => ({
                    id: attendanceDoc.id,
                    ...attendanceDoc.data()
                })
            );

        renderAttendance(
            attendanceRecords
        );

        updateBasicAttendanceStats();

        await loadReports();

    } catch (error) {

        console.error(
            "Load attendance error:",
            error
        );

        if (attendanceTableBody) {

            attendanceTableBody.innerHTML =
                `
                <tr>
                    <td colspan="7">
                        Unable to load attendance.
                    </td>
                </tr>
                `;
        }
    }
}

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

    if (filtered.length === 0) {

        attendanceTableBody.innerHTML =
            `
            <tr>
                <td colspan="7">
                    No attendance records found.
                </td>
            </tr>
            `;

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

            const timestamp =
                record.timestamp;

            let time = "-";

            if (
                timestamp &&
                typeof timestamp.toDate === "function"
            ) {

                time =
                    timestamp
                        .toDate()
                        .toLocaleTimeString();
            }

            return `
                <tr>

                    <td>
                        ${escapeHTML(
                            record.studentName || "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            record.studentMatric || "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            record.courseCode || "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            record.date || "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(time)}
                    </td>

                    <td>
                        ${
                            record.distance != null
                                ? `${Math.round(
                                    Number(
                                        record.distance
                                    )
                                  )}m`
                                : "-"
                        }
                    </td>

                    <td>
                        ${escapeHTML(
                            record.status ||
                            "Present"
                        )}
                    </td>

                </tr>
            `;

        }).join("");
}

function updateBasicAttendanceStats() {

    const today =
        getToday();

    const todayRecords =
        attendanceRecords.filter(
            (record) =>
                record.date === today
        );

    const students =
        new Set();

    attendanceRecords.forEach(
        (record) => {

            const id =
                record.studentId ||
                record.studentMatric ||
                record.studentEmail;

            if (id) {
                students.add(id);
            }
        }
    );

    if (totalAttendance) {
        totalAttendance.textContent =
            attendanceRecords.length;
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
// REPORTS
// ==========================================

function updateReportSessionCount() {

    if (!reportTotalSessions) return;

    reportTotalSessions.textContent =
        attendanceSessions.length;
}

function getFilteredReportAttendance() {

    const selectedCourse =
        reportCourseFilter?.value
            ?.trim()
            .toLowerCase() || "";

    const selectedDate =
        reportDateFilter?.value || "";

    return attendanceRecords.filter(
        (record) => {

            const recordCourse =
                String(
                    record.courseCode || ""
                )
                    .trim()
                    .toLowerCase();

            if (
                selectedCourse &&
                recordCourse !== selectedCourse
            ) {
                return false;
            }

            if (
                selectedDate &&
                record.date !== selectedDate
            ) {
                return false;
            }

            return true;
        }
    );
}

function getFilteredReportSessions() {

    const selectedCourse =
        reportCourseFilter?.value
            ?.trim()
            .toLowerCase() || "";

    const selectedDate =
        reportDateFilter?.value || "";

    return attendanceSessions.filter(
        (session) => {

            const sessionCourse =
                String(
                    session.courseCode || ""
                )
                    .trim()
                    .toLowerCase();

            if (
                selectedCourse &&
                sessionCourse !== selectedCourse
            ) {
                return false;
            }

            if (
                selectedDate &&
                session.date !== selectedDate
            ) {
                return false;
            }

            return true;
        }
    );
}

async function loadReports() {

    if (!attendanceRecords) {
        attendanceRecords = [];
    }

    updateReportSessionCount();

    generateAttendanceReport(false);
}

function generateAttendanceReport(showMessageBox = true) {

    const records =
        getFilteredReportAttendance();

    const sessions =
        getFilteredReportSessions();

    const studentSet =
        new Set();

    records.forEach((record) => {

        const studentId =
            record.studentId ||
            record.studentMatric ||
            record.studentEmail ||
            record.studentName;

        if (studentId) {
            studentSet.add(studentId);
        }
    });

    /*
     * Attendance rate is calculated from:
     *
     * total attendance records
     * divided by
     * possible attendance slots
     *
     * For a course/session report, every registered
     * student would ideally be the denominator.
     *
     * Since the current attendance collection does
     * not necessarily contain registration snapshots,
     * we use sessions as the available session count
     * and report attendance counts directly.
     */

    const totalAttendanceCount =
        records.length;

    if (reportTotalAttendance) {
        reportTotalAttendance.textContent =
            totalAttendanceCount;
    }

    if (reportUniqueStudents) {
        reportUniqueStudents.textContent =
            studentSet.size;
    }

    /*
     * If there are attendance records and sessions,
     * show attendance per session as a practical
     * attendance rate.
     *
     * This is not a student absence rate.
     */

    let rate = 0;

    if (sessions.length > 0) {

        /*
         * Count each student's attendance once
         * per session.
         */

        const uniqueStudentSessionPairs =
            new Set();

        records.forEach((record) => {

            const student =
                record.studentId ||
                record.studentMatric ||
                record.studentEmail ||
                record.studentName ||
                "unknown";

            const session =
                record.sessionId ||
                `${record.courseCode || ""}-${record.date || ""}`;

            uniqueStudentSessionPairs.add(
                `${student}__${session}`
            );
        });

        /*
         * Without registration data we cannot know
         * the exact number of students expected in
         * every session.
         *
         * Therefore the displayed rate is based on
         * attendance records per available sessions,
         * capped at 100%.
         */

        const averageStudents =
            studentSet.size;

        const possible =
            sessions.length *
            averageStudents;

        if (possible > 0) {

            rate =
                Math.min(
                    100,
                    (
                        uniqueStudentSessionPairs.size /
                        possible
                    ) * 100
                );
        }
    }

    if (reportAttendanceRate) {

        reportAttendanceRate.textContent =
            `${rate.toFixed(1)}%`;
    }

    renderCourseReport(
        records,
        sessions
    );

    renderStudentReport(
        records,
        sessions
    );

    if (showMessageBox) {

        showMessage(
            reportMessage,
            "Attendance report generated.",
            "success"
        );
    }
}

function renderCourseReport(
    records,
    sessions
) {

    if (!attendanceReportTableBody) return;

    if (
        records.length === 0 &&
        sessions.length === 0
    ) {

        attendanceReportTableBody.innerHTML =
            `
            <tr>
                <td colspan="5">
                    No attendance data found.
                </td>
            </tr>
            `;

        return;
    }

    const courseMap = new Map();

    courses.forEach((course) => {

        const code =
            course.code || "";

        if (code) {

            courseMap.set(
                code.toLowerCase(),
                {
                    code,
                    sessions: 0,
                    attendance: 0,
                    students: new Set()
                }
            );
        }
    });

    sessions.forEach((session) => {

        const code =
            session.courseCode || "";

        if (!code) return;

        const key =
            code.toLowerCase();

        if (!courseMap.has(key)) {

            courseMap.set(
                key,
                {
                    code,
                    sessions: 0,
                    attendance: 0,
                    students: new Set()
                }
            );
        }

        courseMap.get(key).sessions++;
    });

    records.forEach((record) => {

        const code =
            record.courseCode || "";

        if (!code) return;

        const key =
            code.toLowerCase();

        if (!courseMap.has(key)) {

            courseMap.set(
                key,
                {
                    code,
                    sessions: 0,
                    attendance: 0,
                    students: new Set()
                }
            );
        }

        const item =
            courseMap.get(key);

        item.attendance++;

        const student =
            record.studentId ||
            record.studentMatric ||
            record.studentEmail ||
            record.studentName;

        if (student) {
            item.students.add(student);
        }
    });

    const rows =
        Array.from(courseMap.values())
            .filter(
                (item) =>
                    item.sessions > 0 ||
                    item.attendance > 0
            )
            .sort(
                (a, b) =>
                    a.code.localeCompare(b.code)
            );

    if (rows.length === 0) {

        attendanceReportTableBody.innerHTML =
            `
            <tr>
                <td colspan="5">
                    No course report available.
                </td>
            </tr>
            `;

        return;
    }

    attendanceReportTableBody.innerHTML =
        rows.map((item) => {

            /*
             * This percentage represents attendance
             * records relative to the number of
             * sessions and unique students represented
             * in the report.
             */

            let rate = 0;

            if (
                item.sessions > 0 &&
                item.students.size > 0
            ) {

                rate =
                    Math.min(
                        100,
                        (
                            item.attendance /
                            (
                                item.sessions *
                                item.students.size
                            )
                        ) * 100
                    );
            }

            return `
                <tr>

                    <td>
                        <strong>
                            ${escapeHTML(item.code)}
                        </strong>
                    </td>

                    <td>
                        ${item.sessions}
                    </td>

                    <td>
                        ${item.attendance}
                    </td>

                    <td>
                        ${item.students.size}
                    </td>

                    <td>
                        ${rate.toFixed(1)}%
                    </td>

                </tr>
            `;

        }).join("");
}

function renderStudentReport(
    records,
    sessions
) {

    if (!studentReportTableBody) return;

    if (records.length === 0) {

        studentReportTableBody.innerHTML =
            `
            <tr>
                <td colspan="5">
                    No student attendance data found.
                </td>
            </tr>
            `;

        return;
    }

    const studentMap = new Map();

    records.forEach((record) => {

        const id =
            record.studentId ||
            record.studentMatric ||
            record.studentEmail ||
            record.studentName;

        if (!id) return;

        if (!studentMap.has(id)) {

            studentMap.set(
                id,
                {
                    name:
                        record.studentName ||
                        "-",

                    matric:
                        record.studentMatric ||
                        "-",

                    attendance: 0,

                    courses: new Set(),

                    sessions: new Set()
                }
            );
        }

        const student =
            studentMap.get(id);

        student.attendance++;

        if (record.courseCode) {
            student.courses.add(
                record.courseCode
            );
        }

        const sessionId =
            record.sessionId ||
            `${record.courseCode || ""}-${record.date || ""}`;

        student.sessions.add(
            sessionId
        );
    });

    const rows =
        Array.from(
            studentMap.values()
        ).sort(
            (a, b) =>
                String(a.name)
                    .localeCompare(
                        String(b.name)
                    )
        );

    studentReportTableBody.innerHTML =
        rows.map((student) => {

            let rate = 0;

            if (sessions.length > 0) {

                rate =
                    Math.min(
                        100,
                        (
                            student.attendance /
                            sessions.length
                        ) * 100
                    );
            }

            return `
                <tr>

                    <td>
                        ${escapeHTML(
                            student.name
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            student.matric
                        )}
                    </td>

                    <td>
                        ${student.attendance}
                    </td>

                    <td>
                        ${student.courses.size}
                    </td>

                    <td>
                        ${rate.toFixed(1)}%
                    </td>

                </tr>
            `;

        }).join("");
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

            const userSnap =
                await getDoc(
                    doc(
                        db,
                        "users",
                        user.uid
                    )
                );

            if (!userSnap.exists()) {

                await signOut(auth);

                window.location.href =
                    "admin-auth.html";

                return;
            }

            const userData =
                userSnap.data();

            if (
                userData.role !== "admin"
            ) {

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
                "Admin authenticated successfully."
            );

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

if (generateReportBtn) {

    generateReportBtn.addEventListener(
        "click",
        () => {
            generateAttendanceReport(true);
        }
    );
}

if (refreshReportBtn) {

    refreshReportBtn.addEventListener(
        "click",
        async () => {

            await loadCourses();
            await loadActiveSessions();
            await loadAttendance();

            generateAttendanceReport(true);
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
// STARTUP MESSAGE
// ==========================================

console.log(
    "AttendCheck Admin Portal loaded."
);