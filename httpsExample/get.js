const https = require('https')
const syswidecas = require('syswide-cas');

syswidecas.addCAs('cert.pem');
const options = {
  hostname: 'localhost',
  port: 443,
  path: '/todos',
  method: 'GET'
}

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`)

  res.on('data', d => {
    process.stdout.write(d)
  })
})

req.on('error', error => {
  console.error(error)
})

req.end()