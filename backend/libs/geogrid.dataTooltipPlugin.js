"use strict"

//if (typeof L === 'undefined') throw '[geogrid.js] Leaflet and geogrid.js need to be loaded first'

// tooltip

L.DataTooltipPlugin = class DataTooltipPlugin extends L.ISEA3HLayerPlugin {
  onHover(e) {
    if (this._tooltip) this._tooltip.remove()
    this._tooltip = L.polygon([[e.cell.lat, e.cell.lon]], {
      stroke: false,
    }}).bindTooltip(`<b>value: ${(e.cell.value) ? e.cell.value.toFixed(2) : e.cell.value}</b><br/>lat, lon: ${e.cell.lat.toFixed(3)}°, ${e.cell.lon.toFixed(3)}°`, {
        offset: L.point(20, 0),
        direction: 'right',
        permanent: true,
        opacity: 1,
    }).addTo(this._layer._map)
  }
  onUnhover(e) {
    if (this._tooltip) this._tooltip.remove()
  }
}

L.dataTooltipPlugin = () => new L.DataTooltipPlugin()
