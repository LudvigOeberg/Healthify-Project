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
  driver = new webdriver.Builder().forBrowser('chrome').setChromeOptions(options).build()
})

afterAll(() => {
  driver.close()
})

function randInt(maxNum) {
  return Math.floor(Math.random() * maxNum)
}

function User(user) {
  this.email = `${randInt(1000000)}epost@test.se`
  this.passw = 'passw'
  this.dateOfBirth = undefined
  if (user === 'patient') {
    this.dateOfBirth = '25092010'
  }
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

// eslint-disable-next-line no-shadow
async function logout(driver) {
  await driver.findElement(webdriver.By.id('logoutHeaderButton')).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}login`))
}

async function login(driver, userPath, user) {
  await driver.get(localURL)
  await driver.findElement(webdriver.By.id('loginHeaderButton')).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}login`))
  await driver.findElement(webdriver.By.id('email')).sendKeys(user.email)
  await driver.findElement(webdriver.By.id('password')).sendKeys(user.passw)
  await driver.findElement(webdriver.By.id('loginButton')).click()
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

async function registerPatient(driver, patient) {
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
  const diseaseArray = ['DIABETES', 'OBESITY']
  const selectedGender = genderArray[randInt(4)]
  const selectedDisease = diseaseArray[randInt(2)]

  // selects a gender and a disease randomly
  await driver.findElement(webdriver.By.css("div[aria-labelledby='gender-label']")).click()
  await driver.findElement(webdriver.By.css(`li[data-value='${selectedGender}']`)).click()
  await driver.findElement(webdriver.By.css("div[aria-labelledby='disease-label']")).click()
  await driver.findElement(webdriver.By.css(`li[data-value='${selectedDisease}']`)).click()
  await driver.sleep(2000)
  // passes  input to the remaining fields based on the disease
  if (selectedDisease === 'DIABETES') {
    await driver.findElement(webdriver.By.id('measurements')).sendKeys('3')
    await driver.findElement(webdriver.By.id('SU_LO')).sendKeys('5')
    await driver.findElement(webdriver.By.id('SU_HI')).sendKeys('13')
  } else {
    await driver.findElement(webdriver.By.id('goalweight')).sendKeys('45')
  }
  await driver.findElement(webdriver.By.id('registerChild')).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}parent`), 5000, 'Timed out after 5 sec', 100)
}

// Test Cases
describe('Testing patient login', () => {
  const childParent = new User('parent')
  const patient = new User('patient')
  test('Invalid Email address and valid password', async () => {
    await getHomePage(localURL)
    await register(driver, childParent)
    await registerPatient(driver, patient)
    await logout(driver)
    const clonedPatient = JSON.parse(JSON.stringify(patient))
    clonedPatient.email = 'wrongemail.se'
    await login(driver, 'child', clonedPatient).catch(async () => {
      const text = await driver.findElement(webdriver.By.id('email-helper-text'), 10000).getText()
      expect(text).toEqual('Not a valid email address')
    })
  })

  test('Valid email and invalid password', async () => {
    const clonedPatient = JSON.parse(JSON.stringify(patient))
    clonedPatient.passw = 'wrongpass'
    await login(driver, 'child', clonedPatient).catch(async () => {
      const text = await driver.findElement(webdriver.By.id('password-helper-text'), 10000).getText()
      expect(text).toEqual('User not found or wrong password')
    })
  })

  test('Invalid email and invalid password', async () => {
    const clonedPatient = JSON.parse(JSON.stringify(patient))
    clonedPatient.email = 'wrongemail.se'
    clonedPatient.passw = 'wrongpass'
    await login(driver, 'child', clonedPatient).catch(async () => {
      const text = await driver.findElement(webdriver.By.id('email-helper-text'), 10000).getText()
      expect(text).toEqual('User not found or wrong password')
    })
  })

  test('Valid email and valid password', async () => {
    await login(driver, 'child', patient).catch(async () => {
      await driver.wait(webdriver.until.urlIs(`${localURL}child`))
      expect(await driver.getCurrentUrl()).toEqual(`${localURL}child`)
    })
  })
})
