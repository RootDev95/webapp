const proxyUrl = "https://cors-anywhere.herokuapp.com/";
const apiUrl = "https://osintpromax-2andkey-sijbsineons.onrender.com/?query=" + encodeURIComponent(query);
const fetchUrl = proxyUrl + apiUrl;

const response = await fetch(fetchUrl);
const API_BASE = "https://osintpromax-2andkey-sijbsineons.onrender.com/?query=";
const form = document.getElementById('search-form');
const queryInput = document.getElementById('query');
const statusDiv = document.getElementById('status');
const resultsDiv = document.getElementById('results');

// Helper for rendering records
function makeField(label, value) {
  return `<div class="detail"><span class="label">${label}</span> <span class="value">${value}</span></div>`;
}

form.addEventListener('submit', async function(e) {
  e.preventDefault();
  const q = queryInput.value.trim();
  if (!q) return;

  statusDiv.textContent = 'Searching...';
  resultsDiv.innerHTML = '';

  try {
    const url = API_BASE + encodeURIComponent(q);
    const response = await fetch(url);
    const data = await response.json();

    if (!data.List || Object.keys(data.List).length === 0) {
      statusDiv.textContent = "No results found.";
      return;
    }

    statusDiv.textContent = "";

    let html = '';
    for (const [dbName, dbObj] of Object.entries(data.List)) {
      html += `<div class="result-section"><h3>${dbName}</h3>`;
      if (dbObj.Data && dbObj.Data.length > 0) {
        dbObj.Data.forEach((record, i) => {
          html += `<div class="result-card">`;
          for (const [k, v] of Object.entries(record)) {
            html += makeField(k, v);
          }
          html += `</div>`;
        });
      } else {
        html += `<div class="result-card"><i>No records in this database.</i></div>`;
      }
      html += `</div>`;
    }
    resultsDiv.innerHTML = html;
  } catch (err) {
    statusDiv.textContent = "Error fetching data or API unavailable.";
    resultsDiv.innerHTML = "";
  }
});
