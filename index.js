const reqest = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const json2csv = require("json2csv").Parser;

// const movies = ["https://www.imdb.com/title/tt4154796",
// "https://www.imdb.com/title/tt7286456/",
// "https://www.imdb.com/title/tt1375666/"];

(async () => {
  let imdbData = [];

//for(let movie in movies )
//number below might not work always
for(let i=96600 ; i < 96625;i++)
{
    const response = await reqest({
        //else uri:movie
        uri: `https://www.imdb.com/title/tt00${i}`,
        headers: {
            // copy this data from header of network in dev tools
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "accept-encoding": "gzip, deflate, br",
          "accept-language": "en-US,en;q=0.9",
        },
        gzip: true,
      });
    
      let $ = cheerio.load(response);
      let title = $('div[class="title_wrapper"] > h1')
        .text()
        .trim();
      let rating = $('div[class="ratingValue"] > strong > span').text();
      let summary = $('div[class="summary_text"] ')
        .text()
        .trim();
      let releaseDate = $('a[title="See more release dates"]')
        .text()
        .trim();
    
      imdbData.push({
        title,
        rating,
        summary,
        releaseDate,
      });
    
    
}
const j2cp = new json2csv()
const csv = j2cp.parse(imdbData)
fs.writeFileSync('./imdb.csv',csv,'utf-8')

}

)();
