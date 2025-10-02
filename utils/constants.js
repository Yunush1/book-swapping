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
    SERVICE: {
        TYPE: {
            CHAT: 400,
            VIDEO: 401,
            CALL: 402,
            PALMISTRY: 403,
            REPORT: 404,
            POOJA: 405,
            LIVE: 406,
        },
        STATUS: {
            PENDING: 500,
            COMPLETED: 501,
            CANCELLED: 502,
            NO_SHOW: 503,
            ONGOING: 504,
        },
        FOLLOW: {
            PENDING: 505,
            ACCEPTED: 506,
            REJECTED: 507,
        },
    },
    EXCHANGE: {
        EXCHANGE_STATUS: {
            ON_GOING: 400,
            COMPLETED: 401,
            OPEN: 402,
            PENDING: 403,
            ACCEPTED: 404,
            DECLIENED: 405,
            REQUEST: 406
        },
        SPECIFICATION: {
            SCINECE: {
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
            COMMERCE: {
                ACCOUNTING: 700,
                MARKETING: 701,
                FINANCE: 702,
                ECONOMICS: 703,
                MANAGEMENT: 704,
                LAW: 705,
            },
            LAW: {
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
            OTHERS: {
                OTHERS: 1100,
                NOVEL: 1101,
                POETRY: 1102,
                BIOGRAPHY: 1103,
            }
        },
        CONDITION: {
            NEW: 1200,
            USED: 1201,
            OLD: 1202,
            GOOD: 1203,
            EXCELLENT: 1204
        }
    },
    PAYMENT: {
        STATUS: {
            PENDING: 600,
            PAID: 601,
            REFUNDED: 602,
            FAILED: 603,
            CANCELLED: 604,
        },
        METHOD: {
            CREDIT_CARD: 700,
            DEBIT_CARD: 701,
            UPI: 702,
            WALLET: 703,
            NET_BANKING: 704,
        },
        PROVIDER: {
            RAZORPAY: 800,
            PAYTM: 801,
            STRIPE: 802,
            CASHFREE: 803,
            ASTROUP: 804,
            PHONEPAY: 805,
        },
    },

}

Object.freeze(Enums);

module.exports = Enums;