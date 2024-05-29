export class DOMUtils {

  /**
   * Whether $element is entirely visible within $root on vertical axis?
   * @param $root area of scrolling.
   * @param $element to scroll in/out of area.
   */
  public static isVisible($root: HTMLElement, $element: HTMLElement): boolean {
    const viewportTop: number = $root.scrollTop;
    const viewportBottom: number = viewportTop + $root.offsetHeight;
    const elementTop: number = $element.offsetTop;
    const elementBottom: number = elementTop + $element.offsetHeight;

    return elementTop >= viewportTop && elementBottom <= viewportBottom;
  }

}
