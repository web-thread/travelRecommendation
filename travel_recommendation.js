const btnSearch = document.getElementById('btnSearch');
const btnReset = document.getElementById('btnReset');
const result = document.getElementById('result');
const keywordInput = document.getElementById('searchInput');
let options = { timeZone: 'America/New_York', hour12: true, hour: '2-digit', minute: '2-digit' };

// Initially disable the buttons
btnSearch.disabled = true;
btnReset.disabled = true;

// Enable buttons only if input has value
keywordInput.addEventListener('input', () => {
  const hasValue = keywordInput.value.trim() !== '';
  btnSearch.disabled = !hasValue;
  btnReset.disabled = !hasValue;
});


function searchKeyword() {
    const keyword = keywordInput.value.toLowerCase().trim();
    result.innerHTML = '';

    fetch('travel_recommendation_api.json')
      .then(response => response.json())
      .then(data => {

        result.classList.add('show');

        let results = [];

        if (keyword === 'beach' || keyword === 'beaches') {
          results = data.beaches;
        } else if (keyword === 'temple' || keyword === 'temples') {
          results = data.temples;
        } else if (keyword === 'country' || keyword === 'countries') {
          for (const country of data.countries) {
            results.push(...country.cities);
          }
        }
      
        if (results.length === 0) {
          result.innerHTML = `<p><strong>No results found</strong>. <br>Try 'beach', 'temple' or 'country'.</p>`;
          return;
        } else{
          results.forEach(place => {
            options.timeZone = place.timezone;
            let placeTime = new Date().toLocaleTimeString('en-US', options);
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
              <img src="${place.imageUrl}" alt="${place.name}">
              <h3>${place.name}</h3>
              <span class="time">Current time: ${placeTime}</span>
              <p>${place.description}</p>
            `;
            result.appendChild(card);
          });
        }

      })
      .catch(error => {
        console.error('Error:', error);
        result.innerHTML = 'An error occurred while fetching data.';
      });
}
btnSearch.addEventListener('click', searchKeyword);

searchInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter' && searchInput.value.trim() !== '') {
    event.preventDefault(); // Prevent form submission if in a form
    searchKeyword();        // Call your search function
  }
});


btnReset.addEventListener('click', () => {
  result.classList.remove('show');
  keywordInput.value = '';
  btnSearch.disabled = true;
  btnReset.disabled = true;
});


const submitButton = document.getElementById('submitBtn');
const form = document.getElementById('myForm');

if(form){
  submitButton.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default form submission
    window.alert('Thank you for contacting us!');
  });
}
