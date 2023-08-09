/*
* STATUS CODE FORMAT
* first two letters: Indicates service, ex: OA - OAuth
* next two letters: Indicates route/aspect, ex: RE - Register route
* fifth letter: Indicates type of code, ex: V - Client data validation error
* next digits: error code numbering
*
* ************** Routes/Aspect Codes ***************
* RE: register
* LO: login
* */
module.exports = Object.freeze({
    OAREV_1000: "Invalid username or mobile",
    OALOV_1001: "Invalid password",
    OAREV_1002: "User Name is invalid",
    OAREV_1003: "User Name is too long, it should be in the range of (8-20)",
    OAREV_1004: "User Name is too short, it should be in the range of (8-20)",
    OAREV_1005: "User Name should start with an alphabet, it should contain only alphabets and numbers",
    OAREV_1006: "Mobile Number is invalid",
    OAREV_1007: "Mobile number is too long, it should contain 10 digits",
    OAREV_1008: "Mobile number is too short, it should contain 10 digits",
    OAREV_1009: "Mobile Number should only contain 10 digts",
    OAREV_1010: "Password is invalid",
    OAREV_1011: "Password is too long, it should be in the range of (8-31)",
    OAREV_1012: "Password is too short, it should be in the range of (8-31)",
    OAREV_1013: "Password must contain atleast 1 Capital letter, 1 small letter and 1 special character",
    OAREV_1013: "Name is not invalid",
    OAREV_1014: "Name is too short, it should contain atleat 3 characters",
    OAREV_1015: "Name is too long, it should contain only 40 characters",
    OAREV_1016: "Mobile number is already registered",
    OALOV_1017: "Invalid username or mobile",
});