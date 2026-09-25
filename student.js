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
// HELPER - SAFE HTML
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
        statusIcon.textContent = icon;
    }

    if (statusTitle) {
        statusTitle.textContent = title;
    }

    if (statusMessage) {
        statusMessage.textContent = message;
    }

    if (attendanceStatus) {
        attendanceStatus.style.display = "block";
    }
}


// ==========================================
// REGISTRATION MESSAGE
// ==========================================

function showRegistrationMessage(message) {

    if (registrationMessage) {
        registrationMessage.style.display = "block";
    }

    if (registrationMessageText) {
        registrationMessageText.textContent = message;
    }
}


// ==========================================
// HIDE REGISTRATION MESSAGE
// ==========================================

function hideRegistrationMessage() {

    if (registrationMessage) {
        registrationMessage.style.display = "none";
    }
}


// ==========================================
// AUTH STATE
// ==========================================

onAuthStateChanged(
    auth,
    async (user) => {

        try {

            if (!user) {

                currentStudent = null;
                studentProfile = null;

                if (studentWelcome) {

                    studentWelcome.textContent =
                        "Student Portal";
                }

                if (studentWelcomeText) {

                    studentWelcomeText.textContent =
                        "Login to access your AttendCheck account.";
                }

                if (studentMatric) {

                    studentMatric.textContent =
                        "Matric: -";
                }

                if (studentEmail) {

                    studentEmail.textContent =
                        "Email: -";
                }

                if (studentWelcomeActions) {

                    studentWelcomeActions.style.display =
                        "none";
                }

                if (studentLoginLink) {

                    studentLoginLink.style.display =
                        "block";
                }

                return;
            }


            // ======================================
            // GET STUDENT PROFILE
            // ======================================

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

                setAttendanceStatus(
                    "❌",
                    "Profile Not Found",
                    "Your student profile could not be found in the system."
                );

                return;
            }


            const data =
                userSnap.data();


            // ======================================
            // CHECK ROLE
            // ======================================

            if (data.role !== "student") {

                await signOut(auth);

                alert(
                    "This account is not registered as a student account."
                );

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


            // ======================================
            // DISPLAY STUDENT INFORMATION
            // ======================================

            if (studentWelcome) {

                studentWelcome.textContent =
                    "Student Portal";
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
                    `Matric: ${
                        studentProfile.matricNumber ||
                        "-"
                    }`;
            }


            if (studentEmail) {

                studentEmail.textContent =
                    `Email: ${
                        studentProfile.email ||
                        "-"
                    }`;
            }


            if (studentWelcomeActions) {

                studentWelcomeActions.style.display =
                    "flex";
            }


            if (studentLoginLink) {

                studentLoginLink.style.display =
                    "none";
            }


            // ======================================
            // AUTO-FILL PROFILE INFORMATION
            // ======================================

            if (
                studentProfile.department &&
                studentDepartment
            ) {

                const departments =
                    getDepartments();

                const departmentMatch =
                    departments.find(
                        department =>
                            String(department)
                                .toLowerCase() ===
                            String(
                                studentProfile.department
                            )
                                .toLowerCase()
                    );

                if (departmentMatch) {

                    studentDepartment.value =
                        departmentMatch;

                    loadLevels();
                }
            }


            if (
                studentProfile.level &&
                studentLevel
            ) {

                const levelMatch =
                    Array.from(
                        studentLevel.options
                    ).find(
                        option =>
                            String(option.value)
                                .toLowerCase() ===
                            String(
                                studentProfile.level
                            )
                                .toLowerCase()
                    );

                if (levelMatch) {

                    studentLevel.value =
                        levelMatch.value;

                    loadSemesters();
                }
            }


            // ======================================
            // LOAD DATA
            // ======================================

            await loadRegisteredCourses();

            await loadStudentAttendanceHistory();

        } catch (error) {

            console.error(
                "Authentication error:",
                error
            );

            setAttendanceStatus(
                "❌",
                "System Error",
                error.message ||
                "Unable to load your student account."
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
        department => {

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
        level => {

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
        sem => {

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


    hideRegistrationMessage();


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


    let courses = [];


    try {

        courses =
            getCourses(
                department,
                level,
                selectedSemester
            ) || [];

    } catch (error) {

        console.error(
            "Course catalog error:",
            error
        );

        registrationCourseList.innerHTML =
            `<p class="empty-state">
                Unable to load courses.
            </p>`;

        return;
    }


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
                String(
                    course.code ||
                    course.courseCode ||
                    "---"
                )
                .trim()
                .toUpperCase();


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
                        ${escapeHTML(courseCode)}
                    </strong>

                    <h4>
                        ${escapeHTML(courseTitle)}
                    </h4>

                    <p>
                        ${escapeHTML(units)}
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


    registrationCourseList
        .querySelectorAll(
            ".register-course-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const index =
                            Number(
                                button.dataset.index
                            );

                        const course =
                            courses[index];

                        if (!course) {
                            return;
                        }

                        await registerCourse(
                            course,
                            button
                        );
                    }
                );
            }
        );
}


// ==========================================
// REGISTER COURSE
// ==========================================

async function registerCourse(
    course,
    button
) {

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
        studentDepartment?.value || "";

    const level =
        studentLevel?.value || "";

    const selectedSemester =
        semester?.value || "";

    const session =
        academicSession?.value || "";


    if (
        !department ||
        !level ||
        !selectedSemester ||
        !session
    ) {

        showRegistrationMessage(
            "Please select your department, level, academic session and semester."
        );

        return;
    }


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

        if (button) {

            button.disabled = true;

            button.textContent =
                "Checking...";
        }


        // ======================================
        // CHECK DUPLICATE
        // ======================================

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
                `${courseCode} is already registered for ${session} ${selectedSemester}.`
            );

            return;
        }


        if (button) {

            button.textContent =
                "Registering...";
        }


        // ======================================
        // SAVE REGISTRATION
        // ======================================

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
                    department,

                level:
                    level,

                session:
                    session,

                semester:
                    selectedSemester,

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
            error.message ||
            "Unable to register this course. Please try again."
        );

    } finally {

        if (button) {

            button.disabled = false;

            button.textContent =
                "Register Course";
        }
    }
}


// ==========================================
// LOAD REGISTERED COURSES
// ==========================================

async function loadRegisteredCourses() {

    if (
        !currentStudent ||
        !registeredCourseList
    ) {
        return;
    }


    try {

        registeredCourseList.innerHTML =
            `<p class="empty-state">
                Loading registered courses...
            </p>`;


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
            docSnap => {

                registeredCourses.push({

                    id:
                        docSnap.id,

                    ...docSnap.data()

                });
            }
        );


        // ======================================
        // SORT NEWEST REGISTRATIONS
        // ======================================

        registeredCourses.sort(
            (a, b) => {

                const timeA =
                    a.registeredAt?.seconds ||
                    0;

                const timeB =
                    b.registeredAt?.seconds ||
                    0;

                return timeB - timeA;
            }
        );


        renderRegisteredCourses();


    } catch (error) {

        console.error(
            "Error loading registered courses:",
            error
        );

        registeredCourseList.innerHTML =
            `<p class="empty-state">
                Unable to load registered courses.
            </p>`;
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


    if (!registeredCourses.length) {

        registeredCourseList.innerHTML =
            `<p class="empty-state">
                You have not registered any courses yet.
            </p>`;


        if (registeredSession) {
            registeredSession.textContent = "-";
        }


        if (registeredSemester) {
            registeredSemester.textContent = "-";
        }


        if (selectedCourseCard) {
            selectedCourseCard.style.display = "none";
        }

        return;
    }


    const latestCourse =
        registeredCourses[0];


    if (registeredSession) {

        registeredSession.textContent =
            latestCourse.session ||
            "-";
    }


    if (registeredSemester) {

        registeredSemester.textContent =
            latestCourse.semester ||
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
                        ${escapeHTML(
                            course.courseCode ||
                            "---"
                        )}
                    </strong>

                    <h4>
                        ${escapeHTML(
                            course.courseTitle ||
                            "Untitled Course"
                        )}
                    </h4>

                    <p>
                        ${escapeHTML(
                            course.units ||
                            "-"
                        )}
                        Unit${
                            course.units == 1
                                ? ""
                                : "s"
                        }
                    </p>

                    <small>
                        ${escapeHTML(
                            course.session ||
                            ""
                        )}
                        ${
                            course.semester
                                ? " • " +
                                  escapeHTML(
                                      course.semester
                                  )
                                : ""
                        }
                    </small>

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


    registeredCourseList
        .querySelectorAll(
            ".select-attendance-course"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                button.dataset.index
                            );

                        const course =
                            registeredCourses[index];

                        if (course) {

                            selectCourseForAttendance(
                                course
                            );
                        }
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
            `${course.courseCode || ""} - ${
                course.courseTitle || ""
            }`;
    }


    if (selectedCourseLocation) {

        selectedCourseLocation.textContent =
            "The active attendance session will provide the location.";
    }


    if (selectedCourseRadius) {

        selectedCourseRadius.textContent =
            "Checked automatically";
    }


    setAttendanceStatus(
        "📍",
        "Ready for Attendance",
        `Selected ${
            course.courseCode ||
            "course"
        }. Enter the active attendance code when prompted.`
    );


    // Scroll to attendance area

    if (selectedCourseCard) {

        selectedCourseCard.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
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


            hideRegistrationMessage();
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


            hideRegistrationMessage();
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
// SESSION CHANGE
// ==========================================

if (academicSession) {

    academicSession.addEventListener(
        "change",
        () => {

            hideRegistrationMessage();

            // Keep current course list visible.
            // Registration will use the selected session.
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


                // ==================================
                // COURSE CODE
                // ==================================

                const courseCode =
                    String(
                        selectedCourse.courseCode ||
                        ""
                    )
                    .trim()
                    .toUpperCase();


                const today =
                    getLocalDate();


                // ==================================
                // FIND ACTIVE SESSION
                // ==================================

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
                    docSnap => {

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


                // ==================================
                // ATTENDANCE CODE
                // ==================================

                const enteredCode =
                    prompt(
                        `Enter the 6-digit attendance code for ${courseCode}:`
                    );


                if (
                    enteredCode === null ||
                    String(enteredCode).trim() === ""
                ) {

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


                // ==================================
                // CHECK TIME
                // ==================================

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


                // ==================================
                // TESTING MODE
                // ==================================

                const testingMode =
                    matchingSession.testingMode === true;


                let studentLatitude =
                    null;

                let studentLongitude =
                    null;

                let distance =
                    null;


                // ==================================
                // TESTING MODE
                // ==================================

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


                        // FIXED SYNTAX ERROR
                        if (
                            Number.isFinite(
                                classLat
                            ) &&
                            Number.isFinite(
                                classLng
                            )
                        ) {

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
                            `You are approximately ${Math.round(
                                distance
                            )}m away. You must be within ${
                                allowedRadius
                            }m of the class location.`
                        );

                        return;
                    }
                }


                // ==================================
                // CHECK DUPLICATE ATTENDANCE
                // ==================================

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


                // ==================================
                // SAVE ATTENDANCE
                // ==================================

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


                // ==================================
                // SUCCESS
                // ==================================

                if (testingMode) {

                    setAttendanceStatus(
                        "🧪",
                        "Test Attendance Successful",
                        "Attendance was successfully recorded in Testing Mode."
                    );

                } else {

                    setAttendanceStatus(
                        "✅",
                        "Attendance Marked Successfully",
                        `Your attendance for ${courseCode} has been recorded.`
                    );
                }


                // ==================================
                // REFRESH HISTORY
                // ==================================

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
// LOAD ATTENDANCE HISTORY
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
            docSnap => {

                studentAttendanceRecords.push({

                    id:
                        docSnap.id,

                    ...docSnap.data()

                });
            }
        );


        // ==================================
        // NEWEST FIRST
        // ==================================

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
// ATTENDANCE STATS
// ==========================================

function updateStudentAttendanceStats() {

    const total =
        studentAttendanceRecords.length;


    const testAttendance =
        studentAttendanceRecords.filter(
            record =>
                record.testingMode === true ||
                record.status === "Test Attendance"
        ).length;


    const normalAttendance =
        studentAttendanceRecords.filter(
            record =>
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
// FORMAT TIME
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
// FORMAT DATE
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
            record => {

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
        record => {

            const isTesting =
                record.testingMode === true ||
                record.status ===
                    "Test Attendance";


            const numericDistance =
                Number(
                    record.distance
                );


            const distance =
                Number.isFinite(
                    numericDistance
                )
                    ? `${Math.round(
                        numericDistance
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


            const statusClass =
                isTesting
                    ? "student-test-status"
                    : "student-present-status";


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>

                    <strong>
                        ${escapeHTML(
                            record.courseCode ||
                            "---"
                        )}
                    </strong>

                    <small>
                        ${escapeHTML(
                            record.courseTitle ||
                            ""
                        )}
                    </small>

                </td>

                <td>
                    ${formatAttendanceDate(
                        record.date
                    )}
                </td>

                <td>
                    ${formatAttendanceTime(
                        record.timestamp
                    )}
                </td>

                <td>
                    ${distance}
                </td>

                <td>

                    <span class="${statusClass}">
                        ${escapeHTML(statusText)}
                    </span>

                </td>

                <td>

                    <span class="${statusClass}">
                        ${escapeHTML(modeText)}
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
// ATTENDANCE SEARCH
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
// ATTENDANCE REFRESH
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

            } catch (error) {

                console.error(
                    "Refresh error:",
                    error
                );

            } finally {

                refreshStudentAttendanceBtn.disabled =
                    false;

                refreshStudentAttendanceBtn.textContent =
                    "Refresh";
            }
        }
    );
}