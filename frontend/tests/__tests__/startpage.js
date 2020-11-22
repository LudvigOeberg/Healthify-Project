let driver
const webdriver = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
// const remoteURL = 'http://tddc88-company-2-2020.kubernetes-public.it.liu.se/'
const localURL = 'http://localhost:4100/'

beforeEach(() => {
  const options = new chrome.Options()
  options.addArguments('--no-sandbox', '--headless', '--disable-dev-shm-usage', "window-size=1024,768");
  driver = new webdriver.Builder().forBrowser('chrome').setChromeOptions(options).build()
})

afterEach(() => {
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
  await alert2.sendKeys(process.env.ehr_user)
  await alert2.accept()
}

test('TestCaseID:51. Check Healthify startpage', async () => {
  expect(true).toBeTruthy();
})

test('TestCaseID:51. Check Healthify startpage', async () => {
    await connectToEHR()
    await driver.get(localURL)
    expect(await driver.getTitle()).toEqual('Healthify')
  })
/*
test('TestCaseID:52. Check if log in button exists', async () => {
    await connectToEHR()
    await driver.get(localURL)

    let present = true;
    try {
        await driver
        .findElement(webdriver.By.xpath("//span[text()='Logga in']"))
    } catch (err) {
      present = false;
    }
    expect(present).toEqual(true);

  })
  

  test('TestCaseID:53. Check if registration button exists', async () => {
    await connectToEHR()
    await driver.get(localURL)

    let present = true;
    try {
        await driver
        .findElement(webdriver.By.xpath("//span[text()='Registrera dig']"))
    } catch (err) {
      present = false;
    }
    expect(present).toEqual(true);

  })
  

  test('TestCaseID:54. Check log in button functionallity', async () => {    
    await connectToEHR()
    await driver.get(localURL)
        await driver
        .findElement(webdriver.By.xpath("//span[text()='Logga in']")).click()
        expect(await driver.getCurrentUrl()).toEqual(`${localURL}login`);

  })


  test('TestCaseID:55. Check registration button functionallity', async () => {    
    await connectToEHR()
    await driver.get(localURL)
        await driver
        .findElement(webdriver.By.xpath("//span[text()='Registrera dig']")).click()
        expect(await driver.getCurrentUrl()).toEqual(`${localURL}register`);

  })
*/