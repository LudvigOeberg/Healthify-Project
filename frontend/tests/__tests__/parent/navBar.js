/* eslint-disable no-shadow */
let driver
const webdriver = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const localURL = 'http://localhost:4100/'
beforeAll(() => {
  jest.setTimeout(300000)
  const options = new chrome.Options()
  options.addArguments('--test-type')
  options.addArguments('--start-maximized')
  driver = new webdriver.Builder().forBrowser('chrome').setChromeOptions(options).build()
})

afterAll(() => {
  driver.close()
})

async function connectToEHR() {
  await driver.get(localURL)
  await driver.wait(webdriver.until.alertIsPresent())
  const alert1 = await driver.switchTo().alert()
  // replace username with the username for openEHR
  await alert1.sendKeys(process.env.ehr_user)
  await alert1.accept()
  await driver.wait(webdriver.until.alertIsPresent())
  const alert2 = await driver.switchTo().alert()
  // replace pass with password from openEHR
  await alert2.sendKeys(process.env.ehr_user_pass)
  await alert2.accept()
}

function User() {
  const randomInt = Math.floor(Math.random() * Math.floor(1000000))
  this.email = `${randomInt}epost@test.se`
  this.passw = 'passw'
}

async function register(driver, user) {
  // await driver.get(localURL)
  await driver.findElement(webdriver.By.xpath("//span[text()='Registrera dig']")).click()
  await driver.findElement(webdriver.By.id('name')).sendKeys('Namn')
  await driver.findElement(webdriver.By.id('surname')).sendKeys('Efteramn')
  await driver.findElement(webdriver.By.id('email')).sendKeys(user.email)
  await driver.findElement(webdriver.By.id('password')).sendKeys(user.passw)
  await driver.findElement(webdriver.By.id('confirmPassword')).sendKeys(user.passw)
  await driver.findElement(webdriver.By.xpath("//span[text()='Registrera']")).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}parent`), 10000, 'Timed out after 5 sec', 100)
}

async function logut(driver) {
  await driver.findElement(webdriver.By.xpath("//span[text()='Logga ut']")).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}login`))
  expect(await driver.getCurrentUrl()).toEqual(`${localURL}login`)
}

test('TestCaseID:257. Check if navbar exists', async () => {
  const user = new User()
  await connectToEHR()
  await register(driver, user)
  let present = true
  try {
    await driver.findElement(webdriver.By.className('MuiToolbar-root MuiToolbar-regular MuiToolbar-gutters'))
  } catch (err) {
    present = false
  }
  await logut(driver)
  expect(present).toEqual(true)
})

test('TestCaseID:255. Check if Healthify text exists', async () => {
  const user = new User()
  // await connectToEHR()
  await register(driver, user)
  let present = true
  try {
    await driver.findElement(webdriver.By.xpath("//span[text()='Healthify']"))
  } catch (err) {
    present = false
  }
  await logut(driver)
  expect(present).toEqual(true)
})

test('TestCaseID:256. Check if Healthify text is a link to the profile page', async () => {
  const user = new User()
  // await connectToEHR()
  await register(driver, user)
  await driver.findElement(webdriver.By.xpath("//span[text()='Healthify']")).click()
  const url = await driver.getCurrentUrl()
  expect(url).toEqual(`${localURL}parent`)
  await logut(driver)
})

test('TestCaseID:251. Check if navbar drawer exists', async () => {
  const user = new User()
  // await connectToEHR()
  await register(driver, user)
  let present = true
  try {
    await driver.findElement(
      webdriver.By.xpath(
        "//button[@class='MuiButtonBase-root MuiIconButton-root makeStyles-menuButton-5 MuiIconButton-colorInherit MuiIconButton-edgeStart']",
      ),
    )
  } catch (err) {
    present = false
  }
  expect(present).toEqual(true)

  await driver
    .findElement(
      webdriver.By.xpath(
        "//button[@class='MuiButtonBase-root MuiIconButton-root makeStyles-menuButton-5 MuiIconButton-colorInherit MuiIconButton-edgeStart']",
      ),
    )
    .click()
  await logut(driver)
})

test('TestCaseID:252. Check profile link to the profile page', async () => {
  const user = new User()
  // await connectToEHR()
  await register(driver, user)
  await driver
    .findElement(
      webdriver.By.xpath(
        "//button[@class='MuiButtonBase-root MuiIconButton-root makeStyles-menuButton-5 MuiIconButton-colorInherit MuiIconButton-edgeStart']",
      ),
    )
    .click()

  let present = true
  try {
    await driver.findElement(webdriver.By.xpath("//span[.='Min profil']"))
  } catch (err) {
    present = false
  }
  expect(present).toEqual(true)

  await driver.findElement(webdriver.By.xpath("//span[.='Min profil']")).click()
  const url = await driver.getCurrentUrl()
  expect(url).toEqual(`${localURL}parent`)
  await logut(driver)
})

test('TestCaseID:253. Check settings link to the settings page', async () => {
  const user = new User()
  // await connectToEHR()
  await register(driver, user)
  await driver
    .findElement(
      webdriver.By.xpath(
        "//button[@class='MuiButtonBase-root MuiIconButton-root makeStyles-menuButton-5 MuiIconButton-colorInherit MuiIconButton-edgeStart']",
      ),
    )
    .click()

  let present = true
  try {
    await driver.findElement(webdriver.By.xpath("//span[contains(text(),'Inställningar')]"))
  } catch (err) {
    present = false
  }
  expect(present).toEqual(true)

  await driver.findElement(webdriver.By.xpath("//span[.='Inställningar']")).click()
  const url = await driver.getCurrentUrl()
  expect(url).toEqual(`${localURL}parent-settings`)
  await logut(driver)
})

test('TestCaseID:254. Check child registration link to child registration page', async () => {
  const user = new User()
  // await connectToEHR()
  await register(driver, user)
  await driver
    .findElement(
      webdriver.By.xpath(
        "//button[@class='MuiButtonBase-root MuiIconButton-root makeStyles-menuButton-5 MuiIconButton-colorInherit MuiIconButton-edgeStart']",
      ),
    )
    .click()

  let present = true
  try {
    await driver.findElement(webdriver.By.xpath("//span[contains(text(),'Registrering av barn')]"))
  } catch (err) {
    present = false
  }
  expect(present).toEqual(true)

  await driver.findElement(webdriver.By.xpath("//span[.='Registrering av barn']")).click()
  const url = await driver.getCurrentUrl()
  expect(url).toEqual(`${localURL}register-patient`)
  await logut(driver)
})
