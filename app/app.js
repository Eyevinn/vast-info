let resultHtml = "";
document.addEventListener("DOMContentLoaded", () => {
  const ipcRenderer = require('electron').ipcRenderer;
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
    adHeaders.forEach(h => {
      resultHtml += `<th scope="col">${h.replace(regex, "")}</th>`;
    });
    resultHtml += `</tr>
          </thead>
          <tbody>`;
    ads.forEach(a => {
      resultHtml += `<tr>`;
      adHeaders.forEach(h => {
        resultHtml += `<td scope="col">${a[h]}</th>`;
      });
      resultHtml += `</tr>`;
    });
    resultHtml += `</tbody>
          </table>
        `;
  }
  resultArea.innerHTML = resultHtml;
}
