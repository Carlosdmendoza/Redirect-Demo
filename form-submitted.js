// form-submitted-listener.js

const formSubmittedListener = {
  event: "FORM_SUBMITTED",
  handler: function () {
    onFormSubmitted();
  },
};

function onFormSubmitted() {
  window.open("https://www.google.com", "_blank");
}

window.addEventListener("message", function (event) {
  if (event.data === "FORM_SUBMITTED") {
    onFormSubmitted();
  }
});
