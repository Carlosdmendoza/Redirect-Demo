function loadEventApp() {
  const orgId = document.getElementById("orgId").value.trim();
  const path = document.getElementById("path").value.trim();
  const instanceUrl = "https://events.blackthorn.io";
  const domain = "events.blackthorn.io";

  const appSrc = `https://${domain}${
    path.startsWith("/") ? path : "/" + path
  }?_vh=1152`;
  const iframe = document.createElement("iframe");
  iframe.src = appSrc;
  iframe.classList.add("events-container");
  iframe.style.height = "1152px";
  iframe.style.width = "100%";
  document.body.appendChild(iframe);

  const script = document.createElement("script");
  script.src = `https://${domain}/embed.js`;
  script.onload = function () {
    if (typeof initializeEventsApp === "function") {
      initializeEventsApp(orgId, path, instanceUrl);
    }
  };
  document.body.appendChild(script);
}

document.getElementById("loadEvent").addEventListener("click", loadEventApp);

function initializeEventsApp(orgId, path, instanceUrl) {
  const app = new EventsApp({
    orgId,
    path,
    instanceUrl,
    listeners: [formSubmittedListener],
  });
  app.mount(".events-container");
}
