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

function randInt(maxNum) {
  return Math.floor(Math.random() * maxNum)
}

function User() {
  this.email = `${randInt(1000000)}epost@test.se`
  this.passw = 'passw'
}

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
  await driver.findElement(webdriver.By.id('logoutHeaderButton')).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}login`))
  expect(await driver.getCurrentUrl()).toEqual(`${localURL}login`)
}

test('TestCaseID:112.1.1 Test Reward Button', async () => {
    const user = new User()
    await connectToEHR()
    await register(driver, user)
    const patient = new User()
    await registerPatient(driver, patient, 'obesity', [45])
    await driver.findElement(webdriver.By.id('parentsChildOverviewButton')).click()

    driver.executeScript(
        'arguments[0].click();',
        await driver.findElement(webdriver.By.xpath("//a[@href='/parent-reward']")),
      )
      await driver.wait(webdriver.until.urlIs(`${localURL}parent-reward`), 10000, 'Timed out after 5 sec', 100)
  
    await logut(driver)   
  })