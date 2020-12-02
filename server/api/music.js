const router = require('express').Router()
module.exports = router
const {Parser} = require('node-sql-parser')
const parser = new Parser()
const db = require('../db')
var _ = require('lodash')

router.get('/', async (req, res, next) => {
  try {
    // const ast = parser.astify(
    //   'select songs.title, artists.age from songs left join artists on song.artistId = artists.id'
    // )
    // mysql sql grammer parsed by default
    const ast = parser.astify('select * from songs, artists') // mysql sql grammer parsed by default

    res.send(ast)
  } catch (err) {
    next(err)
  }
})

router.get('/models', async (req, res, next) => {
  try {
    const [results, metadata] = await db.query(
      "SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE table_schema='public'"
    )
    //redid with lodash
    let prettierArray = _.reduce(
      results,
      function(result, value) {
        let tableName = value.table_name
        let columnName = value.column_name
        let exists = _.find(result, function(o) {
          return o[tableName]
        })
        if (exists) {
          exists[tableName].push(columnName)
        } else {
          let obj = {}
          obj[tableName] = [columnName]
          result.push(obj)
        }
        return result
      },
      []
    )

    //original script
    // let prettierArray = results.reduce(
    //   (accum, element) => {
    //     for (let i = 0; i < accum.length; i++) {
    //       let current = accum[i]
    //       let tableName = element.table_name
    //       let columnName = element.column_name
    //       if (current[tableName]) {
    //         current[tableName].push(columnName)
    //         break
    //       } else if (i === accum.length - 1) {
    //         let newObj = {}
    //         newObj[tableName] = []
    //         accum.push(newObj)
    //       }
    //     }
    //     return accum
    //   },
    //   ['test']
    // )
    //redid with lodash
    _.forEach(prettierArray, function(value) {
      _.forEach(value, function(value, key) {
        value.sort().unshift(value.splice(value.indexOf('id'), 1)[0])
      })
    })
    res.send(prettierArray)
    //original script
    // let songsArray = prettierArray.slice(1)[0].songs.sort()
    // songsArray.unshift(songsArray.splice(songsArray.indexOf('id'), 1))
    // let albumsArray = prettierArray.slice(1)[1].albums.sort()
    // albumsArray.unshift(albumsArray.splice(albumsArray.indexOf('id'), 1))
    // let artistsArray = prettierArray.slice(1)[2].artists.sort()
    // artistsArray.unshift(artistsArray.splice(artistsArray.indexOf('id'), 1))
    // res.send(prettierArray.slice(1))
  } catch (err) {
    next(err)
  }
})
