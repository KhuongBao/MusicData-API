const $ = require("jquery")
const express = require("express")
const axios = require("axios")
const cheerio = require("cheerio")
const fetch = require("node-fetch");

const app = express()
const PORT = 9000


app.get('/', (req, res) =>{
    res.send("Welcome!")
})

// Youtube videos most viewed last 24h
app.get('/youtube/24h', (req, res) =>{
        const url = "https://kworb.net/youtube/"
        const kworb = (axios(url).then(response => {
        const html = response.data
        const _ = cheerio.load(html)
        const data = []
    
        _('tbody tr', html).each(function(){
            var link = _(this).find("td").find("a").attr("href")
            const ranking = _(this).find("td").eq(0).html()
            const status = _(this).find("td").eq(1).text()
            const video = _(this).find("td").find("a").text()
            const views = _(this).find("td").eq(3).html()
            const likes = _(this).find("td").eq(4).html()
            
            if (link.includes("youtube") == false){
                link = link.replace("video/", "").replace(".html", "")
                link = `https://youtube.com/watch?v=${link}`
            }
            data.push({ranking, status, video, link, views, likes})
        })
        res.send(data)
    })
    )
})

// Youtube videos most viewed last 24h by language
app.get('/youtube/24h/:lang', (req, res) =>{
    var {lang} = req.params

    const dict = {
        "english" : "realtime_anglo",
        "spanish" : "realtime_hispano",
        "asian" : "realtime_asian",
        "other" : "realtime_other"

    }
    if (lang in dict == true){
        lang = dict[lang]
    }
    const url = `https://kworb.net/youtube/${lang}.html`

    fetch(url)
        .then(response => {
          if (response.status === 404) {
           res.send('404 Data not found')
          } else {
            const kworb = (axios(url).then(response => {
            const html = response.data
            const _ = cheerio.load(html)
            const data = []
            
            _('tbody tr', html).each(function(){
                var link = _(this).find("td").find("a").attr("href")
                const ranking = _(this).find("td").eq(0).html()
                const status = _(this).find("td").eq(1).text()
                const video = _(this).find("td").find("a").text()
                const views = _(this).find("td").eq(3).html()
                const likes = _(this).find("td").eq(4).html()
                
                if (link.includes("youtube") == false){
                    link = link.replace("video/", "").replace(".html", "")
                    link = `https://youtube.com/watch?v=${link}`
                }
                data.push({ranking, status, video, link, views, likes})
            })
            res.send(data)
            })
            )
          }
        })
        .catch(error => {
          res.json('An error had occurred:', error)
        })
})

// Youtube videos most viewed weekly
app.get('/youtube/weekly', (req, res) =>{
        const url = "https://kworb.net/youtube/weekly"
        const kworb = (axios(url).then(response => {
        const html = response.data
        const _ = cheerio.load(html)
        const data = []

        _('tbody tr', html).each(function(){
            var link = _(this).find("td").find("a").attr("href")
            const ranking = _(this).find("td").eq(0).html()
            const status = _(this).find("td").eq(1).text()
            const video = _(this).find("td").find("a").text()
            const weeks = _(this).find("td").eq(3).html()
            const peak = _(this).find("td").eq(4).html()
            
            if (link.includes("youtube") == false){
                link = link.replace("video/", "").replace(".html", "")
                link = `https://youtube.com/watch?v=${link}`
            }
            data.push({ranking, status, video, link, weeks, peak})
        })
        res.send(data)
    })
    )
})

// Youtube weekly search by year and nth week
app.get('/youtube/weekly/:year:nthweek', (req, res) =>{
    const {year} = req.params
    const {nthweek} = req.params
    const url = `https://kworb.net/youtube/weekly/${year}${nthweek}.html`
    fetch(url)
        .then(response => {
          if (response.status === 404) {
           res.send('404 Date not found')
          } else {
                const kworb = (axios(url).then(response => {
                const html = response.data
                const _ = cheerio.load(html)
                const data = []
            
                _('tbody tr', html).each(function(){
                        var link = _(this).find("td").find("a").attr("href")
                        const ranking = _(this).find("td").eq(0).html()
                        const status = _(this).find("td").eq(1).text()
                        const video = _(this).find("td").find("a").text()
                        const weeks = _(this).find("td").eq(3).html()
                        const peak = _(this).find("td").eq(4).html() + _(this).find('td').eq(5).text()
                        const views = _(this).find('td').eq(6).text()
                        const views_delta = _(this).find('td').eq(7).text()
                        
                        if (link.includes("youtube") == false){
                            link = link.replace("video/", "").replace(".html", "")
                            link = `https://youtube.com/watch?v=${link}`
                        }
                        data.push({ranking, status, video, link, weeks, peak, views, views_delta})
                    })
                    res.send(data)
                })
                )
          }
        })
        .catch(error => {
          res.json('An error had occurred:', error)
        })
})

// Youtube MV trending worldwide
app.get('/youtube/trending', (req, res) =>{
        const url = "https://kworb.net/youtube/trending.html"
        const kworb = (axios(url).then(response => {
        const html = response.data
        const _ = cheerio.load(html)
        const data = []

        _('tbody tr', html).each(function(){
            const ranking = _(this).find("td").eq(0).html()
            const status = _(this).find("td").eq(1).text()
            var link = _(this).find("td").find("a").attr("href")
            const video = _(this).find("td").find("a").text()
            const highlights = _(this).find("td").eq(4).text()

            if (link.includes("youtube.com") == false){
                link = link.replace("/youtube/trending/video/", "").replace(".html", "")
                link = `https://youtube.com/watch?v=${link}`
            }
            
            data.push({ranking, status, video, link, highlights})
        })
        res.send(data)
    })
    )
})

// Youtube videos (and non-music) trending worldwide
app.get('/youtube/trending/overall', (req, res) =>{
        const url = "https://kworb.net/youtube/trending_overall.html"
        const kworb = (axios(url).then(response => {
        const html = response.data
        const _ = cheerio.load(html)
        const data = []

        _('tbody tr', html).each(function(){
            const ranking = _(this).find("td").eq(0).html()
            const status = _(this).find("td").eq(1).text()
            var link = _(this).find("td").find("a").attr("href")
            const video = _(this).find("td").find("a").text()
            const highlights = _(this).find("td").eq(4).text()

            if (link.includes("youtube.com") == false){
                link = link.replace("/youtube/trending/video/", "").replace(".html", "")
                link = `https://youtube.com/watch?v=${link}`
            }
            
            data.push({ranking, status, video, link, highlights})
        })
        res.send(data)
    })
    )
})

// Youtube trending video per country
app.get('/youtube/trending/countries', (req, res) =>{
        const url = "https://kworb.net/youtube/trending_countries.html"
        const kworb = (axios(url).then(response => {
        const html = response.data
        const _ = cheerio.load(html)
        const data = []

        _('tbody tr', html).each(function(){
            const country = _(this).find("td").eq(0).html()
            const top_overall = _(this).find("td").eq(1).text()
            const top_music = _(this).find("td").eq(2).text()
            
            data.push({country, top_overall, top_music})
        })
        res.send(data)
    })
    )
})

// Youtube trending video specific country
app.get('/youtube/trending/countries/:country', (req, res) =>{
        const {country} = req.params
        const url = `https://kworb.net/youtube/trending/${country}.html`

        fetch(url)
        .then(response => {
          if (response.status === 404) {
           res.send('404 Country not found')
          } else {
                const kworb = (axios(url).then(response => {
                const html = response.data
                const _ = cheerio.load(html)

                const overall = []
                const music = []
                var ranking = "0"

                _('.overall tbody tr', html).each(function(){
                    const video = _(this).find("td").find("a").text()
                    var link = _(this).find("td").find("a").attr("href")
                    const likes = _(this).find("td").eq(1).html()

                    ranking=(parseInt(ranking)+1).toString()
                    
                    if (link.includes("youtube") == false){
                        link = link.replace("video/", "").replace(".html", "")
                        link = `https://youtube.com/watch?v=${link}`
                    }
                    overall.push({ranking, video, link, likes})
                })

                _('.music tbody tr', html).each(function(){
                    const video = _(this).find("td").find("a").text()
                    var link = _(this).find("td").find("a").attr("href")
                    const likes = _(this).find("td").eq(1).html()

                    ranking=(parseInt(ranking)+1).toString()
                    
                    if (link.includes("youtube") == false){
                        link = link.replace("video/", "").replace(".html", "")
                        link = `https://youtube.com/watch?v=${link}`
                    }
                    music.push({ranking, video, link, likes})
                })
                data = {
                    "overall" : overall,
                    "music" : music
                }
                res.send(data)
            })
            )
          }
        })
        .catch(error => {
          res.json('An error had occurred:', error)
        })
})

// Youtube top artist all time
app.get('/youtube/topartist', (req, res) =>{
        const url = "https://kworb.net/youtube/archive.html"
        const kworb = (axios(url).then(response => {
        const html = response.data
        const _ = cheerio.load(html)
        const data = []
        var ranking = "0"

        _('tbody tr', html).each(function(){
            const artist = _(this).find('td').find('a').text()
            const total_views_millions = _(this).find('td').eq(1).text()
            const videos_over_100M = _(this).find('td').eq(2).text()
            const average_daily_views_million = _(this).find('.smaller').text()

            ranking=(parseInt(ranking)+1).toString()

            data.push({ranking, artist, total_views_millions, videos_over_100M, average_daily_views_million})
        })
        res.send(data)
    })
    )
})

// Youtube top artist by year
app.get('/youtube/topartist/:year', (req, res) =>{
    const {year} = req.params
    const url = `https://kworb.net/youtube/topartists_${year}.html`

    fetch(url)
        .then(response => {
          if (response.status === 404) {
           res.send('404 Year not found')
          } else {
                const kworb = (axios(url).then(response => {
                const html = response.data
                const _ = cheerio.load(html)
                const data = []
                var ranking = "0"
            
                _('tbody tr', html).each(function(){
                    const artist = _(this).find('td').find('a').text()
                    const views = _(this).find('td').eq(1).text()

                    ranking=(parseInt(ranking)+1).toString()
            
                    data.push({ranking, artist, views})
                })
                res.send(data)
            })
            )
          }
        })
        .catch(error => {
          res.json('An error had occurred:', error)
        })
})

// Youtube top feature by year
app.get('/youtube/topartist_feat/:year', (req, res) =>{
    const {year} = req.params
    const url = `https://kworb.net/youtube/topartists_feat_${year}.html`

    fetch(url)
        .then(response => {
          if (response.status === 404) {
           res.send('404 Year not found')
          } else {
                const kworb = (axios(url).then(response => {
                const html = response.data
                const _ = cheerio.load(html)
                const data = []
                var ranking = "0"
            
                _('tbody tr', html).each(function(){
                    const artist = _(this).find('td').find('a').text()
                    const views = _(this).find('td').eq(1).text()

                    ranking=(parseInt(ranking)+1).toString()
            
                    data.push({ranking, artist, views})
                })
                res.send(data)
            })
            )
          }
        })
        .catch(error => {
          res.json('An error had occurred:', error)
        })
})

// Youtube top artist by country
app.get('/youtube/topartist/country/:nationID', (req, res) =>{
    const {nationID} = req.params
    const url = `https://kworb.net/youtube/topvideos_${nationID}.html`

    fetch(url)
        .then(response => {
          if (response.status === 404) {
           res.send('404 Year not found')
          } else {
                const kworb = (axios(url).then(response => {
                const html = response.data
                const _ = cheerio.load(html)
                const data = []
                var ranking = "0"
            
                _('tbody tr', html).each(function(){
                    const video = _(this).find("td").find("a").text()
                    var link = _(this).find("td").find("a").attr("href")
                    const views = _(this).find("td").eq(1).html()
                    const yesterday_views = _(this).find("td").eq(2).html()
            
                    ranking=(parseInt(ranking)+1).toString()
                    
                    if (link.includes("youtube") == false){
                        link = link.replace("video/", "").replace(".html", "")
                        link = `https://youtube.com/watch?v=${link}`
                    }
                    data.push({ranking, video, link, views, yesterday_views})
                })
                res.send(data)
            })
            )
          }
        })
        .catch(error => {
          res.json('An error had occurred:', error)
        })
})

// Specific Youtube artist
app.get('/youtube/artist/:artistName', (req, res) =>{
        const {artistName} = req.params
        const url = `https://kworb.net/youtube/artist/${artistName}.html`

        fetch(url)
        .then(response => {
          if (response.status === 404) {
           res.send('404 Artist not found')
          } else {
                const kworb = (axios(url).then(response => {
                const html = response.data
                const _ = cheerio.load(html)
                const info_data = []
                const video_data = []
                
                const total_views = _('.nobg').eq(1).text()
                const daily_average = _('.nobg').eq(3).text()
                info_data.push({artistName, total_views, daily_average})

                _('.addpos.sortable tbody tr', html).each(function(){
                    const video = _(this).find("td").find("a").text()
                    var link = _(this).find("td").find("a").attr("href")
                    const views = _(this).find("td").eq(1).html()
                    const yesterday_views = _(this).find("td").eq(2).html()
                    const published_date = _(this).find("td").eq(3).html()

                    if (link.includes("youtube") == false){
                        link = link.replace("../video/", "").replace(".html", "")
                        link = `https://youtube.com/watch?v=${link}`
                    }

                    video_data.push({video, link, views, yesterday_views, published_date})
                })
                
                response = {
                    "info" : info_data,
                    "statistics" : video_data
                }

                res.send(response)
            })
            )
          }
        })
        .catch(error => {
          res.json('An error had occurred:', error)
        })
})

// Global Youtube chart
app.get('/youtube/global', (req, res) =>{
        const url = "https://kworb.net/youtube/insights/"
        const kworb = (axios(url).then(response => {
        const html = response.data
        const _ = cheerio.load(html)
        const data = []

        _('tbody tr', html).each(function(){
            const country = _(this).find('td').eq(0).text()
            const track = _(this).find('td').find("a").text()
            const market_size = _(this).find('td').eq(2).text()
            

            data.push({country, track, market_size})
        })
        res.send(data)
    })
    )
})

// Weekly/Daily country Youtube chart
app.get('/youtube/global/:countryID', (req, res) =>{
        const {countryID} = req.params
        const url = `https://kworb.net/youtube/insights/${countryID}.html`

        fetch(url)
        .then(response => {
          if (response.status === 404) {
           res.send('404 Artist not found')
          } else if (url.includes("_daily")){
                const kworb = (axios(url).then(response => {
                const html = response.data
                const _ = cheerio.load(html)
                const data = []
            
                _('tbody tr', html).each(function(){
                    const ranking = _(this).find('td').eq(0).text()
                    const status = _(this).find('td').eq(1).text()
                    const track = _(this).find('td').eq(2).text()
                    const streams = _(this).find('td').eq(3).text()
                    const streams_delta = _(this).find('td').eq(4).text()

                    data.push({ranking, status, track, streams, streams_delta})
                })
                res.send(data)
            })
            )
          }
          else{
                const kworb = (axios(url).then(response => {
                const html = response.data
                const _ = cheerio.load(html)
                const data = []
            
                _('tbody tr', html).each(function(){
                    const ranking = _(this).find('td').eq(0).text()
                    const status = _(this).find('td').eq(1).text()
                    const track = _(this).find('td').eq(2).text()
                    const weeks = _(this).find('td').eq(3).text()
                    const peak = _(this).find('td').eq(4).text() + _(this).find('td').eq(5).text()
                    const streams = _(this).find('td').eq(6).text()
                    const streams_delta = _(this).find('td').eq(7).text()
                    data.push({ranking, status, track, weeks, peak ,streams, streams_delta})
                })
                res.send(data)
            })
            )
          }
        })
        .catch(error => {
          res.json('An error had occurred:', error)
        })
})

// Top Youtube viewed videos all time
app.get('/youtube/topviews', (req, res) =>{
        const url = `https://kworb.net/youtube/topvideos.html`
        const kworb = (axios(url).then(response => {
        const html = response.data
        const _ = cheerio.load(html)
        const data = []
        var ranking = "0"
    
        _('tbody tr', html).each(function(){
            const video = _(this).find("td").find("a").text()
            var link = _(this).find("td").find("a").attr("href")
            const views = _(this).find("td").eq(1).html()
            const yesterday_views = _(this).find("td").eq(2).html()

            ranking=(parseInt(ranking)+1).toString()
            
            if (link.includes("youtube") == false){
                link = link.replace("video/", "").replace(".html", "")
                link = `https://youtube.com/watch?v=${link}`
            }
            data.push({ranking, video, link, views, yesterday_views})
        })
        res.send(data)
    })
    )
})

// Top Youtube viewed videos by year
app.get('/youtube/topviews/:year', (req, res) =>{
    const {year} = req.params
    const url = `https://kworb.net/youtube/topvideos${year}.html`

    fetch(url)
        .then(response => {
          if (response.status === 404) {
           res.send('404 Year not found')
          } else {
                const kworb = (axios(url).then(response => {
                const html = response.data
                const _ = cheerio.load(html)
                const data = []
                var ranking = "0"
            
                _('tbody tr', html).each(function(){
                    const video = _(this).find("td").find("a").text()
                    var link = _(this).find("td").find("a").attr("href")
                    const views = _(this).find("td").eq(1).html()
            
                    ranking=(parseInt(ranking)+1).toString()
                    
                    if (link.includes("youtube") == false){
                        link = link.replace("video/", "").replace(".html", "")
                        link = `https://youtube.com/watch?v=${link}`
                    }
                    data.push({ranking, video, link, views})
                })
                res.send(data)
            })
            )
          }
        })
        .catch(error => {
          res.json('An error had occurred:', error)
        })
})

// Top Youtube viewed videos published in n.year
app.get('/youtube/topviews/published/:year', (req, res) =>{
    const {year} = req.params
    const url = `https://kworb.net/youtube/topvideos_published_${year}.html`

    fetch(url)
        .then(response => {
          if (response.status === 404) {
           res.send('404 Year not found')
          } else {
                const kworb = (axios(url).then(response => {
                const html = response.data
                const _ = cheerio.load(html)
                const data = []
                var ranking = "0"
            
                _('tbody tr', html).each(function(){
                    const video = _(this).find("td").find("a").text()
                    var link = _(this).find("td").find("a").attr("href")
                    const views = _(this).find("td").eq(1).html()
                    const yesterday_views = _(this).find("td").eq(2).html()
            
                    ranking=(parseInt(ranking)+1).toString()
                    
                    if (link.includes("youtube") == false){
                        link = link.replace("video/", "").replace(".html", "")
                        link = `https://youtube.com/watch?v=${link}`
                    }
                    data.push({ranking, video, link, views, yesterday_views})
                })
                res.send(data)
            })
            )
          }
        })
        .catch(error => {
          res.json('An error had occurred:', error)
        })
})

// Top Youtube liked videos
app.get('/youtube/toplikes', (req, res) =>{
        const url = `https://kworb.net/youtube/topvideos_likes.html`
        const kworb = (axios(url).then(response => {
        const html = response.data
        const _ = cheerio.load(html)
        const data = []
        var ranking = "0"

        _('tbody tr', html).each(function(){
            const video = _(this).find("td").find("a").text()
            var link = _(this).find("td").find("a").attr("href")
            const likes = _(this).find("td").eq(1).html()

            ranking=(parseInt(ranking)+1).toString()
            
            if (link.includes("youtube") == false){
                link = link.replace("video/", "").replace(".html", "")
                link = `https://youtube.com/watch?v=${link}`
            }
            data.push({ranking, video, link, likes})
        })
        res.send(data)
    })
    )
})

// Top Youtube commented videos
app.get('/youtube/topcomments', (req, res) =>{
        const url = `https://kworb.net/youtube/topvideos_comments.html`
        const kworb = (axios(url).then(response => {
        const html = response.data
        const _ = cheerio.load(html)
        const data = []
        var ranking = "0"

        _('tbody tr', html).each(function(){
            const video = _(this).find("td").find("a").text()
            var link = _(this).find("td").find("a").attr("href")
            const comments = _(this).find("td").eq(1).html()

            ranking=(parseInt(ranking)+1).toString()
            
            if (link.includes("youtube") == false){
                link = link.replace("video/", "").replace(".html", "")
                link = `https://youtube.com/watch?v=${link}`
            }
            data.push({ranking, video, link, comments})
        })
        res.send(data)
    })
    )
})

// Fastest to ... milestone Youtube views
app.get('/youtube/milestone/:milestone', (req, res) =>{
        const {milestone} = req.params
        const url = `https://kworb.net/youtube/milestones_${milestone}.html`
    
        fetch(url)
        .then(response => {
          if (response.status === 404) {
           res.send('404 Milestone not found')
          } else {
                const kworb = (axios(url).then(response => {
                const html = response.data
                const _ = cheerio.load(html)
                const data = []
        
                _('tbody tr', html).each(function(){
                    const ranking = _(this).find("td").eq(0).text()
                    const video = _(this).find("td").find("a").text()
                    var link = _(this).find("td").find("a").attr("href")
                    const days = _(this).find("td").eq(2).html()
        
                    
                    if (link.includes("youtube") == false){
                        link = link.replace("video/", "").replace(".html", "")
                        link = `https://youtube.com/watch?v=${link}`
                    }
                    data.push({ranking, video, link, days})
                })
                res.send(data)
            })
            )
          }
        })
        .catch(error => {
          res.json('An error had occurred:', error)
        })
})

// Specific Youtube video statistics
app.get('/youtube/video/:videoID', (req, res) =>{
    const {videoID} = req.params
    const url = `https://kworb.net/youtube/video/${videoID}.html`

    fetch(url)
    .then(response => {
      if (response.status === 404) {
       res.send('404 Video ID not found')
      } else {
            const kworb = (axios(url).then(response => {
            const html = response.data
            const _ = cheerio.load(html)
            const data = []

            var link = _(".subcontainer").find("iframe").attr("src")
            link = link.replace("embed", "watch").replace("?rel=0", "")

            const track = _(".subcontainer").find('.pagetitle').text().split("|")[0].slice(0, -2)

            var other = _(".subcontainer").eq(4).find('div[style="float: left; width: 450px;"]').text()
            
            //Split \n to JSON object
            let json = {}
            let lines = other.split('\n')
            for (let line of lines) {
                let colonIndex = line.indexOf(':')
                let key = line.slice(0, colonIndex).trim()
                let value = line.slice(colonIndex + 1).trim()
                json[key] = value
                if(key === "Likes"){
                    rest = lines.slice(lines.indexOf(line) + 1)
                    break
                }
            }
            // Deleting unnecessary data
            delete json[""]
            rest = rest.filter(line => line.trim() != "" && !line.startsWith("On top lists:") && !line.startsWith("Available worldwide."));

            //Easier to read
            const general = json
            const other_data = rest

            data.push({track, link, general, other_data})
            res.send(data)
        })
        )
      } 
    })
    .catch(error => {
      res.json('An error had occurred:', error)
    })
})

// Spotify get global/country chart daily/weekly or total daily/weekly
app.get('/spotify/chart/:location/:timeframe', (req, res) =>{
    const {location} = req.params
    var {timeframe} = req.params
    timeframe = "_" + timeframe
    const url = `https://kworb.net/spotify/country/${location}${timeframe}.html`

    fetch(url)
        .then(response => {
          if (response.status === 404) {
           res.send('404 Chart not found')
          } else {
                const kworb = (axios(url).then(response => {
                const html = response.data
                const _ = cheerio.load(html)
                const data = []
        
                if (url.includes("_total") == true){
                        // const text = _(".subcontainer").eq(3).text()
                        // let time = text.match(/Covers charts from [\d\/]+ to [\d\/]+/)[0]

                        const kworb = (axios(url).then(response => {
                        const html = response.data
                        const _ = cheerio.load(html)
                        const data = []
                        var ranking = "0"
                
                        _('tbody tr', html).each(function(){
                            const artist_and_title = _(this).find("td").eq(0).text()
                            const weeks = _(this).find("td").eq(1).html()
                            const days = weeks
                            const top_10 = _(this).find("td").eq(2).html()
                            const peak = _(this).find("td").eq(3).html() + _(this).find("td").eq(4).html()
                            const peak_streams = _(this).find("td").eq(5).html()
                            const total_streams = _(this).find("td").eq(6).html()

                            ranking=(parseInt(ranking)+1).toString()
                            if (url.includes("daily") == true){
                                data.push({ranking, artist_and_title, days, top_10, peak, peak_streams, total_streams})
                            }else if(url.includes("weekly") == true){
                                data.push({ranking, artist_and_title, weeks, top_10, peak, peak_streams, total_streams})
                            }
                        })
                        res.send(data)
                    })
                    )
                } else{
                        const kworb = (axios(url).then(response => {
                        const html = response.data
                        const _ = cheerio.load(html)
                        const data = []
                        var ranking = "0"
                
                        _('tbody tr', html).each(function(){
                            if (url.includes("daily") == true){
                                const ranking = _(this).find("td").eq(0).text()
                                const status = _(this).find("td").eq(1).text()
                                const artist_and_title = _(this).find("td").eq(2).text()
                                const days = _(this).find("td").eq(3).html()
                                const peak = _(this).find("td").eq(4).html() + _(this).find("td").eq(5).html()
                                const streams = _(this).find("td").eq(6).html()
                                const streams_delta = _(this).find("td").eq(7).html()
                                const days7 = _(this).find("td").eq(8).html()
                                const days7_delta = _(this).find("td").eq(8).html()
                                const total_streams = _(this).find("td").eq(9).html()

                                data.push({ranking, status, artist_and_title, days, streams, peak, streams, streams_delta, "7days":days7, "7days_delta": days7_delta, total_streams})
                            }else if(url.includes("weekly") == true){
                                const ranking = _(this).find("td").eq(0).text()
                                const status = _(this).find("td").eq(1).text()
                                const artist_and_title = _(this).find("td").eq(2).text()
                                const weeks = _(this).find("td").eq(3).html()
                                const peak = _(this).find("td").eq(4).html() + _(this).find("td").eq(5).html()
                                const streams = _(this).find("td").eq(6).html()
                                const streams_delta = _(this).find("td").eq(7).html()
                                const total_streams = _(this).find("td").eq(8).html()

                                data.push({ranking, status, artist_and_title, weeks, peak, streams, streams_delta, total_streams})
                            }
                        })
                        res.send(data)
                    })
                    )
                }
            })
            )
          }
        })
        .catch(error => {
          res.json('An error had occurred:', error)
        })
})

// Spotify top artist by monthly listeners
app.get('/spotify/topartist', (req, res) =>{
        const url = `https://kworb.net/spotify/listeners.html`
        const kworb = (axios(url).then(response => {
        const html = response.data
        const _ = cheerio.load(html)
        const data = []
        var ranking = "0"

        _('tbody tr', html).each(function(){
            const artist = _(this).find("td").find("a").text()
            const listeners = _(this).find("td").eq(1).html()
            const daily_trend = _(this).find("td").eq(2).html()
            const peak = _(this).find("td").eq(3).html()
            const peak_listeners = _(this).find("td").eq(4).html()

            ranking=(parseInt(ranking)+1).toString()
            
            data.push({ranking, artist, listeners, daily_trend, peak, peak_listeners})
        })
        res.send(data)
    })
    )
})

// Spotify top list
app.get('/spotify/toplist', (req, res) =>{
        const url = `https://kworb.net/spotify/toplists.html`
        const kworb = (axios(url).then(response => {
        const html = response.data
        const _ = cheerio.load(html)
        const data = []

        _('table[style="width: 650px;"] tbody tr', html).each(function(){
            const time = _(this).find("td").eq(0).html()
            const artist_and_title = _(this).find("td").find("a").text()
            const streams = _(this).find("td").eq(2).html()

            data.push({time, artist_and_title, streams})
        })
        res.send(data)
    })
    )
})

// Spotify most streamed songs
app.get('/spotify/topsongs', (req, res) =>{
        const url = `https://kworb.net/spotify/songs.html`
        const kworb = (axios(url).then(response => {
        const html = response.data
        const _ = cheerio.load(html)
        const data = []
        var ranking = "0"

        _('tbody tr', html).each(function(){
            const artist_and_title = _(this).find("td").eq(0).text()
            const streams = _(this).find("td").eq(1).html()
            const daily = _(this).find("td").eq(2).html()

            ranking=(parseInt(ranking)+1).toString()
            
            data.push({ranking, artist_and_title, streams, daily})
        })
        res.send(data)
    })
    )
})

// Spotify most streamed albums
app.get('/spotify/topalbums', (req, res) =>{
        const url = `https://kworb.net/spotify/albums.html`
        const kworb = (axios(url).then(response => {
        const html = response.data
        const _ = cheerio.load(html)
        const data = []
        var ranking = "0"

        _('tbody tr', html).each(function(){
            const artist_and_title = _(this).find("td").eq(0).text()
            const streams = _(this).find("td").eq(1).html()
            const daily = _(this).find("td").eq(2).html()

            ranking=(parseInt(ranking)+1).toString()
            
            data.push({ranking, artist_and_title, streams, daily})
        })
        res.send(data)
    })
    )
})

// Spotify most streamed songs in specific year
app.get('/spotify/topsongs/:year', (req, res) =>{
        var {year} = req.params
        const url = `https://kworb.net/spotify/songs_${year}.html`

        fetch(url)
        .then(response => {
          if (response.status === 404) {
           res.send('404 List not found')
          } else {
            const kworb = (axios(url).then(response => {
            const html = response.data
            const _ = cheerio.load(html)
            const data = []
            var ranking = "0"

                _('tbody tr', html).each(function(){
                    const artist_and_title = _(this).find("td").eq(0).text()
                    const streams = _(this).find("td").eq(1).html()
                    const daily = _(this).find("td").eq(2).html()
        
                    ranking=(parseInt(ranking)+1).toString()
                    
                    data.push({ranking, artist_and_title, streams, daily})
                })
                res.send(data)
            })
            )
          }
        })
    .catch(error => {
        res.json('An error had occurred:', error)
    })
})

// Spotify specific artist
app.get('/spotify/artist/:artistID', (req, res) =>{
    var {artistID} = req.params
    const ID = artistID.split("_")

    const dict = {
        "peak" : "",
        "albums" : "_albums",
        "songs" : "_songs",
        undefined : "_songs",
    }
    
    if (ID[1] in dict == true){
        ID[1] = dict[ID[1]]
    }
    artistID = ID.join("")

    const url = `https://kworb.net/spotify/artist/${artistID}.html`

    fetch(url)
        .then(response => {
          if (response.status === 404) {
           res.send('404 Data not found')
          } else {
                const kworb = (axios(url).then(response => {
                const html = response.data
                const _ = cheerio.load(html)
                const data = []

                    if (url.includes("_info") == true){    
                        const streams = []
                        const daily = []
                        const tracks = []  
                        var column = 0
                        _('table[style="width: 580px;"] tbody tr', html).each(function(){
                            const total = _(this).find("td").eq(1).text()
                            const as_lead = _(this).find("td").eq(2).html()
                            const as_solo = _(this).find("td").eq(3).html()
                            const as_feature = _(this).find("td").eq(4).html()
                            
                            if(column == 0){
                                streams.push({total, as_lead, as_solo, as_feature})
                            }else if (column == 1){
                                daily.push({total, as_lead, as_solo, as_feature})
                            }else if (column == 2){
                                tracks.push({total, as_lead, as_solo, as_feature})
                            }
                            column += 1
                        })
                        res.send({streams, daily, tracks})
                    }else if (url.includes("_albums") == true){
                        _('.addpos.sortable tbody tr', html).each(function(){
                            const title = _(this).find("a").text()
                            const link = _(this).find("a").attr("href")
                            const streams = _(this).find("td").eq(1).text()
                            const daily = _(this).find("td").eq(2).text()
                            
                            data.push({title, link, streams, daily})
                        })
                        res.send(data)
                        
                    }else if(url.includes("_peak") == true){
                        _('.sortable tbody tr', html).each(function(){
                            const title = _(this).find("a").text()
                            const link = _(this).find("a").attr("href")
                            const streams = _(this).find("td").eq(2).text()

                            let dict = []
                            for (let i = 3; i < 79; i++){
                                dict.push({
                                    key : _(".sortable thead tr").find("th").eq(i).text(),
                                    value : _(".sortable tbody tr").find("td").eq(i).text()
                                })
                            }
                        })

                        data.push({title, link, peak_date, streams, dict})
                    }
                })
                )
          }
        })
        .catch(error => {
          res.json('An error had occurred:', error)
        })
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`))
