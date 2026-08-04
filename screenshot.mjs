import { chromium } from '@playwright/test';

async function takeScreenshots() {
  const browser = await chromium.launch();

  const url = 'http://localhost:4321';

  // Screenshot at 2500ms
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(url);
  await page.waitForTimeout(2500);
  const path2500 = 'C:\\Users\\kevin\\AppData\\Local\\Temp\\claude\\c--DevProjects-Portfolio\\8636aad3-a071-4e12-8e4b-d3020db62893\\scratchpad\\screenshot-2500.png';
  await page.screenshot({ path: path2500 });
  console.log('Screenshot at 2500ms taken');
  await page.close();

  // Fresh page for 3300ms
  const page2 = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page2.goto(url);
  await page2.waitForTimeout(3300);
  const path3300 = 'C:\\Users\\kevin\\AppData\\Local\\Temp\\claude\\c--DevProjects-Portfolio\\8636aad3-a071-4e12-8e4b-d3020db62893\\scratchpad\\screenshot-3300.png';
  await page2.screenshot({ path: path3300 });
  console.log('Screenshot at 3300ms taken');
  await page2.close();

  // Fresh page for 6000ms
  const page3 = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page3.goto(url);
  await page3.waitForTimeout(6000);
  const path6000 = 'C:\\Users\\kevin\\AppData\\Local\\Temp\\claude\\c--DevProjects-Portfolio\\8636aad3-a071-4e12-8e4b-d3020db62893\\scratchpad\\screenshot-6000.png';
  await page3.screenshot({ path: path6000 });
  console.log('Screenshot at 6000ms taken');
  await page3.close();

  await browser.close();
}

takeScreenshots().catch(console.error);
