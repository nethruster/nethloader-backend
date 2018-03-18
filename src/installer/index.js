const sleep = require('sleep-promise')
const readLine = require('readline-sync')

const db = require('../models')
const config = (require('../utils/config')).getConfig()
const createUser = require('../utils/create-user');

(async function () {
  let answer
  console.log("Welcome to Nethloader's installer")
  await sleep(200)
  console.log("First of all, let's check your database config:")
  await sleep(400)
  console.log(JSON.stringify(config.database, null, 2))
  await sleep(200)
  answer = readLine.keyInYN('Is it correct?')
  if (!answer) return console.log('Rectify your config file and then restart this installer')

  answer = readLine.keyInYN('Do you want to erase all database content?')
  console.log('Starting the migration...')
  let sucess = await dbSync(answer)
  if (!sucess) return
  answer = readLine.keyInYN('Do you want to add a new user?')
  if(answer) {
    let complete = false
    while(!complete) {
      await addNewUser();

      complete = !readLine.keyInYN('Do you want to add another user?')
    }
  }
  console.log('Bye')
})()

async function addNewUser() {
  let user
  let complete = false
  while (!complete) {
    user = {
      name: readLine.question("Insert the user's name: "),
      email: readLine.questionEMail("Insert the user's email: "),
      isAdmin: readLine.keyInYN("Should the user be an admin?"),
      password: ""
    }
    user.password = askPassword()

    await sleep(400)
    console.log(JSON.stringify(user, null, 2))
    if(!readLine.keyInYN("Is this data correct?")) {continue;}
    await createUser(user)
    complete = true
  }
}
function askPassword() {
  let pass = readLine.question("Insert the user's password: ")
  if(pass === readLine.question("Retype the user's password: ")) {
    return pass
  } else {
    console.log("\x1b[31mPasswords doesn't match", "\x1b[0m")
    askPassword()
  }
}

function dbSync (force) {
  return db.sequelize.sync({ force: force, logging: false })
    .then(() => true)
    .catch(err => {
      if (err.name === 'SequelizeConnectionError') {
        console.log('Can not connect to the database.')
        let answer = readLine.keyInSelect(['Try again.', 'Close the installer'], 'What do you want to do?')
        if (answer === 0) {
          dbSync(force)
        } else {
          return false
        }
      } else {
        console.error(err)
      }
    })
}
