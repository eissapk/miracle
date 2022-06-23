// e.g. confirm popup
// oConfirm({
//   dark: true,
//   title: "popup title",
//   desc: " Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, ex!",
//   btns: { cancel: { exists: true, text: "Cancel" }, okay: { text: "Okay" } },
// }).then(res => {
//   if (res) {
//     console.log("ok");
//   } else {
//     console.log("cancel");
//   }
// });

function oConfirm(data) {
  return new Promise(resolve => {
    const cancelExists = data && data.btns && data.btns.cancel && data.btns.cancel.exists === true;
    const cancelText = data && data.btns && data.btns.cancel && data.btns.cancel.text;
    const okayText = data && data.btns && data.btns.okay && data.btns.okay.text;
    let temp = `
      <article>
        ${data && data.title ? `<h3>${data.title}</h3>` : ""}
        ${data && data.desc ? `<p>${data.desc}</p>` : ""}
      </article>
      <section>
        ${cancelExists ? `<button type="button" class="cancelBtn">${cancelText ? cancelText : "Cancel"}</button>` : ""}
        <button type="button" class="okBtn ${!cancelExists ? `removeFloat` : ""}">${okayText ? okayText : "Okay"}</button>
      </section>
    `;
    let confirmElm = document.getElementById("o-confirm");
    if (!confirmElm) {
      confirmElm = document.createElement("div");
      confirmElm.id = "o-confirm";
      const div = document.createElement("div");

      if (data.dark && data.dark === true) {
        confirmElm.className = "dark";
        div.className = "o-popup dark";
      } else {
        div.className = "o-popup";
      }

      div.innerHTML = temp;
      confirmElm.append(div);
      const okBtn = confirmElm.querySelector(".okBtn");
      const cancelBtn = confirmElm.querySelector(".cancelBtn");
      if (okBtn) {
        okBtn.focus();
        okBtn.onclick = function (e) {
          confirmElm.remove();
          resolve(true);
        };
      }
      if (cancelBtn) {
        cancelBtn.onclick = function (e) {
          confirmElm.remove();
          resolve(false);
        };
      }
      document.body.append(confirmElm);
    }
  });
}

// e.g. alert popup
// oAlert({
//   dark: false,
//   title: "popup title",
//   desc: " Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, ex!",
//   okay: { text: "Okay" },
// }).then(res => {
//   if (res) {
//     console.log("ok");
//   } else {
//     console.log("cancel");
//   }
// });

function oAlert(data) {
  return new Promise(resolve => {
    const okayText = data && data.okay && data.okay.text;
    let temp = `
      <article>
        ${data && data.title ? `<h3>${data.title}</h3>` : ""}
        ${data && data.desc ? `<p>${data.desc}</p>` : ""}
      </article>
      <section>
        <button type="button" class="okBtn removeFloat">${okayText ? okayText : "Okay"}</button>
      </section>
    `;
    let alertElm = document.getElementById("o-alert");
    if (!alertElm) {
      alertElm = document.createElement("div");
      alertElm.id = "o-alert";
      const div = document.createElement("div");

      if (data.dark && data.dark === true) {
        alertElm.className = "dark";
        div.className = "o-popup dark";
      } else {
        div.className = "o-popup";
      }

      div.innerHTML = temp;
      alertElm.append(div);
      const okBtn = alertElm.querySelector(".okBtn");
      const cancelBtn = alertElm.querySelector(".cancelBtn");
      if (okBtn) {
        okBtn.focus();
        okBtn.onclick = function (e) {
          alertElm.remove();
          resolve(true);
        };
      }
      if (cancelBtn) {
        cancelBtn.onclick = function (e) {
          alertElm.remove();
          resolve(false);
        };
      }
      document.body.append(alertElm);
    }
  });
}

export default { oConfirm, oAlert }