document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector('.navbar');
    const acc = document.querySelectorAll(".accordion");
    const ageElement = document.getElementById("age");

    // Handle Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        const top = window.scrollY;
        header.classList.toggle('navbarDark', top >= 100);
    });

    // Calculate and Display Age
    const getAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    if (ageElement) {
        ageElement.textContent = `Age: ${getAge('2001-09-23')}`;
    }

    // Accordion Toggle Logic
    acc.forEach((item) => {
        item.addEventListener("click", () => {
            item.classList.toggle("active");
            const panel = item.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    });
});

async function getArxivPapers(authorName) {
    // Construct the query string for the arXiv API
    const query = `au:${authorName}`;
    const url = `https://export.arxiv.org/api/query?search_query=${query}&start=0&max_results=3`;

    try {
        // Fetch the data from arXiv
        const response = await fetch(url);
        const xmlText = await response.text();
        
        // Parse the XML response to JSON
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        
        // Extract paper details from the XML
        const entries = xmlDoc.getElementsByTagName('entry');
        const paperList = document.getElementById("paper-list");
        paperList.innerHTML = '';  // Clear the existing list
        
        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            const title = entry.getElementsByTagName('title')[0].textContent;
            const summary = entry.getElementsByTagName('summary')[0].textContent;
            const authors = entry.getElementsByTagName('author');
            const authorsList = []
            for (let index = 0; index < authors.length; index++) {
                authorsList.push(authors[index].textContent.trim())
            }
            if (!authorsList.includes("Maxence Leguéry")) {
                continue;
            }
            const link = entry.getElementsByTagName('id')[0].textContent;
            const publishedDate = entry.getElementsByTagName('published')[0].textContent;

            const paperCard = `
                <div class="paper-card">
                    <h3 class="paper-title">
                        <a href="${link}" target="_blank">${title}</a>
                    </h3>
                    <p class="paper-authors">Authors: ${authorsList.join(', ')}</p>
                    <p class="paper-journal">Published in: ${publishedDate}</p>
                    <p class="paper-summary">${summary}</p>
                </div>
            `;
            console.log(paperCard);

            paperList.innerHTML += paperCard;
        }

        return papers;
    } catch (error) {
        console.error("Error fetching papers:", error);
        return [];
    }
}

window.onload = function() {
    //fetchMyPapers();
    getArxivPapers('Maxence Leguery');
};