let driver;
const webdriver = require("selenium-webdriver");
// const remoteURL = 'http://tddc88-company-2-2020.kubernetes-public.it.liu.se/'
const localURL = "http://localhost:4100/";

beforeEach(() => {
  const chromeCapabilities = webdriver.Capabilities.chrome();
  // setting chrome options to start the browser fully maximized
  const chromeOptions = {
    args: ["--test-type", "--start-maximized"],
  };
  chromeCapabilities.set("chromeOptions", chromeOptions);
  driver = new webdriver.Builder().withCapabilities(chromeCapabilities).build();
});

afterEach(() => {
  driver.close();
});

async function connectToEHR() {
  await driver.get(localURL);
  await driver.wait(webdriver.until.alertIsPresent());
  const alert1 = await driver.switchTo().alert();
  // replace username with the username for openEHR
  await alert1.sendKeys("username");
  await alert1.accept();
  await driver.wait(webdriver.until.alertIsPresent());
  const alert2 = await driver.switchTo().alert();
  // replace pass with password from openEHR
  await alert2.sendKeys("password");
  await alert2.accept();
}

function User() {
  const randomInt = Math.floor(Math.random() * Math.floor(1000000));
  this.email = `${randomInt}epost@test.se`;
  this.passw = "passw";
}

async function register(driver, user) {
  await driver.get(localURL);
  await driver
    .findElement(webdriver.By.xpath("//span[text()='Registrera dig']"))
    .click();
  await driver.findElement(webdriver.By.id("name")).sendKeys("Namn");
  await driver.findElement(webdriver.By.id("surname")).sendKeys("Efteramn");
  await driver.findElement(webdriver.By.id("email")).sendKeys(user.email);
  await driver.findElement(webdriver.By.id("password")).sendKeys(user.passw);
  await driver
    .findElement(webdriver.By.id("confirmPassword"))
    .sendKeys(user.passw);
  await driver
    .findElement(webdriver.By.xpath("//span[text()='Registrera']"))
    .click();
  await driver.wait(
    webdriver.until.urlIs(`${localURL}parent`),
    10000,
    "Timed out after 5 sec",
    100
  );
}


test("TestCaseID:257. Check if navbar exists", async () => {
    const user = new User();
    await connectToEHR();
    await register(driver, user);
    let present = true;
    try {
      await driver.findElement(
        webdriver.By.className(
            "MuiToolbar-root MuiToolbar-regular MuiToolbar-gutters"
        )
      );
    } catch (err) {
      present = false;
    }
    expect(present).toEqual(true);

});


test("TestCaseID:255. Check if Healthify text exists", async () => {
    const user = new User();
    await connectToEHR();
    await register(driver, user);
    let present = true;
    try {
      await driver.findElement(
        webdriver.By.xpath(
            "//span[text()='Healthify']"
        )
      );
    } catch (err) {
      present = false;
    }
    expect(present).toEqual(true);

});

    test("TestCaseID:256. Check if Healthify text is a link to the profile page", async () => {
    const user = new User();
    await connectToEHR();
    await register(driver, user);
    await driver.findElement(webdriver.By.xpath("//span[text()='Healthify']")).click()
    let url = await driver.getCurrentUrl();
    expect(url).toEqual(`${localURL}parent`);

});


test("TestCaseID:251. Check if navbar drawer exists", async () => {
  const user = new User();
  await connectToEHR();
  await register(driver, user);
  let present = true;
  try {
    await driver.findElement(
      webdriver.By.xpath(
        "//button[@class='MuiButtonBase-root MuiIconButton-root makeStyles-menuButton-2 MuiIconButton-colorInherit MuiIconButton-edgeStart']"
      )
    );
  } catch (err) {
    present = false;
  }
  expect(present).toEqual(true);

  await driver
    .findElement(
      webdriver.By.xpath(
        "//button[@class='MuiButtonBase-root MuiIconButton-root makeStyles-menuButton-2 MuiIconButton-colorInherit MuiIconButton-edgeStart']"
      )
    )
    .click();
});

test("TestCaseID:252. Check profile link to the profile page", async () => {
  const user = new User();
  await connectToEHR();
  await register(driver, user);
  await driver
    .findElement(
      webdriver.By.xpath(
        "//button[@class='MuiButtonBase-root MuiIconButton-root makeStyles-menuButton-2 MuiIconButton-colorInherit MuiIconButton-edgeStart']"
      )
    )
    .click();

  let present = true;
  try {
    await driver.findElement(webdriver.By.xpath("//span[.='Min profil']"));
  } catch (err) {
    present = false;
  }
  expect(present).toEqual(true);

  await driver
    .findElement(webdriver.By.xpath("//span[.='Min profil']"))
    .click();
  let url = await driver.getCurrentUrl();
  expect(url).toEqual(`${localURL}parent`);
});

test("TestCaseID:253. Check settings link to the settings page", async () => {
  const user = new User();
  await connectToEHR();
  await register(driver, user);
  await driver
    .findElement(
      webdriver.By.xpath(
        "//button[@class='MuiButtonBase-root MuiIconButton-root makeStyles-menuButton-2 MuiIconButton-colorInherit MuiIconButton-edgeStart']"
      )
    )
    .click();

  present = true;
  try {
    await driver.findElement(
      webdriver.By.xpath("//span[contains(text(),'Inställningar')]")
    );
  } catch (err) {
    present = false;
  }
  expect(present).toEqual(true);

  await driver
    .findElement(webdriver.By.xpath("//span[.='Inställningar']"))
    .click();
  let url = await driver.getCurrentUrl();
  expect(url).toEqual(`${localURL}parent-settings`);
});

test("TestCaseID:254. Check child registration link to child registration page", async () => {
  const user = new User();
  await connectToEHR();
  await register(driver, user);
  await driver
    .findElement(
      webdriver.By.xpath(
        "//button[@class='MuiButtonBase-root MuiIconButton-root makeStyles-menuButton-2 MuiIconButton-colorInherit MuiIconButton-edgeStart']"
      )
    )
    .click();

  present = true;
  try {
    await driver.findElement(
      webdriver.By.xpath("//span[contains(text(),'Registrering av barn')]")
    );
  } catch (err) {
    present = false;
  }
  expect(present).toEqual(true);

  await driver
    .findElement(webdriver.By.xpath("//span[.='Registrering av barn']"))
    .click();
  let url = await driver.getCurrentUrl();
  expect(url).toEqual(`${localURL}register-patient`);
});
