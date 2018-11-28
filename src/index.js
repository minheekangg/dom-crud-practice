// let allGifts = []
//
//
// document.addEventListener('DOMContentLoaded', () => {
//   allGifts = gifts
//   const giftListContainer = document.querySelector(".gift-list li")
//   const formForGiftName = document.querySelector("#gift-name-input")
//   const formForGiftImage = document.querySelector("#gift-image-input")
//   const formForGiftSubmit = document.querySelector("#gift-form-button")
//   const formForGift = document.querySelector("#new-gift-form")
//   console.log('DOM has been fully loaded')
//   console.table(allGifts)
//
// /// Iterating through to render each item to the page
//  function renderGifts(allGifts) {
//    giftListContainer.innerHTML = allGifts.map(function(g) {
//      return `<li>
//      <button id="${g.id}">Edit</button> <br>
//      <button id="${g.id}">Delete</button> <br>
//      <div>${g.name} </div> <br>
//      <img src= ${g.image}> </li>`
//    }).join('')//end of gift for each
//  }//end of render gifts
//
//  renderGifts(allGifts)
//
// ///SWITCHING TO EDIT MODE
//   giftListContainer.addEventListener("click", function(e) {
//     if (e.target.innerHTML === "Edit"){
//       clickedImgId = e.target.id
//       selectedItem = allGifts.filter(each => each.id === parseInt(clickedImgId))[0]
//       formForGiftName.value = selectedItem.name
//       formForGiftImage.value = selectedItem.image
//       formForGiftSubmit.innerText = "Submit Edit"
//     } else if (e.target.innerHTML === "Delete"){
//       clickedImgId = e.target.id
//       updatedGifts = allGifts.filter(each => each.id !== parseInt(clickedImgId))
//       allGifts = updatedGifts
//       renderGifts(allGifts)
//     }//end of e.target.innerHTML if condition
//   }) //end of giftListContainer.addEventListener
//
// /// Editing on the form
//   formForGift.addEventListener("click", function(e) {
//     e.preventDefault()
//     if (e.target.innerHTML === "Submit Edit"){
//       selectedItem.name = formForGiftName.value
//       selectedItem.image = formForGiftImage.value
//       let index = allGifts.indexOf(selectedItem)
//       allGifts.splice(index, 1, selectedItem)
//     }// end of IF
//     renderGifts(allGifts)
//   })//end of addEventListenerfor form
//
//
//
// })// end of DOMContentLoaded

document.addEventListener('DOMContentLoaded', () => {
  const giftListContainer = document.querySelector(".gift-list li")
  const formForNewGiftName = document.querySelector("#gift-name-input")
  const formForNewGiftImage = document.querySelector("#gift-image-input")
  const formForNewGiftSubmit = document.querySelector("#gift-form-button")
  const formForNewGift = document.querySelector("#new-gift-form")
  const formForEditGiftName = document.querySelector("#edit-gift-name-input")
  const formForEditGiftImage = document.querySelector("#edit-gift-image-input")
  const formForEditGiftSubmit = document.querySelector("#edit-gift-form-button")
  const formForEditGift = document.querySelector("#edit-gift-form")
  const filterForm = document.querySelector("#filter-input")
let allGifts = []
/// FETCH GIFTS FROM SERVER
function fetchGifts() {
    fetch(`http://localhost:3000/gifts`)
    .then(response => response.json())
    .then(gifts => {renderGifts(gifts);
      allGifts = gifts;
    console.log("ALL GIFTS:", allGifts)}
    )
  } //end function fetchGifts
fetchGifts()

function renderGifts(allGifts) {
   giftListContainer.innerHTML = allGifts.map(function(g) {
     return `<li>
     <button id="${g.id}">Edit</button> <br>
     <button id="${g.id}">Delete</button> <br>
     <div>${g.name} </div> <br>
     <img src= ${g.image}> </li>`
   }).join('')//end of gift for each
 }//end of render gifts

 //////////////// SEARCH FORM
    filterForm.addEventListener('input', function(e) {
      userInput = e.target.value
      filteredGifts = allGifts.filter((g)=> {
        return g.name.includes(userInput)
      })//end of filter
      renderGifts(filteredGifts)
    })//end of addEventListener on filterForm

/// EDIT GIFT - change FORM to EDIT MODE /// or DELETE
giftListContainer.addEventListener('click', function(e) {
  selectedId = parseInt(e.target.id)
  foundGift = allGifts.find(g => g.id === selectedId)
  if (e.target.innerText === "Edit") {
    // console.log("FOUND YOUR GIFT TO EDIT:", foundGift)
    formForEditGiftName.value = foundGift.name
    formForEditGiftImage.value = foundGift.image
    formForEditGift.dataset.id = foundGift.id
  } else if (e.target.innerText === "Delete"){
    //update allGifts
    updatedAllGifts = allGifts.filter(g => g.id != selectedId)
    allGifts = updatedAllGifts
    console.log(allGifts, updatedAllGifts)
    //update DOM
    renderGifts(updatedAllGifts)
    //update server
    fetch(`http://localhost:3000/gifts/${selectedId}`, {method: 'DELETE'})
  }// if condition
}) // end addEventListener for Edit

//////////////// EDIT FROM FORM - OPTIMISTICALLY RENDERING
formForEditGift.addEventListener('submit', function(e) {
  e.preventDefault()
  // SHOW ON PAGE FIRST
  // debugger
  editId = parseInt(e.target.dataset.id)
  giftToEdit = allGifts.find(g => g.id === editId)

  // Assign new name and image to AllGifts arr + render
  giftToEdit.name = formForEditGiftName.value
  giftToEdit.image = formForEditGiftImage.value
  let index = allGifts.indexOf(giftToEdit)
  allGifts.splice(index, 1, giftToEdit)
  renderGifts(allGifts)
  // BACKEND UPDATE TO SERVER
    fetch(`http://localhost:3000/gifts/${giftToEdit.id}`, {method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      name: giftToEdit.name,
      image: giftToEdit.image
    })
    })//end of fetch
    .then(res => res.json())
    .then(data => console.log(data))
})// end addEventListener on form

///////////// CREATE FROM FORM - PESSIMISTICALLY RENDERING
formForNewGift.addEventListener('submit', function(e) {
  e.preventDefault()

  // BACKEND UPDATE TO SERVER
    fetch(`http://localhost:3000/gifts`, {method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      name: formForNewGiftName.value,
      image: formForNewGiftImage.value
    })
    })//end of fetch
    .then(res => res.json())
    .then(gift => {
      // *** REMEMEBER TO UPDATE ALLGIFTS
      allGifts.push(gift);
      // ADD on the page
      giftListContainer.innerHTML +=
      `<li>
      <button id="${gift.id}">Edit</button> <br>
      <button id="${gift.id}">Delete</button> <br>
      <div>${gift.name} </div> <br>
      <img src= ${gift.image}> </li>`})

    })// end addEventListener on form



})//end of DOMContentLoaded
