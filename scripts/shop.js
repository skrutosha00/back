import { changeBalance, animateOnce, setBalanceField } from "./functions.js"

let items = [
    { name: "1", price: 7500 },
    { name: "2", price: 12500 },
    { name: "3", price: 15000 }
]

setBalanceField()
let balance = document.querySelector('.balance')
let cardCont = document.querySelector('.shop')

document.querySelector('.balance').innerHTML = localStorage.getItem('balance_back')

for (let item of items) {

    if (!localStorage.getItem(item.name + '_back')) {
        localStorage.setItem(item.name + '_back', 0)
    }

    let card = document.createElement('div')
    card.classList.add('card')

    let picCont = document.createElement('div')
    picCont.classList.add('pic_cont', 'block')
    card.appendChild(picCont)

    let pic = document.createElement('img')
    pic.src = '../png/board_' + item.name + '.png'
    picCont.appendChild(pic)

    let button = document.createElement('div')
    button.classList.add('button_elips')
    button.dataset.item = item.name

    let buttonSpan = document.createElement('span')
    buttonSpan.innerHTML = item.price
    button.append(buttonSpan)

    if (localStorage.getItem(item.name + '_back') == 1) {
        buttonSpan.innerHTML = 'Select'
    }

    if (localStorage.getItem('chosen_back') == item.name) {
        buttonSpan.innerHTML = 'Selected'
    }

    card.appendChild(button)

    button.onclick = () => {
        let price = item.price

        if (localStorage.getItem(button.dataset.item + '_back') == 1) {
            localStorage.setItem('chosen_back', button.dataset.item)

            for (let b of document.querySelectorAll('.button span')) {
                if (b.innerHTML == 'Selected') {
                    b.innerHTML = 'Select'
                }
            }

            buttonSpan.innerHTML = 'Selected'
        }

        if (buttonSpan.innerHTML == price) {
            if (Number(balance.innerHTML) <= price) {
                animateOnce('.balance', 'red')
                return
            }

            buttonSpan.innerHTML = 'Select'
            changeBalance(-price)

            localStorage.setItem(button.dataset.item + '_back', 1)
            localStorage.setItem('chosen_back', button.dataset.item)
        }
    }

    cardCont.appendChild(card)
}
