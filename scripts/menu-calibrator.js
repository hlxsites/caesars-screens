const MENU_CAFE_FONT_SIZE_CACHE_KEY = 'menu-cafe-fontSize';

function delayTimer(ms) {
    return new Promise((res) => setTimeout(res, ms));
}

function getOffset(element) {
    return Math.abs(window.innerHeight - element.offsetHeight);
}

export async function calibrateMenuForPlayer(htmlElement) {
    if (!htmlElement) {
        htmlElement = document.querySelector('html');
    }
    const cachedFontSize = localStorage.getItem(MENU_CAFE_FONT_SIZE_CACHE_KEY);
    if (cachedFontSize) {
        htmlElement.style.fontSize = `${cachedFontSize}%`;
        return;
    }
    let fontSize = 30; // optimal initial fontsize(fits 360 * 640)
    let prevOffset = -1;
    while (true) {
        fontSize += 0.75;
        htmlElement.style.fontSize = `${fontSize}%`;
        window.dispatchEvent(new Event('resize'));
        const currentOffset = getOffset(htmlElement);
        // Keep increasing fontsize if the offset between window and html element is decreasing,
        // break the loop if it increases
        if ((prevOffset !== -1 && currentOffset >= prevOffset && currentOffset < 50) || fontSize > 250) {
            fontSize -= 0.75;
            console.log('Optimal fontsize: ' + fontSize);
            localStorage.setItem(MENU_CAFE_FONT_SIZE_CACHE_KEY, fontSize.toString());
            htmlElement.style.fontSize = `${fontSize}%`;
            window.dispatchEvent(new Event('resize'));
            break;
        }
        prevOffset = currentOffset;
        await delayTimer(15); // add delay if needed on specific native platforms
    }
}

export function calibrateMenuForWeb() {
    const htmlElement = document.querySelector('html');
    htmlElement.style.fontSize = `${getOptimalFontSize()}%`;
}

function getOptimalFontSize() {
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    // Font size was calculated manually for multiple popular resolutions and based on the data,
    // the optimal fontsize was found to be ~windowHeight/18 for portrait and ~windowHeight/11.25 for landscape
    if (windowWidth < windowHeight || windowWidth <= 900) {
        // Portrait orientation
        return windowHeight/18;
    } else {
        // Landscape orientation
        return windowHeight/11.25;
    }
}