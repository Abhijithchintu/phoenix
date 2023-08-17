import fetch, {Headers} from 'node-fetch';
import * as assert from "assert";

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

const oauth_register_validation = async () => {
    try {
        const data = JSON.stringify({
            "user_name": "testname4",
            "mobile": "123",
            "password" : "P@assword1",
            "name": "namey",
            "gender": 0,
            "dob": "2020-10-10"
        });

        var headers = new Headers();
        headers.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'POST',
            body: data,
            headers: headers,
            redirect: 'follow'
        };

        const resp = await fetch("http://localhost:3001/register", requestOptions)
        console.log(await resp.json())
        assert.equal(400, resp.status)
    } catch (e) {
        console.log(e)
    }
};

(async () => {
    const tests = [
        health_checks,
        oauth_register_validation
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
