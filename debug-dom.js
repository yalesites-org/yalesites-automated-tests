const { chromium } = require('playwright');

// Usage: node debug-dom.js [url] [optional-selector]
// Examples:
//   node debug-dom.js /component-pages-for-e2e-testing/callout
//   node debug-dom.js /component-pages-for-e2e-testing/gallery .gallery
//   node debug-dom.js /events/event-1-for-e2e .event-location

const BASE_URL = 'http://yalesites-mv482-dev.lndo.site';

async function debugDOM() {
  const args = process.argv.slice(2);
  const urlPath = args[0] || '/';
  const selector = args[1];
  
  const fullUrl = urlPath.startsWith('http') ? urlPath : `${BASE_URL}${urlPath}`;
  
  console.log(`🔍 Debugging DOM for: ${fullUrl}`);
  if (selector) {
    console.log(`🎯 Focusing on selector: ${selector}`);
  }
  console.log('─'.repeat(60));

  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto(fullUrl);
    await page.waitForLoadState('load');
    
    console.log('📄 Page title:', await page.title());
    console.log('─'.repeat(60));
    
    if (selector) {
      // Focus on specific selector
      const elements = await page.locator(selector).count();
      console.log(`🎯 Found ${elements} elements matching "${selector}"`);
      
      if (elements > 0) {
        for (let i = 0; i < Math.min(elements, 5); i++) { // Limit to first 5
          console.log(`\n📍 Element ${i}:`);
          const html = await page.locator(selector).nth(i).innerHTML();
          console.log(html);
          
          const text = await page.locator(selector).nth(i).textContent();
          console.log(`\n📝 Text content: "${text?.trim()}"`);
          console.log('─'.repeat(40));
        }
      }
    } else {
      // General page info
      const bodyText = await page.textContent('body');
      console.log(`📏 Page text length: ${bodyText?.length} characters`);
      
      // Common element counts
      const commonSelectors = [
        'h1', 'h2', 'h3', 'p', 'a', 'button', 'img', 
        '.callout', '.gallery', '.event', '.post', '.form'
      ];
      
      console.log('\n📊 Element counts:');
      for (const sel of commonSelectors) {
        try {
          const count = await page.locator(sel).count();
          if (count > 0) {
            console.log(`  ${sel}: ${count}`);
          }
        } catch (e) {
          // Skip invalid selectors
        }
      }
      
      // Show first few headings for context
      console.log('\n📋 Page headings:');
      const headings = await page.locator('h1, h2, h3').all();
      for (let i = 0; i < Math.min(headings.length, 5); i++) {
        const text = await headings[i].textContent();
        const tagName = await headings[i].evaluate(el => el.tagName);
        console.log(`  ${tagName}: ${text?.trim()}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
    console.log('\n✅ Done!');
  }
}

// Helper function to search for specific text
async function searchText(page, searchTerm) {
  const elements = await page.getByText(searchTerm, { exact: false }).all();
  console.log(`🔍 Found ${elements.length} elements containing "${searchTerm}"`);
  
  for (let i = 0; i < Math.min(elements.length, 3); i++) {
    const text = await elements[i].textContent();
    const html = await elements[i].innerHTML();
    console.log(`\n📍 Match ${i + 1}:`);
    console.log(`Text: "${text?.trim()}"`);
    console.log(`HTML: ${html.substring(0, 200)}${html.length > 200 ? '...' : ''}`);
  }
}

if (require.main === module) {
  debugDOM().catch(console.error);
}

module.exports = { debugDOM, BASE_URL };