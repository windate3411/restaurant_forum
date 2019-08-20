const text = document.querySelector('h1')

function change(e) {
  e.target.innerHTML = 'HEllo'
}

text.addEventListener('click', change)