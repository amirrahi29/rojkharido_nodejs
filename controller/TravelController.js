const axios = require('axios');
const cheerio = require('cheerio');

const test = async (req, res) => {

    let url = "https://www.oyorooms.com/search?location=paharganj&latitude=&longitude=&city=delhi&searchType=&tag=&checkin=11%2F12%2F2022&checkout=12%2F12%2F2022&roomConfig%5B%5D=2&guests=2&rooms=1";
    let data = [];

    axios.get(url)
        .then((response) => {
            let $ = cheerio.load(response.data);
            $('.ListingHotelCardWrapper').each(function (e1, index) {
                // let url = $(this).find('td.titleColumn a').attr('href');
                // let title = $(this).find('td.titleColumn a').text();
                // let rating = $(this).find('td.imdbRating').text();
                // movies.push({ url: url, title: title, rating: rating });

                //let demo = $(this).find('td.titleColumn a').attr('href');
                let title = $(this).find('.oyo-cell--4-col-phone').html();
               // let title = $(this).find('.oyo-cell--4-col-phone .hotelCardListing .hotelCardListing__descriptionWrapper .listingHotelDescription__contentWrapper--left a h3').attr('title');
                data = ({title:title});
            });
            res.send(data);
            console.log(data);
        }).catch((error) => {
            console.log(error);
        });
}

module.exports = {
    test
}