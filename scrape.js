const fs = require('fs')
const fetch = require('isomorphic-fetch')
const jsdom = require('jsdom')
const { JSDOM } = jsdom


async function main () {
  const response = await fetch('https://www.thurstoncountywa.gov/sheriff/Pages/incidents-report.aspx')
  const body = await response.text()
  // const body = fs.readFileSync('./sample.html', 'utf8')

  const dom = new JSDOM(body)
  const rows = [...dom.window.document.querySelectorAll('.ms-webpart-zone')[1].querySelectorAll('table tr')]
  const data = rows.reduce((acc, row) => {
      const tds = row.querySelectorAll('td')
      return [
        ...acc,
        {
          date: tds[0].textContent,
          time: tds[1]?.textContent,
          sequenceNum: tds[2]?.textContent,
          incidentNature: tds[3]?.textContent,
          location: tds[4]?.textContent,
        }
      ]
    }, [])
    .filter(r => !!r.time) // exclude empty rows
    .slice(1) // exclude header row

  console.log(JSON.stringify(data, null, 4))
}
main()
