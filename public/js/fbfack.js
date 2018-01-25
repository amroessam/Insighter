let seedArr = []
let addSeed = (seed) => {
    // document.getElementById(seed.id).className += ' active'
    seed.className += ' active'
    seedArr.push(seed.id)
    fetchResults(seedArr)
}
let removeResults = cb => {
    document.getElementById('seeds').innerHTML = ""
    if (typeof cb == "function") {
        console.log('callback')
        cb()
    }

}
let getSeeds = (srchstr) => {
    checkFBSeed(srchstr)
}


window.fbAsyncInit = function () {
    FB.init({
        appId: '1557218284355355',
        cookie: true,
        xfbml: true,
        version: 'v2.11'
    });


    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });

};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

let statusChangeCallback = res => {
    if (res.status === 'connected') {
        console.log('connected')
    } else {
        console.log('not connected')
    }
}

function checkLoginState() {
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
}
function checkFBSeed(searchstr) {
    console.log(searchstr)
    FB.api(
        '/search',
        'GET',
        { "type": "adinterest", "q": searchstr, "limit": "10000" },
        function (response) {
            // console.log(response.data)
            document.getElementById('seeds').innerHTML = ""
            checkIfValid(response.data, true)
        })
}
let fetchResults = seedArr => {
    FB.api(
        '/search',
        'GET',
        { "type": "adinterestsuggestion", "interest_list": seedArr, "limit": "10000" },
        function (response) {
            document.getElementById('result').innerHTML = ""
            checkIfValid(response.data)
            if (response.paging.next) {
                $.getJSON(response.paging.next, function (response) {
                    checkIfValid(response.data)
                })
            }

        }
    );
}
let checkIfValid = (data, q) => {
    let dataarr = []
    for (i in data) dataarr.push(data[i].id)
    FB.api(
        '/search',
        'GET',
        { "type": "adinterestvalid", "interest_fbid_list": dataarr },
        function (response) {
            console.log(response.data)
            for (i in response.data) {
                if (!q && response.data[i].valid) {
                    document.getElementById('result').innerHTML += `<ul class="list-group-item" id="${response.data[i].name}"> <h4>${response.data[i].name}</h4>${response.data[i].topic || 'Unknown'} <span class="badge badge-success float-right m-2">${response.data[i].audience_size}</span></ul>`
                } else if (!q && !response.data[i].valid) {
                    document.getElementById('result').innerHTML += `<ul class="list-group-item" id="${response.data[i].name}"> <h4>${response.data[i].name}</h4>${response.data[i].topic || 'Unknown'} <span class="badge badge-danger float-right m-2">${response.data[i].audience_size}</span></ul>`
                } else if (q && response.data[i].valid) {
                    document.getElementById('seeds').innerHTML += `<a onclick="addSeed(this)" class="list-group-item list-group-item-action" id="${response.data[i].name}"> <h4>${response.data[i].name}</h4>${response.data[i].topic || 'Unknown'} <span class="badge badge-success float-right m-2">${response.data[i].audience_size}</span></a>`
                } else if (q && !response.data[i].valid) {
                    document.getElementById('seeds').innerHTML += `<a onclick="addSeed(this)" class="list-group-item list-group-item-action" id="${response.data[i].name}"> <h4>${response.data[i].name}</h4>${response.data[i].topic || 'Unknown'} <span class="badge badge-danger float-right m-2">${response.data[i].audience_size}</span></a>`
                }
            }
        }
    )
}

let clearAll = () =>{
    seedArr = []
    dataarr = []
    document.getElementById('result').innerHTML = ''
    document.getElementById('seeds').innerHTML = ''
    document.getElementById('search').value = ''
}
let typeWatchOptions = {
    callback: function (value) { getSeeds(value) },
    wait: 500,
    highlight: true,
    allowSubmit: false,
    captureLength: 2
}
$(document).ready(function () {
    $("#search").typeWatch(typeWatchOptions);
    $('#searchbtn').click(function(){checkFBSeed(document.getElementById('search').value)})
    $('#clearbtn').click(function(){clearAll()})
})