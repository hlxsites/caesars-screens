export default function decorate(block) {
  if (block.firstElementChild) {
    const cols = [...block.firstElementChild.children];
    block.classList.add(`columns-${cols.length}-cols`);
  }
}
