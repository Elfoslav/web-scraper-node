import puppeteer, { Page } from "puppeteer";

export class FlatsScraper {
  private flatsList: any[];

  constructor() {
    this.flatsList = [];
  }

  async run(): Promise<void> {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
    const page = await browser.newPage();
    await page.goto("https://www.sreality.cz/hledani/prodej/byty", {
      waitUntil: "domcontentloaded",
    });

    // Set cookie for cookie modal consent so the modal will not open
    await page.setCookie({
      name: "euconsent-v2",
      value: "CPtqTgAPtqTgAD3ACBCSDJCsAP_AAEPAAATIIXIBhCokBSFCAGpYIIsAAAAHxxAAYCAAABAAgQABABIAIAQAAAAQAAQgBAACABQAIAIAAAAACEBAAAAAAAAAAQAAAAAAAAAAIQAAAAAAAiBAAAAAAABAAAAAAABAQAAAgAAAAAIAQBAAAAEAgAAAAAAAAAAAAAAAAQgAAAAAAAAAAAgAAAAAEELoFAACwAKgAXAAyACAAGQANAAcwBEAEUAJgATwAqgBiAD8AISARABEgCOAE4AKUAZYAzQB3AD9AIQARYAkwBaAC6gGBANYAbQBNoC1AFuALzAZIAy4BpQDUwIXAAAA.YAAAAAAAAAAA",
      expires: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
      httpOnly: false
    });


    while (this.flatsList.length !== 500) {
      const flats = await this.getScrapedFlats(page);
      this.flatsList = this.flatsList.concat(flats);
      try {
        await page.click(".paging-full .paging-next");
      } catch (e) {
        console.log(e);
      }
    }

    await browser.close();
  }

  private async getScrapedFlats(page: Page): Promise<any[]> {
    await page.waitForSelector(".property");

    return await page.evaluate(() => {
      const properties = document.querySelectorAll(".property");
      const imagesSelector = "[component=\"property-carousel\"] a > img:not([src*=\"/camera.svg\"])";

      return Array.from(properties).map((flat) => {
        const title = (flat.querySelector(".title") as HTMLElement).innerText;
        const locality = (flat.querySelector(".locality") as HTMLElement).innerText;
        const price = (flat.querySelector(".norm-price") as HTMLElement).innerText;
        const imagesElements = (flat.querySelectorAll(imagesSelector) as NodeListOf<HTMLElement>);
        const images = Array.from(imagesElements).map((element) => element.getAttribute('src'));

        return { title, locality, price, images };
      });
    });
  }

  getFlats(): any[] {
    return this.flatsList;
  }
}
