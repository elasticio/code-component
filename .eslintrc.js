module.exports = {
    "extends": "airbnb-base",
    "env": {
        "mocha": true,
        "node": true
    },
    "overrides": [
        {
            "files": ["*.test.js", "*.spec.js"],
            "rules": {
                "no-unused-expressions": "off",
            }
        },
        {
            "files": ["*"],
            "rules": {
                "no-plusplus" : "off",
                "no-await-in-loop": "off",
            }
        }
    ]
};
