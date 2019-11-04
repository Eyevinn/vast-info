let resultHtml = "";
document.addEventListener("DOMContentLoaded", () => {
  const ipcRenderer = require("electron").ipcRenderer;
  const fetchBtn = document.querySelector("#button-addon2");
  fetchBtn.addEventListener("click", () => {
    const url = document.querySelector("input#url").value;
    ipcRenderer.send("fetch", url);
  });
  ipcRenderer.on("data", (event, data) => {
    if (Array.isArray(data)) {
      printVMAP(data);
    } else {
      printVast(data);
    }
  });
});

function printVMAP(list) {
  for (let i = 0; i < list.length; i++) {
    let title = i === 0 ? "Pre-roll Block" : "Ad Break #" + i;
    resultHtml += `<h2>${title}</h2>`;
    printVast(list[i]);
  }
  // list.forEach(element => {
  //   printVast(element);
  // });
}

function printVast(data) {
  const resultArea = document.querySelector("section#result");
  let numberOfVASTs = Object.keys(data.vastInfo).length;
  for (let i = 0; i < numberOfVASTs; i++) {
    const key = Object.keys(data.vastInfo)[i];
    const obj = data.vastInfo[key];
    const headers = Object.keys(obj);

    // we're just using the numbers to set order in object, remove before printing.
    var regex = /[1-9]. /;
    // Printing vast info
    resultHtml += `
        <table class="table table-striped">
          <thead>
            <tr>`;
    headers.forEach(h => {
      resultHtml += `<th scope="col">${h.replace(regex, "")}</th>`;
    });
    resultHtml += `</tr>
          </thead>
          <tbody>
            <tr>`;
    headers.forEach(h => {
      resultHtml += `<td scope="col">${obj[h]}</th>`;
    });
    resultHtml += `</tr>
          </tbody>
        </table>
      `;
    // Printing ad info
    const ads = data.prettyPrintObject;
    const adHeaders = Object.keys(data.prettyPrintObject[0]);
    resultHtml += `
        <table class="table table-striped">
          <thead>
            <tr>`;
    /**
     * Iterate through the object keys to write out the headers
     */
    adHeaders.forEach(h => {
      // These parameters exists purely for player usage
      if (h === "vh" || h === "vl") return;
      resultHtml += `<th scope="col">${h.replace(regex, "")}</th>`;
    });
    resultHtml += `</tr>
          </thead>
          <tbody>`;
    ads.forEach(a => {
      resultHtml += `<tr>`;
      /**
       * Iterate through the object keys to write out the value for each object
       */
      adHeaders.forEach(h => {
        // These parameters exists purely for player usage
        if (h === "vh" || h === "vl") return;
        // When we come to highest and lowest by name, let's get the urls
        const url = h.toLowerCase().includes("highest")
          ? a.vh
          : h.toLowerCase().includes("lowest")
          ? a.vl
          : null;
        // make the resolution values clickable
        if (url) {
          resultHtml += `<td scope="col" class="playable" data-src="${url}">${a[h]}</th>`;
        } else {
          resultHtml += `<td scope="col">${a[h]}</th>`;
        }
      });
      resultHtml += `</tr>`;
    });
    resultHtml += `</tbody>
          </table>
        `;
  }
  resultArea.innerHTML = resultHtml;

  /**
   * For all the clickable resolutions
   * Create an event listener to initiate the player
   */
  const urlElements = document.getElementsByClassName("playable");
  Array.from(urlElements).forEach(element => {
    element.addEventListener("click", ev => {
      const url = ev.currentTarget.dataset.src;
      playVideo(url);
    });
  });
}

function playVideo(src) {
  const videoSection = document.querySelector("section#videoHolder");
  const videoElement = document.querySelector("video");
  videoElement.src = src;
  videoSection.classList.add("active");
  videoElement.addEventListener("ended", () => {
    videoElement.src = "";
    videoSection.classList.remove("active");
  });
}
