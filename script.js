let latestNews = [] // Store the latest news once fetched

let newsCards = document.querySelectorAll("#newsCards .card") // Getting all the news container
let newsPromises = getLastestArticlesNumber(newsCards.length) // Getting the numbers of the articles to fetch

//Updating the latest news part with the news retrieved
Promise.all(newsPromises).then(values => {
    for (let i = 0; i < values.length; i++) {
        values[i].json()
            .then(news => {
                newsCards[i].querySelector(".card-footer a").setAttribute("bs-news-triggered", i) //Adding this attritube to know on which button we clicked
                latestNews.push(news)

                let cardTitle = newsCards[i].querySelector(".card-header h3")
                cardTitle.textContent = `${news.date.day} ${news.date.month} ${news.date.year}`

                let cardBody = newsCards[i].querySelector(".card-body")
                cardBody.textContent = news.content[0].split(" ").slice(0,20).reduce((acc, curr) => acc += ` ${curr}`) + " ..." //Only keeping the 20 first words
            })
    }
})


//Handdling the modal behavior
const newsModal = document.querySelector('#newsModal')
if (newsModal) {
    newsModal.addEventListener('show.bs.modal', (event) => {

        // Button that triggered the modal
        const button = event.relatedTarget
        // Extract info from bs-news-triggered attribute
        const newsTriggered = parseInt(button.getAttribute('bs-news-triggered')) //Have to convert it to a number to use it as an index

        //Calling for the news
        let news = latestNews[newsTriggered]

        // Update the modal's title.
        const modalTitle = newsModal.querySelector('.modal-title')
        modalTitle.textContent = news.title

        //Adding the image to the modal
        const modalBodyImage = newsModal.querySelector(".modal-body img")
        if (news.picture != "") {
            modalBodyImage.src = news.picture
        }
        else {
            modalBodyImage.src = ""
        }

        const modalBodyContent = newsModal.querySelector(".modal-body .newsModalContent")
        if (modalBodyContent.children !== null) { //Removing the existing content
            for (let i = modalBodyContent.children.length - 1; i >= 0; i--) {
                modalBodyContent.removeChild(modalBodyContent.children[i])
            }
        }

        //Adding the content text to the modal
        if (news.content.length > 0) {
            for (let i = 0; i < news.content.length; i++) {
                let p = document.createElement("p")
                p.innerHTML = news.content[i]
                modalBodyContent.appendChild(p)
            }
        }
        else {
            let newContent = document.createElement("p")
            newContent.textContent = "L'article est toujours en cours de rédaction, restez à l'affut pour être en avance sur les bonnes affaires"
            modalBodyContent.appendChild(newContent)
        }
        
        const keywords = newsModal.querySelector(".modal-body #keywords")
        if (keywords.children !== null) { //Removing the existing content
            for (let i = keywords.children.length - 1; i >= 0; i--) {
                keywords.removeChild(keywords.children[i])
            }
        }

        for(let i = 0; i < news.keyword.length; i++){
            let keyword = document.createElement("a")
            keyword.href="#"
            keyword.classList.add("digitTitle") // We add this class to make avoid numbers not beeing displayed
            keyword.classList.add("bg-secondary", "border-dark", "border-3", "rounded", "px-2", "text-light")
            keyword.textContent = `#${news.keyword[i]}`
            keywords.appendChild(keyword)
        }

        //Adding the content to the footer
        const modalFooter = newsModal.querySelector('.modal-footer')
        
        
        

        const author = modalFooter.querySelector("#author")
        author.textContent = `${news.author.surname} ${news.author.name}, ${news.author.position}`

    })

}

function getLastestArticlesNumber(numberOfArticleToReturn) {
    console.log(numberOfArticleToReturn)
    let latestArticlesNumber = [1, 2,3,5]
    let promises = []
    for (let i = 0; i < numberOfArticleToReturn; i++) {
        promises.push(fetch(`https://www.tbads.eu/greta/kercode/ajax/?article=${latestArticlesNumber[i]}`))

    }

    console.log(promises)
    return promises
}