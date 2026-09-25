// ==========================================
// ATTENDCHECK - STUDENT SYSTEM
// Course Registration + Attendance + History
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
    query,
    where,
    doc,
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import {
    getDepartments,
    getLevels,
    getSemesters,
    getCourses
} from "./course-catalog.js";


// ==========================================
// ELEMENTS
// ==========================================

const studentWelcome =
    document.getElementById("studentWelcome");

const studentWelcomeText =
    document.getElementById("studentWelcomeText");

const studentMatric =
    document.getElementById("studentMatric");

const studentEmail =
    document.getElementById("studentEmail");

const studentLoginLink =
    document.getElementById("studentLoginLink");

const studentWelcomeActions =
    document.getElementById("studentWelcomeActions");

const studentLogoutBtn =
    document.getElementById("studentLogoutBtn");

const studentDepartment =
    document.getElementById("studentDepartment");

const studentLevel =
    document.getElementById("studentLevel");

const academicSession =
    document.getElementById("academicSession");

const semester =
    document.getElementById("semester");

const courseFilterMessage =
    document.getElementById("courseFilterMessage");

const registrationMessage =
    document.getElementById("registrationMessage");

const registrationMessageText =
    document.getElementById("registrationMessageText");

const registrationCourseList =
    document.getElementById("registrationCourseList");

const registeredCourseCount =
    document.getElementById("registeredCourseCount");

const registeredSession =
    document.getElementById("registeredSession");

const registeredSemester =
    document.getElementById("registeredSemester");

const registeredCourseList =
    document.getElementById("registeredCourseList");

const selectedCourseCard =
    document.getElementById("selectedCourseCard");

const selectedCourseTitle =
    document.getElementById("selectedCourseTitle");

const selectedCourseLocation =
    document.getElementById("selectedCourseLocation");

const selectedCourseRadius =
    document.getElementById("selectedCourseRadius");

const checkLocationBtn =
    document.getElementById("checkLocationBtn");

const attendanceStatus =
    document.getElementById("attendanceStatus");

const statusIcon =
    document.getElementById("statusIcon");

const statusTitle =
    document.getElementById("statusTitle");

const statusMessage =
    document.getElementById("statusMessage");


// ==========================================
// ATTENDANCE HISTORY ELEMENTS
// ==========================================

const refreshStudentAttendanceBtn =
    document.getElementById("refreshStudentAttendanceBtn");

const studentTotalAttendance =
    document.getElementById("studentTotalAttendance");

const studentPresentAttendance =
    document.getElementById("studentPresentAttendance");

const studentTestAttendance =
    document.getElementById("studentTestAttendance");

const studentAttendanceSearch =
    document.getElementById("studentAttendanceSearch");

const studentAttendanceTableBody =
    document.getElementById("studentAttendanceTableBody");


// ==========================================
// VARIABLES
// ==========================================

let currentStudent = null;
let studentProfile = null;

let registeredCourses = [];
let selectedCourse = null;

let studentAttendanceRecords = [];


// ==========================================
// HELPER - LOCAL DATE
// ==========================================

function getLocalDate() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(now.getMonth() + 1)
        .padStart(2, "0");

    const day =
        String(now.getDate())
        .padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// ==========================================
// HELPER - CURRENT TIME
// ==========================================

function getCurrentTime() {

    const now = new Date();

    const hours =
        String(now.getHours())
        .padStart(2, "0");

    const minutes =
        String(now.getMinutes())
        .padStart(2, "0");

    return `${hours}:${minutes}`;
}


// ==========================================
// HELPER - COURSE UNITS
// ==========================================

function getCourseUnits(course) {

    if (
        course.units !== undefined &&
        course.units !== null
    ) {
        return course.units;
    }

    if (
        course.unit !== undefined &&
        course.unit !== null
    ) {
        return course.unit;
    }

    if (
        course.creditUnit !== undefined &&
        course.creditUnit !== null
    ) {
        return course.creditUnit;
    }

    if (
        course.creditUnits !== undefined &&
        course.creditUnits !== null
    ) {
        return course.creditUnits;
    }

    return "-";
}


// ==========================================
// HELPER - DISTANCE
// ==========================================

function calculateDistance(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const earthRadius = 6371000;

    const dLat =
        (lat2 - lat1) *
        Math.PI / 180;

    const dLon =
        (lon2 - lon1) *
        Math.PI / 180;

    const a =
        Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +

        Math.cos(
            lat1 * Math.PI / 180
        ) *

        Math.cos(
            lat2 * Math.PI / 180
        ) *

        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return earthRadius * c;
}


// ==========================================
// HELPER - GET GPS LOCATION
// ==========================================

function getStudentLocation() {

    return new Promise((resolve, reject) => {

        if (!navigator.geolocation) {

            reject(
                new Error(
                    "Geolocation is not supported by this browser."
                )
            );

            return;
        }

        navigator.geolocation.getCurrentPosition(

            (position) => {

                resolve({

                    latitude:
                        position.coords.latitude,

                    longitude:
                        position.coords.longitude

                });

            },

            (error) => {

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

                reject(
                    new Error(message)
                );
            },

            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }
        );
    });
}


// ==========================================
// STATUS MESSAGE
// ==========================================

function setAttendanceStatus(
    icon,
    title,
    message
) {

    if (statusIcon) {

        statusIcon.textContent =
            icon;
    }

    if (statusTitle) {

        statusTitle.textContent =
            title;
    }

    if (statusMessage) {

        statusMessage.textContent =
            message;
    }

    if (attendanceStatus) {

        attendanceStatus.style.display =
            "block";
    }
}


// ==========================================
// AUTH STATE
// ==========================================

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            currentStudent = null;
            studentProfile = null;

            if (studentWelcome) {

                studentWelcome.style.display =
                    "none";
            }

            if (studentWelcomeActions) {

                studentWelcomeActions.style.display =
                    "none";
            }

            if (studentLoginLink) {

                studentLoginLink.style.display =
                    "inline-block";
            }

            return;
        }


        try {

            const userRef =
                doc(
                    db,
                    "users",
                    user.uid
                );

            const userSnap =
                await getDoc(userRef);


            if (!userSnap.exists()) {

                console.error(
                    "Student profile was not found."
                );

                return;
            }


            const data =
                userSnap.data();


            if (data.role !== "student") {

                await signOut(auth);

                return;
            }


            currentStudent = user;


            studentProfile = {

                ...data,

                uid:
                    user.uid,

                email:
                    user.email ||
                    data.email ||
                    ""
            };


            if (studentWelcome) {

                studentWelcome.style.display =
                    "block";
            }


            if (studentWelcomeActions) {

                studentWelcomeActions.style.display =
                    "flex";
            }


            if (studentLoginLink) {

                studentLoginLink.style.display =
                    "none";
            }


            if (studentWelcomeText) {

                studentWelcomeText.textContent =
                    `Welcome, ${
                        studentProfile.fullName ||
                        "Student"
                    }`;
            }


            if (studentMatric) {

                studentMatric.textContent =
                    studentProfile.matricNumber ||
                    "-";
            }


            if (studentEmail) {

                studentEmail.textContent =
                    studentProfile.email ||
                    "-";
            }


            await loadRegisteredCourses();

            await loadStudentAttendanceHistory();

        } catch (error) {

            console.error(
                "Authentication error:",
                error
            );
        }
    }
);


// ==========================================
// LOGOUT
// ==========================================

if (studentLogoutBtn) {

    studentLogoutBtn.addEventListener(
        "click",
        async () => {

            try {

                await signOut(auth);

                window.location.href =
                    "student.html";

            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );
            }
        }
    );
}


// ==========================================
// LOAD DEPARTMENTS
// ==========================================

function loadDepartments() {

    if (!studentDepartment) {
        return;
    }

    studentDepartment.innerHTML =
        `<option value="">
            Select Department
        </option>`;


    const departments =
        getDepartments();


    departments.forEach(
        (department) => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                department;

            option.textContent =
                department;

            studentDepartment.appendChild(
                option
            );
        }
    );
}


// ==========================================
// LOAD LEVELS
// ==========================================

function loadLevels() {

    if (!studentLevel) {
        return;
    }

    studentLevel.innerHTML =
        `<option value="">
            Select Level
        </option>`;


    const department =
        studentDepartment?.value;


    if (!department) {
        return;
    }


    const levels =
        getLevels(department);


    levels.forEach(
        (level) => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                level;

            option.textContent =
                level;

            studentLevel.appendChild(
                option
            );
        }
    );
}


// ==========================================
// LOAD SEMESTERS
// ==========================================

function loadSemesters() {

    if (!semester) {
        return;
    }

    semester.innerHTML =
        `<option value="">
            Select Semester
        </option>`;


    const department =
        studentDepartment?.value;

    const level =
        studentLevel?.value;


    if (!department || !level) {
        return;
    }


    const semesters =
        getSemesters(
            department,
            level
        );


    semesters.forEach(
        (sem) => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                sem;

            option.textContent =
                sem;

            semester.appendChild(
                option
            );
        }
    );
}


// ==========================================
// LOAD COURSE CATALOG
// ==========================================

function loadCourseCatalog() {

    if (!registrationCourseList) {
        return;
    }


    const department =
        studentDepartment?.value;

    const level =
        studentLevel?.value;

    const selectedSemester =
        semester?.value;


    if (
        !department ||
        !level ||
        !selectedSemester
    ) {

        registrationCourseList.innerHTML =
            `<p class="empty-state">
                Select your department, level and semester.
            </p>`;

        return;
    }


    const courses =
        getCourses(
            department,
            level,
            selectedSemester
        );


    if (!courses.length) {

        registrationCourseList.innerHTML =
            `<p class="empty-state">
                No courses found for this selection.
            </p>`;

        return;
    }


    registrationCourseList.innerHTML =
        "";


    courses.forEach(
        (course, index) => {

            const courseCode =
                course.code ||
                course.courseCode ||
                "---";


            const courseTitle =
                course.title ||
                course.courseTitle ||
                "Untitled Course";


            const units =
                getCourseUnits(course);


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "course-card";


            card.innerHTML = `

                <div>

                    <strong>
                        ${courseCode}
                    </strong>

                    <h4>
                        ${courseTitle}
                    </h4>

                    <p>
                        ${units}
                        Unit${units == 1 ? "" : "s"}
                    </p>

                </div>

                <button
                    type="button"
                    class="register-course-btn"
                    data-index="${index}"
                >
                    Register Course
                </button>

            `;


            registrationCourseList.appendChild(
                card
            );
        }
    );


    document
        .querySelectorAll(
            ".register-course-btn"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                button.dataset.index
                            );

                        const course =
                            courses[index];

                        registerCourse(
                            course
                        );
                    }
                );
            }
        );
}


// ==========================================
// REGISTER COURSE
// ==========================================

async function registerCourse(course) {

    if (
        !currentStudent ||
        !studentProfile
    ) {

        showRegistrationMessage(
            "Please log in before registering a course."
        );

        return;
    }


    const department =
        studentDepartment?.value;

    const level =
        studentLevel?.value;

    const selectedSemester =
        semester?.value;

    const session =
        academicSession?.value;


    const courseCode =
        String(
            course.code ||
            course.courseCode ||
            ""
        )
        .trim()
        .toUpperCase();


    if (!courseCode) {

        showRegistrationMessage(
            "This course does not have a valid course code."
        );

        return;
    }


    try {

        const existingQuery =
            query(
                collection(
                    db,
                    "courseRegistrations"
                ),

                where(
                    "studentId",
                    "==",
                    currentStudent.uid
                ),

                where(
                    "courseCode",
                    "==",
                    courseCode
                ),

                where(
                    "session",
                    "==",
                    session
                ),

                where(
                    "semester",
                    "==",
                    selectedSemester
                )
            );


        const existingSnapshot =
            await getDocs(
                existingQuery
            );


        if (!existingSnapshot.empty) {

            showRegistrationMessage(
                `${courseCode} is already registered.`
            );

            return;
        }


        await addDoc(
            collection(
                db,
                "courseRegistrations"
            ),
            {

                studentId:
                    currentStudent.uid,

                studentName:
                    studentProfile.fullName ||
                    "",

                matricNumber:
                    studentProfile.matricNumber ||
                    "",

                email:
                    studentProfile.email ||
                    "",

                courseId:
                    course.id ||
                    courseCode,

                courseCode:
                    courseCode,

                courseTitle:
                    course.title ||
                    course.courseTitle ||
                    "",

                units:
                    getCourseUnits(course),

                department:
                    department || "",

                level:
                    level || "",

                session:
                    session || "",

                semester:
                    selectedSemester || "",

                registeredAt:
                    serverTimestamp()
            }
        );


        showRegistrationMessage(
            `${courseCode} registered successfully.`
        );


        await loadRegisteredCourses();

    } catch (error) {

        console.error(
            "Course registration error:",
            error
        );

        showRegistrationMessage(
            "Unable to register this course. Please try again."
        );
    }
}


// ==========================================
// REGISTRATION MESSAGE
// ==========================================

function showRegistrationMessage(message) {

    if (registrationMessage) {

        registrationMessage.style.display =
            "block";
    }

    if (registrationMessageText) {

        registrationMessageText.textContent =
            message;
    }
}


// ==========================================
// LOAD REGISTERED COURSES
// ==========================================

async function loadRegisteredCourses() {

    if (!currentStudent) {
        return;
    }


    try {

        const registrationQuery =
            query(
                collection(
                    db,
                    "courseRegistrations"
                ),

                where(
                    "studentId",
                    "==",
                    currentStudent.uid
                )
            );


        const snapshot =
            await getDocs(
                registrationQuery
            );


        registeredCourses = [];


        snapshot.forEach(
            (docSnap) => {

                registeredCourses.push({

                    id:
                        docSnap.id,

                    ...docSnap.data()

                });
            }
        );


        renderRegisteredCourses();

    } catch (error) {

        console.error(
            "Error loading registered courses:",
            error
        );
    }
}


// ==========================================
// RENDER REGISTERED COURSES
// ==========================================

function renderRegisteredCourses() {

    if (!registeredCourseList) {
        return;
    }


    if (registeredCourseCount) {

        registeredCourseCount.textContent =
            registeredCourses.length;
    }


    if (registeredCourses.length === 0) {

        registeredCourseList.innerHTML =
            `<p class="empty-state">
                You have not registered any courses yet.
            </p>`;


        if (selectedCourseCard) {

            selectedCourseCard.style.display =
                "none";
        }

        return;
    }


    if (registeredSession) {

        registeredSession.textContent =
            registeredCourses[0].session ||
            "-";
    }


    if (registeredSemester) {

        registeredSemester.textContent =
            registeredCourses[0].semester ||
            "-";
    }


    registeredCourseList.innerHTML =
        "";


    registeredCourses.forEach(
        (course, index) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "registered-course-card";


            card.innerHTML = `

                <div>

                    <strong>
                        ${course.courseCode || "---"}
                    </strong>

                    <h4>
                        ${course.courseTitle || "Untitled Course"}
                    </h4>

                    <p>
                        ${course.units || "-"}
                        Unit${course.units == 1 ? "" : "s"}
                    </p>

                </div>

                <button
                    type="button"
                    class="select-attendance-course"
                    data-index="${index}"
                >
                    Select
                </button>

            `;


            registeredCourseList.appendChild(
                card
            );
        }
    );


    document
        .querySelectorAll(
            ".select-attendance-course"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                button.dataset.index
                            );

                        selectCourseForAttendance(
                            registeredCourses[index]
                        );
                    }
                );
            }
        );
}


// ==========================================
// SELECT COURSE FOR ATTENDANCE
// ==========================================

function selectCourseForAttendance(course) {

    selectedCourse =
        course;


    if (selectedCourseCard) {

        selectedCourseCard.style.display =
            "block";
    }


    if (selectedCourseTitle) {

        selectedCourseTitle.textContent =
            `${course.courseCode || ""} - ${course.courseTitle || ""}`;
    }


    if (selectedCourseLocation) {

        selectedCourseLocation.textContent =
            "Attendance session location will be checked automatically.";
    }


    if (selectedCourseRadius) {

        selectedCourseRadius.textContent =
            "Session radius will be used.";
    }


    setAttendanceStatus(
        "📍",
        "Ready for Attendance",
        `Selected ${course.courseCode || "course"}. Enter the active attendance code when prompted.`
    );
}


// ==========================================
// DEPARTMENT CHANGE
// ==========================================

if (studentDepartment) {

    studentDepartment.addEventListener(
        "change",
        () => {

            loadLevels();


            if (semester) {

                semester.innerHTML =
                    `<option value="">
                        Select Semester
                    </option>`;
            }


            if (registrationCourseList) {

                registrationCourseList.innerHTML =
                    `<p class="empty-state">
                        Select your level and semester.
                    </p>`;
            }
        }
    );
}


// ==========================================
// LEVEL CHANGE
// ==========================================

if (studentLevel) {

    studentLevel.addEventListener(
        "change",
        () => {

            loadSemesters();


            if (registrationCourseList) {

                registrationCourseList.innerHTML =
                    `<p class="empty-state">
                        Select your semester.
                    </p>`;
            }
        }
    );
}


// ==========================================
// SEMESTER CHANGE
// ==========================================

if (semester) {

    semester.addEventListener(
        "change",
        () => {

            loadCourseCatalog();
        }
    );
}


// ==========================================
// INITIAL COURSE SETUP
// ==========================================

loadDepartments();


// ==========================================
// ATTENDANCE
// ==========================================

if (checkLocationBtn) {

    checkLocationBtn.addEventListener(
        "click",
        async () => {

            if (!currentStudent) {

                setAttendanceStatus(
                    "🔐",
                    "Login Required",
                    "Please log in as a student before marking attendance."
                );

                return;
            }


            if (!selectedCourse) {

                setAttendanceStatus(
                    "⚠️",
                    "Select a Course",
                    "Please select one of your registered courses first."
                );

                return;
            }


            try {

                checkLocationBtn.disabled =
                    true;

                checkLocationBtn.textContent =
                    "Checking Attendance...";


                // ======================================
                // FIND ACTIVE SESSION
                // ======================================

                const courseCode =
                    String(
                        selectedCourse.courseCode ||
                        ""
                    )
                    .trim()
                    .toUpperCase();


                const today =
                    getLocalDate();


                const sessionsSnapshot =
                    await getDocs(
                        collection(
                            db,
                            "attendanceSessions"
                        )
                    );


                let matchingSession =
                    null;

                let matchingSessionId =
                    null;


                sessionsSnapshot.forEach(
                    (docSnap) => {

                        const session =
                            docSnap.data();


                        const sessionCourseCode =
                            String(
                                session.courseCode ||
                                ""
                            )
                            .trim()
                            .toUpperCase();


                        if (
                            sessionCourseCode ===
                                courseCode &&

                            session.date ===
                                today &&

                            session.active ===
                                true
                        ) {

                            matchingSession =
                                session;

                            matchingSessionId =
                                docSnap.id;
                        }
                    }
                );


                if (
                    !matchingSession ||
                    !matchingSessionId
                ) {

                    setAttendanceStatus(
                        "❌",
                        "No Active Session",
                        `There is no active attendance session for ${courseCode} today.`
                    );

                    return;
                }


                // ======================================
                // ASK FOR ATTENDANCE CODE
                // ======================================

                const enteredCode =
                    prompt(
                        `Enter the 6-digit attendance code for ${courseCode}:`
                    );


                if (!enteredCode) {

                    setAttendanceStatus(
                        "⚠️",
                        "Code Required",
                        "You must enter the attendance code."
                    );

                    return;
                }


                const cleanEnteredCode =
                    String(
                        enteredCode
                    )
                    .trim();


                const savedCode =
                    String(
                        matchingSession.code ||
                        ""
                    )
                    .trim();


                if (
                    cleanEnteredCode !==
                    savedCode
                ) {

                    setAttendanceStatus(
                        "❌",
                        "Incorrect Code",
                        "The attendance code you entered is incorrect."
                    );

                    return;
                }


                // ======================================
                // CHECK TIME
                // ======================================

                const currentTime =
                    getCurrentTime();


                const startTime =
                    matchingSession.startTime ||
                    "00:00";


                const endTime =
                    matchingSession.endTime ||
                    "23:59";


                if (
                    currentTime <
                    startTime
                ) {

                    setAttendanceStatus(
                        "⏳",
                        "Attendance Not Started",
                        `Attendance starts at ${startTime}.`
                    );

                    return;
                }


                if (
                    currentTime >
                    endTime
                ) {

                    setAttendanceStatus(
                        "⏰",
                        "Attendance Closed",
                        `Attendance ended at ${endTime}.`
                    );

                    return;
                }


                // ======================================
                // TESTING MODE
                // ======================================

                const testingMode =
                    matchingSession.testingMode ===
                    true;


                let studentLatitude =
                    null;

                let studentLongitude =
                    null;

                let distance =
                    null;


                // ======================================
                // TESTING MODE ON
                // ======================================

                if (testingMode) {

                    setAttendanceStatus(
                        "🧪",
                        "Testing Mode Active",
                        "GPS distance restrictions are bypassed for this test attendance."
                    );


                    try {

                        const location =
                            await getStudentLocation();


                        studentLatitude =
                            location.latitude;

                        studentLongitude =
                            location.longitude;


                        const classLat =
                            Number(
                                matchingSession.latitude
                            );

                        const classLng =
                            Number(
                                matchingSession.longitude
                            );


                        if (
                            Number.isFinite(
                                classLat
                            ) &&
                            Number.isFinite(
                                classLng
                            )
                        {

                            distance =
                                calculateDistance(
                                    studentLatitude,
                                    studentLongitude,
                                    classLat,
                                    classLng
                                );
                        }

                    } catch (gpsError) {

                        console.warn(
                            "Testing Mode GPS skipped:",
                            gpsError
                        );
                    }

                } else {

                    // ==================================
                    // NORMAL MODE
                    // ==================================

                    try {

                        const location =
                            await getStudentLocation();


                        studentLatitude =
                            location.latitude;

                        studentLongitude =
                            location.longitude;

                    } catch (gpsError) {

                        setAttendanceStatus(
                            "📍",
                            "Location Required",
                            gpsError.message
                        );

                        return;
                    }


                    const classLat =
                        Number(
                            matchingSession.latitude
                        );

                    const classLng =
                        Number(
                            matchingSession.longitude
                        );

                    const allowedRadius =
                        Number(
                            matchingSession.radius
                        );


                    if (
                        !Number.isFinite(
                            classLat
                        ) ||

                        !Number.isFinite(
                            classLng
                        ) ||

                        !Number.isFinite(
                            allowedRadius
                        )
                    ) {

                        setAttendanceStatus(
                            "❌",
                            "Location Error",
                            "The attendance session does not have valid location settings."
                        );

                        return;
                    }


                    distance =
                        calculateDistance(
                            studentLatitude,
                            studentLongitude,
                            classLat,
                            classLng
                        );


                    if (
                        distance >
                        allowedRadius
                    ) {

                        setAttendanceStatus(
                            "🚫",
                            "Outside Attendance Area",
                            `You are approximately ${Math.round(distance)}m away. You must be within ${allowedRadius}m of the class location.`
                        );

                        return;
                    }
                }


                // ======================================
                // CHECK DUPLICATE ATTENDANCE
                // ======================================

                const duplicateQuery =
                    query(
                        collection(
                            db,
                            "attendance"
                        ),

                        where(
                            "studentId",
                            "==",
                            currentStudent.uid
                        ),

                        where(
                            "sessionId",
                            "==",
                            matchingSessionId
                        )
                    );


                const duplicateSnapshot =
                    await getDocs(
                        duplicateQuery
                    );


                if (
                    !duplicateSnapshot.empty
                ) {

                    setAttendanceStatus(
                        "⚠️",
                        "Already Marked",
                        "You have already marked attendance for this session."
                    );

                    return;
                }


                // ======================================
                // SAVE ATTENDANCE
                // ======================================

                await addDoc(
                    collection(
                        db,
                        "attendance"
                    ),
                    {

                        studentId:
                            currentStudent.uid,

                        studentName:
                            studentProfile.fullName ||
                            "",

                        matricNumber:
                            studentProfile.matricNumber ||
                            "",

                        email:
                            studentProfile.email ||
                            "",

                        sessionId:
                            matchingSessionId,

                        courseCode:
                            courseCode,

                        courseTitle:
                            selectedCourse.courseTitle ||
                            "",

                        session:
                            selectedCourse.session ||
                            "",

                        semester:
                            selectedCourse.semester ||
                            "",

                        studentLatitude:
                            studentLatitude,

                        studentLongitude:
                            studentLongitude,

                        classLatitude:
                            Number(
                                matchingSession.latitude
                            ),

                        classLongitude:
                            Number(
                                matchingSession.longitude
                            ),

                        distance:
                            distance,

                        radius:
                            Number(
                                matchingSession.radius
                            ),

                        date:
                            today,

                        status:
                            testingMode
                                ? "Test Attendance"
                                : "Present",

                        testingMode:
                            testingMode,

                        timestamp:
                            serverTimestamp()
                    }
                );


                // ======================================
                // SUCCESS
                // ======================================

                if (testingMode) {

                    setAttendanceStatus(
                        "🧪",
                        "Test Attendance Successful",
                        "Attendance was successfully recorded in Testing Mode. GPS distance restrictions were bypassed."
                    );

                } else {

                    setAttendanceStatus(
                        "✅",
                        "Attendance Marked Successfully",
                        `Your attendance for ${courseCode} has been recorded.`
                    );
                }


                // ======================================
                // REFRESH ATTENDANCE HISTORY
                // ======================================

                await loadStudentAttendanceHistory();


            } catch (error) {

                console.error(
                    "Attendance error:",
                    error
                );


                setAttendanceStatus(
                    "❌",
                    "Attendance Failed",
                    error.message ||
                    "Something went wrong while marking attendance."
                );

            } finally {

                checkLocationBtn.disabled =
                    false;

                checkLocationBtn.textContent =
                    "Check My Location & Mark Attendance";
            }
        }
    );
}


// ==========================================
// LOAD STUDENT ATTENDANCE HISTORY
// ==========================================

async function loadStudentAttendanceHistory() {

    if (
        !currentStudent ||
        !studentAttendanceTableBody
    ) {
        return;
    }


    try {

        studentAttendanceTableBody.innerHTML =
            `<tr>
                <td colspan="6">
                    Loading attendance history...
                </td>
            </tr>`;


        const attendanceQuery =
            query(
                collection(
                    db,
                    "attendance"
                ),

                where(
                    "studentId",
                    "==",
                    currentStudent.uid
                )
            );


        const snapshot =
            await getDocs(
                attendanceQuery
            );


        studentAttendanceRecords = [];


        snapshot.forEach(
            (docSnap) => {

                studentAttendanceRecords.push({

                    id:
                        docSnap.id,

                    ...docSnap.data()

                });
            }
        );


        // ======================================
        // SORT NEWEST FIRST
        // ======================================

        studentAttendanceRecords.sort(
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


        updateStudentAttendanceStats();

        renderStudentAttendanceHistory();

    } catch (error) {

        console.error(
            "Error loading attendance history:",
            error
        );


        studentAttendanceTableBody.innerHTML =
            `<tr>
                <td colspan="6">
                    Unable to load attendance history.
                </td>
            </tr>`;
    }
}


// ==========================================
// UPDATE ATTENDANCE STATS
// ==========================================

function updateStudentAttendanceStats() {

    const total =
        studentAttendanceRecords.length;


    const testAttendance =
        studentAttendanceRecords.filter(
            (record) =>
                record.testingMode === true ||
                record.status === "Test Attendance"
        ).length;


    const normalAttendance =
        studentAttendanceRecords.filter(
            (record) =>
                record.status === "Present" &&
                record.testingMode !== true
        ).length;


    if (studentTotalAttendance) {

        studentTotalAttendance.textContent =
            total;
    }


    if (studentPresentAttendance) {

        studentPresentAttendance.textContent =
            normalAttendance;
    }


    if (studentTestAttendance) {

        studentTestAttendance.textContent =
            testAttendance;
    }
}


// ==========================================
// FORMAT ATTENDANCE TIME
// ==========================================

function formatAttendanceTime(timestamp) {

    if (
        !timestamp ||
        !timestamp.seconds
    ) {
        return "-";
    }


    return new Date(
        timestamp.seconds * 1000
    ).toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


// ==========================================
// FORMAT ATTENDANCE DATE
// ==========================================

function formatAttendanceDate(date) {

    if (!date) {
        return "-";
    }


    const parsedDate =
        new Date(
            `${date}T00:00:00`
        );


    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {

        return date;
    }


    return parsedDate.toLocaleDateString(
        [],
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


// ==========================================
// RENDER ATTENDANCE HISTORY
// ==========================================

function renderStudentAttendanceHistory() {

    if (!studentAttendanceTableBody) {
        return;
    }


    const searchTerm =
        String(
            studentAttendanceSearch?.value ||
            ""
        )
        .trim()
        .toLowerCase();


    const filteredRecords =
        studentAttendanceRecords.filter(
            (record) => {

                if (!searchTerm) {
                    return true;
                }


                const searchableText = [

                    record.courseCode,

                    record.courseTitle,

                    record.date,

                    record.status,

                    record.testingMode
                        ? "testing"
                        : "normal"

                ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();


                return searchableText.includes(
                    searchTerm
                );
            }
        );


    if (!filteredRecords.length) {

        studentAttendanceTableBody.innerHTML =
            `<tr>
                <td colspan="6">
                    ${
                        studentAttendanceRecords.length
                            ? "No attendance records match your search."
                            : "No attendance records found."
                    }
                </td>
            </tr>`;

        return;
    }


    studentAttendanceTableBody.innerHTML =
        "";


    filteredRecords.forEach(
        (record) => {

            const isTesting =
                record.testingMode === true ||
                record.status ===
                    "Test Attendance";


            const distance =
                Number.isFinite(
                    Number(record.distance)
                )
                    ? `${Math.round(
                        Number(record.distance)
                    )}m`
                    : "-";


            const statusText =
                isTesting
                    ? "Test Attendance"
                    : record.status ||
                      "Present";


            const modeText =
                isTesting
                    ? "🧪 Testing"
                    : "📍 Normal";


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>

                    <strong>
                        ${
                            record.courseCode ||
                            "---"
                        }
                    </strong>

                    <small>
                        ${
                            record.courseTitle ||
                            ""
                        }
                    </small>

                </td>

                <td>
                    ${
                        formatAttendanceDate(
                            record.date
                        )
                    }
                </td>

                <td>
                    ${
                        formatAttendanceTime(
                            record.timestamp
                        )
                    }
                </td>

                <td>
                    ${distance}
                </td>

                <td>
                    <span class="${
                        isTesting
                            ? "student-test-status"
                            : "student-present-status"
                    }">
                        ${statusText}
                    </span>
                </td>

                <td>
                    <span class="${
                        isTesting
                            ? "student-test-status"
                            : "student-present-status"
                    }">
                        ${modeText}
                    </span>
                </td>

            `;


            studentAttendanceTableBody.appendChild(
                row
            );
        }
    );
}


// ==========================================
// ATTENDANCE HISTORY SEARCH
// ==========================================

if (studentAttendanceSearch) {

    studentAttendanceSearch.addEventListener(
        "input",
        () => {

            renderStudentAttendanceHistory();
        }
    );
}


// ==========================================
// ATTENDANCE HISTORY REFRESH
// ==========================================

if (refreshStudentAttendanceBtn) {

    refreshStudentAttendanceBtn.addEventListener(
        "click",
        async () => {

            refreshStudentAttendanceBtn.disabled =
                true;

            refreshStudentAttendanceBtn.textContent =
                "Refreshing...";


            try {

                await loadStudentAttendanceHistory();

            } finally {

                refreshStudentAttendanceBtn.disabled =
                    false;

                refreshStudentAttendanceBtn.textContent =
                    "Refresh";
            }
        }
    );
}