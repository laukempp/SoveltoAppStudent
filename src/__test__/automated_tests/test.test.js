require('chromedriver')

const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

const assert = require('assert');

describe('Testing NameForm', () => {
  let driver;

  before(async ()=> {
    driver = await new webdriver.Builder()
    .forBrowser('chrome')
    .build();
  })

  it ('When user submits valid input values, page redirects to the Quiz-page', async() => {
    
    await driver.get('http://localhost:3000/student/entry');
    await driver.findElement(By.id('studentNickname')).click();
    await driver.findElement(By.id('studentNickname')).sendKeys('nimi', webdriver.Key.TAB);
    await driver.findElement(By.id('teacherBadge')).click();
    await driver.findElement(By.id('teacherBadge')).sendKeys('70408', webdriver.Key.TAB);
    await driver.findElement(By.id('teacherBadge')).click();
    await driver.findElement(By.id('nfButton')).click()

    await driver.wait(until.elementLocated(By.id('quizFormTitle')), 10000);

      let h2Value = await driver.findElement(By.id('quizFormTitle')).getText()
      assert.equal(h2Value, 'Odota hetki, tentti alkaa pian')
  })

  it ('If badge does not exists, a warning is displayed on the page', async() => {

    await driver.get('http://localhost:3000/student/entry');
    await driver.findElement(By.id('studentNickname')).click();
    await driver.findElement(By.id('studentNickname')).sendKeys('nimi', webdriver.Key.TAB);
    await driver.findElement(By.id('teacherBadge')).click();
    await driver.findElement(By.id('teacherBadge')).sendKeys('66489', webdriver.Key.TAB);
    await driver.findElement(By.id('teacherBadge')).click();
    await driver.findElement(By.id('nfButton')).click()

    await driver.wait(until.elementLocated(By.id('teacherError')), 10000);

    /*driver.sleep(2000).then(() => {
      driver.findElement(By.id('teacherError')).getText()
        .then((errorElement) => {
          assert.notEqual(errorElement, 'Opettajanumeroa 66489 ei voida tunnistaa, kokeile uudelleen!')
        })
    })*/

      let errorElement = await driver.findElement(By.id('teacherError')).getText()
      assert.equal(errorElement, 'Opettajanumeroa 66489 ei voida tunnistaa, kokeile uudelleen!')

  })

  after(() => driver && driver.quit())

})

/*

driver.get('http://localhost:3000/student/entry');

driver.findElement(By.name('studentNickname')).sendKeys('webdriver');

driver.sleep(1000).then(function() {
  driver.findElement(By.name('q')).sendKeys(webdriver.Key.TAB);
});

driver.findElement(By.name('btnK')).click();

driver.sleep(2000).then(function() {
  driver.getTitle().then(function(title) {
    if(title === 'webdriver - Google Search') {
      console.log('Test passed');
    } else {
      console.log('Test failed');
    }
    driver.quit();
  });
});*/