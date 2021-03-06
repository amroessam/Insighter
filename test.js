var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){
        res.send('Working...')
    
        url = 'http://www.imdb.com/title/tt1229340/';
    
        request(url, function(error, response, html){
            if(!error){
                // console.log(response)
                // console.log(html)
                var $ = cheerio.load(html);
    
                var title, release, rating;
                var json = { title : "", release : "", rating : ""};
    
                $('.title_wrapper').filter(function(){
                    var data = $(this);
                    title = data.children().first().text();
    
                    release = data.children().last().children().text();
    
                    json.title = title;
                    json.release = release;
                    console.log(json)
                })
    
                // Since the rating is in a different section of the DOM, we'll have to write a new jQuery filter to extract this information.
    
                $('.star-box-giga-star').filter(function(){
                    var data = $(this);
    
                    // The .star-box-giga-star class was exactly where we wanted it to be.
                    // To get the rating, we can simply just get the .text(), no need to traverse the DOM any further
    
                    rating = data.text();
    
                    json.rating = rating;
                })
                
            }
        })
    })
    
app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;

