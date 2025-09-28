const Enums = {
    USER: {
        ROLE: {
            USER: 100,
            ADMIN: 103,
        },
        LOGIN_METHOD: {
            OTP: 200,
            GOOGLE: 201,
            FACEBOOK: 202,
            PASSWORD: 203,
            APPLE: 204,
        },
        VERIFICATION_STATUS: {
            PENDING: 300,
            APPROVED: 301,
            REJECTED: 302,
            UNDER_REVIEW: 303,
        },
        GENDER: {
            MALE: 1,
            FEMALE: 2,
            OTHER: 3
        },
    },
    EXCHANGE: {
        EXCHANGE_STATUS:{
            ON_GOING: 400,
            COMPLETED: 401,
            OPEN:402,
            PENDING:403,
            ACCEPTED:404,
            DECLIENED:405,
            REQUEST:406
        },
        SPECIFICATION:{
            SCINECE:{
                MATHS: 500,
                PHYSICS: 501,
                CHEMISTRY: 502
            },
            ARTS: {
                DANCE: 600,
                MUSIC: 601,
                POETRY: 602,
                HISTORY: 603,
                LITERATURE: 604,
                POETRY: 605,
            },
            COMMERCE:{
                ACCOUNTING: 700,
                MARKETING: 701,
                FINANCE: 702,
                ECONOMICS: 703,
                MANAGEMENT: 704,
                LAW: 705,
            },
            LAW:{
                CRIMINAL_LAW: 800,
                CIVIL_LAW: 801,
                ADMINISTRATIVE_LAW: 802
            },
            TECHNOLOGY: {
                COMPUTER: 900,
                ELECTRONICS: 901,
                MECHANICAL: 902,
                ELECTRICAL: 903,
                CHEMICAL: 904,
                BIOLOGICAL: 905,
                MECHANICAL: 906,
                BIOLOGICAL: 907,
            },
            MEDICAL: {
                SURGERY: 1000,
                PATHOLOGY: 1001,
                PHARMACY: 1002,
                DENTISTRY: 1003,
                RADIOLOGY: 1004,
                OPHTHALMOLOGY: 1005,
                OTOLOGY: 1006,
            },
            OTHERS:{
                OTHERS: 1100,
                NOVEL: 1101,
                POETRY: 1102,
                BIOGRAPHY: 1103,
            }
        },
        CONDITION:{
            NEW: 1200,
            USED: 1201,
            OLD: 1202,
            GOOD:1203,
            EXCELLENT:1204
        }
    }

}

Object.freeze(Enums);

module.exports = Enums;