const express = require('express');
const request = require('request');
const app = express();
const port = 80;

app.use(express.json())


const sleep = (ms) => {
    return new Promise((resolve) => {
    setTimeout(resolve, ms);
    });
} 

const exchange = async (code) => {
    const options = {
        uri:'https://oauth2.googleapis.com/token', 
        method: 'POST',
        form: {
          client_id:,
          client_secret:,
          code:code,
          grant_type:'authorization_code',
          redirect_uri:'http://soviet.kr/authcode'
        }
      }
      console.log(code);
        request.post(options, (err, res) => {
            if (err)
            {
                console.log(err);
            }
            else
            {
                let token = JSON.parse(res.body).access_token
                exchange.result = token;
                console.log(exchange.result);
            }
        });
    await sleep(1000)
    return exchange.result;
};

const getProfile = async (token) => {
    const options = {
        uri: "https://www.googleapis.com/oauth2/v2/userinfo",
        qs:{
          access_token:await token
        }
    };
    console.log(options);
    request(options,(err,res) => {
        getProfile.result = res.body;
    });
    await sleep(3000);
    console.log(getProfile.result)
    return getProfile.result;
};

app.set('views', __dirname);
app.set('view-engine', 'ejs');

app.get('/', (req, res) => res.render('index.ejs'));

app.get('/info', (req, res) => res.render('info.ejs'));

app.get('/agreement', (req, res) => res.render('agreement.ejs'));

app.get('/authcode', async (req, res) => {let token = exchange(req.query.code); let data = await getProfile(token); res.render("profile.ejs", {data: data});});

app.get('/token', (req, res) => res.render('fetch.ejs'));

app.get('/fetch', async (req, res) => {let data = await getProfile(req.query.access_token); res.json({data: await data});});

app.listen(port, () => console.log(`Server listening on port ${port}!`));
