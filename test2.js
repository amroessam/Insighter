const fs = require('fs')
let data

data = fs.readFileSync('data.json')

// for(i in data[0]){
//     console.log(`Name: ${data[i].name}, Audience Size: ${data[i].audience_size}`)
// }

console.log(data)