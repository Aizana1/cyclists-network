  let mainContainer = document.getElementById('vision')
  let btn = document.querySelector('.sortButton')
  btn.addEventListener('click', async (e) => {
    e.preventDefault()
    const response = await fetch('/sort')
    let result = await response.text()
    console.log(result)
    result = result.match(/<ul([\s\S]*)<\/ul>/gm)[0]
    mainContainer.lastElementChild.remove();
    mainContainer.insertAdjacentHTML('beforeend', result)
  })


