/* eslint-disable no-unused-vars */
const ManotasDom = {
  render: (template, elemt) => {
    const result = elemt.innerHTML = template
    return result
  }
}

const getItems = () => new Promise(resolve => resolve((window.localStorage.getItem('lista') && JSON.parse(window.localStorage.getItem('lista'))) || []))

const addItemApi = value => new Promise(resolve => getItems().then(list => {
  window.localStorage.setItem('lista', JSON.stringify([...list, value]))
  resolve([...list, value])
}))

const deleteItemApi = id => new Promise(resolve => {
  getItems()
    .then(items => {
      const remove = items.filter(item => item.id !== id)
      window.localStorage.setItem('lista', JSON.stringify(remove))
      resolve(remove)
    })
})

const init = () => getItems().then(list => template(list))

const addItem = value => {
  if (value === '') return false
  toggleClass()
  const item = { id: Date.now(), name: value }
  addItemApi(item).then(list => setTimeout(() => template(list), 1000))
}
const deleteItem = id => deleteItemApi(id).then(list => setTimeout(() => template(list), 600))

const toggleClass = () => {
  const modal = document.querySelector('.modal')
  const trueOrFalse = modal.classList.contains('show')
  return trueOrFalse ? modal.classList.remove('show') : modal.classList.add('show')
}

const template = listaCopy => {
  const partme = listaCopy.reduce((acc, item) => {
    const part = `<li>${item.name}<a  onclick='deleteItem(${item.id})'><span>deleted</span></a></li>`
    const result = acc += part
    return result
  }, '')
  const templateString = (
    `<div class='wrapper'>
      <button onclick='toggleClass()'>add Items +</button>
      <ul>
        ${partme}
      </ul>
      <div class='modal'>
        <div class='content'>
          <span onclick='toggleClass()' class='close'>x</span>
          <div class='form'>
            <input type='text' placeholder='Add new item' id='addItem' />
            <div class='wrapper-buttons'>
              <button onclick='addItem(document.getElementById("addItem").value)'>Save </button>
              <button onclick='toggleClass()'>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>`
  )
  return ManotasDom.render(templateString, document.getElementById('app'))
}

init()
