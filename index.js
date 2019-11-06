const fs = require("fs");
const logger = require("hexo-log")();
const uglifyJS = require("uglify-es");
const defaultConfig = require("./default_config");

logger.info(`=======================================
HEXO MINOS Visitor Counter
=============================================`);

// check dependency
logger.info("Checking dependencies");
const missingDeps = ["hexo-inject"]
    .map(name => {
        try {
            require.resolve(name);
            return true;
        } catch (e) {
            logger.error(`Package ${name} is not installed.`);
        }
        return false;
    })
    .some(installed => !installed);
if (missingDeps) {
    logger.error(
        "Please install the missing dependencies in the root directory of your Hexo site."
    );
    process.exit(-1);
}

const config = Object.assign(Object.seal({ ...defaultConfig }), hexo.config["visitor-counter"]);
const { "firebase-version": version, ...otherConfig } = config;
let jsContent = fs.readFileSync(`${__dirname}/lib/visitor-counter.js`, "utf8");

// replace firebase config
for (const key in otherConfig) {
    if (!otherConfig.hasOwnProperty(key)) continue;

    const val = otherConfig[key];
    const re = new RegExp(`__${key}__`, "g");
    jsContent = jsContent.replace(re, val);
}

// minify js content
const { code: minJsContent } = uglifyJS.minify(jsContent);

// inject script
hexo.extend.filter.register("inject_ready", inject => {
    const cdnUrl = "https://www.gstatic.com/firebasejs";
    inject.bodyEnd
        .script({ src: `${cdnUrl}/${version}/firebase-app.js` })
        .script({ src: `${cdnUrl}/${version}/firebase-database.js` })
        .script({}, minJsContent);
});
