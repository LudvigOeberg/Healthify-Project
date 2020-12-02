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

function randInt(maxNum) {
  return Math.floor(Math.random() * maxNum)
}

function User() {
  this.email = `${randInt(1000000)}epost@test.se`
  this.passw = 'passw'
}

async function register(driver, user) {
  await driver.get(localURL)
  await driver.findElement(webdriver.By.id('registerHeaderButton')).click()
  await driver.findElement(webdriver.By.id('name')).sendKeys('Namn')
  await driver.findElement(webdriver.By.id('surname')).sendKeys('Efteramn')
  await driver.findElement(webdriver.By.id('email')).sendKeys(user.email)
  await driver.findElement(webdriver.By.id('password')).sendKeys(user.passw)
  await driver.findElement(webdriver.By.id('confirmPassword')).sendKeys(user.passw)
  await driver.findElement(webdriver.By.id('registerUserButton')).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}parent`), 10000, 'Timed out after 5 sec', 100)
}

/* registerPatient fuction takes in a driver object, a patient object,
   a disease which is a string and must take a value of 'diabetes' or 'obesity',
   a value which is an array of the form [3,7,12] if disease is diabetes or
   [42] if disease is obesity */
async function registerPatient(driver, patient, disease, values) {
  driver.executeScript(
    'arguments[0].click();',
    await driver.findElement(webdriver.By.xpath("//a[@href='/register-patient']")),
  )
  await driver.wait(webdriver.until.urlIs(`${localURL}register-patient`), 10000, 'Timed out after 5 sec', 100)
  await driver.findElement(webdriver.By.id('name')).sendKeys('Namn')
  await driver.findElement(webdriver.By.id('surname')).sendKeys('Efteramn')
  await driver.findElement(webdriver.By.id('email')).sendKeys(patient.email)
  await driver.findElement(webdriver.By.id('password')).sendKeys(patient.passw)
  await driver.findElement(webdriver.By.id('confirmPassword')).sendKeys(patient.passw)
  await driver.findElement(webdriver.By.id('dateofbirth')).sendKeys('25092011')
  const genderArray = ['MALE', 'FEMALE', 'OTHER', 'UNKNOWN']
  const selectedGender = genderArray[randInt(4)]

  // selects a gender randomly
  await driver.findElement(webdriver.By.css("div[aria-labelledby='gender-label']")).click()
  await driver.findElement(webdriver.By.css(`li[data-value='${selectedGender}']`)).click()
  await driver.findElement(webdriver.By.css("div[aria-labelledby='disease-label']")).click()
  await driver.findElement(webdriver.By.css(`li[data-value='${disease.toUpperCase()}']`)).click()
  await driver.sleep(2000)
  // passes  input to the remaining fields based on the disease
  if (disease === 'diabetes') {
    await driver.findElement(webdriver.By.id('measurements')).sendKeys(values[0].toString())
    await driver.findElement(webdriver.By.id('SU_LO')).sendKeys(values[1].toString())
    await driver.findElement(webdriver.By.id('SU_HI')).sendKeys(values[2].toString())
  } else {
    await driver.findElement(webdriver.By.id('goalweight')).sendKeys(values[0].toString())
  }
  await driver.findElement(webdriver.By.id('registerChild')).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}parent`), 5000, 'Timed out after 5 sec', 100)
}

async function logut(driver) {
  await driver.findElement(webdriver.By.xpath("//span[text()='Logga ut']")).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}login`))
}

test('TestCaseID:22.1.1. Register a new Patient', async () => {
  const user = new User()
  await connectToEHR()
  await register(driver, user)
  const patient = new User()
  await registerPatient(driver, patient, 'diabetes', [1, 0, 0])
  await logut(driver)
})

test('TestCaseID:22.1.2. Register same Patient to same parent twice', async () => {
  const user = new User()
  await register(driver, user)
  const patient = new User()
  await registerPatient(driver, patient, 'diabetes', [1, 0, 0])
  await registerPatient(driver, patient, 'diabetes', [1, 0, 0]).catch(async () => {
    const text = await driver.findElement(webdriver.By.xpath("//p[@id='email-helper-text']"), 10000).getText()
    await logut(driver)
    expect(text).toEqual('User already registered')
  })
})

test('TestCaseID:22.1.3. Register two new Patient', async () => {
  const user = new User()
  await register(driver, user)
  const patient = new User()
  await registerPatient(driver, patient, 'diabetes', [1, 0, 0])
  const patient2 = new User()
  await registerPatient(driver, patient2, 'diabetes', [1, 0, 0])
  await logut(driver)
})

test('TestCaseID:98.1.1. Register Patient with diabetes using valid values', async () => {
  const user = new User()
  await register(driver, user)
  const patient = new User()
  await registerPatient(driver, patient, 'diabetes', [5.5, 5.5, 5.5])
  await logut(driver)
})

test('TestCaseID:98.1.2. Register Patient with diabetes using invalid values', async () => {
  const user = new User()
  await register(driver, user)
  const patient = new User()
  await driver.get(`${localURL}register-patient`)
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
  await driver.findElement(webdriver.By.id('SU_HI')).sendKeys(16)
  let x = await driver.findElement(webdriver.By.id('measurements')).getAttribute('value')
  expect(x).toEqual('20')
  x = await driver.findElement(webdriver.By.id('SU_LO')).getAttribute('value')
  expect(x).toEqual('15')
  await driver.findElement(webdriver.By.id('name')).sendKeys('Namn')
  x = await driver.findElement(webdriver.By.id('SU_HI')).getAttribute('value')
  expect(x).toEqual('15')
  await driver.findElement(webdriver.By.id('registerChild')).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}parent`), 5000, 'Timed out after 5 sec', 100)
})
