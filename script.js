let latestNews = [] // Store the latest news once fetched
let latestNewsClicked = -1 // Tracking the last news clicked to avoid loading content already loaded

let newsCards = document.querySelectorAll("#newsCards .card") // Getting all the news container
let newsPromises = getLastestArticlesNumber(newsCards.length) // Getting the articles from fetch

//Updating the latest news part with the news retrieved
Promise.all(newsPromises).then(values => {
    for (let i = 0; i < values.length; i++) {
        values[i].json()
            .then(news => {
                newsCards[i].querySelector(".card-body button").setAttribute("bs-news-triggered", i) //Adding this attritube to know on which button we clicked

                console.log(newsCards[i].querySelector(".card-body a"))

                latestNews.push(news)

                let cardTitle = newsCards[i].querySelector(".card-body .card-title")
                cardTitle.textContent = `${news.date.day} ${news.date.month} ${news.date.year}`

                let cardBody = newsCards[i].querySelector(".card-body p")
                cardBody.textContent = news.content[0].split(" ").slice(0, 20).reduce((acc, curr) => acc += ` ${curr}`) + "..." //Only keeping the 20 first words
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

        if (newsTriggered != latestNewsClicked) {
            //Calling for the news
            let news = latestNews[newsTriggered]

            // Update the modal's title.
            const modalTitle = newsModal.querySelector('.modal-title')
            modalTitle.textContent = news.title

            //Adding the image to the modal
            const modalBodyImage = newsModal.querySelector(".modal-body img")
            if (news.picture) {
                modalBodyImage.src = news.picture
            }
            else {
                modalBodyImage.src = ""
            }

            const modalBodyContent = newsModal.querySelector(".modal-body .newsModalContent")
            removeChildsFromElement(modalBodyContent)

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
            removeChildsFromElement(keywords)


            for (let i = 0; i < news.keyword.length; i++) {
                let keyword = document.createElement("a")
                keyword.href = "#"
                keyword.classList.add("digitTitle") // We add this class to make avoid numbers not beeing displayed
                keyword.classList.add("bg-secondary", "border-dark", "border-3", "rounded", "px-2", "text-light")
                keyword.textContent = `#${news.keyword[i]}`
                keywords.appendChild(keyword)
            }

            //Adding the content to the footer
            const modalFooter = newsModal.querySelector('.modal-footer')


            const author = modalFooter.querySelector("#author")
            author.textContent = `${news.author.surname} ${news.author.name}, ${news.author.position}`
            
            latestNewsClicked = newsTriggered
        }

    })
}

/*
    Function that fecthes the given number of latest articles to provide.
    Parameter : -numberOfArticleToReturn : The number of articles to return
    Return : An array of promises that contains each promises for each article.
*/
function getLastestArticlesNumber(numberOfArticleToReturn) {

    let latestArticlesNumber = [1, 2, 3, 5]
    let promises = []
    for (let i = 0; i < numberOfArticleToReturn; i++) {
        promises.push(fetch(`https://www.tbads.eu/greta/kercode/ajax/?article=${latestArticlesNumber[i]}`))

    }

    console.log(promises)
    return promises
}
/*
    Remove all the childs from a given element
    Parameter : - element : An HTML element
*/
function removeChildsFromElement(element) {
    if (element.children !== null) { //Removing the existing content
        for (let i = element.children.length - 1; i >= 0; i--) {
            element.removeChild(element.children[i])
        }
    }
}