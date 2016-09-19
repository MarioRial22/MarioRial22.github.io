window.hjSiteSettings = window.hjSiteSettings || {"testers_widgets":[],"polls":[],"recording_capture_keystrokes":true,"site_id":97904,"deferred_page_contents":[],"record_targeting_rules":[],"surveys":[],"heatmaps":[],"feedback_widgets":[],"forms":[],"record":false,"r":1.0};

window.hjBootstrap = window.hjBootstrap || function (scriptUrl) {
    var s = document.createElement('script');
    s.src = scriptUrl;
    document.getElementsByTagName('head')[0].appendChild(s);
    window.hjBootstrap = function() {};
};

hjBootstrap('https://script.hotjar.com/modules-3a655ad13238f38c608ff3a95a7cb46a.js');