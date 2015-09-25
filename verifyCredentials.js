module.exports = verify;

function verify(credentials, cb) {

    console.log('About to verify credentials');

    if (!credentials.name) {
        console.log('Invalid credentials');

        return cb(null, {verified: false});
    }

    console.log('Successfully verified credentials');

    cb(null, {verified: true});
}

