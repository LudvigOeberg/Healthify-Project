/* eslint-disable no-shadow */
let driver
const webdriver = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
// const remoteURL = 'http://tddc88-company-2-2020.kubernetes-public.it.liu.se/'
const localURL = 'http://tddc88-company-2-2020.kubernetes-public.it.liu.se/'
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
  await driver.findElement(webdriver.By.id('registerHeaderButton')).click()
  await driver.findElement(webdriver.By.id('name')).sendKeys('Namn')
  await driver.findElement(webdriver.By.id('surname')).sendKeys('Efteramn')
  await driver.findElement(webdriver.By.id('email')).sendKeys(user.email)
  await driver.findElement(webdriver.By.id('password')).sendKeys(user.passw)
  await driver.findElement(webdriver.By.id('confirmPassword')).sendKeys(user.passw)
  await driver.findElement(webdriver.By.xpath("//span[text()='Registrera']")).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}parent`), 10000, 'Timed out after 5 sec', 100)
}


async function registerPatient(driver, patient) {
  //await driver.findElement(webdriver.By.xpath("//span[text()='Lägg till barn']")).click()
  await driver.get(localURL+"register-patient")
  await driver.wait(webdriver.until.urlIs(`${localURL}register-patient`), 10000, 'Timed out after 5 sec', 100)
  await driver.findElement(webdriver.By.id('name')).sendKeys('Namn')
  await driver.findElement(webdriver.By.id('surname')).sendKeys('Efteramn')
  await driver.findElement(webdriver.By.id('email')).sendKeys(patient.email)
  await driver.findElement(webdriver.By.id('password')).sendKeys(patient.passw)
  await driver.findElement(webdriver.By.id('confirmPassword')).sendKeys(patient.passw)
  await driver.findElement(webdriver.By.id('dateofbirth')).sendKeys('2010-01-01T00:00:00Z')
  await driver.findElement(webdriver.By.css("div[aria-labelledby='gender-label']")).click()
  await driver.findElement(webdriver.By.css("li[data-value='FEMALE']")).click()
  await driver.findElement(webdriver.By.css("div[aria-labelledby='disease-label']")).click()
  await driver.findElement(webdriver.By.css("li[data-value='DIABETES']")).click()
  await driver.findElement(webdriver.By.id('measurements')).sendKeys(1)
  await driver.findElement(webdriver.By.id('SU_LO')).sendKeys(0)
  await driver.findElement(webdriver.By.id("SU_HI")).sendKeys(0)
  await driver.findElement(webdriver.By.css('#main > main > div > form > button')).sendKeys(webdriver.Key.ENTER)
  await driver.wait(webdriver.until.urlIs(`${localURL}parent`), 5000, 'Timed out after 5 sec', 100)
}

async function registerPatientWithDiabetes(driver, patient) {
  //await driver.findElement(webdriver.By.xpath("//span[text()='Lägg till barn']")).click()
  await driver.get(localURL+"register-patient")
  await driver.wait(webdriver.until.urlIs(`${localURL}register-patient`), 10000, 'Timed out after 5 sec', 100)
  await driver.findElement(webdriver.By.id('name')).sendKeys('Namn')
  await driver.findElement(webdriver.By.id('surname')).sendKeys('Efteramn')
  await driver.findElement(webdriver.By.id('email')).sendKeys(patient.email)
  await driver.findElement(webdriver.By.id('password')).sendKeys(patient.passw)
  await driver.findElement(webdriver.By.id('confirmPassword')).sendKeys(patient.passw)
  await driver.findElement(webdriver.By.id('dateofbirth')).sendKeys('2010-01-01T00:00:00Z')
  await driver.findElement(webdriver.By.css("div[aria-labelledby='gender-label']")).click()
  await driver.findElement(webdriver.By.css("li[data-value='FEMALE']")).click()
  await driver.findElement(webdriver.By.css("div[aria-labelledby='disease-label']")).click()
  await driver.findElement(webdriver.By.css("li[data-value='DIABETES']")).click()
  await driver.findElement(webdriver.By.id('measurements')).sendKeys(5.5)
  await driver.findElement(webdriver.By.id('SU_LO')).sendKeys(5.5)
  await driver.findElement(webdriver.By.id("SU_HI")).sendKeys(5.5)
  await driver.findElement(webdriver.By.css('#main > main > div > form > button')).sendKeys(webdriver.Key.ENTER)
  await driver.wait(webdriver.until.urlIs(`${localURL}parent`), 5000, 'Timed out after 5 sec', 100)
}


async function logut(driver) {
  await driver.findElement(webdriver.By.xpath("//span[text()='Logga ut']")).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}login`))
  expect(await driver.getCurrentUrl()).toEqual(`${localURL}login`)
}

test('TestCaseID:22.1.1. Register a new Patient', async () => {
  const user = new User()
  await connectToEHR()
  await register(driver, user)
  const patient = new User()
  await registerPatient(driver, patient)
  await logut(driver)
})

test('TestCaseID:22.1.2. Register same Patient to same parent twice', async () => {
  const user = new User()
  // await connectToEHR()
  await register(driver, user)
  const patient = new User()
  await registerPatient(driver, patient)
  await registerPatient(driver, patient).catch(async () => {
    const text = await driver.findElement(webdriver.By.xpath("//p[@id='email-helper-text']"), 10000).getText()
    await logut(driver)
    expect(text).toEqual('User already registered')
  })
})

test('TestCaseID:22.1.3. Register two new Patient', async () => {
  const user = new User()
  // await connectToEHR()
  await register(driver, user)
  const patient = new User()
  await registerPatient(driver, patient)
  const patient2 = new User()
  await registerPatient(driver, patient2)
  await logut(driver)
})


test('TestCaseID:98.1.1. Register Patient with diabetes using valid values', async () => {
  const user = new User()
  // await connectToEHR()
  await register(driver, user)
  const patient = new User()
  await registerPatientWithDiabetes(driver, patient)
  await logut(driver)
})


test('TestCaseID:98.1.2. Register Patient with diabetes using invalid values', async () => {
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
  await driver.findElement(webdriver.By.css("li[data-value='FEMALE']")).click()
  await driver.findElement(webdriver.By.css("div[aria-labelledby='disease-label']")).click()
  await driver.findElement(webdriver.By.css("li[data-value='DIABETES']")).click()
  await driver.findElement(webdriver.By.id('measurements')).sendKeys(21)
  await driver.findElement(webdriver.By.id('SU_LO')).sendKeys(16)
  await driver.findElement(webdriver.By.id("SU_HI")).sendKeys(16)
  var x = await driver.findElement(webdriver.By.id("measurements")).getAttribute("value")
  expect(x).toEqual("20")
  x = await driver.findElement(webdriver.By.id("SU_LO")).getAttribute("value")
  expect(x).toEqual("15")
  await driver.findElement(webdriver.By.id('name')).sendKeys('Namn')
  x = await driver.findElement(webdriver.By.id("SU_HI")).getAttribute("value")
  expect(x).toEqual("15")
  await driver.findElement(webdriver.By.css('#main > main > div > form > button')).sendKeys(webdriver.Key.ENTER)
  await driver.wait(webdriver.until.urlIs(`${localURL}parent`), 5000, 'Timed out after 5 sec', 100)
})
