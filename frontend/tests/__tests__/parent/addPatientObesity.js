/* eslint-disable no-shadow */
let driver
const webdriver = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
// const remoteURL = 'http://tddc88-company-2-2020.kubernetes-public.it.liu.se/'
const localURL = 'http://localhost:4100/'
beforeAll(() => {
  jest.setTimeout(300000)
  const options = new chrome.Options()
  options.addArguments('--test-type')
  options.addArguments('--start-maximized')
  // options.addArguments('--headless')
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

// eslint-disable-next-line no-unused-vars
async function login(driver, userPath, user) {
  await driver.get(localURL)
  await driver.findElement(webdriver.By.xpath("//span[text()='Logga in']")).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}login`))
  await driver.findElement(webdriver.By.id('email')).sendKeys(user.email)
  await driver.findElement(webdriver.By.id('password')).sendKeys(user.passw)
  await driver.findElement(webdriver.By.xpath("//span[text()='Logga In']")).click()
  await driver.wait(webdriver.until.urlIs(localURL + userPath))
  expect(await driver.getCurrentUrl()).toEqual(localURL + userPath)
}

async function register(driver, user) {
  await driver.get(localURL)
  await driver.findElement(webdriver.By.xpath("//span[text()='Registrera dig']")).click()
  await driver.findElement(webdriver.By.id('name')).sendKeys('Namn')
  await driver.findElement(webdriver.By.id('surname')).sendKeys('Efteramn')
  await driver.findElement(webdriver.By.id('email')).sendKeys(user.email)
  await driver.findElement(webdriver.By.id('password')).sendKeys(user.passw)
  await driver.findElement(webdriver.By.id('confirmPassword')).sendKeys(user.passw)
  await driver.findElement(webdriver.By.xpath("//span[text()='Registrera']")).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}parent`), 10000, 'Timed out after 5 sec', 100)
}

async function registerPatientWithObesity(driver, patient) {
    //await driver.findElement(webdriver.By.xpath("//span[text()='Lägg till barn']")).click()
    //work around, not able to press the plus sign for registration with webdriver.
    await driver.get(localURL+"register-patient")
    await driver.wait(webdriver.until.urlIs(`${localURL}register-patient`), 10000, 'Timed out after 5 sec', 100)
    await driver.findElement(webdriver.By.id('name')).sendKeys('Namn')
    await driver.findElement(webdriver.By.id('surname')).sendKeys('Efteramn')
    await driver.findElement(webdriver.By.id('email')).sendKeys(patient.email)
    await driver.findElement(webdriver.By.id('password')).sendKeys(patient.passw)
    await driver.findElement(webdriver.By.id('confirmPassword')).sendKeys(patient.passw)
    await driver.findElement(webdriver.By.id('dateofbirth')).sendKeys('2010-01-01T00:00:00Z')
    await driver.findElement(webdriver.By.css("div[aria-labelledby='gender-label']")).click()
    await driver.findElement(webdriver.By.css("li[data-value='MALE']")).click()
    await driver.findElement(webdriver.By.css("div[aria-labelledby='disease-label']")).click()
    await driver.findElement(webdriver.By.css("li[data-value='OBESITY']")).click()
    await driver.findElement(webdriver.By.id('goalweight')).sendKeys(45)
    await driver.findElement(webdriver.By.css('#main > main > div > form > button')).sendKeys(webdriver.Key.ENTER)
    await driver.wait(webdriver.until.urlIs(`${localURL}parent`), 5000, 'Timed out after 5 sec', 100)
}

async function logut(driver) {
    await driver.findElement(webdriver.By.xpath("//span[text()='Logga ut']")).click()
    await driver.wait(webdriver.until.urlIs(`${localURL}login`))
    expect(await driver.getCurrentUrl()).toEqual(`${localURL}login`)
}
  

test('TestCaseID:100.1.1. Register Patient with obesity using valid values', async () => {
    const user = new User()
    // await connectToEHR()
    await register(driver, user)
    const patient = new User()
    await registerPatientWithObesity(driver, patient)
    await logut(driver)
})

test('TestCaseID:100.1.2. Register Patient with obesity using invalid values', async () => {
    const user = new User()
    // await connectToEHR()
    await register(driver, user)
    const patient = new User()
    await driver.get(localURL+"register-patient")
    await driver.wait(webdriver.until.urlIs(`${localURL}register-patient`), 10000, 'Timed out after 5 sec', 100)
    await driver.findElement(webdriver.By.id('name')).sendKeys('Namn')
    await driver.findElement(webdriver.By.id('surname')).sendKeys('Efteramn')
    await driver.findElement(webdriver.By.id('email')).sendKeys(patient.email)
    await driver.findElement(webdriver.By.id('password')).sendKeys(patient.passw)
    await driver.findElement(webdriver.By.id('confirmPassword')).sendKeys(patient.passw)
    await driver.findElement(webdriver.By.id('dateofbirth')).sendKeys('2010-01-01T00:00:00Z')
    await driver.findElement(webdriver.By.css("div[aria-labelledby='gender-label']")).click()
    await driver.findElement(webdriver.By.css("li[data-value='MALE']")).click()
    await driver.findElement(webdriver.By.css("div[aria-labelledby='disease-label']")).click()
    await driver.findElement(webdriver.By.css("li[data-value='OBESITY']")).click()
    await driver.findElement(webdriver.By.id('goalweight')).sendKeys(70)
    var x = await driver.findElement(webdriver.By.id("goalweight")).getAttribute("value")
    expect(x).toEqual("60")
    await driver.findElement(webdriver.By.css('#main > main > div > form > button')).sendKeys(webdriver.Key.ENTER)
    await driver.wait(webdriver.until.urlIs(`${localURL}parent`), 5000, 'Timed out after 5 sec', 100)
})