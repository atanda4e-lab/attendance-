// ============================================================
// ATTENDCHECK - COMPLETE COURSE CATALOG
// ============================================================
// Existing departments are preserved.
// Batch 3 adds:
// Engineering + Agriculture
//
// NOTE:
// Courses marked here are based on KWASU published programme/
// course information where available. Do not treat a course as
// an official curriculum item unless it has been verified from
// the relevant KWASU curriculum/course listing.
// ============================================================

const COURSE_CATALOG = {

    // ========================================================
    // 1. COMPUTER SCIENCE
    // ========================================================
    "Computer Science": {

        "100": {
            "First Semester": [
                { code: "CSC101", title: "Introduction to Computer Science", units: 3 },
                { code: "CSC103", title: "Introduction to Programming", units: 3 },
                { code: "CSC105", title: "Computer Organization", units: 3 },
                { code: "CSC107", title: "Discrete Mathematics", units: 3 }
            ],
            "Second Semester": [
                { code: "CSC102", title: "Internet Technology II", units: 3 },
                { code: "CSC104", title: "Fundamentals of Data Analysis", units: 3 },
                { code: "CSC106", title: "Computer Hardware Maintenance", units: 3 }
            ]
        },

        "200": {
            "First Semester": [
                { code: "CSC201", title: "Data Structures", units: 3 },
                { code: "CSC203", title: "Computer Architecture", units: 3 },
                { code: "CSC205", title: "Database Systems", units: 3 }
            ],
            "Second Semester": [
                { code: "CSC202", title: "Introduction to Data Science", units: 3 },
                { code: "CSC204", title: "Big Data Computing and Security", units: 3 },
                { code: "CSC206", title: "Operations Research", units: 3 },
                { code: "CSC208", title: "Netcentric Computing", units: 3 },
                { code: "CSC210", title: "Compiler Construction", units: 3 }
            ]
        },

        "300": {
            "First Semester": [
                { code: "CSC301", title: "Data Structures", units: 3 },
                { code: "CSC309", title: "Artificial Intelligence", units: 3 },
                { code: "CSC311", title: "Computer Graphics", units: 3 },
                { code: "CSC315", title: "Data Mining and Warehousing", units: 3 }
            ],
            "Second Semester": [
                { code: "CSC308", title: "Operating Systems", units: 3 },
                { code: "CSC310", title: "System Analysis and Design", units: 3 },
                { code: "CSC312", title: "Preliminary Research Techniques", units: 3 },
                { code: "CSC314", title: "Survey of Programming Language", units: 3 },
                { code: "CSC316", title: "Machine Learning", units: 3 },
                { code: "CSC318", title: "Management Information System", units: 3 },
                { code: "CSC322", title: "Computer Science Innovation and New Technologies", units: 3 },
                { code: "DTS304", title: "Data Management I", units: 3 }
            ]
        },

        "400": {
            "First Semester": [
                { code: "CSC401", title: "Advanced Computer Science", units: 3 },
                { code: "CSC403", title: "Software Engineering", units: 3 },
                { code: "CSC405", title: "Computer Security", units: 3 }
            ],
            "Second Semester": [
                { code: "CSC499", title: "Final Year Project", units: 6 }
            ]
        }
    },


    // ========================================================
    // 2. ACCOUNTING
    // ========================================================
    "Accounting": {
        "100": {
            "First Semester": [
                { code: "ACC101", title: "Introduction to Accounting", units: 3 },
                { code: "ACC103", title: "Principles of Accounting I", units: 3 }
            ],
            "Second Semester": [
                { code: "ACC102", title: "Principles of Accounting II", units: 3 }
            ]
        },

        "200": {
            "First Semester": [
                { code: "ACC201", title: "Financial Accounting I", units: 3 },
                { code: "ACC203", title: "Cost Accounting I", units: 3 }
            ],
            "Second Semester": [
                { code: "ACC202", title: "Financial Accounting II", units: 3 },
                { code: "ACC204", title: "Cost Accounting II", units: 3 }
            ]
        },

        "300": {
            "First Semester": [
                { code: "ACC301", title: "Advanced Financial Accounting", units: 3 },
                { code: "ACC303", title: "Management Accounting", units: 3 }
            ],
            "Second Semester": [
                { code: "ACC302", title: "Auditing", units: 3 },
                { code: "ACC304", title: "Taxation", units: 3 }
            ]
        },

        "400": {
            "First Semester": [
                { code: "ACC401", title: "Advanced Auditing", units: 3 },
                { code: "ACC403", title: "Public Sector Accounting", units: 3 }
            ],
            "Second Semester": [
                { code: "ACC499", title: "Accounting Project", units: 6 }
            ]
        }
    },


    // ========================================================
    // 3. FINANCE
    // ========================================================
    "Finance": {
        "100": {
            "First Semester": [
                { code: "FIN101", title: "Introduction to Finance", units: 3 },
                { code: "FIN103", title: "Principles of Economics", units: 3 }
            ],
            "Second Semester": [
                { code: "FIN102", title: "Introduction to Banking", units: 3 }
            ]
        },

        "200": {
            "First Semester": [
                { code: "FIN201", title: "Financial Institutions", units: 3 },
                { code: "FIN203", title: "Money and Banking", units: 3 }
            ],
            "Second Semester": [
                { code: "FIN202", title: "Financial Markets", units: 3 },
                { code: "FIN204", title: "Corporate Finance", units: 3 }
            ]
        },

        "300": {
            "First Semester": [
                { code: "FIN301", title: "Investment Analysis", units: 3 },
                { code: "FIN303", title: "Risk Management", units: 3 }
            ],
            "Second Semester": [
                { code: "FIN302", title: "Financial Management", units: 3 },
                { code: "FIN304", title: "International Finance", units: 3 }
            ]
        },

        "400": {
            "First Semester": [
                { code: "FIN401", title: "Advanced Financial Management", units: 3 },
                { code: "FIN403", title: "Portfolio Management", units: 3 }
            ],
            "Second Semester": [
                { code: "FIN499", title: "Finance Project", units: 6 }
            ]
        }
    },


    // ========================================================
    // 4. BUSINESS ADMINISTRATION
    // ========================================================
    "Business Administration": {
        "100": {
            "First Semester": [
                { code: "BUS101", title: "Introduction to Business", units: 3 },
                { code: "BUS103", title: "Principles of Management", units: 3 }
            ],
            "Second Semester": [
                { code: "BUS102", title: "Business Communication", units: 3 }
            ]
        },

        "200": {
            "First Semester": [
                { code: "BUS201", title: "Organizational Behaviour", units: 3 },
                { code: "BUS203", title: "Business Statistics", units: 3 }
            ],
            "Second Semester": [
                { code: "BUS202", title: "Human Resource Management", units: 3 },
                { code: "BUS204", title: "Marketing Management", units: 3 }
            ]
        },

        "300": {
            "First Semester": [
                { code: "BUS301", title: "Operations Management", units: 3 },
                { code: "BUS303", title: "Strategic Management", units: 3 }
            ],
            "Second Semester": [
                { code: "BUS302", title: "Entrepreneurship", units: 3 },
                { code: "BUS304", title: "Business Research Methods", units: 3 }
            ]
        },

        "400": {
            "First Semester": [
                { code: "BUS401", title: "Strategic Business Analysis", units: 3 },
                { code: "BUS403", title: "Corporate Management", units: 3 }
            ],
            "Second Semester": [
                { code: "BUS499", title: "Business Administration Project", units: 6 }
            ]
        }
    },


    // ========================================================
    // 5. ENTREPRENEURSHIP
    // ========================================================
    "Entrepreneurship": {
        "100": {
            "First Semester": [
                { code: "ENT101", title: "Introduction to Entrepreneurship", units: 3 },
                { code: "ENT103", title: "Business Environment", units: 3 }
            ],
            "Second Semester": [
                { code: "ENT102", title: "Entrepreneurial Skills", units: 3 }
            ]
        },

        "200": {
            "First Semester": [
                { code: "ENT201", title: "Small Business Management", units: 3 },
                { code: "ENT203", title: "Entrepreneurial Finance", units: 3 }
            ],
            "Second Semester": [
                { code: "ENT202", title: "Business Planning", units: 3 },
                { code: "ENT204", title: "Innovation Management", units: 3 }
            ]
        },

        "300": {
            "First Semester": [
                { code: "ENT301", title: "Venture Development", units: 3 },
                { code: "ENT303", title: "Entrepreneurial Marketing", units: 3 }
            ],
            "Second Semester": [
                { code: "ENT302", title: "Business Growth Strategies", units: 3 },
                { code: "ENT304", title: "Enterprise Development", units: 3 }
            ]
        },

        "400": {
            "First Semester": [
                { code: "ENT401", title: "Advanced Entrepreneurship", units: 3 },
                { code: "ENT403", title: "Venture Management", units: 3 }
            ],
            "Second Semester": [
                { code: "ENT499", title: "Entrepreneurship Project", units: 6 }
            ]
        }
    },


    // ========================================================
    // 6. ECONOMICS
    // ========================================================
    "Economics": {
        "100": {
            "First Semester": [
                { code: "ECO101", title: "Principles of Economics I", units: 3 },
                { code: "ECO103", title: "Introduction to Microeconomics", units: 3 }
            ],
            "Second Semester": [
                { code: "ECO102", title: "Principles of Economics II", units: 3 },
                { code: "ECO104", title: "Introduction to Macroeconomics", units: 3 }
            ]
        },

        "200": {
            "First Semester": [
                { code: "ECO201", title: "Intermediate Microeconomics", units: 3 },
                { code: "ECO203", title: "Statistics for Economics", units: 3 }
            ],
            "Second Semester": [
                { code: "ECO202", title: "Intermediate Macroeconomics", units: 3 },
                { code: "ECO204", title: "Mathematical Economics", units: 3 }
            ]
        },

        "300": {
            "First Semester": [
                { code: "ECO301", title: "Econometrics", units: 3 },
                { code: "ECO303", title: "Development Economics", units: 3 }
            ],
            "Second Semester": [
                { code: "ECO302", title: "International Economics", units: 3 },
                { code: "ECO304", title: "Public Finance", units: 3 }
            ]
        },

        "400": {
            "First Semester": [
                { code: "ECO401", title: "Advanced Econometrics", units: 3 },
                { code: "ECO403", title: "Economic Policy Analysis", units: 3 }
            ],
            "Second Semester": [
                { code: "ECO499", title: "Economics Project", units: 6 }
            ]
        }
    },


    // ========================================================
    // 7. POLITICAL SCIENCE
    // ========================================================
    "Political Science": {
        "100": {
            "First Semester": [
                { code: "POL101", title: "Introduction to Political Science", units: 3 },
                { code: "POL103", title: "Nigerian Government", units: 3 }
            ],
            "Second Semester": [
                { code: "POL102", title: "Political Ideas", units: 3 }
            ]
        },

        "200": {
            "First Semester": [
                { code: "POL201", title: "Political Theory", units: 3 },
                { code: "POL203", title: "Comparative Politics", units: 3 }
            ],
            "Second Semester": [
                { code: "POL202", title: "International Relations", units: 3 },
                { code: "POL204", title: "Public Policy", units: 3 }
            ]
        },

        "300": {
            "First Semester": [
                { code: "POL301", title: "Political Research Methods", units: 3 },
                { code: "POL303", title: "African Politics", units: 3 }
            ],
            "Second Semester": [
                { code: "POL302", title: "Political Economy", units: 3 },
                { code: "POL304", title: "Electoral Politics", units: 3 }
            ]
        },

        "400": {
            "First Semester": [
                { code: "POL401", title: "Advanced Political Theory", units: 3 },
                { code: "POL403", title: "International Political Economy", units: 3 }
            ],
            "Second Semester": [
                { code: "POL499", title: "Political Science Project", units: 6 }
            ]
        }
    },


    // ========================================================
    // 8. PUBLIC ADMINISTRATION
    // ========================================================
    "Public Administration": {
        "100": {
            "First Semester": [
                { code: "PAD101", title: "Introduction to Public Administration", units: 3 },
                { code: "PAD103", title: "Introduction to Government", units: 3 }
            ],
            "Second Semester": [
                { code: "PAD102", title: "Public Sector Organization", units: 3 }
            ]
        },

        "200": {
            "First Semester": [
                { code: "PAD201", title: "Public Personnel Administration", units: 3 },
                { code: "PAD203", title: "Public Finance", units: 3 }
            ],
            "Second Semester": [
                { code: "PAD202", title: "Administrative Theory", units: 3 },
                { code: "PAD204", title: "Local Government Administration", units: 3 }
            ]
        },

        "300": {
            "First Semester": [
                { code: "PAD301", title: "Public Policy", units: 3 },
                { code: "PAD303", title: "Development Administration", units: 3 }
            ],
            "Second Semester": [
                { code: "PAD302", title: "Administrative Law", units: 3 },
                { code: "PAD304", title: "Research Methods", units: 3 }
            ]
        },

        "400": {
            "First Semester": [
                { code: "PAD401", title: "Advanced Public Administration", units: 3 },
                { code: "PAD403", title: "Public Policy Analysis", units: 3 }
            ],
            "Second Semester": [
                { code: "PAD499", title: "Public Administration Project", units: 6 }
            ]
        }
    },


    // ========================================================
    // 9. MASS COMMUNICATION
    // ========================================================
    "Mass Communication": {
        "100": {
            "First Semester": [
                { code: "MAC101", title: "Introduction to Mass Communication", units: 3 },
                { code: "MAC103", title: "Communication Skills", units: 3 }
            ],
            "Second Semester": [
                { code: "MAC102", title: "History of Mass Communication", units: 3 }
            ]
        },

        "200": {
            "First Semester": [
                { code: "MAC201", title: "News Writing", units: 3 },
                { code: "MAC203", title: "Broadcasting", units: 3 }
            ],
            "Second Semester": [
                { code: "MAC202", title: "Editing", units: 3 },
                { code: "MAC204", title: "Media Production", units: 3 }
            ]
        },

        "300": {
            "First Semester": [
                { code: "MAC301", title: "Media Research", units: 3 },
                { code: "MAC303", title: "Digital Journalism", units: 3 }
            ],
            "Second Semester": [
                { code: "MAC302", title: "Public Relations", units: 3 },
                { code: "MAC304", title: "Advertising", units: 3 }
            ]
        },

        "400": {
            "First Semester": [
                { code: "MAC401", title: "Advanced Media Studies", units: 3 },
                { code: "MAC403", title: "Media Management", units: 3 }
            ],
            "Second Semester": [
                { code: "MAC499", title: "Mass Communication Project", units: 6 }
            ]
        }
    },


    // ========================================================
    // 10. MATHEMATICS
    // ========================================================
    "Mathematics": {
        "100": {
            "First Semester": [
                { code: "MTH101", title: "Elementary Mathematics I", units: 3 },
                { code: "MTH103", title: "Coordinate Geometry", units: 3 },
                { code: "MTH105", title: "Introduction to Algebra", units: 3 }
            ],
            "Second Semester": [
                { code: "MTH102", title: "Elementary Mathematics II", units: 3 },
                { code: "MTH104", title: "Trigonometry", units: 3 }
            ]
        },

        "200": {
            "First Semester": [
                { code: "MTH201", title: "Calculus", units: 3 },
                { code: "MTH203", title: "Linear Algebra", units: 3 }
            ],
            "Second Semester": [
                { code: "MTH202", title: "Differential Equations", units: 3 },
                { code: "MTH204", title: "Abstract Algebra", units: 3 }
            ]
        },

        "300": {
            "First Semester": [
                { code: "MTH301", title: "Real Analysis", units: 3 },
                { code: "MTH303", title: "Numerical Analysis", units: 3 }
            ],
            "Second Semester": [
                { code: "MTH302", title: "Complex Analysis", units: 3 },
                { code: "MTH304", title: "Operations Research", units: 3 }
            ]
        },

        "400": {
            "First Semester": [
                { code: "MTH401", title: "Advanced Analysis", units: 3 },
                { code: "MTH403", title: "Functional Analysis", units: 3 }
            ],
            "Second Semester": [
                { code: "MTH499", title: "Mathematics Project", units: 6 }
            ]
        }
    },


    // ========================================================
    // 11. STATISTICS
    // ========================================================
    "Statistics": {
        "100": {
            "First Semester": [
                { code: "STA101", title: "Introduction to Statistics", units: 3 },
                { code: "STA103", title: "Statistical Methods I", units: 3 }
            ],
            "Second Semester": [
                { code: "STA102", title: "Statistical Methods II", units: 3 }
            ]
        },

        "200": {
            "First Semester": [
                { code: "STA201", title: "Probability Theory", units: 3 },
                { code: "STA203", title: "Statistical Computing", units: 3 }
            ],
            "Second Semester": [
                { code: "STA202", title: "Probability Distributions", units: 3 },
                { code: "STA204", title: "Sampling Techniques", units: 3 }
            ]
        },

        "300": {
            "First Semester": [
                { code: "STA301", title: "Regression Analysis", units: 3 },
                { code: "STA303", title: "Experimental Design", units: 3 }
            ],
            "Second Semester": [
                { code: "STA302", title: "Multivariate Analysis", units: 3 },
                { code: "STA304", title: "Time Series Analysis", units: 3 }
            ]
        },

        "400": {
            "First Semester": [
                { code: "STA401", title: "Advanced Statistics", units: 3 },
                { code: "STA403", title: "Statistical Modelling", units: 3 }
            ],
            "Second Semester": [
                { code: "STA499", title: "Statistics Project", units: 6 }
            ]
        }
    },


    // ========================================================
    // 12. PHYSICS & MATERIAL SCIENCE
    // ========================================================
    "Physics & Material Science": {
        "100": {
            "First Semester": [
                { code: "PHY101", title: "General Physics I", units: 3 },
                { code: "PHY103", title: "Experimental Physics I", units: 2 }
            ],
            "Second Semester": [
                { code: "PHY102", title: "General Physics II", units: 3 },
                { code: "PHY104", title: "Experimental Physics II", units: 2 }
            ]
        },

        "200": {
            "First Semester": [
                { code: "PHY201", title: "Mechanics", units: 3 },
                { code: "PHY203", title: "Thermal Physics", units: 3 }
            ],
            "Second Semester": [
                { code: "PHY202", title: "Electricity and Magnetism", units: 3 },
                { code: "PHY204", title: "Waves and Optics", units: 3 }
            ]
        },

        "300": {
            "First Semester": [
                { code: "PHY301", title: "Quantum Physics", units: 3 },
                { code: "PHY303", title: "Solid State Physics", units: 3 }
            ],
            "Second Semester": [
                { code: "PHY302", title: "Electromagnetic Theory", units: 3 },
                { code: "PHY304", title: "Materials Science", units: 3 }
            ]
        },

        "400": {
            "First Semester": [
                { code: "PHY401", title: "Advanced Materials Science", units: 3 },
                { code: "PHY403", title: "Applied Physics", units: 3 }
            ],
            "Second Semester": [
                { code: "PHY499", title: "Physics Project", units: 6 }
            ]
        }
    },


    // ========================================================
    // 13. CHEMISTRY
    // ========================================================
    "Chemistry": {
        "100": {
            "First Semester": [
                { code: "CHM101", title: "General Chemistry I", units: 3 },
                { code: "CHM103", title: "Inorganic Chemistry I", units: 3 }
            ],
            "Second Semester": [
                { code: "CHM102", title: "General Chemistry II", units: 3 },
                { code: "CHM104", title: "Organic Chemistry I", units: 3 }
            ]
        },

        "200": {
            "First Semester": [
                { code: "CHM201", title: "Physical Chemistry I", units: 3 },
                { code: "CHM203", title: "Organic Chemistry II", units: 3 }
            ],
            "Second Semester": [
                { code: "CHM202", title: "Physical Chemistry II", units: 3 },
                { code: "CHM204", title: "Analytical Chemistry", units: 3 }
            ]
        },

        "300": {
            "First Semester": [
                { code: "CHM301", title: "Advanced Organic Chemistry", units: 3 },
                { code: "CHM303", title: "Instrumental Analysis", units: 3 }
            ],
            "Second Semester": [
                { code: "CHM302", title: "Coordination Chemistry", units: 3 },
                { code: "CHM304", title: "Chemical Kinetics", units: 3 }
            ]
        },

        "400": {
            "First Semester": [
                { code: "CHM401", title: "Advanced Analytical Chemistry", units: 3 },
                { code: "CHM403", title: "Industrial Chemistry", units: 3 }
            ],
            "Second Semester": [
                { code: "CHM499", title: "Chemistry Project", units: 6 }
            ]
        }
    },


    // ========================================================
    // 14. INDUSTRIAL CHEMISTRY
    // ========================================================
    "Industrial Chemistry": {
        "100": {
            "First Semester": [
                { code: "ICH101", title: "General Chemistry I", units: 3 },
                { code: "ICH103", title: "Introduction to Industrial Chemistry", units: 3 }
            ],
            "Second Semester": [
                { code: "ICH102", title: "General Chemistry II", units: 3 },
                { code: "ICH104", title: "Organic Chemistry", units: 3 }
            ]
        },

        "200": {
            "First Semester": [
                { code: "ICH201", title: "Physical Chemistry", units: 3 },
                { code: "ICH203", title: "Industrial Processes", units: 3 }
            ],
            "Second Semester": [
                { code: "ICH202", title: "Analytical Chemistry", units: 3 },
                { code: "ICH204", title: "Chemical Technology", units: 3 }
            ]
        },

        "300": {
            "First Semester": [
                { code: "ICH301", title: "Petrochemical Technology", units: 3 },
                { code: "ICH303", title: "Polymer Chemistry", units: 3 }
            ],
            "Second Semester": [
                { code: "ICH302", title: "Industrial Chemical Processes", units: 3 },
                { code: "ICH304", title: "Environmental Chemistry", units: 3 }
            ]
        },

        "400": {
            "First Semester": [
                { code: "ICH401", title: "Advanced Industrial Chemistry", units: 3 },
                { code: "ICH403", title: "Industrial Process Control", units: 3 }
            ],
            "Second Semester": [
                { code: "ICH499", title: "Industrial Chemistry Project", units: 6 }
            ]
        }
    },


    // ========================================================
    // 15. BIOCHEMISTRY
    // ========================================================
    "Biochemistry": {
        "100": {
            "First Semester": [
                { code: "BCH101", title: "Introduction to Biochemistry", units: 3 },
                { code: "BCH103", title: "General Biology", units: 3 }
            ],
            "Second Semester": [
                { code: "BCH102", title: "General Chemistry", units: 3 },
                { code: "BCH104", title: "Cell Biology", units: 3 }
            ]
        },

        "200": {
            "First Semester": [
                { code: "BCH201", title: "Biological Chemistry", units: 3 },
                { code: "BCH203", title: "Enzymology", units: 3 }
            ],
            "Second Semester": [
                { code: "BCH202", title: "Metabolism", units: 3 },
                { code: "BCH204", title: "Molecular Biology", units: 3 }
            ]
        },

        "300": {
            "First Semester": [
                { code: "BCH301", title: "Advanced Biochemistry", units: 3 },
                { code: "BCH303", title: "Protein Chemistry", units: 3 }
            ],
            "Second Semester": [
                { code: "BCH302", title: "Clinical Biochemistry", units: 3 },
                { code: "BCH304", title: "Biochemical Techniques", units: 3 }
            ]
        },

        "400": {
            "First Semester": [
                { code: "BCH401", title: "Advanced Molecular Biology", units: 3 },
                { code: "BCH403", title: "Biotechnology", units: 3 }
            ],
            "Second Semester": [
                { code: "BCH499", title: "Biochemistry Project", units: 6 }
            ]
        }
    },


    // ========================================================
    // 16. MICROBIOLOGY
    // ========================================================
    "Microbiology": {
        "100": {
            "First Semester": [
                { code: "MCB101", title: "Introduction to Microbiology", units: 3 },
                { code: "MCB103", title: "General Biology", units: 3 }
            ],
            "Second Semester": [
                { code: "MCB102", title: "Microbial Diversity", units: 3 },
                { code: "MCB104", title: "Basic Microbiology Laboratory", units: 2 }
            ]
        },

        "200": {
            "First Semester": [
                { code: "MCB201", title: "General Microbiology", units: 3 },
                { code: "MCB203", title: "Microbial Physiology", units: 3 }
            ],
            "Second Semester": [
                { code: "MCB202", title: "Microbial Genetics", units: 3 },
                { code: "MCB204", title: "Microbiology Laboratory", units: 2 }
            ]
        },

        "300": {
            "First Semester": [
                { code: "MCB301", title: "Medical Microbiology", units: 3 },
                { code: "MCB303", title: "Industrial Microbiology", units: 3 }
            ],
            "Second Semester": [
                { code: "MCB302", title: "Food Microbiology", units: 3 },
                { code: "MCB304", title: "Environmental Microbiology", units: 3 }
            ]
        },

        "400": {
            "First Semester": [
                { code: "MCB401", title: "Advanced Microbiology", units: 3 },
                { code: "MCB403", title: "Microbial Biotechnology", units: 3 }
            ],
            "Second Semester": [
                { code: "MCB499", title: "Microbiology Project", units: 6 }
            ]
        }
    },


    // ========================================================
    // 17. ZOOLOGY
    // ========================================================
    "Zoology": {
        "100": {
            "First Semester": [
                { code: "ZOO101", title: "Introduction to Zoology", units: 3 },
                { code: "ZOO103", title: "Animal Diversity", units: 3 }
            ],
            "Second Semester": [
                { code: "ZOO102", title: "General Zoology", units: 3 },
                { code: "ZOO104", title: "Animal Biology", units: 3 }
            ]
        },

        "200": {
            "First Semester": [
                { code: "ZOO201", title: "Invertebrate Zoology", units: 3 },
                { code: "ZOO203", title: "Animal Physiology", units: 3 }
            ],
            "Second Semester": [
                { code: "ZOO202", title: "Vertebrate Zoology", units: 3 },
                { code: "ZOO204", title: "Ecology", units: 3 }
            ]
        },

        "300": {
            "First Semester": [
                { code: "ZOO301", title: "Animal Behaviour", units: 3 },
                { code: "ZOO303", title: "Parasitology", units: 3 }
            ],
            "Second Semester": [
                { code: "ZOO302", title: "Entomology", units: 3 },
                { code: "ZOO304", title: "Wildlife Biology", units: 3 }
            ]
        },

        "400": {
            "First Semester": [
                { code: "ZOO401", title: "Advanced Zoology", units: 3 },
                { code: "ZOO403", title: "Conservation Biology", units: 3 }
            ],
            "Second Semester": [
                { code: "ZOO499", title: "Zoology Project", units: 6 }
            ]
        }
    },


    // ========================================================
    // 18. GEOLOGY & MINERAL SCIENCE
    // ========================================================
    "Geology & Mineral Science": {
        "100": {
            "First Semester": [
                { code: "GEO101", title: "Introduction to Geology I", units: 3 },
                { code: "GEO103", title: "Physical Geology", units: 3 }
            ],
            "Second Semester": [
                { code: "GEO102", title: "Introduction to Geology II", units: 3 },
                { code: "GEO104", title: "Historical Geology", units: 3 }
            ]
        },

        "200": {
            "First Semester": [
                { code: "GEO201", title: "Mineralogy", units: 3 },
                { code: "GEO203", title: "Petrology", units: 3 }
            ],
            "Second Semester": [
                { code: "GEO202", title: "Structural Geology", units: 3 },
                { code: "GEO204", title: "Sedimentology", units: 3 }
            ]
        },

        "300": {
            "First Semester": [
                { code: "GEO301", title: "Engineering Geology", units: 3 },
                { code: "GEO303", title: "Geochemistry", units: 3 }
            ],
            "Second Semester": [
                { code: "GEO302", title: "Economic Geology", units: 3 },
                { code: "GEO304", title: "Hydrogeology", units: 3 }
            ]
        },

        "400": {
            "First Semester": [
                { code: "GEO401", title: "Advanced Geology", units: 3 },
                { code: "GEO403", title: "Mineral Exploration", units: 3 }
            ],
            "Second Semester": [
                { code: "GEO499", title: "Geology Project", units: 6 }
            ]
        }
    },


    // ========================================================
    // 19. PLANT & ENVIRONMENTAL BIOLOGY
    // ========================================================
    "Plant & Environmental Biology": {
        "100": {
            "First Semester": [
                { code: "PEB101", title: "Introduction to Plant Biology", units: 3 },
                { code: "PEB103", title: "General Biology", units: 3 }
            ],
            "Second Semester": [
                { code: "PEB102", title: "Plant Diversity", units: 3 },
                { code: "PEB104", title: "Plant Structure", units: 3 }
            ]
        },

        "200": {
            "First Semester": [
                { code: "PEB201", title: "Plant Anatomy", units: 3 },
                { code: "PEB203", title: "Plant Physiology", units: 3 }
            ],
            "Second Semester": [
                { code: "PEB202", title: "Plant Taxonomy", units: 3 },
                { code: "PEB204", title: "Ecology", units: 3 }
            ]
        },

        "300": {
            "First Semester": [
                { code: "PEB301", title: "Plant Ecology", units: 3 },
                { code: "PEB303", title: "Environmental Biology", units: 3 }
            ],
            "Second Semester": [
                { code: "PEB302", title: "Plant Biotechnology", units: 3 },
                { code: "PEB304", title: "Conservation Biology", units: 3 }
            ]
        },

        "400": {
            "First Semester": [
                { code: "PEB401", title: "Advanced Plant Biology", units: 3 },
                { code: "PEB403", title: "Environmental Management", units: 3 }
            ],
            "Second Semester": [
                { code: "PEB499", title: "Plant Biology Project", units: 6 }
            ]
        }
    },


    // ========================================================
    // BATCH 3 — ENGINEERING
    // ========================================================

    // 20. AERONAUTICS & ASTRONAUTICS ENGINEERING
    "Aeronautics & Astronautics Engineering": {

        "100": {
            "First Semester": [
                { code: "AAE101", title: "Introduction to Aerospace Engineering", units: 3 },
                { code: "AAE103", title: "Engineering Mathematics I", units: 3 },
                { code: "AAE105", title: "Engineering Physics I", units: 3 }
            ],
            "Second Semester": [
                { code: "AAE102", title: "Engineering Mathematics II", units: 3 },
                { code: "AAE104", title: "Engineering Drawing", units: 3 }
            ]
        },

        "200": {
            "First Semester": [
                { code: "AAE201", title: "Introduction to Aerospace Systems Engineering", units: 3 },
                { code: "AAE203", title: "Engineering Mechanics", units: 3 },
                { code: "AAE205", title: "Thermodynamics", units: 3 }
            ],
            "Second Semester": [
                { code: "AAE202", title: "Fluid Mechanics", units: 3 },
                { code: "AAE204", title: "Materials Science", units: 3 }
            ]
        },

        "300": {
            "First Semester": [
                { code: "AAE301", title: "Aerodynamics", units: 3 },
                { code: "AAE303", title: "Aircraft Structures", units: 3 },
                { code: "AAE305", title: "Flight Mechanics", units: 3 }
            ],
            "Second Semester": [
                { code: "AAE302", title: "Aircraft Propulsion", units: 3 },
                { code: "AAE304", title: "Aerospace Systems", units: 3 }
            ]
        },

        "400": {
            "First Semester": [
                { code: "AAE401", title: "Advanced Aerodynamics", units: 3 },
                { code: "AAE403", title: "Spacecraft Engineering", units: 3 },
                { code: "AAE405", title: "Aircraft Design", units: 3 }
            ],
            "Second Semester": [
                { code: "AAE499", title: "Aeronautics Engineering Project", units: 6 }
            ]
        }
    },


    // 21. CIVIL & ENVIRONMENTAL ENGINEERING
    "Civil & Environmental Engineering": {

        "100": {
            "First Semester": [
                { code: "CEE101", title: "Introduction to Civil Engineering", units: 3 },
                { code: "CEE103", title: "Engineering Drawing", units: 3 },
                { code: "CEE105", title: "Engineering Mathematics", units: 3 }
            ],
            "Second Semester": [
                { code: "CEE102", title: "Engineering Mechanics", units: 3 },
                { code: "CEE104", title: "Surveying", units: 3 }
            ]
        },

        "200": {
            "First Semester": [
                { code: "CEE201", title: "Engineering Mechanics I", units: 3 },
                { code: "CEE203", title: "Construction Materials", units: 3 }
            ],
            "Second Semester": [
                { code: "CEE202", title: "Engineering Mechanics II", units: 3 },
                { code: "CEE204", title: "Fluid Mechanics", units: 3 }
            ]
        },

        "300": {
            "First Semester": [
                { code: "CEE301", title: "Fluid Mechanics", units: 3 },
                { code: "CEE303", title: "Engineering Geology", units: 3 },
                { code: "CEE305", title: "Soil Mechanics", units: 3 }
            ],
            "Second Semester": [
                { code: "CEE302", title: "Structural Analysis", units: 3 },
                { code: "CEE304", title: "Transportation Engineering", units: 3 }
            ]
        },

        "400": {
            "First Semester": [
                { code: "CEE401", title: "Structural Engineering", units: 3 },
                { code: "CEE403", title: "Environmental Engineering", units: 3 },
                { code: "CEE405", title: "Hydraulic Engineering", units: 3 }
            ],
            "Second Semester": [
                { code: "CEE499", title: "Civil Engineering Project", units: 6 }
            ]
        }
    },


    // 22. ELECTRICAL & COMPUTER ENGINEERING
    "Electrical & Computer Engineering": {

        "100": {
            "First Semester": [
                { code: "ECE101", title: "Introduction to Electrical Engineering", units: 3 },
                { code: "ECE103", title: "Engineering Mathematics I", units: 3 },
                { code: "ECE105", title: "Basic Electrical Science", units: 3 }
            ],
            "Second Semester": [
                { code: "ECE102", title: "Engineering Mathematics II", units: 3 },
                { code: "ECE104", title: "Digital Fundamentals", units: 3 }
            ]
        },

        "200": {
            "First Semester": [
                { code: "ECE201", title: "Circuit Theory", units: 3 },
                { code: "ECE203", title: "Electronic Devices", units: 3 }
            ],
            "Second Semester": [
                { code: "ECE202", title: "Digital Electronics", units: 3 },
                { code: "ECE204", title: "Signals and Systems", units: 3 }
            ]
        },

        "300": {
            "First Semester": [
                { code: "ECE301", title: "Electrical Machines", units: 3 },
                { code: "ECE303", title: "Microprocessors", units: 3 }
            ],
            "Second Semester": [
                { code: "ECE302", title: "Control Systems", units: 3 },
                { code: "ECE304", title: "Communication Systems", units: 3 }
            ]
        },

        "400": {
            "First Semester": [
                { code: "ECE401", title: "Power Systems", units: 3 },
                { code: "ECE403", title: "Computer Engineering Design", units: 3 }
            ],
            "Second Semester": [
                { code: "ECE499", title: "Electrical & Computer Engineering Project", units: 6 }
            ]
        }
    },


    // 23. FOOD & AGRICULTURAL ENGINEERING
    "Food & Agricultural Engineering": {

        "100": {
            "First Semester": [
                { code: "FAE101", title: "Introduction to Agricultural Engineering", units: 3 },
                { code: "FAE103", title: "Engineering Mathematics I", units: 3 },
                { code: "FAE105", title: "Engineering Drawing", units: 3 }
            ],
            "Second Semester": [
                { code: "FAE102", title: "Engineering Mathematics II", units: 3 },
                { code: "FAE104", title: "Basic Agricultural Science", units: 3 }
            ]
        },

        "200": {
            "First Semester": [
                { code: "FAE201", title: "Introduction to Agricultural Engineering", units: 3 },
                { code: "FAE203", title: "Mechanics of Machines", units: 3 }
            ],
            "Second Semester": [
                { code: "FAE202", title: "Soil Science", units: 3 },
                { code: "FAE204", title: "Crop Production", units: 3 }
            ]
        },

        "300": {
            "First Semester": [
                { code: "FAE301", title: "Design of Machine and Structural Elements", units: 3 },
                { code: "FAE303", title: "Crop Production", units: 3 },
                { code: "FAE305", title: "Soil Science", units: 3 }
            ],
            "Second Semester": [
                { code: "FAE302", title: "Biosystems Engineering", units: 3 },
                { code: "FAE304", title: "Hydraulics in Agriculture", units: 3 },
                { code: "FAE306", title: "Hydrology in Agriculture", units: 3 }
            ]
        },

        "400": {
            "First Semester": [
                { code: "FAE401", title: "Farm Power and Machinery", units: 3 },
                { code: "FAE403", title: "Storage and Processing of Agricultural and Biological Materials", units: 3 }
            ],
            "Second Semester": [
                { code: "FAE499", title: "Agricultural Engineering Project", units: 6 }
            ]
        }
    },


    // 24. MATERIALS SCIENCE & ENGINEERING
    "Materials Science & Engineering": {

        "100": {
            "First Semester": [
                { code: "MSE101", title: "Introduction to Materials Science", units: 3 },
                { code: "MSE103", title: "Engineering Mathematics", units: 3 }
            ],
            "Second Semester": [
                { code: "MSE102", title: "Engineering Physics", units: 3 },
                { code: "MSE104", title: "Engineering Drawing", units: 3 }
            ]
        },

        "200": {
            "First Semester": [
                { code: "MSE201", title: "Materials Chemistry", units: 3 },
                { code: "MSE203", title: "Materials Characterization", units: 3 }
            ],
            "Second Semester": [
                { code: "MSE202", title: "Materials Processing", units: 3 },
                { code: "MSE204", title: "Engineering Materials", units: 3 }
            ]
        },

        "300": {
            "First Semester": [
                { code: "MSE301", title: "Mechanical Behaviour of Materials", units: 3 },
                { code: "MSE303", title: "Metallurgy", units: 3 }
            ],
            "Second Semester": [
                { code: "MSE302", title: "Ceramics and Glasses", units: 3 },
                { code: "MSE304", title: "Polymer Materials", units: 3 }
            ]
        },

        "400": {
            "First Semester": [
                { code: "MSE401", title: "Advanced Materials Science", units: 3 },
                { code: "MSE403", title: "Materials Failure Analysis", units: 3 }
            ],
            "Second Semester": [
                { code: "MSE499", title: "Materials Science Project", units: 6 }
            ]
        }
    },


    // 25. MECHANICAL ENGINEERING
    "Mechanical Engineering": {

        "100": {
            "First Semester": [
                { code: "MEC101", title: "Introduction to Mechanical Engineering", units: 3 },
                { code: "MEC103", title: "Engineering Mathematics I", units: 3 },
                { code: "MEC105", title: "Engineering Drawing", units: 3 }
            ],
            "Second Semester": [
                { code: "MEC102", title: "Engineering Mathematics II", units: 3 },
                { code: "MEC104", title: "Engineering Physics", units: 3 }
            ]
        },

        "200": {
            "First Semester": [
                { code: "MEC201", title: "Engineering Mechanics", units: 3 },
                { code: "MEC203", title: "Thermodynamics", units: 3 }
            ],
            "Second Semester": [
                { code: "MEC202", title: "Fluid Mechanics", units: 3 },
                { code: "MEC204", title: "Manufacturing Processes", units: 3 }
            ]
        },

        "300": {
            "First Semester": [
                { code: "MEC301", title: "Mechanics of Machines", units: 3 },
                { code: "MEC303", title: "Heat Transfer", units: 3 }
            ],
            "Second Semester": [
                { code: "MEC302", title: "Machine Design", units: 3 },
                { code: "MEC304", title: "Control Engineering", units: 3 }
            ]
        },

        "400": {
            "First Semester": [
                { code: "MEC401", title: "Advanced Machine Design", units: 3 },
                { code: "MEC403", title: "Engineering Management", units: 3 }
            ],
            "Second Semester": [
                { code: "MEC499", title: "Mechanical Engineering Project", units: 6 }
            ]
        }
    },


    // ========================================================
    // 26. AGRICULTURAL ECONOMICS & EXTENSION SERVICES
    // ========================================================
    "Agricultural Economics & Extension Services": {

        "100": {
            "First Semester": [
                { code: "AGE101", title: "Introduction to Agricultural Economics", units: 3 },
                { code: "AGE103", title: "Green Revolution and Sustainable Environment I", units: 3 }
            ],
            "Second Semester": [
                { code: "AGE102", title: "Introduction to Agricultural Extension", units: 3 }
            ]
        },

        "200": {
            "First Semester": [
                { code: "AGE201", title: "Agricultural Economics", units: 3 },
                { code: "AGE203", title: "Agricultural Extension", units: 3 }
            ],
            "Second Semester": [
                { code: "AGE202", title: "Farm Management", units: 3 },
                { code: "AGE204", title: "Agricultural Marketing", units: 3 }
            ]
        },

        "300": {
            "First Semester": [
                { code: "AGE301", title: "Production Economics and Policy", units: 3 },
                { code: "AGE303", title: "Computer in Agriculture", units: 3 }
            ],
            "Second Semester": [
                { code: "AGE302", title: "Farm Management Finance and Accounting", units: 3 },
                { code: "AGE304", title: "Agricultural Extension Practices", units: 3 }
            ]
        },

        "400": {
            "First Semester": [
                { code: "AGE401", title: "Agricultural Production Economics", units: 3 },
                { code: "AGE403", title: "Agricultural Policy and Development", units: 3 }
            ],
            "Second Semester": [
                { code: "AGE499", title: "Special Project", units: 6 }
            ]
        }
    },


    // ========================================================
    // 27. ANIMAL PRODUCTION, FISHERIES & AQUACULTURE
    // ========================================================
    "Animal Production, Fisheries & Aquaculture": {

        "100": {
            "First Semester": [
                { code: "APA101", title: "Introduction to Animal Production", units: 3 },
                { code: "APA103", title: "General Biology", units: 3 }
            ],
            "Second Semester": [
                { code: "APA102", title: "Introduction to Fisheries and Aquaculture", units: 3 }
            ]
        },

        "200": {
            "First Semester": [
                { code: "APA201", title: "Animal Production", units: 3 },
                { code: "APA203", title: "Animal Nutrition", units: 3 }
            ],
            "Second Semester": [
                { code: "APA202", title: "Fisheries Biology", units: 3 },
                { code: "APA204", title: "Aquaculture", units: 3 }
            ]
        },

        "300": {
            "First Semester": [
                { code: "APA301", title: "Animal Breeding", units: 3 },
                { code: "APA303", title: "Fish Production", units: 3 }
            ],
            "Second Semester": [
                { code: "APA302", title: "Animal Health", units: 3 },
                { code: "APA304", title: "Aquaculture Management", units: 3 }
            ]
        },

        "400": {
            "First Semester": [
                { code: "APA401", title: "Advanced Animal Production", units: 3 },
                { code: "APA403", title: "Fisheries Management", units: 3 }
            ],
            "Second Semester": [
                { code: "APA499", title: "Animal Production Project", units: 6 }
            ]
        }
    },


    // ========================================================
    // 28. CROP PRODUCTION
    // ========================================================
    "Crop Production": {

        "100": {
            "First Semester": [
                { code: "CRP101", title: "Introduction to Crop Production", units: 3 },
                { code: "CRP103", title: "General Agriculture", units: 3 }
            ],
            "Second Semester": [
                { code: "CRP102", title: "Crop Science", units: 3 }
            ]
        },

        "200": {
            "First Semester": [
                { code: "CRP201", title: "Crop Production", units: 3 },
                { code: "CRP203", title: "Soil Science", units: 3 }
            ],
            "Second Semester": [
                { code: "CRP202", title: "Crop Physiology", units: 3 },
                { code: "CRP204", title: "Crop Protection", units: 3 }
            ]
        },

        "300": {
            "First Semester": [
                { code: "CRP301", title: "Permanent and Arable Crop Production", units: 3 },
                { code: "CRP303", title: "Crop Breeding", units: 3 }
            ],
            "Second Semester": [
                { code: "CRP302", title: "Weed Science", units: 3 },
                { code: "CRP304", title: "Plant Pathology", units: 3 }
            ]
        },

        "400": {
            "First Semester": [
                { code: "CRP401", title: "Advanced Crop Production", units: 3 },
                { code: "CRP403", title: "Crop Production Technology", units: 3 }
            ],
            "Second Semester": [
                { code: "CRP499", title: "Crop Production Project", units: 6 }
            ]
        }
    },


    // ========================================================
    // 29. FOOD SCIENCE & TECHNOLOGY
    // ========================================================
    "Food Science & Technology": {

        "100": {
            "First Semester": [
                { code: "FST101", title: "Introduction to Food Science", units: 3 },
                { code: "FST103", title: "General Chemistry", units: 3 }
            ],
            "Second Semester": [
                { code: "FST102", title: "Food Science Fundamentals", units: 3 }
            ]
        },

        "200": {
            "First Semester": [
                { code: "FST201", title: "Food Chemistry", units: 3 },
                { code: "FST203", title: "Food Microbiology", units: 3 }
            ],
            "Second Semester": [
                { code: "FST202", title: "Food Processing", units: 3 },
                { code: "FST204", title: "Food Analysis", units: 3 }
            ]
        },

        "300": {
            "First Semester": [
                { code: "FST301", title: "Food Preservation", units: 3 },
                { code: "FST303", title: "Food Quality Control", units: 3 }
            ],
            "Second Semester": [
                { code: "FST302", title: "Food Product Development", units: 3 },
                { code: "FST304", title: "Food Engineering", units: 3 }
            ]
        },

        "400": {
            "First Semester": [
                { code: "FST401", title: "Advanced Food Processing", units: 3 },
                { code: "FST403", title: "Food Safety Management", units: 3 }
            ],
            "Second Semester": [
                { code: "FST499", title: "Food Science & Technology Project", units: 6 }
            ]
        }
    }

};


// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getDepartments() {
    return Object.keys(COURSE_CATALOG);
}

function getLevels(department) {
    return Object.keys(COURSE_CATALOG[department] || {});
}

function getSemesters(department, level) {
    return Object.keys(
        COURSE_CATALOG[department]?.[level] || {}
    );
}

function getCourses(department, level, semester) {
    return COURSE_CATALOG[department]?.[level]?.[semester] || [];
}


// ============================================================
// EXPORT
// ============================================================

export {
    COURSE_CATALOG,
    getDepartments,
    getLevels,
    getSemesters,
    getCourses
};