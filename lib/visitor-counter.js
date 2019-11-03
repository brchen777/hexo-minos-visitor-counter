// Base on: https://blog.johnwu.cc/article/how-to-add-visitors-counter-on-hexo.html
$(document).ready(() => {
    // Append tag
    const tagV = `<span id="visits" class="column is-narrow">Visits: <font class="count">--<font></span>`;
    const tagP = `<span id="pageviews" class="column is-narrow">Pageviews: <font class="count">--<font></span>`;
    $(".article-meta").append(tagV, tagP);

    // Init firebase
    const config = {
        apiKey: "__apiKey__",
        authDomain: "__authDomain__",
        databaseURL: "__databaseURL__"
    };
    firebase.initializeApp(config);

    const database = firebase.database();
    const oriUrl = window.location.host;
    const curUrl = oriUrl + window.location.pathname;
    function readVisits(url, selector) {
        const db_key = decodeURI(url.replace(new RegExp("\\/|\\.", "g"), "_"));
        database
            .ref(db_key)
            .once("value")
            .then(function(result) {
                var count = parseInt(result.val() || 0) + 1;
                database.ref(db_key).set(count);
                if (selector.length > 0) {
                    selector.html(count);
                }
            });
    }

    readVisits(oriUrl, $("#visits .count"));
    if (curUrl && curUrl != "_") {
        readVisits("page/" + curUrl, $("#pageviews .count"));
    }
});
