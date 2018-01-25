let socket = io.connect('http://localhost:8080')
$('.selectpicker').selectpicker()
countryList = []
let addCountry = ()=>{
    countryName = document.getElementById('search')
    if (countryList.includes(countryName.value) == false){
        countryList.push(countryName.value)
        newCountry = document.createElement('li')
        newCountry.className += "list-group-item list-group-item-action"
        newCountry.textContent += countryName.options[countryName.selectedIndex].text
        document.getElementById('countryList').appendChild(newCountry)
        document.getElementById('search').value = ''
        console.log(countryList)
    }
    // document.getElementById('countryList').appendChild(`<li>${countryName}</li>`)
}

let removeCountry = i =>{
    console.log(i)
    countryListEl = document.getElementById('countryList')
    countryListEl.removeChild(countryListEl.childNodes[i])
}

let passParam = () =>{
    let formData = $('#submitForm').serializeArray()
    formData.push({name:'CountryList',value:countryList})
    $.post('/app',formData)
    // $.ajax({
    //     url: 'http://localhost/app',
    //     type: 'POST',
    //     data: {
    //         countryList: countryList
    //     },
    //     success: function(data){
    //         console.log(data);
    //     }
    // });
}
// button.addEventListener('click',()=>{socket.emit('pressed',{
//     message:`I've been pressed`
// })})

            // let GetIndex = (el) =>
            // {   
            //     let aElements = el.parentNode.parentNode.getElementsByTagName("a");
            //     let aElementsLength = aElements.length;
            //     for (var i = 0; i < aElementsLength; i++)
            //     {
            //         if (aElements[i] == sender) //this condition is never true
            //         {
            //             removeCountry(i)
                        
            //         }
            //     }
            // }

            function getIndex(node) {
                var childs = node.parentNode.childNodes;
                for (i = 0; i < childs.length; i++) {
                  if (node == childs[i]) break;
                }
                console.log(i)
                return i;
              }
              