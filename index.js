const fs = require("fs");
const uglifyJS = require("uglify-es");

const { "firebase-version": version = "7.2.3", ...configArgs } = hexo.config["visitor-counter"];

hexo.extend.filter.register("inject_ready", inject => {
    // inject dependencies
    const cdnUrl = "https://www.gstatic.com/firebasejs";
    inject.bodyEnd.script({ src: `${cdnUrl}/${version}/firebase-app.js` });
    inject.bodyEnd.script({ src: `${cdnUrl}/${version}/firebase-database.js` });

    let jsContent = fs.readFileSync(`${__dirname}/lib/visitor-counter.js`, "utf8");
    // replace config
    for (const key in configArgs) {
        const val = configArgs[key];
        const re = new RegExp(`__${key}__`, "g");
        jsContent = jsContent.replace(re, val);
    }
    // minify js content
    const { code: minJsContent } = uglifyJS.minify(jsContent);
    inject.bodyEnd.script({}, minJsContent);
});
