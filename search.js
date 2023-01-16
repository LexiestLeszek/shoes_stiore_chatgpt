document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#search-form');
    const resultsDiv = document.querySelector('#search-results');
  
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      // get search criteria from form inputs
      const price = document.querySelector('#price').value;
      const size = document.querySelector('#size').value;
      const color = document.querySelector('#color').value;
  
      // send search request to server
      const response = await fetch('/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price, size, color }),
      });
  
      // handle response from server
      if (response.ok) {
        const results = await response.json();
        displayResults(results);
      } else {
        resultsDiv.innerHTML = '<p>An error occurred while searching for shoes. Please try again.</p>';
      }
    });
  
    const displayResults = (results) => {
      // clear previous search results
      resultsDiv.innerHTML = '';
  
      // display search results
      if (results.length > 0) {
        results.forEach((result) => {
          const { price, description, pictures, phone } = result;
          const resultHTML = `
            <div class="result">
              <p>Price: ${price}</p>
              <p>Description: ${description}</p>
              <p>Pictures:</p>
              <ul>
                ${pictures.map((picture) => `<li><img src="${picture}" alt="Shoe picture"></li>`).join('')}
              </ul>
              <p>Phone Number: ${phone}</p>
            </div>
          `;
          resultsDiv.innerHTML += resultHTML;
        });
      } else {
        resultsDiv.innerHTML = '<p>No results found. Please try a different search.</p>';
      }
    };
  });
  