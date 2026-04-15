/**
 * Minimal reactive store for app-level state.
 * Avoids external dependencies — just a plain object with a tiny pub/sub.
 */

const _listeners = {};

function emit(event, payload) {
  (_listeners[event] ?? []).forEach((cb) => cb(payload));
}

export const store = {
  /** ISO codes of selected countries (up to 3). */
  selectedCountries: [],
  /** ISO code of the currently hovered country. */
  hoveredCountry: null,

  /**
   * Subscribe to a state change event.
   * @param {"selectionChanged"|"hoverChanged"} event
   * @param {(payload: any) => void} callback
   * @returns {() => void} unsubscribe function
   */
  on(event, callback) {
    _listeners[event] = _listeners[event] ?? [];
    _listeners[event].push(callback);
    return () => {
      _listeners[event] = _listeners[event].filter((cb) => cb !== callback);
    };
  },

  /**
   * Adds a country to the selection (max 3, FIFO eviction).
   * If the country is already selected, deselects it instead.
   * @param {string} iso
   */
  toggleCountry(iso) {
    const idx = this.selectedCountries.indexOf(iso);
    if (idx !== -1) {
      this.selectedCountries = this.selectedCountries.filter((c) => c !== iso);
    } else {
      const next = [...this.selectedCountries, iso];
      this.selectedCountries = next.length > 3 ? next.slice(next.length - 3) : next;
    }
    emit("selectionChanged", [...this.selectedCountries]);
  },

  /** Clear all selected countries. */
  clearSelection() {
    this.selectedCountries = [];
    emit("selectionChanged", []);
  },

  /**
   * Update hovered country.
   * @param {string | null} iso
   * @param {string} [name]
   */
  setHovered(iso, name) {
    this.hoveredCountry = iso;
    emit("hoverChanged", { iso, name });
  },
};
