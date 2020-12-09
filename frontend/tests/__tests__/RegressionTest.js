/* eslint-disable no-shadow */
let driver
const webdriver = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
// const remoteURL = 'http://tddc88-company-2-2020.kubernetes-public.it.liu.se/'
const localURL = 'http://localhost:4100/'
beforeAll(() => {
  jest.setTimeout(30000)
  const options = new chrome.Options()
  options.addArguments('--test-type')
  options.addArguments('--start-maximized')
  // options.addArguments('--headless')
  driver = new webdriver.Builder().forBrowser('chrome').setChromeOptions(options).build()
})

function randInt(maxNum) {
  return Math.floor(Math.random() * maxNum)
}

afterAll(() => {
  driver.quit()
})

function User() {
  this.email = `${randInt(1000000)}epost@test.se`
  this.passw = 'passw'
  this.dateOfBirth = undefined
  // this.dateOfBirth = '25092010' // works for some
  this.dateOfBirth = '002010-09-25' // works for others
}

async function getHomePage(url) {
  await driver.get(url)
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

async function logut(driver) {
  await driver.findElement(webdriver.By.id('logoutHeaderButton')).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}login`))
  expect(await driver.getCurrentUrl()).toEqual(`${localURL}login`)
}

async function login(driver, userPath, user) {
  await driver.get(localURL)
  await driver.findElement(webdriver.By.id('loginHeaderButton')).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}login`))
  await driver.findElement(webdriver.By.id('email')).sendKeys(user.email)
  await driver.findElement(webdriver.By.id('password')).sendKeys(user.passw)
  await driver.findElement(webdriver.By.id('loginButton')).click()
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
  await driver.findElement(webdriver.By.id('dateofbirth')).sendKeys(patient.dateOfBirth)
  const genderArray = ['MALE', 'FEMALE', 'OTHER', 'UNKNOWN']
  const selectedGender = genderArray[randInt(4)]

  // selects a gender and a disease randomly
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
  return disease.toUpperCase()
}

async function clickAroundChild(driver, userPath, disease) {
  await driver.wait(webdriver.until.urlIs(localURL + userPath))
  await driver.findElement(webdriver.By.id('addFooterLinkButton')).click()
  if (disease === 'DIABETES') {
    console.log('Diabetes')
    await driver.findElement(webdriver.By.id('childValue')).sendKeys(Number('8'))
  } else {
    console.log('Obesity')
    await driver.findElement(webdriver.By.id('childValue')).sendKeys('80')
  }
}

test('ID:S1. Test start application', async () => {
  await getHomePage(localURL)
})

test('ID:S2. Test registration follow by auto login for parent', async () => {
  const user = new User()
  await register(driver, user)
  await logut(driver)
})

test('ID:S3. Register a Patient', async () => {
  const user = new User()
  await register(driver, user)
  const patient = new User()
  await registerPatient(driver, patient, 'diabetes', [5, 7, 13])
  await logut(driver)
})

test('ID:S4. Log out', async () => {
  const user = new User()
  await register(driver, user)
  await logut(driver)
  await login(driver, 'parent', user)
  await logut(driver)
})

test('ID:S5. Login as a registered Patient', async () => {
  const parent = new User()
  await register(driver, parent)
  const patient = new User()
  await registerPatient(driver, patient, 'obesity', [45])
  await logut(driver)
  await login(driver, 'child', patient)
  await logut(driver)
})

test('ID:S6. Registration for an already registered email', async () => {
  const user = new User()
  await register(driver, user)
  await logut(driver)
  await register(driver, user).catch(async () => {
    const text = await driver.findElement(webdriver.By.xpath("//p[@id='email-helper-text']"), 10000).getText()
    await expect(text).toEqual('User already registered')
  })
})

test('ID:S7. Clicking around in the application', async () => {
  const parent = new User()
  await register(driver, parent)
  const patient = new User()
  const disease = await registerPatient(driver, patient, 'diabetes', [5,1,14])
  patient_2 = new User()
  const disease_2 = await registerPatient(driver, patient_2, 'obesity', [40])
  await logut(driver)
  await login(driver, 'child', patient)
  await clickAroundChild(driver, 'child', disease)
  await logut(driver)
  await login(driver, 'child', patient_2)
  await clickAroundChild(driver, 'child', disease_2)
  

})