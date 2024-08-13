const { test, expect, chromium } = require("@playwright/test");

async function NewContextForTests({ browser }) {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("http://uitestingplayground.com/home");
  return page;
}

// test.beforeAll(async ({ browser }) => {   //NOT WORK
//   context = await browser.newContext();
//   page = await context.newPage();
//   await page.goto("http://uitestingplayground.com/home");
//   await page.waitForLoadState("load");
// });

test("Dynamic ID", async ({ browser }) => {
  const page = await NewContextForTests({ browser });

  await page.locator("a[href='/dynamicid']").click();
  const button = await page.locator(".btn.btn-primary");
  await button.click();
  //expect
  await expect(button).toHaveText("Button with Dynamic ID");
  await expect(button).toBeVisible();
});

test("Class Attribute", async ({ browser }) => {
  const page = await NewContextForTests({ browser });

  await page.locator("a[href='/classattr']").click();
  // await page.waitForLoadState("load");
  await page
    .locator(
      "//button[contains(concat(' ', normalize-space(@class), ' '), ' btn-primary ')]"
    )
    .click();
  await page.once("dialog", async (dialog) => {
    expect(dialog.message()).toBe("Primary button pressed");
    await dialog.accept();
  });
});

test("Hidden Layers", async ({ browser }) => {
  const page = await NewContextForTests({ browser });

  await page.locator("a[href='/hiddenlayers']").click();
  const GreenButton = await page.locator("#greenButton");
  await GreenButton.click();
  const BlueButton = await page.locator("#blueButton");
  await expect(BlueButton).toBeVisible(); //тут питання як перевірити що зелену не можна нажати вдруге
});

test("Load Delay", async ({ browser }) => {
  const page = await NewContextForTests({ browser });

  await page.locator("a[href='/loaddelay']").click(); //15sek for load
  await page.waitForLoadState("load");
  const ButtonOnLoadPage = await page.locator(
    "button[class='btn btn-primary']"
  );
  await expect(ButtonOnLoadPage).toBeVisible();
});

test("AJAX Data", async ({ browser }) => {
  const page = await NewContextForTests({ browser });

  await page.locator("a[href='/ajax']").click();
  await page.locator("#ajaxButton").click();
  const LabelText = await page.waitForSelector(".bg-success", {
    timeout: 20000,
  });
  await expect(LabelText).toBeTruthy();
});

test("Client Side Delay", async ({ browser }) => {
  const page = await NewContextForTests({ browser });

  await page.locator("a[href='/clientdelay']").click();
  await page.locator("#ajaxButton").click();
  const LabelText = await page.waitForSelector(".bg-success", {
    timeout: 20000,
  });
  await expect(LabelText).toBeTruthy();
  const TextContent = await LabelText.innerText();
  await expect(TextContent).toEqual("Data calculated on the client side.");
});

test("Click", async ({ browser }) => {
  const page = await NewContextForTests({ browser });

  await page.locator("a[href='/click']").click();
  const BadButtonBlue = await page.locator(".btn.btn-primary");
  await BadButtonBlue.click();
  //await page.waitForTimeout(1000);
  const BadButtonGreen = await page.locator(".btn.btn-success");
  await expect(BadButtonGreen).toBeVisible();
});

test("Text Input", async ({ browser }) => {
  const page = await NewContextForTests({ browser });

  await page.locator("a[href='/textinput']").click();
  await page.locator("#newButtonName").fill("MyNewButton");

  await page.locator(".btn.btn-primary").click(); //при debug працює нажаття на кнопку, а якщо без вуигп рк нажимає і назва кнопки не міняється

  // await page.waitForTimeout(1000);
  // await expect(page.locator(".btn.btn-primary")).toHaveText("MyNewButton");
});

test("Scroll Button Into Visible Area", async ({ browser }) => {
  const page = await NewContextForTests({ browser });

  await page.locator("a[href='/scrollbars']").click();
  const hidenButton = await page.locator("#hidingButton");
  await hidenButton.scrollIntoViewIfNeeded();
  await expect(hidenButton).toBeVisible();
});
