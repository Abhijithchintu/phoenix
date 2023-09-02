import fetch, {Headers} from 'node-fetch';
import * as assert from "assert";
import * as crypto from "crypto";

const fail_threshold = 20;

const health_checks = async () => {
    const health_check_uri = [
        'http://localhost:3001/health-check',
        'http://localhost:3002/health-check',
        'http://localhost:3003/health-check'
    ];
    for (const uri of health_check_uri) {
        const response = await fetch(uri);
        assert.equal(200, response.status)
    }
};

const oauth_register_basic_validation = async () => {
    const test_data = [];

    const user_name = "a" + crypto.randomBytes(5).toString('hex');
    const mobile = 1000_000_000 + parseInt(crypto.randomBytes(4).toString('hex'), 16);
    const body = {
        "user_name": user_name,
        "mobile": mobile,
        "password" : "P@assword1",
        "name": "namey",
        "gender": 0,
        "dob": "2020-10-10"
    };

    // invalid user_name
    test_data.push({... body, "user_name": "name@"})
    // invalid mobile
    test_data.push({... body, "mobile": "124242"})
    // invalid password
    test_data.push({... body, "password": "p"})
    // invalid name
    test_data.push({... body, "name": "no"})
    // invalid gender
    test_data.push({... body, "gender": "no"})
    // invalid dob
    test_data.push({... body, "dob": "2000-23-23"})

    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    for (const test_case_body of test_data) {
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(test_case_body),
            headers: headers,
            redirect: 'follow'
        };
        const resp = await fetch("http://localhost:3001/register", requestOptions);
        await sleep(1);
        assert.equal(400, resp.status);
    }
};

const oauth_register_existing_user_validation = async () => {
    const user_name = "a" + crypto.randomBytes(5).toString('hex');
    const mobile = 1000_000_000 + parseInt(crypto.randomBytes(4).toString('hex'), 16);
    const body = {
        "user_name": user_name,
        "mobile": mobile,
        "password" : "P@assword1",
        "name": "namey",
        "gender": 0,
        "dob": "2020-10-10"
    };

    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    for (let i=0; i<2; i++) {
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: headers,
            redirect: 'follow'
        };
        const resp = await fetch("http://localhost:3001/register", requestOptions);
        await sleep(1);
        if (i === 0)
            assert.equal(200, resp.status);
        else if (i === 1)
            assert.equal(400, resp.status);
    }
};

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

(async () => {
    const tests = [
        health_checks,
        oauth_register_basic_validation,
        oauth_register_existing_user_validation
    ]
    let success = 0;
    let fail = 0;

    for (let test of tests) {
        let test_status = true;
        try {
            await test();
        } catch (ex) {
            test_status = false;
        }

        if (test_status) {
            success++;
        } else {
            console.log("\x1b[31m test failed:\x1b[0m", test.name);
            fail++;
            if (fail >= fail_threshold) {
                console.log("Stopped tests as failed >= ", fail_threshold)
                break;
            }
        }
    }
    console.log("success:", success, "fail:", fail);
})();
