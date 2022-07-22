const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require('express')
const app = express()

const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/international',
        base: ''
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraphindia.com/',
        base: ''
    }
]

const articles=[]


newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then(response=>{
        const html=response.data
        const $ = cheerio.load(html)

        $('a:contains("climate")',html).each(function (){
            const title = $(this).text()
            const url = $(this).attr('href')
            articles.push({
                title,
                url: newspaper.base + url,
                source: newspaper.name
            })
        })

    })
})



app.get('/',(req,res)=>{
    res.json('Welcome yoyo')
})


app.get('/news', (req,res)=>{
    res.json(articles)
})

app.get('/news/:newspaperID', async(req,res)=>{
    const newspaperID = req.params.newspaperID
    const newspaperAdd = newspapers.filter(newspaper => newspaper.name== newspaperID)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name== newspaperID)[0].base


    axios.get(newspaperAdd)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const sarticles = []

        $('a:contains("climate")',html).each(function(){
            const title = $(this).text()
            const url = $(this).attr('href')
            sarticles.push({
                title,
                url: newspaperBase + url,
                source : newspaperID
            })
        })
        res.json(sarticles)
    }).catch(err=> console.log(err))
})

app.listen(PORT, ()=> console.log(`server running on PORT ${PORT}`))
