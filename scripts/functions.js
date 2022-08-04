function animateOnce(selector, animClass = 'anim') {
    for (let node of document.querySelectorAll(selector)) {
        node.classList.add(animClass)
        setTimeout(() => {
            node.classList.remove(animClass)
        }, 500);
    }
}

function animate(selector) {
    for (let node of document.querySelectorAll(selector)) {
        setInterval(() => {
            node.classList.add('anim')
            setTimeout(() => {
                node.classList.remove('anim')
            }, 500);
        }, 2500);
    }
}

function setBalanceField() {
    let balanceField = document.querySelector('.balance_field')

    let currency = document.createElement('img')
    currency.src = '../png/currency.png'
    balanceField.appendChild(currency)

    let balance = document.createElement('div')
    balance.classList.add('balance')
    balanceField.appendChild(balance)
    balance.innerHTML = localStorage.getItem('balance_back')
}

function changeBalance(amount) {
    let balance = document.querySelector('.balance')
    localStorage.setItem('balance_back', Number(localStorage.getItem('balance_back')) + amount)
    balance.innerHTML = localStorage.getItem('balance_back')
}

function shuffle(arr) {
    let array = [...arr]
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

function randElem(arr) {
    let rand = Math.floor(Math.random() * arr.length);
    return arr[rand];
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function activateAudio(fileName = 'main') {
    let volumeCont = document.createElement('div')
    volumeCont.classList.add('volume_cont', 'block')
    document.querySelector('.wrapper').appendChild(volumeCont)

    let volumePic = document.createElement('img')
    volumePic.src = '../png/volume_on.png'
    volumeCont.appendChild(volumePic)

    let volume = false
    let audio = new Audio()
    audio.src = '../audio/' + fileName + '.mp3'
    audio.loop = true

    volumeCont.onclick = () => {
        volume = !volume

        if (volume) {
            audio.play()
            volumeCont.querySelector('img').src = '../png/volume_off.png'
        } else {
            audio.pause()
            volumeCont.querySelector('img').src = '../png/volume_on.png'
        }
    }
}

export { animate, animateOnce, shuffle, changeBalance, randInt, setBalanceField, randElem, activateAudio }